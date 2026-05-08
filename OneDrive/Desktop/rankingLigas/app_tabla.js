
// ─── 2. CALCULAR LA TABLA ────────────────────────────────────────────────────

function calcularTabla(partidos) {
  const tabla = {};

  // Inicializar cada equipo
  partidos.forEach(p => {
    [p.local, p.visitante].forEach(equipo => {
      if (!tabla[equipo]) {
        tabla[equipo] = {
          nombre:   equipo,
          PJ: 0,  // partidos jugados
          PG: 0,  // ganados
          PE: 0,  // empatados
          PP: 0,  // perdidos
          GF: 0,  // goles a favor
          GC: 0,  // goles en contra
          DIF: 0, // diferencia de gol
          PTS: 0, // puntos
        };
      }
    });
  });

  // Procesar cada partido jugado (ignorar pendientes: goles === 99)
  partidos.forEach(p => {
    if (p.goles_local === 99 && p.goles_visitante === 99) return; // pendiente

    const local = tabla[p.local];
    const visit = tabla[p.visitante];

    // Partidos jugados
    local.PJ++;
    visit.PJ++;

    // Goles
    local.GF += p.goles_local;
    local.GC += p.goles_visitante;
    visit.GF += p.goles_visitante;
    visit.GC += p.goles_local;

    // Resultado
    if (p.goles_local > p.goles_visitante) {
      // Gana local
      local.PG++;  local.PTS += 3;
      visit.PP++;
    } else if (p.goles_local < p.goles_visitante) {
      // Gana visitante
      visit.PG++; visit.PTS += 3;
      local.PP++;
    } else {
      // Empate
      local.PE++; local.PTS++;
      visit.PE++; visit.PTS++;
    }
  });

  // Calcular diferencia de gol
  Object.values(tabla).forEach(e => {
    e.DIF = e.GF - e.GC;
  });

  // Ordenar: primero por puntos, luego por diferencia, luego por GF
  return Object.values(tabla).sort((a, b) =>
    b.PTS - a.PTS || b.DIF - a.DIF || b.GF - a.GF
  );
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
    const tabla  = calcularTabla(partidosSimulados);
    const clasif = tabla.slice(0, cantidadClassif);

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

// ─── 3. USO ──────────────────────────────────────────────────────────────────

Promise.all([d3.csv('mundial.csv')]).then(([data1]) => {
    data1.forEach(d => {
        d.goles_local = +d.goles_local
        d.goles_visitante = +d.goles_visitante
    })
    console.table(calcularTabla(data1))
    console.log(calcularProbabilidades(data1))
})