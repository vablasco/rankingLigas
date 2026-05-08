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

    // 5. Sorteo (aleatorio, pero fijo por escenario — ver nota abajo)
    return 0; // en simulación lo tratamos como 50/50 (ver más abajo)
  });
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

  let gana_local = 0.33;
  let empate = 0.66;
  let gana_visitante = 1-(gana_local+empate);

  if (rand < gana_local) return { goles_local: 1, goles_visitante: 0 }; // local
  if (rand < gana_local+empate) return { goles_local: 0, goles_visitante: 0 }; // empate
  return              { goles_local: 0, goles_visitante: 1 }; // visitante
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

Promise.all([d3.csv('data2.csv')]).then(([data1]) => {
    data1.forEach(d => {
      d.jugado = d.goles_local !== '99' && d.goles_visitante !== '99'
      d.goles_local =     d.jugado ? Number(d.goles_local)     : null
      d.goles_visitante = d.jugado ? Number(d.goles_visitante) : null
    })
    console.table(calcularPosiciones(data1))
    console.table(calcularProbabilidades(data1, 1, 1000));
    console.log(data1)
})

