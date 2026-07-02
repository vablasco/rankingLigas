import { rankingFIFA2026 } from './rankingFIFA2026.js';

function obtenerEquipos(partidos) {
  const set = new Set();
  partidos.forEach((p) => {
    set.add(p.local);
    set.add(p.visitante);
  });
  return Array.from(set);
}

function obtenerGrupos(partidos) {
  const set = new Set();
  partidos.forEach((p) => {
    set.add(p.local.split('-')[1]);
    set.add(p.visitante.split('-')[1]);
  });
  return Array.from(set);
}

function poisson(lambda) {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

const LAMBDAS = {
  ['Mundial 2026']: { local: 1.35, visitante: 1.35 },
  argentina: { local: 1.1, visitante: 0.8 },
  ['Campeonato 2024']: { local: 1.1, visitante: 0.8 },
  ['Apertura 2025']: { local: 1.1, visitante: 0.8 },
  WorldCup: { local: 1.35, visitante: 1.35 },
  ClubWorldCup: { local: 1.35, visitante: 1.35 },
  ['ELIMINATORIAS CONMEBOL MUNDIAL 2026']: { local: 1.4, visitante: 0.81 },
  Libertadores: { local: 1.4, visitante: 0.81 },
  Sudamericana: { local: 1.4, visitante: 0.81 },
  premierLeague: { local: 1.55, visitante: 1.15 },
  españa: { local: 1.55, visitante: 1.1 },
  bundesliga: { local: 1.65, visitante: 1.2 },
};

const CALIBRACION = {
  GF_PROMEDIO_TIPICO: 1.3,
  GF_TECHO_SCORE_100: 2.7,
  GC_PISO_SCORE_100: 0,
  GC_TECHO_SCORE_0: 2.7,
  PESO_AJUSTE_LAMBDA: 0.15,
  VENTANA_PARTIDOS: 5,
};

const PESOS_SCORE = {
  efectividad: 0.5,
  golesFavor: 0.3,
  golesContra: 0.2,
};

function calcularFactorAmortiguador(scoreRendimiento, rankingPropio, rankingRival) {
  const rankingFavorece = rankingRival > rankingPropio;
  const rendimientoFavorece = scoreRendimiento > 50;
  const mismaDirec = rankingFavorece === rendimientoFavorece;
  return mismaDirec ? 0.5 : 1.0;
}

function scoreDesdeVentana(ventana, puntosPorPartido) {
  if (ventana.length === 0) return 50;

  let puntosGanados = 0;
  let puntosPosibles = 0;
  let golesFavor = 0;
  let golesContra = 0;

  ventana.forEach(({ gf, gc }) => {
    golesFavor += gf;
    golesContra += gc;
    if (gf > gc) puntosGanados += puntosPorPartido;
    else if (gf === gc) puntosGanados += 1;
    puntosPosibles += puntosPorPartido;
  });

  const n = ventana.length;
  const efectividad = puntosGanados / puntosPosibles;
  const gfProm = golesFavor / n;
  const scoreGF = Math.min(gfProm / CALIBRACION.GF_TECHO_SCORE_100, 1);
  const gcProm = golesContra / n;
  const scoreGC = Math.max(1 - gcProm / CALIBRACION.GC_TECHO_SCORE_0, 0);
  const score = (efectividad * PESOS_SCORE.efectividad + scoreGF * PESOS_SCORE.golesFavor + scoreGC * PESOS_SCORE.golesContra) * 100;

  return Math.round(score);
}

function ajustarLambdaPorRendimiento(lambdaBase, scoreRendimiento, rankingPropio, rankingRival) {
  const amortiguador = calcularFactorAmortiguador(scoreRendimiento, rankingPropio, rankingRival);
  const desviacion = (scoreRendimiento - 50) / 50;
  const factor = 1 + desviacion * CALIBRACION.PESO_AJUSTE_LAMBDA * amortiguador;

  return Math.max(0.4, Math.min(2.8, lambdaBase * factor));
}

function inicializarVentanas(equipos, partidosReales) {
  const ventanas = {};
  equipos.forEach((eq) => {
    ventanas[eq] = partidosReales
      .filter((p) => p.jugado && (p.local === eq || p.visitante === eq))
      .slice(-CALIBRACION.VENTANA_PARTIDOS)
      .map((p) => ({
        gf: p.local === eq ? p.goles_local : p.goles_visitante,
        gc: p.local === eq ? p.goles_visitante : p.goles_local,
      }));
  });
  return ventanas;
}

function actualizarVentana(ventanas, equipo, gf, gc) {
  const v = ventanas[equipo];
  v.push({ gf, gc });
  if (v.length > CALIBRACION.VENTANA_PARTIDOS) v.shift();
}

function generarResultado(liga = 'argentina', override = null, equipoLocal = null, equipoVisitante = null, rendimiento = null) {
  const config = override ?? LAMBDAS[liga];
  let lambdaL = config.local;
  let lambdaV = config.visitante;

  let rankL = 50;
  let rankV = 50;

  if (equipoLocal && equipoVisitante) {
    rankL = rankingFIFA2026[equipoLocal.replace(/-[A-L]$/, '')] || 50;
    rankV = rankingFIFA2026[equipoVisitante.replace(/-[A-L]$/, '')] || 50;

    const diff = rankV - rankL;
    const k = 0.022;
    const ajuste = k * diff;

    lambdaL = Math.max(0.4, Math.min(2.8, lambdaL + ajuste / 2));
    lambdaV = Math.max(0.4, Math.min(2.8, lambdaV - ajuste / 2));
  }

  if (rendimiento) {
    lambdaL = ajustarLambdaPorRendimiento(lambdaL, rendimiento.scoreL, rankL, rankV);
    lambdaV = ajustarLambdaPorRendimiento(lambdaV, rendimiento.scoreV, rankV, rankL);
  }

  return {
    goles_local: poisson(lambdaL),
    goles_visitante: poisson(lambdaV),
  };
}

function generarTarjetas() {
  const tarjetas = () => {
    const amarillas = poissonRandom(1.7);
    const rojas_indirectas = poissonRandom(0.04);
    const rojas_directas = poissonRandom(0.05);
    const amarilla_mas_roja = poissonRandom(0.02);

    return { amarillas, rojas_indirectas, rojas_directas, amarilla_mas_roja };
  };

  return { local: tarjetas(), visitante: tarjetas() };
}

function poissonRandom(lambda) {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function calcularYOrdenarTablaConDatos(partidos, puntosPorPartido) {
  const tabla = {};

  partidos.forEach((p) => {
    if (!p.jugado) return;

    [p.local, p.visitante].forEach((equipo) => {
      if (!tabla[equipo]) {
        tabla[equipo] = {
          pts: 0,
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          diff: 0,
          fairPlay: 0,
          rankingFIFA: 0,
        };
      }
    });

    const gl = p.goles_local;
    const gv = p.goles_visitante;

    tabla[p.local].pj++;
    tabla[p.visitante].pj++;
    tabla[p.local].gf += gl;
    tabla[p.local].gc += gv;
    tabla[p.local].diff += gl - gv;
    tabla[p.visitante].gf += gv;
    tabla[p.visitante].gc += gl;
    tabla[p.visitante].diff += gv - gl;

    if (gl > gv) {
      tabla[p.local].pts += puntosPorPartido;
      tabla[p.local].pg++;
      tabla[p.visitante].pp++;
    } else if (gl === gv) {
      tabla[p.local].pts += 1;
      tabla[p.visitante].pts += 1;
      tabla[p.local].pe++;
      tabla[p.visitante].pe++;
    } else {
      tabla[p.visitante].pts += puntosPorPartido;
      tabla[p.visitante].pg++;
      tabla[p.local].pp++;
    }

    tabla[p.local].fairPlay -= (p.amarillas_local || 0) * 1 + (p.rojas_indirectas_local || 0) * 3 + (p.rojas_directas_local || 0) * 4 + (p.amarilla_mas_roja_local || 0) * 5;
    tabla[p.visitante].fairPlay -= (p.amarillas_visitante || 0) * 1 + (p.rojas_indirectas_visitante || 0) * 3 + (p.rojas_directas_visitante || 0) * 4 + (p.amarilla_mas_roja_visitante || 0) * 5;
  });

  Object.keys(tabla).forEach((equipoConGrupo) => {
    const nombre = equipoConGrupo.replace(/-[A-L]$/, '');
    tabla[equipoConGrupo].rankingFIFA = rankingFIFA2026[nombre] || 999;
  });

  function statsDirectos(equiposEnDisputa) {
    const stats = {};
    equiposEnDisputa.forEach((e) => {
      stats[e] = { pts: 0, diff: 0, gf: 0 };
    });

    partidos.forEach((p) => {
      if (!p.jugado) return;
      if (!equiposEnDisputa.includes(p.local) || !equiposEnDisputa.includes(p.visitante)) return;

      const gl = p.goles_local;
      const gv = p.goles_visitante;

      if (gl > gv) {
        stats[p.local].pts += puntosPorPartido;
      } else if (gl === gv) {
        stats[p.local].pts += 1;
        stats[p.visitante].pts += 1;
      } else {
        stats[p.visitante].pts += puntosPorPartido;
      }

      stats[p.local].gf += gl;
      stats[p.local].diff += gl - gv;
      stats[p.visitante].gf += gv;
      stats[p.visitante].diff += gv - gl;
    });

    return stats;
  }

  function comparar(a, b, empatados) {
    const sa = tabla[a];
    const sb = tabla[b];
    const directos = statsDirectos(empatados);
    const da = directos[a];
    const db = directos[b];

    if (da.pts !== db.pts) return db.pts - da.pts;
    if (da.diff !== db.diff) return db.diff - da.diff;
    if (da.gf !== db.gf) return db.gf - da.gf;
    if (sa.diff !== sb.diff) return sb.diff - sa.diff;
    if (sa.gf !== sb.gf) return sb.gf - sa.gf;
    if (sb.fairPlay !== sa.fairPlay) return sb.fairPlay - sa.fairPlay;
    if (sa.rankingFIFA !== sb.rankingFIFA) return sa.rankingFIFA - sb.rankingFIFA;
    return 0;
  }

  const equipos = Object.keys(tabla);
  const ordenados = equipos.sort((a, b) => {
    if (tabla[b].pts !== tabla[a].pts) return tabla[b].pts - tabla[a].pts;
    const empatados = equipos.filter((e) => tabla[e].pts === tabla[a].pts);
    return comparar(a, b, empatados);
  });

  return ordenados.map((equipo, i) => ({
    pos: i + 1,
    equipo,
    pts: tabla[equipo].pts,
    pj: tabla[equipo].pj,
    pg: tabla[equipo].pg,
    pe: tabla[equipo].pe,
    pp: tabla[equipo].pp,
    gf: tabla[equipo].gf,
    gc: tabla[equipo].gc,
    diff: tabla[equipo].diff,
    fairPlay: tabla[equipo].fairPlay,
    rankingFIFA: tabla[equipo].rankingFIFA,
  }));
}

export async function calcularProbabilidadesEnSegundoPlano({ partidos, puntosPorPartido, competencia, clasificacionPorGrupo, repechaje, simulaciones = 10_000 }) {
  await new Promise((resolve) => setTimeout(resolve, 0));

  const equipos = obtenerEquipos(partidos);
  const grupos = obtenerGrupos(partidos);
  const clasificaciones = {};
  const posiciones = {};

  equipos.forEach((e) => {
    clasificaciones[e] = 0;
    posiciones[e] = new Set();
  });

  for (let sim = 0; sim < simulaciones; sim++) {
    const clasificacionesSim = {};
    equipos.forEach((e) => {
      clasificacionesSim[e] = 0;
    });

    const ventanas = inicializarVentanas(equipos, partidos);
    const partidosSimulados = partidos.map((p) => {
      if (p.jugado) {
        actualizarVentana(ventanas, p.local, p.goles_local, p.goles_visitante);
        actualizarVentana(ventanas, p.visitante, p.goles_visitante, p.goles_local);
        return { ...p, simulados: false, id: sim };
      }

      const scoreL = scoreDesdeVentana(ventanas[p.local], puntosPorPartido);
      const scoreV = scoreDesdeVentana(ventanas[p.visitante], puntosPorPartido);
      const resultado = generarResultado(competencia, null, p.local, p.visitante, { scoreL, scoreV });
      const tarjetas = generarTarjetas();

      actualizarVentana(ventanas, p.local, resultado.goles_local, resultado.goles_visitante);
      actualizarVentana(ventanas, p.visitante, resultado.goles_visitante, resultado.goles_local);

      return {
        ...p,
        ...resultado,
        amarillas_local: tarjetas.local.amarillas,
        rojas_indirectas_local: tarjetas.local.rojas_indirectas,
        rojas_directas_local: tarjetas.local.rojas_directas,
        amarilla_mas_roja_local: tarjetas.local.amarilla_mas_roja,
        amarillas_visitante: tarjetas.visitante.amarillas,
        rojas_indirectas_visitante: tarjetas.visitante.rojas_indirectas,
        rojas_directas_visitante: tarjetas.visitante.rojas_directas,
        amarilla_mas_roja_visitante: tarjetas.visitante.amarilla_mas_roja,
        jugado: true,
        simulados: true,
        id: sim,
      };
    });

    const terceros = [];

    grupos.forEach((d) => {
      const grupo = partidosSimulados.filter((e) => e.local.split('-')[1] === d || e.visitante.split('-')[1] === d);
      const tablaCompleta = calcularYOrdenarTablaConDatos(grupo, puntosPorPartido);
      const tabla = tablaCompleta.filter((t) => t.equipo.split('-')[1] === d);
      const orden = tabla.map((t) => t.equipo);

      orden.forEach((eq, i) => posiciones[eq].add(i + 1));
      orden.slice(0, clasificacionPorGrupo).forEach((eq) => {
        clasificaciones[eq]++;
        clasificacionesSim[eq]++;
      });

      if (repechaje > 0 && tabla.length > clasificacionPorGrupo) {
        terceros.push(tabla[clasificacionPorGrupo]);
      }
    });

    if (repechaje > 0 && terceros.length > 0) {
      terceros.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.diff !== a.diff) return b.diff - a.diff;
        if (b.gf !== a.gf) return b.gf - a.gf;
        if ((b.fairPlay ?? 0) !== (a.fairPlay ?? 0)) return (b.fairPlay ?? 0) - (a.fairPlay ?? 0);
        const rankA = rankingFIFA2026[a.equipo.replace(/-[A-L]$/, '')] || 999;
        const rankB = rankingFIFA2026[b.equipo.replace(/-[A-L]$/, '')] || 999;
        return rankA - rankB;
      });

      terceros.slice(0, repechaje).forEach((t) => {
        clasificaciones[t.equipo]++;
        clasificacionesSim[t.equipo]++;
      });
    }
  }

  const resultado = {};
  equipos.forEach((equipo) => {
    const posArr = [...posiciones[equipo]].sort((a, b) => a - b);
    const posStr = posArr.length === 1 ? `${posArr[0]}` : `${posArr[0]}-${posArr[posArr.length - 1]}`;
    resultado[equipo] = {
      clasificaciones: clasificaciones[equipo],
      probabilidad: Number(((clasificaciones[equipo] / simulaciones) * 100).toFixed(1)),
      posicion: posStr,
    };
  });

  return resultado;
}
