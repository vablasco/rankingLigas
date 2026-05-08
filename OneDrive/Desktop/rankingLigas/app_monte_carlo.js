// =============================================================
//  SISTEMA DE PROBABILIDADES DE CLASIFICACIÓN EN GRUPO
//  Fútbol — grupos de 4 equipos, 2 clasifican, 3 fechas
// =============================================================


// =============================================================
//  1. PARSEO DEL CSV
// =============================================================

/**
 * Recibe el texto crudo del CSV y devuelve un array de partidos.
 * Cada partido tiene la forma:
 *   {
 *     local:    string,
 *     visitante: string,
 *     goles_local:     number | null,
 *     goles_visitante: number | null,
 *     jugado:   boolean,
 *     fecha:    string,
 *     dia:      string,
 *     torneo:   string,
 *   }
 */

const csvTexto = `torneo,fecha,dia,local,visitante,goles_local,goles_visitante
Torneo WorldCup 2014,Fecha 1,Jun 15 2014,Argentina-F,bosnia_herzegovina-F,2,1
Torneo WorldCup 2014,Fecha 1,Jun 16 2014,iran-F,nigeria-F,0,0
Torneo WorldCup 2014,Fecha 2,Jun 21 2014,Argentina-F,iran-F,1,0
Torneo WorldCup 2014,Fecha 2,Jun 21 2014,nigeria-F,bosnia_herzegovina-F,1,0
Torneo WorldCup 2014,Fecha 3,Jun 25 2014,Argentina-F,nigeria-F,,9
Torneo WorldCup 2014,Fecha 3,Jun 25 2014,bosnia_herzegovina-F,iran-F,,`;

function parsearCSV(textoCSV) {
  const lineas = textoCSV.trim().split('\n');
  const encabezado = lineas[0].split(',');

  const partidos = [];

  for (let i = 1; i < lineas.length; i++) {
    const valores = lineas[i].split(',');

    // Mapear cada columna por nombre de encabezado
    const fila = {};
    encabezado.forEach((col, idx) => {
      fila[col.trim()] = valores[idx]?.trim() ?? '';
    });

    const golesLocalStr     = fila['goles_local'];
    const golesVisitanteStr = fila['goles_visitante'];

    // Si tiene goles cargados → partido jugado
    const jugado =
      golesLocalStr !== '' &&
      golesVisitanteStr !== '' &&
      !isNaN(Number(golesLocalStr)) &&
      !isNaN(Number(golesVisitanteStr));

    partidos.push({
      torneo:          fila['torneo']     || '',
      fecha:           fila['fecha']      || '',
      dia:             fila['dia']        || '',
      local:           fila['local']      || '',
      visitante:       fila['visitante']  || '',
      goles_local:     jugado ? Number(golesLocalStr)     : null,
      goles_visitante: jugado ? Number(golesVisitanteStr) : null,
      jugado,
    });
  }

  return partidos;
}

// =============================================================
//  2. TABLA DE POSICIONES
// =============================================================

/**
 * Calcula la tabla de posiciones a partir de un array de partidos.
 * Solo considera los partidos con jugado === true.
 *
 * Devuelve un objeto con esta forma:
 *   {
 *     'Argentina-F': { pts, pj, pg, pe, pp, gf, gc },
 *     'iran-F':      { ... },
 *     ...
 *   }
 */
