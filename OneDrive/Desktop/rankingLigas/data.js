export async function procesarDatos() {
  let data1 = await d3.csv('./torneos/sudamericana2026.csv');

  /* let torneos = [...new Set(data1.map((d) => d.torneo))]
  data1 = data1.filter(d => d.torneo == 'Torneo Apertura 2008') */

  let nombre_torneo = data1[0].torneo.replace('Torneo ', '');
  let puntos_por_partido = 3;
  let year_torneo = parseInt(data1[0].torneo.split(' ').slice(-1));
  year_torneo < 1996 ? (puntos_por_partido = 2) : '';
  data1[0].torneo == 'Torneo Apertura 1995' ? (puntos_por_partido = 3) : '';

  /* let verEquipo = 'River Plate'
  let grupoDeVerEquipo = data1.filter(d => d.local.split('-')[0] == verEquipo || d.visitante.split('-')[0] == verEquipo)[0].local.split('-')[1] */

  /* console.log(structuredClone(data1));
  data1 = data1.filter((d) => d.local.split('-')[1] == grupoDeVerEquipo || d.visitante.split('-')[1] == grupoDeVerEquipo);
  data1.forEach((d) => {
    d.local = d.local.split('-')[0];
    d.visitante = d.visitante.split('-')[0];
  });
  console.log(structuredClone(data1)); */

  let competencia = nombre_torneo.split(' ')[0];

  /* console.log(nombre_torneo)

  function clasificados_por_competencia1 () {
    if (nombre_torneo.toLowerCase().includes('libertadores')) return 2 
    return 1
  }

  console.log(clasificados_por_competencia1()) */

  const clasificados_por_competencia = {
    Campeonato: 1,
    Apertura: 8,
    WorldCup: 2,
    ClubWorldCup: 2,
    ELIMINATORIAS: 7,
    Libertadores: 2,
    Sudamericana: 2,
    argentina: 8,
    mundial: 2,
  };

  let clasificacion_por_grupo = clasificados_por_competencia[competencia];

  let formatDateLarge = d3.utcFormat('%b %d');
  let formatDate = d3.utcFormat('%Y-%m-%d');

  /* data1.forEach(d => {
    if (d.fecha == 'Fecha 3') {
      d.goles_local = '99';
      d.goles_visitante = '99';
    }
  }) */


  /*   function detectarGrupos(partidos) {

  // --- Union-Find ---
  // Cada equipo empieza siendo su propio representante
  const padre = {};

  function encontrar(equipo) {
    if (padre[equipo] === undefined) padre[equipo] = equipo;
    if (padre[equipo] !== equipo) {
      // Compresión de camino: aplanar el árbol al buscar
      padre[equipo] = encontrar(padre[equipo]);
    }
    return padre[equipo];
  }

  function unir(equipoA, equipoB) {
    const raizA = encontrar(equipoA);
    const raizB = encontrar(equipoB);
    if (raizA !== raizB) {
      // El primero en aparecer en el CSV manda como raíz
      padre[raizB] = raizA;
    }
  }

  // Unir todos los pares que se enfrentaron
  partidos.forEach(p => unir(p.local, p.visitante));

  // --- Agrupar equipos por su raíz ---
  const equiposPorRaiz = {};
  Object.keys(padre).forEach(equipo => {
    const raiz = encontrar(equipo);
    if (!equiposPorRaiz[raiz]) equiposPorRaiz[raiz] = [];
    equiposPorRaiz[raiz].push(equipo);
  });

  // --- Asignar letra de grupo (A, B, C...) ---
  // Ordenar las raíces según el orden de primera aparición en el CSV
  const ordenDeAparicion = [];
  partidos.forEach(p => {
    const raizLocal     = encontrar(p.local);
    const raizVisitante = encontrar(p.visitante);
    if (!ordenDeAparicion.includes(raizLocal))     ordenDeAparicion.push(raizLocal);
    if (!ordenDeAparicion.includes(raizVisitante)) ordenDeAparicion.push(raizVisitante);
  });

  const letraDeGrupo = {};
  ordenDeAparicion.forEach((raiz, idx) => {
    // A = 65 en ASCII, B = 66, etc.
    letraDeGrupo[raiz] = String.fromCharCode(65 + idx);
  });

  // --- Construir el Map equipo → letra ---
  const grupoDeEquipo = new Map();
  Object.keys(padre).forEach(equipo => {
    const raiz  = encontrar(equipo);
    const letra = letraDeGrupo[raiz];
    grupoDeEquipo.set(equipo, letra);
  });

  return grupoDeEquipo;
}

function agregarSufijoDeGrupo(partidos, grupoDeEquipo) {
  return partidos.map(p => ({
    ...p,
    local:     `${p.local}-${grupoDeEquipo.get(p.local)}`,
    visitante: `${p.visitante}-${grupoDeEquipo.get(p.visitante)}`,
  }));
} */
  /* 
data1 = agregarSufijoDeGrupo(data1, detectarGrupos(data1)) */

  let data_cruda = data1.map((d) => ({ ...d }));
  let casos1 = [];

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
          local.pts += 3;
          local.pg++;
          visitante.pp++;
        } else if (p.goles_local < p.goles_visitante) {
          // Ganó el visitante
          visitante.pts += 3;
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
        tabla[p.local].pts += 3;
        tabla[p.local].pg++;
        tabla[p.visitante].pp++;
      } else if (gl === gv) {
        tabla[p.local].pts += 1;
        tabla[p.visitante].pts += 1;
        tabla[p.local].pe++;
        tabla[p.visitante].pe++;
      } else {
        tabla[p.visitante].pts += 3;
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
          stats[p.local].pts += 3;
        } else if (gl === gv) {
          stats[p.local].pts += 1;
          stats[p.visitante].pts += 1;
        } else {
          stats[p.visitante].pts += 3;
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

  function calcularYOrdenarTablaConDatos(partidos) {
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
        tabla[p.local].pts += 3;
        tabla[p.local].pg++;
        tabla[p.visitante].pp++;
      } else if (gl === gv) {
        tabla[p.local].pts += 1;
        tabla[p.visitante].pts += 1;
        tabla[p.local].pe++;
        tabla[p.visitante].pe++;
      } else {
        tabla[p.visitante].pts += 3;
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
          stats[p.local].pts += 3;
        } else if (gl === gv) {
          stats[p.local].pts += 1;
          stats[p.visitante].pts += 1;
        } else {
          stats[p.visitante].pts += 3;
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
    /* return ordenados.flatMap((equipo) => [equipo, tabla[equipo].pts]); */
    return ordenados.map((equipo, i) => ({ pos: i + 1, equipo, pts: tabla[equipo].pts }));
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
    mundial: { local: 1.35, visitante: 1.35 },
    argentina: { local: 1.1, visitante: 0.8 },
    Campeonato: { local: 1.1, visitante: 0.8 },
    Apertura: { local: 1.1, visitante: 0.8 },
    WorldCup: { local: 1.35, visitante: 1.35 },
    ClubWorldCup: { local: 1.35, visitante: 1.35 },
    ELIMINATORIAS: { local: 1.4, visitante: 0.81 },
    Libertadores: { local: 1.4, visitante: 0.81 },
    Sudamericana: { local: 1.4, visitante: 0.81 },
    premierLeague: { local: 1.55, visitante: 1.15 },
    españa: { local: 1.55, visitante: 1.1 },
    bundesliga: { local: 1.65, visitante: 1.2 },
  };

  /* function calcularLambdas(data) {
  let sumLocal = 0, sumVisitante = 0, n = 0;

  for (const partido of data) {
    const gl = +partido.goles_local;
    const gv = +partido.goles_visitante;

    if (gl == 99 || gl === null || gl === undefined) continue;

    sumLocal     += gl;
    sumVisitante += gv;
    n++;
  }

  return {
    local:     parseFloat((sumLocal / n).toFixed(3)),
    visitante: parseFloat((sumVisitante / n).toFixed(3)),
    promedio:  parseFloat(((sumLocal + sumVisitante) / n).toFixed(3)),
    partidos:  n,
  };
} */

  // Uso:
  /* const lambdas = calcularLambdas(data1); */

  function generarResultado(liga = 'argentina', override = null) {
    const config = override ?? LAMBDAS[liga];
    return {
      goles_local: poisson(config.local),
      goles_visitante: poisson(config.visitante),
    };
  }

  /* function simular(liga = 'ligaArgentina', n = 50000) {
  const conteo = {};

  for (let i = 0; i < n; i++) {
    const { goles_local, goles_visitante } = generarResultado(liga);
    const key = `${goles_local}-${goles_visitante}`;
    conteo[key] = (conteo[key] ?? 0) + 1;
  }

  return Object.entries(conteo)
    .map(([resultado, veces]) => ({
      resultado,
      veces,
      porcentaje: ((veces / n) * 100).toFixed(2) + '%',
    }))
    .sort((a, b) => b.veces - a.veces);
}

// Uso:
const tabla = simular('mundial', 50000);
console.table(tabla); // top 15 */

  /* function simularGrupo(partidos, equipos, n = 100000) {
  const campeon = {};

  for (let i = 0; i < n; i++) {
    // puntos de cada equipo en esta simulación
    const puntos = Object.fromEntries(equipos.map(e => [e, 0]));

    for (const { local, visitante, liga } of partidos) {
      const { goles_local, goles_visitante } = generarResultado(liga);

      if (goles_local > goles_visitante)       puntos[local]    += 3;
      else if (goles_local < goles_visitante)  puntos[visitante] += 3;
      else { puntos[local] += 1; puntos[visitante] += 1; }
    }

    // el que más puntos tiene gana el grupo
    const ganador = Object.entries(puntos).sort((a, b) => b[1] - a[1])[0][0];
    campeon[ganador] = (campeon[ganador] ?? 0) + 1;
  }

  return Object.entries(campeon)
    .map(([equipo, veces]) => ({
      equipo,
      chances: ((veces / n) * 100).toFixed(2) + '%',
    }))
    .sort((a, b) => parseFloat(b.chances) - parseFloat(a.chances));
}

// Ejemplo: grupo con 3 partidos pendientes
const partidos1 = [
  { local: 'River',   visitante: 'Boca',      liga: 'ligaArgentina' },
  { local: 'Racing',  visitante: 'River',     liga: 'ligaArgentina' },
  { local: 'Boca',    visitante: 'Racing',    liga: 'ligaArgentina' },
];

const equipos = ['River', 'Boca', 'Racing'];

const resultado = simularGrupo(partidos1, equipos, 1);
console.table(resultado); */
  // Con override para un partido específico (River vs equipo chico)
  /* generarResultado('ligaArgentina', { local: 1.6, visitante: 0.6 }) */

  // Uso:
  /* console.log(generarResultado('mundial'))        // { goles_local: 1, goles_visitante: 2 }
console.log(generarResultado('ligaArgentina'))  // { goles_local: 0, goles_visitante: 0 }
console.log(generarResultado('bundesliga'))  */

  let casos = [];

  function calcularProbabilidades(partidos, cantidadClassif = 2, simulaciones = 50_000) {
    const equipos = obtenerEquipos(partidos);
    const pendientes = partidos.filter((p) => !p.jugado);

    // Contador de veces que clasificó cada equipo
    const clasificaciones = {};
    equipos.forEach((e) => (clasificaciones[e] = 0));

    for (let sim = 0; sim < simulaciones; sim++) {
      // Copiar partidos y completar los pendientes con resultado aleatorio
      const partidosSimulados = partidos.map((p) => {
        if (p.jugado) return { ...p, simulados: false, id: sim };

        const resultado = generarResultado(competencia);
        return {
          ...p,
          ...resultado,
          jugado: true,
          simulados: true,
          id: sim,
        };
      });

      // Calcular posiciones con este escenario y registrar quiénes clasifican
      obtenerGrupos(data1).forEach((d) => {
        let grupo = partidosSimulados.filter(e => e.local.split('-')[1] == d)

        /* const tabla = calcularPosiciones(grupo); */
        const orden = calcularYOrdenarTabla(grupo);
        /* const orden = ordenarTabla(tabla); */
        const clasif = orden.slice(0, cantidadClassif);

        clasif.forEach((equipo) => clasificaciones[equipo]++);

        casos1.push([calcularYOrdenarTablaConDatos(grupo), grupo]);
        /* if (d == 'H') {
          casos1.push([calcularYOrdenarTablaConDatos(grupo), grupo]);
        } */
      });
    }
    
    const resultado = {};
    equipos.forEach((equipo) => {
      resultado[equipo] = {
        clasificaciones: clasificaciones[equipo],
        probabilidad: Number(/* d3.format(".3~g") */ ((clasificaciones[equipo] / simulaciones) * 100).toFixed(1)),
      };
    });
    
    return resultado;
  }
  console.log(structuredClone(casos1))

  /* console.log(clasificaciones['River Plate-H']); */

  /* casos.forEach(d => {
      console.log(calcularPosiciones(d), d)
      console.log(ordenarTabla1(calcularPosiciones(d)))
    })

    console.log(structuredClone(casos));
    const unique = [...new Map(casos.map(item => [JSON.stringify(item), item])).values()];
    console.log(structuredClone(unique)); */

  /* console.log(structuredClone(casos));

    function returnCasoMasCercano(d) {
      let masCercano = casos[0];
      let indiceCaso = 0;
      let i = 0;
      let ptsD = 99;
      let diffD = 99;
      let gfD = 99;
      let gf2D = 99;
      d.forEach(p => {
        let segundaPosicion = ordenarTabla(calcularPosiciones(p))[1];
        let adentro = calcularPosiciones(p)[segundaPosicion];
        let afuera = calcularPosiciones(p)['River-H'];
        if ((adentro.pts - afuera.pts) <= ptsD && (adentro.diff - afuera.diff) <= diffD && (afuera.gf) <= gfD && (adentro.gf) <= gf2D) {
          ptsD = adentro.pts - afuera.pts;
          diffD = adentro.diff - afuera.diff;
          gfD = afuera.gf;
          gf2D = adentro.gf;
          indiceCaso = i;
          console.log('encontro:', indiceCaso, ptsD, diffD, gfD, gf2D)
        }
        i++
      })
      masCercano = casos[indiceCaso];
      return masCercano
    }

    console.log(calcularYOrdenarTabla(casos[0]))
    console.log(ordenarTabla(calcularPosiciones(casos[0])))

    console.log(returnCasoMasCercano(casos))

    data1 = data1.filter(d => (d.local.split('-')[1] !== 'H'));
    console.log(structuredClone(data1));
    data1 = data1.concat(returnCasoMasCercano(casos));
    data1.forEach(d => {
      d.goles_local = d.goles_local.toString()
      d.goles_visitante = d.goles_visitante.toString()
    })
    console.log(structuredClone(data1)); */

  // --- SIMULAR PEOR CASO ---

  /* let grupo_filtrado = data1.filter(d => (d.local.split('-')[1] == 'H'));
console.log(grupo_filtrado)
data1 = data1.filter(d => (d.local.split('-')[1] !== 'H'));
console.log(structuredClone(data1));
let caso = returnCasoMasCercano(casos)
console.log(caso)
console.log(calcularYOrdenarTabla(caso))
data1 = data1.concat(caso);
data1.forEach(d => {
    d.goles_local = d.goles_local.toString()
    d.goles_visitante = d.goles_visitante.toString()
})
console.log(structuredClone(data1)); */

  /* function returnCaso(d) {
      let masCercano = sinDuplicados[0][1];
      let indiceCaso = 0;
      let i = 0;
      let pts = 0;
      d.forEach(p => {
        console.log(p)
        let rankGrupo = calcularYOrdenarTabla(p);
        arrays1.push(rankGrupo.slice(0, 2))
        let equipo = calcularPosiciones(p)['River Plate-H'];
        if (equipo.pts >= pts) {
          pts = equipo.pts;
          indiceCaso = i;
          console.log('encontro:', indiceCaso, pts)
        }
        i++
      })
      masCercano = casos[indiceCaso];
      return masCercano
    } */

  /* let caso = returnCaso(sinDuplicados)
console.log(caso) */

  /* function encontrarEscenario(data, criterios) {
  // criterios: { "River Plate-H": 16, "Carabobo-H": 9, ... }
  return data.find(([tabla]) => {
    // tabla es el array plano [nombre, pts, nombre, pts, ...]
    for (let i = 0; i < tabla.length; i += 2) {
      const equipo = tabla[i];
      const pts = tabla[i + 1];
      if (criterios[equipo] !== undefined && criterios[equipo] !== pts) {
        return false;
      }
    }
    return true;
  });
}

// Uso:
const resultado1 = encontrarEscenario(sinDuplicados, {
  "Carabobo-H": 99,
}); */

  /* const MAX = 99;

function encontrarEscenario(data, criterios) {
  // Primero resolvemos los MAX
  const criteriosResueltos = { ...criterios };

  for (const [equipo, pts] of Object.entries(criterios)) {
    if (pts === MAX) {
      let maximo = -Infinity;
      for (const escenario of data) {
        const tabla = escenario[0][0];
        for (let i = 0; i < tabla.length; i += 2) {
          if (tabla[i] === equipo && tabla[i + 1] > maximo) {
            maximo = tabla[i + 1];
          }
        }
      }
      criteriosResueltos[equipo] = maximo;
    }
  }

  // Ahora buscamos normalmente
  return data.find((escenario) => {
    const tabla = escenario[0][0];
    for (let i = 0; i < tabla.length; i += 2) {
      const equipo = tabla[i];
      const pts = tabla[i + 1];
      if (criteriosResueltos[equipo] !== undefined && criteriosResueltos[equipo] !== pts) {
        return false;
      }
    }
    return true;
  });
}

// Uso:
const resultado1 = encontrarEscenario(sinDuplicados, {
  "Carabobo-H": 99, // busca donde Carabobo tiene más puntos
}); */

  /* function mayorPuntaje(data, equipo) {
  let max = -Infinity;
  let resultado = null;

  for (const escenario of data) {
    const tabla = escenario[0]; // o escenario[0][0], depende de la estructura real
    for (let i = 0; i < tabla.length; i += 2) {
      if (tabla[i] === equipo && tabla[i + 1] > max) {
        max = tabla[i + 1];
        resultado = escenario;
      }
    }
  }

  return resultado;
}

// Uso:
const resultado1 = mayorPuntaje(sinDuplicados, "Carabobo-H"); */

  /* function encontrarEscenario(data, criterios) {
  return data.find((escenario) => {
    const tabla = escenario[0][0]; // el array plano de [nombre, pts, ...]
    for (let i = 0; i < tabla.length; i += 2) {
      const equipo = tabla[i];
      const pts = tabla[i + 1];
      if (criterios[equipo] !== undefined && criterios[equipo] !== pts) {
        return false;
      }
    }
    return true;
  });
}

// Uso:
const resultado1 = encontrarEscenario(sinDuplicados, {
  "River Plate-H": 16,
  "Carabobo-H": 9,
  "Bragantino-H": 6,
  "Blooming-H": 4
});

console.log(resultado1[1]) */

  // resultado[0] → la tabla, resultado[1] → los partidos

  /* data1 = data1.filter(d => (d.local.split('-')[1] !== 'H'));
let caso = resultado1[1]
console.log(caso)
data1 = data1.concat(caso);
data1.forEach(d => {
    d.goles_local = d.goles_local.toString()
    d.goles_visitante = d.goles_visitante.toString()
}) */


  // Convertir conteos a porcentajes

  let probabilidades = calcularProbabilidades(data_cruda /* .filter(d => d.local.split('-')[1]=='H') */, clasificacion_por_grupo, 100);
  /* console.table(probabilidades)

  function eliminarDuplicados(simulaciones) {
    const vistas = new Set();

    return simulaciones.filter((sim) => {
      const tabla = sim[0]; // tabla de posiciones

      const clave = tabla.map((t) => `${t.equipo}:${t.pts}`).join('|');

      if (vistas.has(clave)) return false;
      vistas.add(clave);
      return true;
    });
  }

  const sinDuplicados1 = eliminarDuplicados(casos1);

  const ordenados1 = [...sinDuplicados1].sort((a, b) => {
    const getPts = (sim, equipo) => sim[0].find((t) => t.equipo === equipo)?.pts ?? 0;

    const posRiverA = a[0].find((t) => t.equipo === verEquipo)?.pos;
    const posRiverB = b[0].find((t) => t.equipo === verEquipo)?.pos;

    if (posRiverA !== posRiverB) return posRiverA - posRiverB;

    const riverA = getPts(a, verEquipo);
    const riverB = getPts(b, verEquipo);

    if (riverA !== riverB) return riverB - riverA;

    const bajoA = a[0].find((t) => t.pos === posRiverA + 1)?.pts ?? 0;
    const bajoB = b[0].find((t) => t.pos === posRiverB + 1)?.pts ?? 0;

    const difA = riverA - bajoA;
    const difB = riverB - bajoB;

    return difB - difA; // ← mayor diferencia primero
  });

  console.log(casos1)
  console.log(sinDuplicados1)
  console.log(ordenados1)
 */
  let totalCasosSimulados = [];

  for (let indexFor = 0; indexFor < 1; indexFor++) {

    /* console.log(ordenados1[indexFor][1]); */
    
    /* data1 = ordenados1[indexFor][1];

    data1.forEach(d => {
    d.goles_local = d.goles_local.toString()
    d.goles_visitante = d.goles_visitante.toString()
    }) */

    /* let puntos_por_partido = 3;
    let year_torneo = parseInt(data1[0].torneo.split(' ').slice(-1));
    year_torneo < 1996 ? (puntos_por_partido = 2) : '';
    data1[0].torneo == 'Torneo Apertura 1995' ? (puntos_por_partido = 3) : ''; */
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

    let torneo = data1.filter((d) => d.visitante != 'fifa');

    let dias = new Set(torneo.map((d) => d.dia).sort((a, b) => a - b));
    dias = new Set([...dias].map((d) => formatDate(d)));

    let clubes = new Set([...new Set(torneo.map((d) => d.local)), ...new Set(torneo.map((d) => d.visitante))]);

    let fechas_torneo = new Set(torneo.filter((d) => d.fecha.split(' ')[1] != fecha_adicional && !d.fecha.includes('1/')).map((d) => d.fecha));
    console.log(fechas_torneo);

    let fechas_torneo2 = new Set(torneo.filter((d) => d.fecha.split(' ')[1] != fecha_adicional && !d.fecha.includes('1/')).map((d) => d.fecha));
    let fechas_def = torneo.filter((d) => d.fecha.split(' ')[1] == fecha_adicional);
    let fechas_playoff = torneo.filter((d) => d.fecha.includes('1/'));

    console.log(fechas_playoff);

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

    console.log(data2);

    let semanas = new Set(data2.map((d) => d.semana).sort((a, b) => a - b));

    console.log(dias);
    console.log(semanas);
    console.log(clubes);
    console.log(fechas_torneo);
    console.log(fechas_torneo2);

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
          simulado: d.simulados
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
          simulado: d.simulados
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
            simulado: d.simulado
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
            simulado: d.simulado
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
        simulado: final_list1[final_list1.length - 1].simulado
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
      simulado: false
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

    totalCasosSimulados.push(final_list1);
  };

  console.log(totalCasosSimulados);
  console.log(totalCasosSimulados[0]);

  window.__appData = { totalCasosSimulados, nombre_torneo, puntos_por_partido, probabilidades };
  return window.__appData;
}
