// ─── DATOS BASE (reutilizando las funciones anteriores) ──────────────────────


// ─── TABLA FINAL DADO UN SET DE PARTIDOS ────────────────────────────────────

function calcularTabla(partidos) {
  const tabla = {};

  partidos.forEach(p => {
    [p.local, p.visitante].forEach(equipo => {
      if (!tabla[equipo]) {
        tabla[equipo] = { nombre: equipo, PJ:0, PG:0, PE:0, PP:0, GF:0, GC:0, DIF:0, PTS:0 };
      }
    });
  });

  partidos.forEach(p => {
    if (p.goles_local === 99) return; // pendiente, no procesar

    const loc = tabla[p.local];
    const vis = tabla[p.visitante];

    loc.PJ++; vis.PJ++;
    loc.GF += p.goles_local;  loc.GC += p.goles_visitante;
    vis.GF += p.goles_visitante; vis.GC += p.goles_local;

    if (p.goles_local > p.goles_visitante) {
      loc.PG++; loc.PTS += 3; vis.PP++;
    } else if (p.goles_local < p.goles_visitante) {
      vis.PG++; vis.PTS += 3; loc.PP++;
    } else {
      loc.PE++; loc.PTS++; vis.PE++; vis.PTS++;
    }
  });

  Object.values(tabla).forEach(e => e.DIF = e.GF - e.GC);
  return tabla;
}

// ─── DESEMPATE POR ENFRENTAMIENTO DIRECTO ───────────────────────────────────

