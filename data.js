import { rankingFIFA2026 } from './rankingFIFA2026.js';

export async function procesarDatos() {
  let data1 = await d3.csv('./torneos/mundial2026.csv');
  const numero_de_simulaciones = 10_000;

  let simular_grupo_de = '';
  let clasifica_simulador = false;
  let filtrar_simulador = false;

  let clasifica = 1;
  let filtrador = 'pos';
  let filtrador_valor = 3;

  let simular = false;

  let repechaje = 0;
  if (data1[0].torneo == 'Mundial 2026') {
    repechaje = 8;
  }

  console.log(repechaje);

  let playoffs = data1.filter((d) => d.fecha.includes('1/'));
  console.log(playoffs);

  // ============================================
  // 1. CALCULAR TABLA DE POSICIONES POR GRUPO
  // ============================================
  function calcularTablas(partidos) {
    const grupos = {};

    // Solo partidos de fase de grupos (Fecha 1, 2, 3)
    partidos
      .filter((p) => ['Fecha 1', 'Fecha 2', 'Fecha 3'].includes(p.fecha))
      .forEach((p) => {
        const grupo = p.local.split('-')[1]; // "Brasil-A" → "A"
        if (!grupos[grupo]) grupos[grupo] = {};

        [p.local, p.visitante].forEach((eq) => {
          if (!grupos[grupo][eq]) {
            grupos[grupo][eq] = { equipo: eq, pts: 0, gf: 0, gc: 0 };
          }
        });

        const gl = parseInt(p.goles_local);
        const gv = parseInt(p.goles_visitante);

        grupos[grupo][p.local].gf += gl;
        grupos[grupo][p.local].gc += gv;
        grupos[grupo][p.visitante].gf += gv;
        grupos[grupo][p.visitante].gc += gl;

        if (gl > gv) {
          grupos[grupo][p.local].pts += 3;
        } else if (gl < gv) {
          grupos[grupo][p.visitante].pts += 3;
        } else {
          grupos[grupo][p.local].pts += 1;
          grupos[grupo][p.visitante].pts += 1;
        }
      });

    // Ordenar cada grupo y devolver 1ro y 2do
    const clasificados = {};
    Object.entries(grupos).forEach(([grupo, equipos]) => {
      const sorted = Object.values(equipos).sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        const dgDiff = b.gf - b.gc - (a.gf - a.gc);
        if (dgDiff !== 0) return dgDiff;
        return b.gf - a.gf;
      });
      clasificados[`1${grupo}`] = sorted[0].equipo; // "1A" → "Brasil-A"
      clasificados[`2${grupo}`] = sorted[1].equipo; // "2A" → "México-A"
    });

    return clasificados;
  }

  // ============================================
  // 2. DEFINIR LA LLAVE (solo una vez, es FIFA)
  // ============================================
  const LLAVE_FIFA = [
    ['1A', '2B'], // Octavos - Partido 0
    ['1C', '2D'], // Octavos - Partido 1
    ['1E', '2F'], // Octavos - Partido 2
    ['1G', '2H'], // Octavos - Partido 3
    ['1B', '2A'], // Octavos - Partido 4
    ['1D', '2C'], // Octavos - Partido 5
    ['1F', '2E'], // Octavos - Partido 6
    ['1H', '2G'], // Octavos - Partido 7
  ];

  // ============================================
  // 3. BRACKET AUTOMÁTICO (reemplaza tu pirámide)
  // ============================================
  function buildBracket(clasificados) {
    // Crear octavos con los equipos reales
    const octavos = LLAVE_FIFA.map(([pos1, pos2], i) => ({
      match: i,
      home: clasificados[pos1],
      away: clasificados[pos2],
      homeKey: pos1, // "1A"
      awayKey: pos2, // "2B"
      winner: null,
    }));

    // Generar las rondas siguientes (vacías, se llenan con resultados)
    const cuartos = Array.from({ length: 4 }, (_, i) => ({
      match: i,
      home: null, // Ganador octavos[i*2]
      away: null, // Ganador octavos[i*2 + 1]
      sourceHome: i * 2,
      sourceAway: i * 2 + 1,
      winner: null,
    }));

    const semis = Array.from({ length: 2 }, (_, i) => ({
      match: i,
      home: null,
      away: null,
      sourceHome: i * 2,
      sourceAway: i * 2 + 1,
      winner: null,
    }));

    const final = {
      match: 0,
      home: null,
      away: null,
      sourceHome: 0,
      sourceAway: 1,
      winner: null,
    };

    return { octavos, cuartos, semis, final };
  }

  // ============================================
  // 4. APLICAR RESULTADOS DEL CSV
  // ============================================
  function parseScore(str) {
    const m = str.trim().match(/^(\d+)(?:\[(\d+)\])?$/);
    return { goles: parseInt(m[1]), penales: m[2] ? parseInt(m[2]) : null };
  }

  function determinarGanador(local, visitante, golLocal, golVisitante) {
    const h = parseScore(golLocal);
    const a = parseScore(golVisitante);
    if (h.goles !== a.goles) return h.goles > a.goles ? local : visitante;
    return h.penales > a.penales ? local : visitante;
  }

  function aplicarResultados(bracket, partidos) {
    const rondas = {
      'Fecha 1/8': { datos: bracket.octavos, siguiente: bracket.cuartos },
      'Fecha 1/4': { datos: bracket.cuartos, siguiente: bracket.semis },
      'Fecha 1/2': { datos: bracket.semis, siguiente: [bracket.final] },
      'Fecha 1/1': { datos: [bracket.final], siguiente: null },
    };

    Object.entries(rondas).forEach(([fechaKey, { datos, siguiente }]) => {
      const matches = partidos.filter((p) => p.fecha === fechaKey);

      matches.forEach((p, i) => {
        const ganador = determinarGanador(p.local, p.visitante, p.goles_local, p.goles_visitante);

        datos[i].home = p.local;
        datos[i].away = p.visitante;
        datos[i].homeScore = p.goles_local;
        datos[i].awayScore = p.goles_visitante;
        datos[i].winner = ganador;

        // Propagar ganador a la siguiente ronda
        if (siguiente) {
          const nextMatch = Math.floor(i / 2);
          const slot = i % 2; // 0 = home, 1 = away  ← ¡ACÁ ESTÁ TU PIRÁMIDE!
          if (slot === 0) siguiente[nextMatch].home = ganador;
          else siguiente[nextMatch].away = ganador;
        }
      });
    });
  }

  // ============================================
  // 5. TODO JUNTO
  // ============================================
  const clasificados = calcularTablas(data1); // partidos ya parseados
  const bracket = buildBracket(clasificados);
  aplicarResultados(bracket, data1);

  console.log(bracket);
  // bracket.final.winner → "Alemania-G" 🏆

  data1 = data1.filter((d) => !d.fecha.includes('1/'));

  let nombre_torneo = data1[0].torneo.replace('Torneo ', '');
  let puntos_por_partido = 3;
  let year_torneo = parseInt(data1[0].torneo.split(' ').slice(-1));
  year_torneo < 1996 ? (puntos_por_partido = 2) : '';
  data1[0].torneo == 'Torneo Apertura 1995' ? (puntos_por_partido = 3) : '';

  let verEquipo = '';
  let grupoDeVerEquipo = '';

  if (simular_grupo_de != '') {
    simular = true;
    verEquipo = simular_grupo_de;
    grupoDeVerEquipo = data1.filter((d) => d.local.split('-')[0] == verEquipo || d.visitante.split('-')[0] == verEquipo)[0].local.split('-')[1];
    verEquipo = simular_grupo_de + '-' + grupoDeVerEquipo;
  }

  let competencia = nombre_torneo;

  const clasificados_por_competencia = {
    ['Campeonato 2024']: 1,
    ['Apertura 2025']: 8,
    WorldCup: 2,
    ClubWorldCup: 2,
    ELIMINATORIAS: 7,
    Libertadores: 2,
    Sudamericana: 2,
    argentina: 8,
    ['Mundial 2026']: 2,
    ['Mundial 2014']: 2,
    ['ELIMINATORIAS CONMEBOL MUNDIAL 2026']: 6,
  };

  let clasificacion_por_grupo = clasificados_por_competencia[competencia];

  let formatDateLarge = d3.utcFormat('%b %d');
  let formatDate = d3.utcFormat('%Y-%m-%d');

  let data_cruda = data1.map((d) => ({ ...d }));
  let casos0 = [];
  let casos1 = [];
  let casos2 = [];
  let casos3 = [];

  data_cruda.forEach((d) => {
    d.jugado = d.goles_local !== '99' && d.goles_visitante !== '99';
    d.goles_local = d.jugado ? Number(d.goles_local) : null;
    d.goles_visitante = d.jugado ? Number(d.goles_visitante) : null;
  });

  function calcularPosiciones(partidos) {
    const tabla = {};

    // Inicializar todos los equipos en cero
    const equipos = obtenerEquipos(partidos);
    equipos.forEach((equipo) => {
      tabla[equipo] = {
        pts: 0,
        pj: 0,
        pg: 0,
        pe: 0,
        pp: 0,
        gf: 0,
        gc: 0,
        diff: 0,
      };
    });

    // Procesar solo partidos jugados
    partidos
      .filter((p) => p.jugado)
      .forEach((p) => {
        const local = tabla[p.local];
        const visitante = tabla[p.visitante];

        local.pj++;
        visitante.pj++;

        local.gf += p.goles_local;
        local.gc += p.goles_visitante;
        visitante.gf += p.goles_visitante;
        visitante.gc += p.goles_local;

        if (p.goles_local > p.goles_visitante) {
          // Ganó el local
          local.pts += puntos_por_partido;
          local.pg++;
          visitante.pp++;
        } else if (p.goles_local < p.goles_visitante) {
          // Ganó el visitante
          visitante.pts += puntos_por_partido;
          visitante.pg++;
          local.pp++;
        } else {
          // Empate
          local.pts += 1;
          local.pe++;
          visitante.pts += 1;
          visitante.pe++;
        }
      });
    Object.values(tabla).forEach((e) => (e.diff = e.gf - e.gc));
    return tabla;
  }

  function calcularYOrdenarTabla(partidos) {
    // --- 1. Construir tabla general desde partidos ---
    const tabla = {};

    partidos.forEach((p) => {
      if (!p.jugado) return;

      [p.local, p.visitante].forEach((equipo) => {
        if (!tabla[equipo]) {
          tabla[equipo] = { pts: 0, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, diff: 0, rojas: 0, amarillas: 0 };
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
        tabla[p.local].pts += puntos_por_partido;
        tabla[p.local].pg++;
        tabla[p.visitante].pp++;
      } else if (gl === gv) {
        tabla[p.local].pts += 1;
        tabla[p.visitante].pts += 1;
        tabla[p.local].pe++;
        tabla[p.visitante].pe++;
      } else {
        tabla[p.visitante].pts += puntos_por_partido;
        tabla[p.visitante].pg++;
        tabla[p.local].pp++;
      }
    });

    // --- 2. Stats de enfrentamientos directos entre un subconjunto ---
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
          stats[p.local].pts += puntos_por_partido;
        } else if (gl === gv) {
          stats[p.local].pts += 1;
          stats[p.visitante].pts += 1;
        } else {
          stats[p.visitante].pts += puntos_por_partido;
        }

        stats[p.local].gf += gl;
        stats[p.local].diff += gl - gv;
        stats[p.visitante].gf += gv;
        stats[p.visitante].diff += gv - gl;
      });

      return stats;
    }

    // --- 3. Comparador con todos los criterios ---
    function comparar(a, b, empatados) {
      const sa = tabla[a];
      const sb = tabla[b];

      // 1º Enfrentamientos directos entre los empatados
      const directos = statsDirectos(empatados);
      const da = directos[a];
      const db = directos[b];

      if (db.pts !== da.pts) return db.pts - da.pts;
      if (db.diff !== da.diff) return db.diff - da.diff;
      if (db.gf !== da.gf) return db.gf - da.gf;

      // 2º Diferencia de goles general
      if (sb.diff !== sa.diff) return sb.diff - sa.diff;

      // 3º Goles a favor general
      if (sb.gf !== sa.gf) return sb.gf - sa.gf;

      // 4º Menor tarjetas rojas
      if (sa.rojas !== sb.rojas) return sa.rojas - sb.rojas;

      // 5º Menor tarjetas amarillas
      if (sa.amarillas !== sb.amarillas) return sa.amarillas - sb.amarillas;

      // 6º Sorteo
      return Math.random() - 0.5;
    }

    // --- 4. Ordenar con grupos de empatados ---
    const equipos = Object.keys(tabla);

    const ordenados = equipos.sort((a, b) => {
      if (tabla[b].pts !== tabla[a].pts) return tabla[b].pts - tabla[a].pts;

      const empatados = equipos.filter((e) => tabla[e].pts === tabla[a].pts);
      return comparar(a, b, empatados);
    });
    // --- 5. Resultado final ---
    return ordenados;
  }

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
    let L = Math.exp(-lambda),
      k = 0,
      p = 1;
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

  // ─────────────────────────────────────────────────────────────
  // Ventana de rendimiento por simulación
  // Mantiene los últimos 5 resultados (reales + simulados) por equipo,
  // SOLO dentro de la simulación actual (id = sim)
  // ─────────────────────────────────────────────────────────────

  const CALIBRACION = {
    // GF promedio de un equipo individual por partido.
    // Un equipo "típico" ronda 1.3 (mitad del promedio combinado ~2.65).
    // El techo de score=100 lo fijamos en 2.7, el máximo histórico sostenido
    // por una selección (Hungría años 50), no en un número arbitrario.
    GF_PROMEDIO_TIPICO: 1.3,
    GF_TECHO_SCORE_100: 2.7,

    // GC promedio de un equipo individual por partido.
    // score=100 (mejor posible) en GC=0; score=0 (peor) lo fijamos en 2.7
    // por simetría con el techo ofensivo, en vez de también usar 3 a ojo.
    GC_PISO_SCORE_100: 0,
    GC_TECHO_SCORE_0: 2.7,

    // Peso del ajuste de rendimiento sobre el lambda base (decidido: ±15%)
    PESO_AJUSTE_LAMBDA: 0.15,

    // Tamaño de ventana de partidos recientes
    VENTANA_PARTIDOS: 5,
  };

  // ─────────────────────────────────────────────────────────────────────
  // PONDERACIÓN INTERNA DEL SCORE DE RENDIMIENTO (decidido: 50/30/20)
  // ─────────────────────────────────────────────────────────────────────
  const PESOS_SCORE = {
    efectividad: 0.5,
    golesFavor: 0.3,
    golesContra: 0.2,
  };

  /* ════════════════════════════════════════════════════════════════════
   NOTA SOBRE REDUNDANCIA CON RANKING FIFA (ver metodología, sección 4)
   ════════════════════════════════════════════════════════════════════
   El ranking FIFA ya incorpora resultados recientes en su cálculo oficial,
   por lo que ajustar el lambda por ranking FIFA y por rendimiento-últimos-5
   de forma totalmente independiente corre el riesgo de contar la misma
   señal dos veces (doble conteo) y sobre-amplificar a equipos en racha.
 
   Se aplica un AMORTIGUADOR: cuando ambas señales apuntan en la MISMA
   dirección (ej. equipo bien rankeado Y en buena racha), el ajuste de
   rendimiento se reduce a la mitad, porque gran parte de esa información
   ya fue capturada por el ranking. Cuando las señales DIVERGEN (ej. equipo
   mal rankeado pero en gran racha reciente, o viceversa), el ajuste de
   rendimiento se aplica completo, porque ahí es donde aporta información
   NUEVA que el ranking todavía no refleja.
   ════════════════════════════════════════════════════════════════════ */

  function calcularFactorAmortiguador(scoreRendimiento, rankingPropio, rankingRival) {
    // ¿El ranking ya favorece a este equipo? (rankingRival - rankingPropio > 0
    // significa que el rival está peor rankeado, o sea este equipo es favorito)
    const rankingFavorece = rankingRival > rankingPropio;
    const rendimientoFavorece = scoreRendimiento > 50;

    const mismaDirec = rankingFavorece === rendimientoFavorece;

    // Si coinciden → amortiguar a la mitad (evitar doble conteo)
    // Si divergen   → aplicar completo (información nueva)
    return mismaDirec ? 0.5 : 1.0;
  }

  // ─────────────────────────────────────────────────────────────────────
  // SCORE DE RENDIMIENTO RECIENTE (0-100) a partir de una ventana de
  // hasta 5 partidos ya jugados (reales o simulados previamente)
  // ─────────────────────────────────────────────────────────────────────
  function scoreDesdeVentana(ventana, puntosPorPartido) {
    if (ventana.length === 0) return 50; // sin historial → neutro

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

    const efectividad = puntosGanados / puntosPosibles; // 0 a 1

    const gfProm = golesFavor / n;
    const scoreGF = Math.min(gfProm / CALIBRACION.GF_TECHO_SCORE_100, 1);

    const gcProm = golesContra / n;
    const scoreGC = Math.max(1 - gcProm / CALIBRACION.GC_TECHO_SCORE_0, 0);

    const score = (efectividad * PESOS_SCORE.efectividad + scoreGF * PESOS_SCORE.golesFavor + scoreGC * PESOS_SCORE.golesContra) * 100;

    return Math.round(score);
  }

  // ─────────────────────────────────────────────────────────────────────
  // Ajusta el lambda base aplicando el score de rendimiento Y el
  // amortiguador anti-doble-conteo respecto al ranking FIFA
  // ─────────────────────────────────────────────────────────────────────
  function ajustarLambdaPorRendimiento(lambdaBase, scoreRendimiento, rankingPropio, rankingRival) {
    const amortiguador = calcularFactorAmortiguador(scoreRendimiento, rankingPropio, rankingRival);

    // Mapeo lineal centrado en 50: score 100 → +15% | score 0 → -15%
    const desviacion = (scoreRendimiento - 50) / 50; // -1 a +1
    const factor = 1 + desviacion * CALIBRACION.PESO_AJUSTE_LAMBDA * amortiguador;

    return Math.max(0.4, Math.min(2.8, lambdaBase * factor));
  }

  // ─────────────────────────────────────────────────────────────────────
  // Ventanas de rendimiento — una por simulación, para no mezclar
  // universos simulados distintos
  // ─────────────────────────────────────────────────────────────────────
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

  /* ════════════════════════════════════════════════════════════════════
   generarResultado — integrando ranking FIFA + rendimiento amortiguado
   ════════════════════════════════════════════════════════════════════ */
  function generarResultado(
    liga = 'argentina',
    override = null,
    equipoLocal = null,
    equipoVisitante = null,
    rendimiento = null // { scoreL, scoreV } ya calculados desde la ventana
  ) {
    const config = override ?? LAMBDAS[liga];
    let lambdaL = config.local;
    let lambdaV = config.visitante;

    let rankL = 50;
    let rankV = 50;

    // ── Ajuste por ranking FIFA ──────────────────────────────────────
    if (equipoLocal && equipoVisitante) {
      rankL = rankingFIFA2026[equipoLocal.replace(/-[A-L]$/, '')] || 50;
      rankV = rankingFIFA2026[equipoVisitante.replace(/-[A-L]$/, '')] || 50;

      const diff = rankV - rankL;
      const k = 0.022;
      const ajuste = k * diff;

      lambdaL = Math.max(0.4, Math.min(2.8, lambdaL + ajuste / 2));
      lambdaV = Math.max(0.4, Math.min(2.8, lambdaV - ajuste / 2));
    }

    // ── Ajuste por rendimiento reciente (con amortiguador anti-doble-conteo) ─
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
    // Promedios históricos por equipo por partido (aprox. Mundial)
    // ~3.5 amarillas totales por partido, ~0.15 rojas totales
    const tarjetas = (lado) => {
      const amarillas = poissonRandom(1.7); // ~1.7 por equipo
      const rojas_indirectas = poissonRandom(0.04); // doble amarilla
      const rojas_directas = poissonRandom(0.05); // roja directa
      const amarilla_mas_roja = poissonRandom(0.02); // amarilla + roja directa

      return { amarillas, rojas_indirectas, rojas_directas, amarilla_mas_roja };
    };

    return { local: tarjetas('local'), visitante: tarjetas('visitante') };
  }

  // Distribución de Poisson — ideal para eventos raros por partido
  function poissonRandom(lambda) {
    const L = Math.exp(-lambda);
    let k = 0,
      p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return k - 1;
  }

  function calcularYOrdenarTablaConDatos(partidos) {
    // --- 1. Construir tabla general desde partidos ---
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
        tabla[p.local].pts += puntos_por_partido;
        tabla[p.local].pg++;
        tabla[p.visitante].pp++;
      } else if (gl === gv) {
        tabla[p.local].pts += 1;
        tabla[p.visitante].pts += 1;
        tabla[p.local].pe++;
        tabla[p.visitante].pe++;
      } else {
        tabla[p.visitante].pts += puntos_por_partido;
        tabla[p.visitante].pg++;
        tabla[p.local].pp++;
      }

      // --- Fair Play ---
      tabla[p.local].fairPlay -= (p.amarillas_local || 0) * 1 + (p.rojas_indirectas_local || 0) * 3 + (p.rojas_directas_local || 0) * 4 + (p.amarilla_mas_roja_local || 0) * 5;

      tabla[p.visitante].fairPlay -= (p.amarillas_visitante || 0) * 1 + (p.rojas_indirectas_visitante || 0) * 3 + (p.rojas_directas_visitante || 0) * 4 + (p.amarilla_mas_roja_visitante || 0) * 5;
    });

    Object.keys(tabla).forEach((equipoConGrupo) => {
      const nombre = equipoConGrupo.replace(/-[A-L]$/, '');
      tabla[equipoConGrupo].rankingFIFA = rankingFIFA2026[nombre] || 999;
    });

    // --- 2. Stats de enfrentamientos directos entre un subconjunto ---
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
          stats[p.local].pts += puntos_por_partido;
        } else if (gl === gv) {
          stats[p.local].pts += 1;
          stats[p.visitante].pts += 1;
        } else {
          stats[p.visitante].pts += puntos_por_partido;
        }

        stats[p.local].gf += gl;
        stats[p.local].diff += gl - gv;
        stats[p.visitante].gf += gv;
        stats[p.visitante].diff += gv - gl;
      });

      return stats;
    }

    // --- 3. Comparador FIFA 2026 (par a par, con contexto de empatados) ---
    function comparar(a, b, empatados) {
      const sa = tabla[a];
      const sb = tabla[b];

      /* console.log(a, sa, sa.rankingFIFA) */

      // 1º–3º Enfrentamientos directos entre TODOS los empatados
      const directos = statsDirectos(empatados);
      const da = directos[a];
      const db = directos[b];

      if (da.pts !== db.pts) return db.pts - da.pts;
      if (da.diff !== db.diff) return db.diff - da.diff;
      if (da.gf !== db.gf) return db.gf - da.gf;

      // 4º Diferencia de goles general
      if (sa.diff !== sb.diff) return sb.diff - sa.diff;

      // 5º Goles a favor general
      if (sa.gf !== sb.gf) return sb.gf - sa.gf;

      // 6º Fair Play (menor = mejor, así que el que tenga menos va primero)
      if (sb.fairPlay !== sa.fairPlay) return sb.fairPlay - sa.fairPlay;

      // 7º Ranking FIFA (menor número = mejor posición en el ranking)
      if (sa.rankingFIFA !== sb.rankingFIFA) return sa.rankingFIFA - sb.rankingFIFA;

      return 0;
    }

    // --- 4. Ordenar con grupos de empatados ---
    const equipos = Object.keys(tabla);

    const ordenados = equipos.sort((a, b) => {
      if (tabla[b].pts !== tabla[a].pts) return tabla[b].pts - tabla[a].pts;

      const empatados = equipos.filter((e) => tabla[e].pts === tabla[a].pts);
      return comparar(a, b, empatados);
    });

    // --- 5. Resultado final con todos los datos para comparar terceros ---
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

  function calcularProbabilidades(partidos, cantidadClassif = 2, mejoresTerceros = 8, simulaciones = 50_000) {
    const equipos = obtenerEquipos(partidos);
    const grupos = obtenerGrupos(partidos);

    const clasificaciones = {};
    const posiciones = {};
    equipos.forEach((e) => {
      clasificaciones[e] = 0;
      posiciones[e] = new Set();
    });

    for (let sim = 0; sim < simulaciones; sim++) {
      casos2 = [];
      casos3 = [];

      const clasificacionesSim = {};

      equipos.forEach((e) => {
        clasificacionesSim[e] = 0;
      });

      // Ventanas frescas por simulación, arrancan con historial REAL
      const ventanas = inicializarVentanas(equipos, partidos);

      const partidosSimulados = partidos.map((p) => {
        if (p.jugado) {
          actualizarVentana(ventanas, p.local, p.goles_local, p.goles_visitante);
          actualizarVentana(ventanas, p.visitante, p.goles_visitante, p.goles_local);
          return { ...p, simulados: false, id: sim };
        }

        const scoreL = scoreDesdeVentana(ventanas[p.local], puntos_por_partido);
        const scoreV = scoreDesdeVentana(ventanas[p.visitante], puntos_por_partido);

        const resultado = generarResultado(competencia, null, p.local, p.visitante, {
          scoreL,
          scoreV,
        });
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

        const tablaCompleta = calcularYOrdenarTablaConDatos(grupo);
        const tabla = tablaCompleta.filter((t) => t.equipo.split('-')[1] === d);
        const orden = tabla.map((t) => t.equipo);

        orden.forEach((eq, i) => posiciones[eq].add(i + 1));
        orden.slice(0, cantidadClassif).forEach((eq) => {
          clasificaciones[eq]++; // acumulado global
          clasificacionesSim[eq]++; // sólo esta simulación
        });

        if (mejoresTerceros > 0 && tabla.length > cantidadClassif) {
          terceros.push(tabla[cantidadClassif]);
        }

        casos3 = casos3.concat(tabla);
        casos2 = casos2.concat(grupo);
        casos1.push([tabla, grupo]);
      });

      if (mejoresTerceros > 0 && terceros.length > 0) {
        terceros.sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.diff !== a.diff) return b.diff - a.diff;
          if (b.gf !== a.gf) return b.gf - a.gf;
          if ((b.fairPlay ?? 0) !== (a.fairPlay ?? 0)) return (b.fairPlay ?? 0) - (a.fairPlay ?? 0);
          const rankA = rankingFIFA2026[a.equipo.replace(/-[A-L]$/, '')] || 999;
          const rankB = rankingFIFA2026[b.equipo.replace(/-[A-L]$/, '')] || 999;
          return rankA - rankB;
        });

        terceros.slice(0, mejoresTerceros).forEach((t) => {
          clasificaciones[t.equipo]++;
          clasificacionesSim[t.equipo]++;
        });
      }

      casos0.push([casos3, casos2, clasificacionesSim]);
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

  // Convertir conteos a porcentajes
  // Se calcula en segundo plano para no bloquear la carga inicial de la visualización.
  let probabilidades = null;

  function eliminarDuplicados(simulaciones) {
    const vistas = new Set();

    return simulaciones.filter((sim) => {
      const tabla = sim[0]; // tabla de posiciones

      const clave = tabla.map((t) => `${t.equipo}`).join('|');

      if (vistas.has(clave)) return false;
      vistas.add(clave);
      return true;
    });
  }

  function filtrarPorValor(simulaciones, equipo, valor) {
    return simulaciones.filter((sim) => sim[2][equipo] === valor);
  }

  function filtrarPorCampo(simulaciones, equipo, campo, valor) {
    return simulaciones.filter((sim) => sim[0].some((t) => t.equipo === equipo && t[campo] === valor));
  }

  if (filtrar_simulador) {
    casos0 = filtrarPorCampo(casos0, verEquipo, filtrador, filtrador_valor);
  }

  if (clasifica_simulador) {
    casos0 = filtrarPorValor(casos0, verEquipo, clasifica);
  }

  const sinDuplicados1 = eliminarDuplicados(casos0);

  const ordenados1 = [...sinDuplicados1].sort((a, b) => {
    const getEquipo = (sim, equipo) => sim[0].find((t) => t.equipo === equipo);

    const equipoA = getEquipo(a, verEquipo);
    const equipoB = getEquipo(b, verEquipo);

    const posA = equipoA?.pos ?? 999;
    const posB = equipoB?.pos ?? 999;

    if (posA !== posB) return posA - posB;

    const ptsA = equipoA?.pts ?? 0;
    const ptsB = equipoB?.pts ?? 0;

    if (ptsA !== ptsB) return ptsB - ptsA;

    /* const bajoA = a[0].find((t) => t.pos === posA + 1)?.pts ?? 0;
  const bajoB = b[0].find((t) => t.pos === posB + 1)?.pts ?? 0;

  const difA = ptsA - bajoA;
  const difB = ptsB - bajoB;

  if (difA !== difB) return difB - difA; */

    const diffA = equipoA?.diff ?? 0;
    const diffB = equipoB?.diff ?? 0;

    if (diffA !== diffB) return diffB - diffA;

    const gfA = equipoA?.gf ?? 0;
    const gfB = equipoB?.gf ?? 0;

    if (gfA !== gfB) return gfB - gfA;

    return 0;
  });

  /* let ordenados1 = casos0 */

  console.log(structuredClone(ordenados1));

  let totalCasosSimulados = [];

  for (let indexFor = 0; indexFor < (simular ? ordenados1.length : 1); indexFor++) {
    /* console.log(ordenados1[indexFor][1]); */

    if (simular) {
      data1 = ordenados1[indexFor][1];
    }
    data1.forEach((d) => {
      d.goles_local = d.goles_local.toString();
      d.goles_visitante = d.goles_visitante.toString();
    });

    let fecha_adicional = 'Def.';

    function mes(mes) {
      if (mes == 'Jan') {
        return 0;
      } else if (mes == 'Feb') {
        return 1;
      } else if (mes == 'Mar') {
        return 2;
      } else if (mes == 'Apr') {
        return 3;
      } else if (mes == 'May') {
        return 4;
      } else if (mes == 'Jun') {
        return 5;
      } else if (mes == 'Jul') {
        return 6;
      } else if (mes == 'Aug') {
        return 7;
      } else if (mes == 'Sep') {
        return 8;
      } else if (mes == 'Oct') {
        return 9;
      } else if (mes == 'Nov') {
        return 10;
      } else if (mes == 'Dec') {
        return 11;
      }
    }

    data1.forEach((d) => {
      if (d.goles_local.includes('[')) {
        d.penales_local = +d.goles_local.split('[')[1].replace(']', '');
      }
      if (d.goles_visitante.includes('[')) {
        d.penales_visitante = +d.goles_visitante.split('[')[1].replace(']', '');
      }
      d.goles_local = +d.goles_local.split('[')[0];
      d.goles_visitante = +d.goles_visitante.split('[')[0];

      d.amarillas_local = +d.amarillas_local;
      d.rojas_indirectas_local = +d.rojas_indirectas_local;
      d.rojas_directas_local = +d.rojas_directas_local;
      d.amarilla_mas_roja_local = +d.amarilla_mas_roja_local;
      d.amarillas_visitante = +d.amarillas_visitante;
      d.rojas_indirectas_visitante = +d.rojas_indirectas_visitante;
      d.rojas_directas_visitante = +d.rojas_directas_visitante;
      d.amarilla_mas_roja_visitante = +d.amarilla_mas_roja_visitante;

      d.pts_local = d.goles_local > d.goles_visitante ? puntos_por_partido : d.goles_local < d.goles_visitante ? 0 : 1;
      d.pts_visitante = d.goles_visitante > d.goles_local ? puntos_por_partido : d.goles_visitante < d.goles_local ? 0 : 1;
      d.dia = new Date(+d.dia.split(' ')[2], mes(d.dia.split(' ')[0]), +d.dia.split(' ')[1]);
      d.dia_large = formatDateLarge(d.dia);
    });

    let deducted = [];

    data1.forEach((d) => {
      if (d.visitante == 'fifa') {
        deducted.push({
          name: d.local,
          pts_deducted: d.goles_visitante,
          dia: formatDate(d.dia),
        });
      }
    });

    let torneo = data1.filter((d) => d.visitante != 'fifa' && !d.fecha.includes('1/'));

    let dias = new Set(torneo.map((d) => d.dia).sort((a, b) => a - b));
    dias = new Set([...dias].map((d) => formatDate(d)));

    let clubes = new Set([...new Set(torneo.map((d) => d.local)), ...new Set(torneo.map((d) => d.visitante))]);

    let fechas_torneo = new Set(torneo.filter((d) => d.fecha.split(' ')[1] != fecha_adicional && !d.fecha.includes('1/')).map((d) => d.fecha));

    let fechas_torneo2 = new Set(torneo.filter((d) => d.fecha.split(' ')[1] != fecha_adicional && !d.fecha.includes('1/')).map((d) => d.fecha));
    let fechas_def = torneo.filter((d) => d.fecha.split(' ')[1] == fecha_adicional);

    let fechas_pospuestas = [];

    fechas_torneo = [...fechas_torneo];

    fechas_torneo.forEach((fecha, i) => {
      try {
        let fechas = torneo.filter((d) => d.fecha == fecha && d.dia < torneo.filter((d) => d.fecha == fechas_torneo[i + 1])[0].dia);
        fechas.forEach((d) => {
          Object.assign(d, { fecha2: d.fecha });
        });
        fechas_pospuestas.push(fechas);
        let pendiente = torneo.filter((d) => d.fecha == fecha && d.dia > torneo.filter((d) => d.fecha == fechas_torneo[i + 1])[0].dia);
        pendiente.forEach((d) => {
          Object.assign(d, { fecha2: 'Fecha Post.', fecha5: 'Fecha same' });
        });
        fechas_pospuestas.push(pendiente);
      } catch {
        let fechas = torneo.filter((d) => d.fecha == fecha && d.dia < torneo.filter((d) => d.fecha == fechas_torneo[i - 1])[0].dia);
        fechas.forEach((d) => {
          Object.assign(d, { fecha2: 'Fecha Post.' });
        });
        fechas_pospuestas.push(fechas);
        let pendiente = torneo.filter((d) => d.fecha == fecha && d.dia > torneo.filter((d) => d.fecha == fechas_torneo[i - 1])[0].dia);
        pendiente.forEach((d) => {
          Object.assign(d, { fecha2: d.fecha });
        });
        fechas_pospuestas.push(pendiente);
      }
    });

    fechas_pospuestas = fechas_pospuestas.filter((d) => d.length > 0);
    fechas_pospuestas = fechas_pospuestas.sort((a, b) => {
      if (a[0].dia > b[0].dia) {
        return 1;
      } else if (a[0].dia < b[0].dia) {
        return -1;
      } else {
        return 0;
      }
    });

    let num_fecha = 0;

    fechas_pospuestas.forEach((d, i) => {
      if (d.map((e) => e.fecha2)[0] == 'Fecha Post.' && d.map((e) => e.fecha2).length == clubes.size / 2) {
        num_fecha = num_fecha + 1;
      }

      if (fechas_pospuestas[i][0].fecha2 == 'Fecha Post.') {
        d.forEach((e) => {
          Object.assign(e, { fecha4: 'Fecha ' + num_fecha });
        });
      }

      if (fechas_pospuestas[i][0].fecha2 != 'Fecha Post.') {
        num_fecha = num_fecha + 1;
        d.forEach((e) => {
          Object.assign(e, { fecha4: 'Fecha ' + num_fecha });
        });
      }
    });

    let total_fechas = [];
    fechas_pospuestas.forEach((d) => {
      d.forEach((e) => {
        total_fechas.push(e.fecha4);
      });
    });
    total_fechas = new Set(total_fechas);

    let fechas_pospuestas1 = [];

    total_fechas.forEach((fecha) => {
      let fechas = torneo.filter((d) => d.fecha4 == fecha);
      fechas_pospuestas1.push(fechas);
    });

    fechas_pospuestas1 = fechas_pospuestas1.sort((a, b) => {
      if (a[0].dia > b[0].dia) {
        return 1;
      } else if (a[0].dia < b[0].dia) {
        return -1;
      } else {
        return 0;
      }
    });

    fechas_def.forEach((d) => {
      d.fecha2 = 'Fecha Def.';
      d.fecha4 = 'Fecha Def.';
    });

    fechas_pospuestas1.push(fechas_def);

    fechas_pospuestas1.forEach((d, i) => {
      d.forEach((e) => {
        Object.assign(e, { semana: i + 1 });
      });
    });

    let data2 = [];

    fechas_pospuestas1.forEach((d) => {
      d.forEach((e) => {
        data2.push(e);
      });
    });

    data2 = data2.sort((a, b) => {
      if (a.dia > b.dia) {
        return 1;
      } else if (a.dia < b.dia) {
        return -1;
      } else {
        return 0;
      }
    });

    let semanas = new Set(data2.map((d) => d.semana).sort((a, b) => a - b));

    data1.forEach((d) => {
      d.dia = formatDate(d.dia);
    });

    let partidos_n = 0;
    let partidos = [];

    partidos.push({ semana: 0, partido_n: partidos_n });

    let final_list = [];

    semanas.forEach((semana) => {
      let semana_filter = data2.filter((d) => d.semana == semana);

      semana_filter.forEach((d) => {
        partidos_n++;
        final_list.push({
          dia: d.dia,
          dia_large: d.dia_large,
          name: d.local,
          l_or_v: 'L',
          vs: d.visitante,
          semana: semana,
          fecha: d.fecha,
          fecha2: d.fecha2,
          fecha4: d.fecha4,
          pts: d.pts_local,
          goles: d.goles_local,
          goles_en_contra: d.goles_visitante,
          penales: d.penales_local,
          penales_en_contra: d.penales_visitante,
          n_partidos: partidos_n,
          simulado: d.simulados,
          amarillas: d.amarillas_local,
          rojas_indirectas: d.rojas_indirectas_local,
          rojas_directas: d.rojas_directas_local,
          amarilla_mas_roja: d.amarilla_mas_roja_local,
        });
        final_list.push({
          dia: d.dia,
          dia_large: d.dia_large,
          name: d.visitante,
          l_or_v: 'V',
          vs: d.local,
          semana: semana,
          fecha: d.fecha,
          fecha2: d.fecha2,
          fecha4: d.fecha4,
          pts: d.pts_visitante,
          goles: d.goles_visitante,
          goles_en_contra: d.goles_local,
          penales: d.penales_local,
          penales_en_contra: d.penales_visitante,
          simulado: d.simulados,
          amarillas: d.amarillas_visitante,
          rojas_indirectas: d.rojas_indirectas_visitante,
          rojas_directas: d.rojas_directas_visitante,
          amarilla_mas_roja: d.amarilla_mas_roja_visitante,
        });
      });
      let clubes_semana1 = new Set(semana_filter.map((d) => d.local));
      let clubes_semana2 = new Set(semana_filter.map((d) => d.visitante));
      let clubes_semana3 = new Set([...clubes_semana1, ...clubes_semana2]);

      clubes.forEach((club) => {
        if (![...clubes_semana3].includes(club)) {
          final_list.push({
            name: club,
            vs: 'none',
            semana: semana,
            fecha: '',
            pts: 0,
            goles: 0,
            goles_en_contra: 0,
          });
        }
      });

      partidos.push({ semana: semana, partido_n: partidos_n });
    });

    let final_list1 = [];

    clubes.forEach((club) => {
      let pts_away = 0;
      let pts = 0;
      let pts_deducted = 0;
      let goles = 0;
      let goles_en_contra = 0;
      let goleadas = 0;
      let goleadas_en_contra = 0;
      let partidos_jugados = 0;
      let partidos_ganados = 0;
      let partidos_empatados = 0;
      let partidos_perdidos = 0;
      let valla_invicta = 0;
      let partido_casa = 0;
      let victoria_casa = 0;
      let empate_casa = 0;
      let derrota_casa = 0;

      let fairPlay = 0;

      let pts1 = 0;
      let goles1 = 0;
      let goles_en_contra1 = 0;
      let goleadas1 = 0;
      let goleadas_en_contra1 = 0;
      let partidos_jugados1 = 0;
      let partidos_ganados1 = 0;
      let partidos_empatados1 = 0;
      let partidos_perdidos1 = 0;

      let filter_clubes = final_list.filter((d) => d.name == club);

      let racha = 0;
      let racha_empates = 0;
      let racha_derrotas = 0;
      let racha_sin_victorias = 0;
      let racha_sin_empates = 0;
      let racha_sin_derrotas = 0;

      filter_clubes.forEach((d) => {
        if (d.fecha.includes(fecha_adicional)) {
          pts1 = pts1 + d.pts;
          goles1 = goles1 + d.goles;
          goles_en_contra1 = goles_en_contra1 + d.goles_en_contra;
          d.goles - d.goles_en_contra >= 3 ? goleadas++ : '';
          d.goles_en_contra - d.goles >= 3 ? goleadas_en_contra++ : '';
          d.vs != 'none' ? partidos_jugados1++ : '';
          d.pts == puntos_por_partido ? partidos_ganados1++ : d.pts == 1 ? partidos_empatados1++ : d.vs != 'none' ? partidos_perdidos1++ : '';

          if (d.vs != 'none') {
            if (d.pts == puntos_por_partido) {
              racha++;
            } else {
              racha = 0;
            }
            if (d.pts == 0) {
              racha_derrotas++;
            } else {
              racha_derrotas = 0;
            }
            if (d.pts == 1) {
              racha_empates++;
            } else {
              racha_empates = 0;
            }
            if (d.pts < puntos_por_partido) {
              racha_sin_victorias++;
            } else {
              racha_sin_victorias = 0;
            }
            if (d.pts > 0) {
              racha_sin_derrotas++;
            } else {
              racha_sin_derrotas = 0;
            }
            if (d.pts != 1) {
              racha_sin_empates++;
            } else {
              racha_sin_empates = 0;
            }
            if (d.goles_en_contra == 0) {
              valla_invicta++;
            }
          }

          final_list1.push({
            name: d.name,
            vs: d.vs,
            l_or_v: d.l_or_v,
            year: d.dia,
            dia: d.dia_large,
            semana: d.semana,
            fecha: d.fecha,
            fecha2: d.fecha2,
            fecha4: d.fecha4,
            value: pts,
            lastValue: pts - d.pts,
            pts_fecha: d.pts,
            goles: goles,
            goles_en_contra: goles_en_contra,
            diferencia_de_goles: goles - goles_en_contra,
            goles_fecha: d.vs != 'none' ? d.goles : '',
            goles_en_contra_fecha: d.vs != 'none' ? d.goles_en_contra : '',
            penales_fecha: d.vs != 'none' ? d.penales : '',
            penales_en_contra_fecha: d.vs != 'none' ? d.penales_en_contra : '',
            vs_text_dia: d.vs != 'none' ? 'vs' : '',
            guion_text_dia: d.vs != 'none' ? '-' : '',
            partidos_jugados: partidos_jugados,
            partidos_ganados: partidos_ganados,
            partidos_empatados: partidos_empatados,
            partidos_perdidos: partidos_perdidos,
            value1: pts1,
            partidos_jugados1: partidos_jugados1,
            partidos_ganados1: partidos_ganados1,
            partidos_empatados1: partidos_empatados1,
            partidos_perdidos1: partidos_perdidos1,
            goles1: goles1,
            goles_en_contra1: goles_en_contra1,
            diferencia_de_goles1: goles1 - goles_en_contra1,
            racha: racha,
            racha_derrotas: racha_derrotas,
            racha_empates: racha_empates,
            racha_sin_victorias: racha_sin_victorias,
            racha_sin_derrotas: racha_sin_derrotas,
            racha_sin_empates: racha_sin_empates,
            goleadas: goleadas,
            goleadas_en_contra: goleadas_en_contra,
            valla_invicta: valla_invicta,
            simulado: d.simulado,
            fairPlay: fairPlay,
          });
        } else {
          let may_deducted = deducted.filter((e) => e.name == d.name && e.dia == d.dia)[0];
          pts_deducted = 0;
          if (may_deducted) {
            pts_deducted = may_deducted.pts_deducted;
            pts = pts - pts_deducted;
          }

          if (d.goles == 99) {
            pts = pts - 1;
            goles = goles - 99;
            goles_en_contra = goles_en_contra - 99;
            racha_empates = racha_empates - 1;
            racha_sin_victorias = racha_sin_victorias - 1;
            racha_sin_derrotas = racha_sin_derrotas - 1;
            racha_sin_empates = racha_sin_empates - 1;
            empate_casa = empate_casa - 1;
            partidos_jugados = partidos_jugados - 1;
            partidos_empatados = partidos_empatados - 1;
          }

          pts_away = d.l_or_v == 'V' && d.goles !== 99 ? pts_away + d.goles : pts_away + 0;
          pts = pts + d.pts;
          goles = goles + d.goles;
          goles_en_contra = goles_en_contra + d.goles_en_contra;
          d.goles - d.goles_en_contra >= 3 ? goleadas++ : '';
          d.goles_en_contra - d.goles >= 3 ? goleadas_en_contra++ : '';
          d.vs != 'none' ? partidos_jugados++ : '';
          d.pts == puntos_por_partido ? partidos_ganados++ : d.pts == 1 ? partidos_empatados++ : d.vs != 'none' ? partidos_perdidos++ : '';
          fairPlay -= (d.amarillas || 0) * 1 + (d.rojas_indirectas || 0) * 3 + (d.rojas_directas || 0) * 4 + (d.amarilla_mas_roja || 0) * 5;

          if (d.vs != 'none') {
            if (d.pts == puntos_por_partido) {
              racha++;
            } else {
              racha = 0;
            }
            if (d.pts == 0) {
              racha_derrotas++;
            } else {
              racha_derrotas = 0;
            }
            if (d.pts == 1) {
              racha_empates++;
            } else {
              racha_empates = 0;
            }
            if (d.pts < puntos_por_partido) {
              racha_sin_victorias++;
            } else {
              racha_sin_victorias = 0;
            }
            if (d.pts > 0) {
              racha_sin_derrotas++;
            } else {
              racha_sin_derrotas = 0;
            }
            if (d.pts != 1) {
              racha_sin_empates++;
            } else {
              racha_sin_empates = 0;
            }
            if (d.goles_en_contra == 0) {
              valla_invicta++;
            }
            if (d.l_or_v == 'L') {
              partido_casa++;
            }
            if (d.pts == puntos_por_partido && d.l_or_v == 'L') {
              victoria_casa++;
            }
            if (d.pts == 1 && d.l_or_v == 'L') {
              empate_casa++;
            }
            if (d.pts == 0 && d.l_or_v == 'L') {
              derrota_casa++;
            }
          }

          final_list1.push({
            name: d.name,
            vs: d.vs,
            l_or_v: d.l_or_v,
            year: d.dia,
            dia_large: d.dia_large,
            semana: d.semana,
            fecha: d.fecha,
            fecha2: d.fecha2,
            fecha4: d.fecha4,
            value: pts,
            value_away: pts_away,
            lastValue: pts - d.pts,
            pts_fecha: d.pts,
            pts_deducted: pts_deducted,
            goles: goles,
            goles_en_contra: goles_en_contra,
            diferencia_de_goles: goles - goles_en_contra,
            goles_fecha: d.vs != 'none' ? d.goles : '',
            goles_en_contra_fecha: d.vs != 'none' ? d.goles_en_contra : '',
            penales_fecha: d.vs != 'none' ? d.penales : '',
            penales_en_contra_fecha: d.vs != 'none' ? d.penales_en_contra : '',
            vs_text_dia: d.vs != 'none' ? 'vs' : '',
            guion_text_dia: d.vs != 'none' ? '-' : '',
            partidos_jugados: partidos_jugados,
            partidos_ganados: partidos_ganados,
            partidos_empatados: partidos_empatados,
            partidos_perdidos: partidos_perdidos,
            value1: pts1,
            partidos_jugados1: partidos_jugados1,
            partidos_ganados1: partidos_ganados1,
            partidos_empatados1: partidos_empatados1,
            partidos_perdidos1: partidos_perdidos1,
            goles1: goles1,
            goles_en_contra1: goles_en_contra1,
            diferencia_de_goles1: goles1 - goles_en_contra1,
            racha: racha,
            racha_derrotas: racha_derrotas,
            racha_empates: racha_empates,
            racha_sin_victorias: racha_sin_victorias,
            racha_sin_derrotas: racha_sin_derrotas,
            racha_sin_empates: racha_sin_empates,
            goleadas: goleadas,
            goleadas_en_contra: goleadas_en_contra,
            valla_invicta: valla_invicta,
            partido_casa: partido_casa,
            victoria_casa: victoria_casa,
            empate_casa: empate_casa,
            derrota_casa: derrota_casa,
            simulado: d.simulado,
            fairPlay: fairPlay,
          });
        }
      });

      final_list1.push({
        name: club,
        vs: 'none',
        year: [...dias][[...dias].length - 1].split('-')[0] + '-12-31',
        final: true,
        fecha: '',
        semana: semanas.size + 1,
        value: final_list1[final_list1.length - 1].value,
        value_away: final_list1[final_list1.length - 1].value_away,
        lastValue: 0,
        pts_fecha: 0,
        pts_deducted: 0,
        goles: final_list1[final_list1.length - 1].goles,
        goles_en_contra: final_list1[final_list1.length - 1].goles_en_contra,
        diferencia_de_goles: final_list1[final_list1.length - 1].diferencia_de_goles,
        goles_fecha: '',
        goles_en_contra_fecha: '',
        penales_fecha: '',
        penales_en_contra_fecha: '',
        vs_text_dia: '',
        guion_text_dia: '',
        partidos_jugados: final_list1[final_list1.length - 1].partidos_jugados,
        partidos_ganados: final_list1[final_list1.length - 1].partidos_ganados,
        partidos_empatados: final_list1[final_list1.length - 1].partidos_empatados,
        partidos_perdidos: final_list1[final_list1.length - 1].partidos_perdidos,
        value1: final_list1[final_list1.length - 1].value1,
        partidos_jugados1: final_list1[final_list1.length - 1].partidos_jugados1,
        partidos_ganados1: final_list1[final_list1.length - 1].partidos_ganados1,
        partidos_empatados1: final_list1[final_list1.length - 1].partidos_empatados1,
        partidos_perdidos1: final_list1[final_list1.length - 1].partidos_perdidos1,
        goles1: final_list1[final_list1.length - 1].goles1,
        goles_en_contra1: final_list1[final_list1.length - 1].goles_en_contra1,
        diferencia_de_goles1: final_list1[final_list1.length - 1].diferencia_de_goles1,
        goleadas: final_list1[final_list1.length - 1].goleadas,
        goleadas_en_contra: final_list1[final_list1.length - 1].goleadas_en_contra,
        simulado: final_list1[final_list1.length - 1].simulado,
        fairPlay: final_list1[final_list1.length - 1].fairPlay,
      });
    });

    final_list1.push({
      name: 'hola',
      vs: 'chau',
      year: [...dias][0].split('-')[0] + '-01-01',
      fecha: '',
      semana: 0,
      value: 0,
      lastValue: 0,
      pts_fecha: 0,
      goles: 0,
      goles_en_contra: 0,
      diferencia_de_goles: 0,
      goles_fecha: '',
      goles_en_contra_fecha: '',
      penales_fecha: '',
      penales_en_contra_fecha: '',
      vs_text_dia: '',
      guion_text_dia: '',
      partidos_jugados: 0,
      partidos_ganados: 0,
      partidos_empatados: 0,
      partidos_perdidos: 0,
      value1: 0,
      partidos_jugados1: 0,
      partidos_ganados1: 0,
      partidos_empatados1: 0,
      partidos_perdidos1: 0,
      goles1: 0,
      goles_en_contra1: 0,
      diferencia_de_goles1: 0,
      racha: 0,
      racha_derrotas: 0,
      racha_empates: 0,
      racha_sin_victorias: 0,
      racha_sin_derrotas: 0,
      racha_sin_empates: 0,
      simulado: false,
      fairPlay: 0,
    });

    const filtrado = final_list1.filter((e) => e.vs != 'none');

    filtrado.forEach((d, i) => {
      const anterior = filtrado[i - 1];
      const siguiente = filtrado[i + 1];

      if (anterior == undefined || siguiente == undefined) return;

      const calcularRacha = (campo) => {
        if (siguiente.name != d.name) return d[campo];
        if (siguiente[campo] < d[campo]) return d[campo];
        if (siguiente.goles_fecha == 99) return d[campo];
        return 0;
      };

      const calcularRachaSin = (campo) => {
        if (anterior.name != d.name) return 0;
        if (d[campo] < anterior[campo]) return anterior[campo];
        return 0;
      };

      Object.assign(d, {
        racha1: calcularRacha('racha'),
        racha_derrotas1: calcularRacha('racha_derrotas'),
        racha_empates1: calcularRacha('racha_empates'),
        racha_sin_victorias1: calcularRachaSin('racha_sin_victorias'),
        racha_sin_derrotas1: calcularRachaSin('racha_sin_derrotas'),
        racha_sin_empates1: calcularRachaSin('racha_sin_empates'),
      });
    });

    final_list1 = final_list1.filter((d) => d.name != 'hola');

    if (simular) {
      final_list1 = final_list1.map((item) => ({
        ...item,
        probabilidad: (ordenados1[indexFor][2][item.name] ?? 0) * 100,
      }));
    }

    totalCasosSimulados.push(final_list1);
  }

  const datosBase = {
    partidos: data_cruda,
    competencia: nombre_torneo,
    clasificacionPorGrupo: clasificacion_por_grupo,
    repechaje,
  };

  window.__appData = { totalCasosSimulados, playoffs, nombre_torneo, puntos_por_partido, probabilidades, clasificados_por_competencia, simulacionesTotales: numero_de_simulaciones, datosBase };
  return window.__appData;
}