function calcularPosiciones(partidos) {
  const tabla = {};

  // Inicializar todos los equipos en cero
  const equipos = obtenerEquipos(partidos);
  equipos.forEach(equipo => {
    tabla[equipo] = { pts: 0, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, diff: 0 };
  });

  // Procesar solo partidos jugados
  partidos
    .filter(p => p.jugado)
    .forEach(p => {
      const local     = tabla[p.local];
      const visitante = tabla[p.visitante];

      local.pj++;
      visitante.pj++;

      local.gf     += p.goles_local;
      local.gc     += p.goles_visitante;
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
    Object.values(tabla).forEach(e => e.diff = e.gf - e.gc);
  return tabla;
}

function puntosEnfrentamientoDirecto(equipoA, equipoB, partidos) {
  let ptsA = 0, ptsB = 0;
  console.log(partidos)

  partidos.forEach(p => {
    if (p.goles_local == null) return;

    const esAvsB = p.local === equipoA && p.visitante === equipoB;
    const esBvsA = p.local === equipoB && p.visitante === equipoA;

    if (!esAvsB && !esBvsA) return;

    if (p.goles_local > p.goles_visitante) {
      if (esAvsB) ptsA += 3; else ptsB += 3;
    } else if (p.goles_local < p.goles_visitante) {
      if (esAvsB) ptsB += 3; else ptsA += 3;
    } else {
      ptsA++; ptsB++;
    }
  });

  return { ptsA, ptsB };
}


// =============================================================
//  3. ORDENAR LA TABLA
// =============================================================

/**
 * Devuelve los nombres de los equipos ordenados por:
 *   1. Puntos (mayor primero)
 *   2. Diferencia de goles (mayor primero)
 *   3. Goles a favor (mayor primero)
 */
/* function ordenarTabla(tabla) {
  return Object.keys(tabla).sort((a, b) => {
    const sa = tabla[a];
    const sb = tabla[b];

    // 1. Puntos
    if (sb.pts !== sa.pts) return sb.pts - sa.pts;

    // 2. Diferencia de goles
    const difA = sa.gf - sa.gc;
    const difB = sb.gf - sb.gc;
    if (difB !== difA) return difB - difA;

    // 3. Goles a favor
    return sb.gf - sa.gf;
  });
} */

  function ordenarTabla(tabla) {
  return Object.keys(tabla).sort((a, b) => {
    const sa = tabla[a];
    const sb = tabla[b];

    // 1. Puntos
    if (sb.pts !== sa.pts) return sb.pts - sa.pts;

    // 2. Diferencia de gol
    if (sb.diff !== sa.diff) return sb.diff - sa.diff;

    // 3. Goles a favor
    if (sb.gf !== sa.gf) return sb.gf - sa.gf;

    // 4. Enfrentamiento directo
    /* const { ptsA, ptsB } = puntosEnfrentamientoDirecto(a.nombre, b.nombre, partidos);
    if (ptsA !== ptsB) return ptsB - ptsA; // mayor pts directo primero */

    // 5. Sorteo (aleatorio, pero fijo por escenario — ver nota abajo)
    return 0; // en simulación lo tratamos como 50/50 (ver más abajo)
  });
}

/* function ordenarTabla(tabla, partidos) {
  const equipos = Object.values(tabla);

  return equipos.sort((a, b) => {
    // 1. Puntos
    if (b.pts !== a.pts) return b.pts - a.pts;

    // 2. Diferencia de gol
    if (b.diff !== a.diff) return b.diff - a.diff;

    // 3. Goles a favor
    if (b.gf !== a.gf) return b.gf - a.gf;

    // 4. Enfrentamiento directo
    const { ptsA, ptsB } = puntosEnfrentamientoDirecto(a.nombre, b.nombre, partidos);
    if (ptsA !== ptsB) return ptsB - ptsA; // mayor pts directo primero

    // 5. Sorteo (aleatorio, pero fijo por escenario — ver nota abajo)
    return 0; // en simulación lo tratamos como 50/50 (ver más abajo)
  });
} */


// =============================================================
//  4. EXTRACCIÓN DE EQUIPOS
// =============================================================

/**
 * Devuelve un array con los nombres únicos de todos los equipos
 * que aparecen en los partidos.
 */
function obtenerEquipos(partidos) {
  const set = new Set();
  partidos.forEach(p => {
    set.add(p.local);
    set.add(p.visitante);
  });
  return Array.from(set);
}


// =============================================================
//  5. SIMULACIÓN DE UN RESULTADO ALEATORIO
// =============================================================

/**
 * Simula el resultado de un partido pendiente.
 * Modelo estadístico simple:
 *   - 40% → gana el local   (1-0)
 *   - 25% → empate          (0-0)
 *   - 35% → gana el visitante (0-1)
 *
 * Devuelve { goles_local, goles_visitante }
 */
function simularResultado() {
  const rand = Math.random();

  let gana_local = 0.33;
  let empate = 0.66;
  let gana_visitante = 1-(gana_local+empate);

  if (rand < gana_local) return { goles_local: 1, goles_visitante: 0 }; // local
  if (rand < gana_local+empate) return { goles_local: 0, goles_visitante: 0 }; // empate
  return              { goles_local: 0, goles_visitante: 1 }; // visitante
}


// =============================================================
//  6. MONTE CARLO — PROBABILIDADES DE CLASIFICACIÓN
// =============================================================

/**
 * Ejecuta N simulaciones de los partidos pendientes y calcula
 * la probabilidad de clasificar de cada equipo.
 *
 * Parámetros:
 *   partidos        — array completo (jugados + pendientes)
 *   cantidadClassif — cuántos clasifican por grupo (default: 2)
 *   simulaciones    — cantidad de simulaciones (default: 50.000)
 *
 * Devuelve un objeto con la forma:
 *   {
 *     'Argentina-F': { probabilidad: 98.4, clasificaciones: 49200 },
 *     'iran-F':      { probabilidad: 12.1, clasificaciones: 6050  },
 *     ...
 *   }
 */
function calcularProbabilidades(
  partidos,
  cantidadClassif = 2,
  simulaciones = 50_000
) {
  const equipos = obtenerEquipos(partidos);
  const pendientes = partidos.filter(p => !p.jugado);

  // Contador de veces que clasificó cada equipo
  const clasificaciones = {};
  equipos.forEach(e => clasificaciones[e] = 0);

  for (let sim = 0; sim < simulaciones; sim++) {

    // Copiar partidos y completar los pendientes con resultado aleatorio
    const partidosSimulados = partidos.map(p => {
      if (p.jugado) return p;

      const resultado = simularResultado();
      return {
        ...p,
        ...resultado,
        jugado: true,
      };
    });

    // Calcular posiciones con este escenario y registrar quiénes clasifican
    const tabla  = calcularPosiciones(partidosSimulados);
    const orden  = ordenarTabla(tabla);
    const clasif = orden.slice(0, cantidadClassif);

    clasif.forEach(equipo => clasificaciones[equipo]++);
  }

  // Convertir conteos a porcentajes
  const resultado = {};
  equipos.forEach(equipo => {
    resultado[equipo] = {
      clasificaciones: clasificaciones[equipo],
      probabilidad: Number(
        ((clasificaciones[equipo] / simulaciones) * 100)
      ),
    };
  });

  return resultado;
}


// =============================================================
//  7. ESCENARIOS EXACTOS (opcional)
// =============================================================

/**
 * Dado un array de resultados concretos para los partidos pendientes,
 * calcula quiénes clasificarían en ese escenario exacto.
 *
 * resultadosPendientes es un array paralelo a los partidos pendientes:
 *   [
 *     { goles_local: 1, goles_visitante: 0 },
 *     { goles_local: 0, goles_visitante: 0 },
 *   ]
 *
 * Devuelve un array con los equipos clasificados en orden.
 */
function calcularEscenario(partidos, resultadosPendientes, cantidadClassif = 2) {
  let idxPendiente = 0;

  const partidosCompletos = partidos.map(p => {
    if (p.jugado) return p;

    const resultado = resultadosPendientes[idxPendiente];
    idxPendiente++;

    return {
      ...p,
      ...resultado,
      jugado: true,
    };
  });

  const tabla = calcularPosiciones(partidosCompletos);
  const orden = ordenarTabla(tabla);
  return orden.slice(0, cantidadClassif);
}


// =============================================================
//  8. PUNTO DE ENTRADA — USO COMPLETO
// =============================================================

/**
 * Función principal: recibe el texto del CSV y devuelve
 * tabla de posiciones + probabilidades de clasificación.
 *
 * Ejemplo de uso:
 *
 *   const textoCSV = await fetch('mundial.csv').then(r => r.text());
 *   const resultado = analizarGrupo(textoCSV);
 *
 *   console.log(resultado.posiciones);
 *   console.log(resultado.probabilidades);
 */
function analizarGrupo(textoCSV, cantidadClassif = 2, simulaciones = 50_000) {
  const partidos     = (textoCSV);
  const tablaActual  = calcularPosiciones(partidos);
  const ordenActual  = ordenarTabla(tablaActual);
  const probabilidades = calcularProbabilidades(partidos, cantidadClassif, simulaciones);

  // Armar tabla ordenada con probabilidad incluida
  const posiciones = ordenActual.map((equipo, idx) => ({
    posicion:      idx + 1,
    equipo,
    ...tablaActual[equipo],
    diferencia:    tablaActual[equipo].gf - tablaActual[equipo].gc,
    probabilidad:  probabilidades[equipo].probabilidad,
  }));

  return {
    partidos,
    posiciones,
    probabilidades,
  };
}

Promise.all([d3.csv('data2.csv')]).then(([data1]) => {
    data1.forEach(d => {
        /* d.jugado = d.goles_local !== '' && d.goles_visitante !== '' &&
      !isNaN(Number(d.goles_local)) &&
      !isNaN(Number(d.goles_visitante)); */
      d.jugado = d.goles_local !== '99' && d.goles_visitante !== '99'
      d.goles_local =     d.jugado ? Number(d.goles_local)     : null
      d.goles_visitante = d.jugado ? Number(d.goles_visitante) : null
    })
    /* console.table(calcularPosiciones(parsearCSV(csvTexto))) */
    console.table((calcularPosiciones(data1)))
    /* console.table(calcularProbabilidades(parsearCSV(csvTexto))) */
    console.table(calcularProbabilidades(data1, 1, 100000));
    console.log(calcularEscenario(data1, data1.filter(d => !d.jugado), 1))/* 
    console.log(puntosEnfrentamientoDirecto('River Plate', 'Boca Juniors', data1)) */
    /* console.log(parsearCSV(csvTexto))
    console.log(data1) */
    console.log(data1)
})


// =============================================================
//  EXPORTAR (para uso en módulos Node.js o bundlers)
// =============================================================

// Descomenta si usás módulos ES o CommonJS:
//
// export { analizarGrupo, parsearCSV, calcularPosiciones, ordenarTabla,
//          calcularProbabilidades, calcularEscenario, simularResultado };
//
// module.exports = { analizarGrupo, parsearCSV, calcularPosiciones,
//                    ordenarTabla, calcularProbabilidades, calcularEscenario };


// =============================================================
//  EJEMPLO DE USO EN EL BROWSER (con fetch)
// =============================================================
//
//  async function main() {
//    const csv = await fetch('mundial.csv').then(r => r.text());
//    const { posiciones, probabilidades } = analizarGrupo(csv);
//
//    console.table(posiciones);
//    console.log(probabilidades);
//  }
//
//  main();