function puntosEnfrentamientoDirecto(equipoA, equipoB, partidos) {
  let ptsA = 0, ptsB = 0;

  partidos.forEach(p => {
    if (p.goles_local === 99) return;

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

// ─── ORDENAR TABLA CON TODOS LOS CRITERIOS ──────────────────────────────────

function ordenarTabla(tabla, partidos) {
  const equipos = Object.values(tabla);

  return equipos.sort((a, b) => {
    // 1. Puntos
    if (b.PTS !== a.PTS) return b.PTS - a.PTS;

    // 2. Diferencia de gol
    if (b.DIF !== a.DIF) return b.DIF - a.DIF;

    // 3. Goles a favor
    if (b.GF !== a.GF) return b.GF - a.GF;

    // 4. Enfrentamiento directo
    const { ptsA, ptsB } = puntosEnfrentamientoDirecto(a.nombre, b.nombre, partidos);
    if (ptsA !== ptsB) return ptsB - ptsA; // mayor pts directo primero

    // 5. Sorteo (aleatorio, pero fijo por escenario — ver nota abajo)
    return 0; // en simulación lo tratamos como 50/50 (ver más abajo)
  });
}

// ─── SIMULAR TODOS LOS ESCENARIOS ───────────────────────────────────────────

function simularProbabilidades(csvTexto) {
  const todosLosPartidos = (csvTexto);
  const pendientes = todosLosPartidos.filter(p => p.goles_local === 99);
  const jugados    = todosLosPartidos.filter(p => p.goles_local !== 99);

  // Resultados posibles para cada partido pendiente:
  // [goles_local, goles_visitante] representativos de G/E/P
  const resultadosPosibles = [
    { goles_local: 1, goles_visitante: 0 }, // gana local
    { goles_local: 0, goles_visitante: 0 }, // empate
    { goles_local: 0, goles_visitante: 1 }, // gana visitante
  ];

  // Generar todas las combinaciones (3^n escenarios)
  function generarCombinaciones(pendientes) {
    if (pendientes.length === 0) return [[]];
    const resto = generarCombinaciones(pendientes.slice(1));
    const combinaciones = [];
    resultadosPosibles.forEach(resultado => {
      resto.forEach(combo => {
        combinaciones.push([{ ...pendientes[0], ...resultado }, ...combo]);
      });
    });
    return combinaciones;
  }

  const combinaciones = generarCombinaciones(pendientes);
  const totalEscenarios = combinaciones.length; // 9

  // Contadores de clasificación y título
  const contadores = {};
  todosLosPartidos.forEach(p => {
    [p.local, p.visitante].forEach(eq => {
      if (!contadores[eq]) contadores[eq] = { clasifican: 0, primero: 0, sorteo: 0 };
    });
  });

  // Evaluar cada escenario
  combinaciones.forEach(combo => {
    const partidos = [...jugados, ...combo];
    const tabla = calcularTabla(partidos);
    const ordenada = ordenarTabla(tabla, partidos);

    // Detectar si hay empate total en posición 2 (necesita sorteo)
    const primero  = ordenada[0];
    const segundo  = ordenada[1];
    const tercero  = ordenada[2];

    // ¿El 2do y 3ro están completamente empatados? → sorteo
    const hayEmpateEnPuesto2 =
      segundo.PTS  === tercero.PTS  &&
      segundo.DIF  === tercero.DIF  &&
      segundo.GF   === tercero.GF   &&
      puntosEnfrentamientoDirecto(segundo.nombre, tercero.nombre, partidos).ptsA ===
      puntosEnfrentamientoDirecto(segundo.nombre, tercero.nombre, partidos).ptsB;

    if (hayEmpateEnPuesto2) {
      // El 1ro clasifica seguro; el 2do puesto es 50/50 entre 2do y 3ro
      contadores[primero.nombre].clasifican  += 1;
      contadores[primero.nombre].primero     += 1;
      contadores[segundo.nombre].clasifican  += 0.5; // sorteo
      contadores[segundo.nombre].sorteo      += 0.5;
      contadores[tercero.nombre].clasifican  += 0.5; // sorteo
      contadores[tercero.nombre].sorteo      += 0.5;
    } else {
      contadores[primero.nombre].clasifican += 1;
      contadores[primero.nombre].primero    += 1;
      contadores[segundo.nombre].clasifican += 1;
    }
  });

  // Calcular probabilidades
  const resultado = Object.entries(contadores).map(([equipo, c]) => ({
    equipo,
    prob_clasificar: ((c.clasifican / totalEscenarios) * 100).toFixed(1) + "%",
    prob_primero:    ((c.primero    / totalEscenarios) * 100).toFixed(1) + "%",
    prob_sorteo:     ((c.sorteo     / totalEscenarios) * 100).toFixed(1) + "%",
    escenarios_clasifican: c.clasifican,
    de_total: totalEscenarios,
  }));

  // Ordenar por probabilidad de clasificar
  resultado.sort((a, b) => b.escenarios_clasifican - a.escenarios_clasifican);

  return resultado;
}

function obtenerEquipos(partidos) {
  const set = new Set();
  partidos.forEach(p => {
    set.add(p.local);
    set.add(p.visitante);
  });
  return Array.from(set);
}

function simularResultado() {
  const rand = Math.random();

  if (rand < 0.40) return { goles_local: 1, goles_visitante: 0 }; // local
  if (rand < 0.65) return { goles_local: 0, goles_visitante: 0 }; // empate
  return              { goles_local: 0, goles_visitante: 1 }; // visitante
}

function calcularPosiciones(partidos) {
  const tabla = {};

  // Inicializar todos los equipos en cero
  const equipos = obtenerEquipos(partidos);
  equipos.forEach(equipo => {
    tabla[equipo] = { pts: 0, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0 };
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

  return tabla;
}

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
        ((clasificaciones[equipo] / simulaciones) * 100).toFixed(1)
      ),
    };
  });

  return resultado;
}

Promise.all([d3.csv('mundial.csv')]).then(([data1]) => {
    data1.forEach(d => {
        d.goles_local = +d.goles_local
        d.goles_visitante = +d.goles_visitante
    })
    console.table(simularProbabilidades(data1));
    console.table(calcularProbabilidades(data1));
    console.table(ordenarTabla(calcularTabla(data1), data1));
})