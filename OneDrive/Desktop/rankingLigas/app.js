import { procesarDatos } from './data.js';
import { colores } from './colores.js';

const { totalCasosSimulados, playoffs, nombre_torneo, puntos_por_partido, probabilidades, clasificados_por_competencia } = window.__appData ?? (await procesarDatos());

const index = (window.__appIndex ?? 0) % totalCasosSimulados.length;
let index1 = 0;
let final_list1 = totalCasosSimulados[index];

let ress_ratio = '1:1';
let resulution = 1;

let width = 16 * 120;
let height = 9 * 120;

width = width * resulution;
height = height * resulution;

let margin = {
  top: height * 0.065,
  right: width * 0.05,
  bottom: height * 0,
  left: width * 0.05,
};

let background_color = '#e5e5e5';
let header_color = '#00001a';
let first_place_color = '#90EE90';
let last_place_color = '#dd2222';

let victoria_color = '#00802b';
let empate_color = '#cc9900';
let derrota_color = '#cc2900';
let grey_color = '#616161';
let black_color = '#202020';

let primer_puesto = '#76c476';
let segundo_puesto = '#94e694';
let tercer_puesto = '#e3ffb5';

let not_played_yet = 99;
let not_played_yet_x = 0.4;
let fechas_not_played = 1;

let localia = false;
let stats_on_top = false;
let datos_totales = false;
let repechaje = 0;
let simular_playoffs = true;
let neutral = true;
let efectividadYPromedioGoles = false;

let competencia = nombre_torneo;

if (nombre_torneo == 'Mundial 2026') {
  repechaje = 1;
}

/* const clasificados_por_competencia = {
  Campeonato: 1,
  Apertura: 8,
  WorldCup: 2,
  ClubWorldCup: 2,
  ELIMINATORIAS: 7,
  Libertadores: 2,
  Sudamericana: 2,
  argentina: 8,
  ['Mundial 2026']: 2,
  ['Mundial 2014']: 2,
}; */

let clasificacion_por_grupo = clasificados_por_competencia[competencia] + repechaje;

console.log(clasificacion_por_grupo);

d3.timeFormatDefaultLocale({
  decimal: ',',
  thousands: '.',
  grouping: [3],
  currency: ['€', ''],
  dateTime: '%a %b %e %X %Y',
  date: '%d/%m/%Y',
  time: '%H:%M:%S',
  periods: ['AM', 'PM'],
  days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  shortDays: ['Dom', 'Lun', 'Mar', 'Mi', 'Jue', 'Vie', 'Sab'],
  months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
});

let formatEfec = d3.format('.0f');

function parseScore(str) {
  const m = str.trim().match(/^(\d+)(?:\[(\d+)\])?$/);
  return {
    goles: parseInt(m[1]),
    penales: m[2] ? parseInt(m[2]) : null,
  };
}

function ordinal(n) {
  const s = ["th","st","nd","rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getColorByProbability(percent) {
  const hue = (percent / 100) * 120;
  return `hsl(${hue}, 85%, 45%)`;
}

const parseDate = (str) => new Date(str);

const halo1 = function (text, strokeWidth, color) {
  text
    .select(function () {
      return this.parentNode.insertBefore(this.cloneNode(true), this);
    })
    .styles({
      fill: 'white',
      stroke: 'white',
      'stroke-width': strokeWidth / 3.5,
      'stroke-linejoin': 'round',
      'stroke-linecap': 'round',
      opacity: 1,
    });
};

const COUNTRY_TEAMS = {
  ar: ['Barracas Central', 'Racing', 'Tigre', 'Riestra', 'San Lorenzo', 'River Plate', 'Boca Juniors'],
  br: ['Vasco Da Gama', 'Sao Paulo', 'Atletico Mineiro', 'Gremio', 'Botafogo', 'Santos', 'Bragantino', 'Cruzeiro'],
  cl: ['OHiggins', 'Audax Italiano', 'Palestino', 'Deportivo Recoleta', 'Universidad Catolica'],
  co: ['Millonarios', 'America De Cali'],
  bo: ['Independiente Petrolero', 'Blooming'],
  ec: ['Deportivo Cuenca', 'Macara', 'Barcelona'],
  pe: ['Alianza Atletico', 'Cienciano'],
  uy: ['Boston River', 'Montevideo City Torque', 'Juventud'],
  ve: ['Academia Puerto Cabello', 'Caracas', 'Carabobo'],
  py: ['Olimpia'],
  mx: ['México'],
  za: ['Sudáfrica'],
  cz: ['República Checa'],
  kr: ['Corea del Sur'],
};

const TEAM_COUNTRY = Object.fromEntries(Object.entries(COUNTRY_TEAMS).flatMap(([code, teams]) => teams.map((team) => [team, code])));

const getFlag = (raw) => {
  const name = raw.replace(/-[A-Z]$/, '');
  const code = TEAM_COUNTRY[name];
  return code ? `${code}.svg` : null;
};

const render = (data, fechas_playoff, nombre_torneo, puntos_por_partido, probabilidades) => {
  console.log(data, fechas_playoff);

  let grupos_1 = [...new Set(data.map((d) => d.name.split('-')[1]))].sort();
  let names_1 = [...new Set(data.map((d) => d.name))];

  let grupos = grupos_1.length;
  let top_n = names_1.length;
  let heightBars = /* (height - (margin.bottom + margin.top)) / (top_n + 2); */ 50;

  margin = {
    top: heightBars * 2,
    right: width * 0.05,
    bottom: height * 0,
    left: width * 0.05,
  };

  let playoffs = {
    32: 6,
    16: 5,
    8: 4,
    4: 3,
    2: 2,
    1: 1,
  };

  let playoffs_names = {
    32: '32avos',
    16: 'Dieciseisavos',
    8: 'Octavos',
    4: 'Cuartos',
    2: 'Semifinales',
    1: 'Final',
  };

  /* let playoffs_names = {
    32: '32avos',
    16: '16avos',
    8: 'Octavos',
    4: 'Cuartos',
    2: 'Semifinales',
    1: 'Final',
  }; */

  if (grupos == 1) {
    grupos = 0;
  }

  function probabilidad(name) {
    if (!Object.keys(probabilidades).includes(name)) {
      return [''];
    } else if (Object.keys(probabilidades).includes(name)) {
      return probabilidades[name];
    } else {
      return [''];
    }
  }

  console.log(fechas_playoff);

  let equipos_por_grupos = top_n / grupos;
  let width_playoffs = heightBars * 8;
  if (simular_playoffs) {
    width_playoffs = heightBars * 7;
  }
  let space_width_playoff = width_playoffs * 0.5;
  let space_height_playoff = heightBars * 0.5;
  let primera_ronda_playoff = fechas_playoff.filter((d) => d.fecha == 'Fecha 1/' + d3.max(fechas_playoff, (d) => +d.fecha.split('/')[1])).length;
  if (fechas_playoff.length == 0 && simular_playoffs) {
    primera_ronda_playoff = (clasificacion_por_grupo * grupos) / 2;
  }
  let rondas_playoff = playoffs[primera_ronda_playoff];
  let distancia_entre_grupos = 0.5;
  console.log(primera_ronda_playoff, fechas_playoff.filter((d) => d.fecha == 'Fecha 1/' + d3.max(fechas_playoff, (d) => +d.fecha.split('/')[1])).length);
  let names_playoffs_1 = [...new Set(fechas_playoff.map((d) => d.local || d.visitante))];

  let dates = [...new Set(data.map((d) => d.semana).sort((a, b) => a - b))];

  let margin_right = margin.right;

  fechas_not_played = d3.max(data, (d) => d.partidos_jugados + d.partidos_jugados1);
  console.log(structuredClone(fechas_not_played));
  let contFechas = 0
  for (let i = 1; i < dates.length; i++) {
    let filter = data.filter(d => d.semana == i)
    let filter1 = filter.find(d => d.goles_fecha != 99)
    if (filter1 != undefined) {
      contFechas = contFechas + 1
    }
    console.log(i, filter1)
    
  }
  console.log(contFechas)
  fechas_not_played=contFechas

  let fechas_no_jugadas = dates.length - 1 - fechas_not_played - 1;
  let weeks = heightBars * 2;
  let weeks_i = weeks * dates.length; /*  - ((heightBars) * (((dates.length-1)-fechas_not_played)-1)); */
  /* let weeks_i = weeks * (dates.length) - ((weeks*not_played_yet_x) * fechas_no_jugadas); */

  width = weeks * dates.length - weeks * not_played_yet_x * fechas_no_jugadas + heightBars * 9;
  height = top_n * heightBars + margin.top;

  height = grupos > 1 ? height + grupos * (heightBars / 2) : height;

  let margin_left = heightBars;

  if (grupos > 1 && names_playoffs_1.length != 0) {
    width = width + (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff);
  } else if (grupos > 1 && simular_playoffs) {
    width = width + (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff * 1.5);
  }

  console.log(fechas_no_jugadas, heightBars, weeks, weeks_i, fechas_not_played, dates.length - 1 - fechas_not_played - 1, not_played_yet_x, dates.length, margin_right);

  console.log(`[${width}, ${height}]`);

  d3.select('body svg').remove();

  const svg = d3.select('body').append('svg').attrs({
    width: width,
    height: height,
  });

  svg.append('rect').attrs({
    x: 0,
    y: 0,
    width: width,
    height: height,
    fill: background_color,
  });

  svg.append('rect').attrs({
    x: 0,
    y: 0,
    width: width,
    height: margin.top,
    fill: header_color,
  });

  svg
    .append('text')
    .attrs({
      x: width * 0.5,
      y: margin.top * 0.3,
    })
    .styles({
      fill: '#f1f1f1',
      'font-size': margin.top * 0.45,
      'font-weight': 600,
      'text-anchor': 'middle',
      'alignment-baseline': 'central',
    })
    .text(nombre_torneo.replace('_', '/'));

  svg
    .append('text')
    .attrs({
      x: width - margin.top * 0.3,
      y: margin.top * 0.3,
    })
    .styles({
      fill: 'lightgrey',
      'font-size': margin.top * 0.2,
      'font-weight': 600,
      'text-anchor': 'end',
      'alignment-baseline': 'central',
    })
    .text('@rankingligas');

  let defaults = {
    bar: {
      style: {
        fill: 'lightgrey',
      },
    },
    name: {
      position: {
        x: heightBars * 0,
        y: !stats_on_top ? -heightBars * 0.2 : -heightBars * 0.0,
      },
      style: {
        fill: black_color,
        font_size: heightBars * 0.4,
        font_weight: 600,
        text_anchor: 'start',
        alignment_baseline: 'central',
      },
    },
    value: {
      position: {
        x: 0,
        y: !stats_on_top ? heightBars * 0.2 : heightBars * 0.275,
      },
      style: {
        fill: black_color,
        font_size: heightBars * 0.3,
        font_weight: 600,
        text_anchor: 'start',
        alignment_baseline: 'central',
      },
      format: (d) => d3.format(',.0f')(d.value),
    },
    subValue: {
      style: {
        fill: black_color,
        font_size: heightBars * 0.225,
        font_weight: 400,
        text_anchor: 'start',
        alignment_baseline: 'central',
      },
    },
    final_infos: {
      position: {
        x: heightBars * 0,
        y: heightBars * 0,
      },
      logos: {
        size: heightBars * 0.45,
      },
    },
    growthValue: {
      position: {
        x: heightBars * 0.25,
        y: heightBars * 0.95,
      },
      style: {
        fill: (d) => (d.growthValue > 0 ? 'green' : d.growthValue == 0 ? 'grey' : 'red'),
        font_size: heightBars * 0.4,
        font_weight: 600,
        text_anchor: 'start',
        alignment_baseline: 'central',
      },
      format: (d) => (d.growthValue > 0 ? '+' : '') + d3.format('.2f')(d.growthValue) + '%',
    },
    logo: {
      position: {
        x: -32.5,
      },
      size: heightBars * 1.1,
      size1: heightBars * 0.75,
    },
    escudo: {
      size: heightBars * 0.4,
    },
    mini_logo: {
      position: {
        x: -32.5,
      },
      size: heightBars * 0.5,
      size1: heightBars * 0.35,
    },
    yearText: {
      position: {
        x: width - margin.right + 60,
        y: margin.top / 2,
      },
      style: {
        fill: black_color,
        font_size: 70,
        font_weight: 400,
        text_anchor: 'end',
        alignment_baseline: 'central',
      },
    },
  };

  function removeDuplicates(books) {
    let newArray = [];
    let uniqueObject = {};
    for (let i in books) {
      let objTitle = books[i]['name'];
      uniqueObject[objTitle] = books[i];
    }
    for (let i in uniqueObject) {
      newArray.push(uniqueObject[i]);
    }

    return newArray;
  }

  const cacheStats = new Map();

  function statsDirectos(nombres, semanaMax = Infinity) {
    const key = [...nombres].sort().join('|') + '|' + semanaMax;
    if (cacheStats.has(key)) return cacheStats.get(key);

    const nombress = [...new Set(nombres)];
    const stats = {};
    nombress.forEach((n) => {
      stats[n] = { pts_directo: 0, pj_directo: 0, pg_directo: 0, pe_directo: 0, pp_directo: 0, diff_directo: 0, gf_directo: 0, gc_directo: 0 };
    });

    const nombresSet = new Set(nombress);
    const dataRelevante = data.filter((d) => d.goles_fecha !== 99 && d.semana <= semanaMax && nombresSet.has(d.name));

    nombress.forEach((nombre) => {
      const rivales = [...new Set(nombress.filter((d) => d !== nombre))]
      /* console.log(semanaMax, nombre, rivales) */
      rivales.forEach((rival) => {
        const matches = dataRelevante.filter((d) => d.name === nombre && d.vs === rival);
        matches.forEach((match) => {
          stats[nombre].pts_directo += match.pts_fecha ?? 0;
          stats[nombre].pj_directo += 1;
          stats[nombre].pg_directo += match.goles_fecha > match.goles_en_contra_fecha ? 1 : 0;
          stats[nombre].pe_directo += match.goles_fecha === match.goles_en_contra_fecha ? 1 : 0;
          stats[nombre].pp_directo += match.goles_fecha < match.goles_en_contra_fecha ? 1 : 0;
          stats[nombre].gf_directo += match.goles_fecha ?? 0;
          stats[nombre].gc_directo += match.goles_en_contra_fecha ?? 0;
          stats[nombre].diff_directo += (match.goles_fecha ?? 0) - (match.goles_en_contra_fecha ?? 0);
        });
      });
    });

    cacheStats.set(key, stats);
    return stats;
  }
  /*

  let sort_teams1 = (array, { usarDirecto = true } = {}) => {
    array = removeDuplicates(array);

    const grupoEmpatadosCache = new Map();

    function getEmpatados(grupo, pts) {
      const key = `${grupo}|${pts}`;
      if (!grupoEmpatadosCache.has(key)) {
        grupoEmpatadosCache.set(
          key,
          array.filter((e) => e.name.split('-')[1] === grupo && e.value === pts).map((e) => e.name)
        );
      }
      return grupoEmpatadosCache.get(key);
    }

    array.sort((a, b) => {
      const ga = a.name.split('-')[1];
      const gb = b.name.split('-')[1];

      if (gb < ga) return 1;
      if (gb > ga) return -1;

      if (b.value !== a.value) return b.value - a.value;

      // Criterios directos (opcionales)
      if (usarDirecto) {
        const empatados = getEmpatados(ga, a.value);
        const sd = statsDirectos(empatados, array[0].semana);
        const sdA = sd[a.name];
        const sdB = sd[b.name];

        if (sdB.pts_directo !== sdA.pts_directo) return sdB.pts_directo - sdA.pts_directo;
        if (sdB.diff_directo !== sdA.diff_directo) return sdB.diff_directo - sdA.diff_directo;
        if (sdB.gf_directo !== sdA.gf_directo) return sdB.gf_directo - sdA.gf_directo;
      }

      if (b.diferencia_de_goles !== a.diferencia_de_goles) return b.diferencia_de_goles - a.diferencia_de_goles;
      if (b.goles !== a.goles) return b.goles - a.goles;
      if (b.value_away !== a.value_away) return b.value_away - a.value_away;

      return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
    });

    array.forEach((d, i) => (d.rank = i));
    array.forEach((d, i) => (d.rankInGroup = i % equipos_por_grupos));
    array.forEach((d) => (d.position = d.rankInGroup + 1 + d.name.split('-')[1]));
    array.forEach((d) => (d.fechas_en_top1 = d.rank === 0 ? 1 : 0));

    return array;
  }; */

  /* let mejores_terceros_sort = (array) => {

    array.sort((a, b) => {

      if (b.value !== a.value) return b.value - a.value;
      if (b.diferencia_de_goles !== a.diferencia_de_goles) return b.diferencia_de_goles - a.diferencia_de_goles;
      if (b.goles !== a.goles) return b.goles - a.goles;

      return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
    });

    return array;
  }; */

  const rankingFIFA2026 = {
    // Grupo A
    México: 15,
    Sudáfrica: 60,
    'Corea del Sur': 25,
    'República Checa': 41,

    // Grupo B
    Canadá: 30,
    'Bosnia y Herzegovina': 65,
    Qatar: 55,
    Suiza: 19,

    // Grupo C
    Brasil: 6,
    Marruecos: 8,
    Haití: 83,
    Escocia: 43,

    // Grupo D
    'Estados Unidos': 16,
    Paraguay: 40,
    Australia: 27,
    Turquía: 22,

    // Grupo E
    Alemania: 10,
    Curazao: 82,
    'Costa de Marfil': 34,
    Ecuador: 23,

    // Grupo F
    'Países Bajos': 7,
    Japón: 18,
    Suecia: 38,
    Túnez: 44,

    // Grupo G
    Bélgica: 9,
    Egipto: 29,
    Irán: 21,
    'Nueva Zelanda': 85,

    // Grupo H
    España: 2,
    'Cabo Verde': 68,
    'Arabia Saudita': 61,
    Uruguay: 17,

    // Grupo I
    Francia: 1,
    Senegal: 14,
    Irak: 57,
    Noruega: 31,

    // Grupo J
    Argentina: 3,
    Argelia: 28,
    Austria: 24,
    Jordania: 64,

    // Grupo K
    Portugal: 5,
    'RD de Congo': 46,
    Uzbekistán: 50,
    Colombia: 13,

    // Grupo L
    Inglaterra: 4,
    Croacia: 11,
    Ghana: 74,
    Panamá: 33,
  };

  function countryToCode(name) {
    const map = {
      México: 'mx',
      Sudáfrica: 'za',
      'Corea del Sur': 'kr',
      'República Checa': 'cz',
      Canadá: 'ca',
      'Bosnia y Herzegovina': 'ba',
      Qatar: 'qa',
      Suiza: 'ch',
      Brasil: 'br',
      Marruecos: 'ma',
      Haití: 'ht',
      Escocia: 'gb-sct',
      'Estados Unidos': 'us',
      Paraguay: 'py',
      Australia: 'au',
      Turquía: 'tr',
      Alemania: 'de',
      Curazao: 'cw',
      'Costa de Marfil': 'ci',
      Ecuador: 'ec',
      'Países Bajos': 'nl',
      Japón: 'jp',
      Suecia: 'se',
      Túnez: 'tn',
      Bélgica: 'be',
      Egipto: 'eg',
      Irán: 'ir',
      'Nueva Zelanda': 'nz',
      España: 'es',
      'Cabo Verde': 'cv',
      'Arabia Saudita': 'sa',
      Uruguay: 'uy',
      Francia: 'fr',
      Senegal: 'sn',
      Irak: 'iq',
      Noruega: 'no',
      Argentina: 'ar',
      Argelia: 'dz',
      Austria: 'at',
      Jordania: 'jo',
      Portugal: 'pt',
      'RD de Congo': 'cd',
      Uzbekistán: 'uz',
      Colombia: 'co',
      Inglaterra: 'gb-eng',
      Croacia: 'hr',
      Ghana: 'gh',
      Panamá: 'pa',
    };

    return map[name] || null;
  }

  function countryToEnglish(name) {
  const map = {
    México: 'Mexico',
    Sudáfrica: 'South Africa',
    'Corea del Sur': 'South Korea',
    'República Checa': 'Czech Republic',
    Canadá: 'Canada',
    'Bosnia y Herzegovina': 'Bosnia and Herzegovina',
    Qatar: 'Qatar',
    Suiza: 'Switzerland',
    Brasil: 'Brazil',
    Marruecos: 'Morocco',
    Haití: 'Haiti',
    Escocia: 'Scotland',
    'Estados Unidos': 'United States',
    Paraguay: 'Paraguay',
    Australia: 'Australia',
    Turquía: 'Turkey',
    Alemania: 'Germany',
    Curazao: 'Curaçao',
    'Costa de Marfil': "Côte d'Ivoire",
    Ecuador: 'Ecuador',
    'Países Bajos': 'Netherlands',
    Japón: 'Japan',
    Suecia: 'Sweden',
    Túnez: 'Tunisia',
    Bélgica: 'Belgium',
    Egipto: 'Egypt',
    Irán: 'Iran',
    'Nueva Zelanda': 'New Zealand',
    España: 'Spain',
    'Cabo Verde': 'Cape Verde',
    'Arabia Saudita': 'Saudi Arabia',
    Uruguay: 'Uruguay',
    Francia: 'France',
    Senegal: 'Senegal',
    Irak: 'Iraq',
    Noruega: 'Norway',
    Argentina: 'Argentina',
    Argelia: 'Algeria',
    Austria: 'Austria',
    Jordania: 'Jordan',
    Portugal: 'Portugal',
    'RD de Congo': 'DR Congo',
    Uzbekistán: 'Uzbekistan',
    Colombia: 'Colombia',
    Inglaterra: 'England',
    Croacia: 'Croatia',
    Ghana: 'Ghana',
    Panamá: 'Panama',
  };

  return map[name] || name;
}

  function getRankingFIFA1(name) {
    const nombre = name.replace(/-[A-L]$/, '');
    return rankingFIFA2026[nombre] || 999;
  }

  /* const stripes = [
  { color: "#002395", size: 1 }, // azul
  { color: "#ffffff", size: 1 }, // blanco
  { color: "#ED2939", size: 1 }  // rojo
];

stripes.forEach(s => {
  const h = (s.size / totalParts) * innerH;
  svg.append("rect")
    .attr("x", 0).attr("y", 0)
    .attr("width", 100).attr("height", h)
    .attr("fill", s.color);
  y += h;
}); */

  let sort_teams1 = (array, { usarDirecto = true } = {}) => {
    array = removeDuplicates(array);

    const grupoEmpatadosCache = new Map();

    function getEmpatados(grupo, pts) {
      const key = `${grupo}|${pts}`;
      if (!grupoEmpatadosCache.has(key)) {
        grupoEmpatadosCache.set(
          key,
          array.filter((e) => e.name.split('-')[1] === grupo && e.value === pts).map((e) => e.name)
        );
      }
      return grupoEmpatadosCache.get(key);
    }

    function getRankingFIFA(name) {
      const nombre = name.replace(/-[A-L]$/, '');
      return rankingFIFA2026[nombre] || 999;
    }

    array.sort((a, b) => {
      const ga = a.name.split('-')[1];
      const gb = b.name.split('-')[1];

      // Separar por grupo
      if (gb < ga) return 1;
      if (gb > ga) return -1;

      // 0. Puntos generales
      if (b.value !== a.value) return b.value - a.value;

      // 1º–3º Enfrentamientos directos
      if (usarDirecto) {
        const empatados = getEmpatados(ga, a.value);
        const sd = statsDirectos(empatados, array[0].semana);
        const sdA = sd[a.name];
        const sdB = sd[b.name];

        if (sdB.pts_directo !== sdA.pts_directo) return sdB.pts_directo - sdA.pts_directo;
        if (sdB.diff_directo !== sdA.diff_directo) return sdB.diff_directo - sdA.diff_directo;
        if (sdB.gf_directo !== sdA.gf_directo) return sdB.gf_directo - sdA.gf_directo;
      }

      // 4º Diferencia de goles general
      if (b.diferencia_de_goles !== a.diferencia_de_goles) return b.diferencia_de_goles - a.diferencia_de_goles;

      // 5º Goles a favor general
      if (b.goles !== a.goles) return b.goles - a.goles;

      // 6º Fair Play (menor = mejor)
      if ((b.fairPlay ?? 0) !== (a.fairPlay ?? 0)) return (b.fairPlay ?? 0) - (a.fairPlay ?? 0);

      // 7º Ranking FIFA (menor = mejor)
      return getRankingFIFA(a.name) - getRankingFIFA(b.name);
    });

    array.forEach((d, i) => (d.rank = i));
    array.forEach((d, i) => (d.rankInGroup = i % equipos_por_grupos));
    array.forEach((d) => (d.position = d.rankInGroup + 1 + d.name.split('-')[1]));
    array.forEach((d) => (d.fechas_en_top1 = d.rank === 0 ? 1 : 0));

    return array;
  };

  let mejores_terceros_sort = (array) => {
    function getRankingFIFA(name) {
      const nombre = name.replace(/-[A-L]$/, '');
      return rankingFIFA2026[nombre] || 999;
    }

    array.sort((a, b) => {
      // 1º Puntos
      if (b.value !== a.value) return b.value - a.value;

      // 2º Diferencia de goles general
      if (b.diferencia_de_goles !== a.diferencia_de_goles) return b.diferencia_de_goles - a.diferencia_de_goles;

      // 3º Goles a favor general
      if (b.goles !== a.goles) return b.goles - a.goles;

      // 4º Fair Play (menor = mejor)
      if ((b.fairPlay ?? 0) !== (a.fairPlay ?? 0)) return (b.fairPlay ?? 0) - (a.fairPlay ?? 0);

      // 5º Ranking FIFA (menor = mejor)
      return getRankingFIFA(a.name) - getRankingFIFA(b.name);
    });

    return array;
  };

  let yearSlice = sort_teams1(data.filter((d) => d.semana == dates[dates.length - 1] && !isNaN(d.value)));

  let x = d3.scaleLinear().domain([0, dates.length]).range([0, weeks_i]);

  let y = d3
    .scaleLinear()
    .domain([top_n, 0])
    .range([height - (grupos * heightBars) / 2 + heightBars / 2, margin.top + heightBars / 2]);

  let mejores_terceros = mejores_terceros_sort(yearSlice.filter((d) => d.rankInGroup == 2))
    .slice(0, 8)
    .map((d) => d.position[1]);

  let mejores = mejores_terceros_sort([...yearSlice]).map((d) => d.name);

  let mejores_num = Object.fromEntries(
  Array.from({ length: equipos_por_grupos }, (_, i) => [
    i,
    mejores_terceros_sort([...yearSlice]).filter((d) => d.rankInGroup == i).map((d) => d.name)
  ])
);

  svg
    .append('clipPath')
    .attr('id', `ellipse-clip-margin-bottom`)
    .append('rect')
    .attrs({
      x: 0,
      y: 0,
      width: width,
      height: y(top_n - 1) + heightBars / 2,
    });

  svg
    .append('clipPath')
    .attr('id', `ellipse-clip-margin-left`)
    .append('rect')
    .attrs({
      class: 'ellipse_clip_margin_left',
      x: -margin_left,
      y: 0,
      width: width,
      height: y(top_n - 1) + heightBars / 2,
    });

  if (grupos < 1) {
    svg
      .selectAll('.rect')
      .data(yearSlice.slice(0, top_n))
      .enter()
      .append('rect')
      .attrs({
        class: 'bars_names',
        x: 0,
        y: (d) => y(d.rank) - heightBars / 2,
        width: width,
        height: heightBars,
      })
      .styles({
        fill: (d, i) => (i < clasificacion_por_grupo ? (i % 2 == 1 ? '#94e694' : '#76c476') : i % 2 == 1 ? '#dddddd' : '#c2c2c2'),

        opacity: (d, i) => (i <= equipos_por_grupos - 1 ? 1 : 1),
      });
  }

  /* function mejor_tercero(grupos) {
    if (mejores_terceros.includes('3L')) {
      return '3L'
    }
  }
 */

  /**
   * mejor_tercero(grupos)
   *
   * Dado un array de 8 strings con las letras de los grupos cuyos terceros
   * clasificaron (ej: ["B","C","D","E","F","G","H","L"]),
   * devuelve un objeto indicando qué tercero va a cada partido.
   *
   * Fuente: Annex C del Reglamento oficial FIFA World Cup 2026 (495 combinaciones)
   *
   * Columnas de la tabla (orden):
   *   [0] P79 → 1A vs 3?
   *   [1] P85 → 1B vs 3?
   *   [2] P81 → 1D vs 3?
   *   [3] P74 → 1E vs 3?
   *   [4] P82 → 1G vs 3?
   *   [5] P77 → 1I vs 3?
   *   [6] P87 → 1K vs 3?
   *   [7] P80 → 1L vs 3?
   */
  const TABLA = {
    EFGHIJKL: ['3E', '3J', '3I', '3F', '3H', '3G', '3L', '3K'],
    DFGHIJKL: ['3H', '3G', '3I', '3D', '3J', '3F', '3L', '3K'],
    DEGHIJKL: ['3E', '3J', '3I', '3D', '3H', '3G', '3L', '3K'],
    DEFHIJKL: ['3E', '3J', '3I', '3D', '3H', '3F', '3L', '3K'],
    DEFGIJKL: ['3E', '3G', '3I', '3D', '3J', '3F', '3L', '3K'],
    DEFGHJKL: ['3E', '3G', '3J', '3D', '3H', '3F', '3L', '3K'],
    DEFGHIKL: ['3E', '3G', '3I', '3D', '3H', '3F', '3L', '3K'],
    DEFGHIJL: ['3E', '3G', '3J', '3D', '3H', '3F', '3L', '3I'],
    DEFGHIJK: ['3E', '3G', '3J', '3D', '3H', '3F', '3I', '3K'],
    CFGHIJKL: ['3H', '3G', '3I', '3C', '3J', '3F', '3L', '3K'],
    CEGHIJKL: ['3E', '3J', '3I', '3C', '3H', '3G', '3L', '3K'],
    CEFHIJKL: ['3E', '3J', '3I', '3C', '3H', '3F', '3L', '3K'],
    CEFGIJKL: ['3E', '3G', '3I', '3C', '3J', '3F', '3L', '3K'],
    CEFGHJKL: ['3E', '3G', '3J', '3C', '3H', '3F', '3L', '3K'],
    CEFGHIKL: ['3E', '3G', '3I', '3C', '3H', '3F', '3L', '3K'],
    CEFGHIJL: ['3E', '3G', '3J', '3C', '3H', '3F', '3L', '3I'],
    CEFGHIJK: ['3E', '3G', '3J', '3C', '3H', '3F', '3I', '3K'],
    CDGHIJKL: ['3H', '3G', '3I', '3C', '3J', '3D', '3L', '3K'],
    CDFHIJKL: ['3C', '3J', '3I', '3D', '3H', '3F', '3L', '3K'],
    CDFGIJKL: ['3C', '3G', '3I', '3D', '3J', '3F', '3L', '3K'],
    CDFGHJKL: ['3C', '3G', '3J', '3D', '3H', '3F', '3L', '3K'],
    CDFGHIKL: ['3C', '3G', '3I', '3D', '3H', '3F', '3L', '3K'],
    CDFGHIJL: ['3C', '3G', '3J', '3D', '3H', '3F', '3L', '3I'],
    CDFGHIJK: ['3C', '3G', '3J', '3D', '3H', '3F', '3I', '3K'],
    CDEHIJKL: ['3E', '3J', '3I', '3C', '3H', '3D', '3L', '3K'],
    CDEGIJKL: ['3E', '3G', '3I', '3C', '3J', '3D', '3L', '3K'],
    CDEGHJKL: ['3E', '3G', '3J', '3C', '3H', '3D', '3L', '3K'],
    CDEGHIKL: ['3E', '3G', '3I', '3C', '3H', '3D', '3L', '3K'],
    CDEGHIJL: ['3E', '3G', '3J', '3C', '3H', '3D', '3L', '3I'],
    CDEGHIJK: ['3E', '3G', '3J', '3C', '3H', '3D', '3I', '3K'],
    CDEFIJKL: ['3C', '3J', '3E', '3D', '3I', '3F', '3L', '3K'],
    CDEFHJKL: ['3C', '3J', '3E', '3D', '3H', '3F', '3L', '3K'],
    CDEFHIKL: ['3C', '3E', '3I', '3D', '3H', '3F', '3L', '3K'],
    CDEFHIJL: ['3C', '3J', '3E', '3D', '3H', '3F', '3L', '3I'],
    CDEFHIJK: ['3C', '3J', '3E', '3D', '3H', '3F', '3I', '3K'],
    CDEFGJKL: ['3C', '3G', '3E', '3D', '3J', '3F', '3L', '3K'],
    CDEFGIKL: ['3C', '3G', '3E', '3D', '3I', '3F', '3L', '3K'],
    CDEFGIJL: ['3C', '3G', '3E', '3D', '3J', '3F', '3L', '3I'],
    CDEFGIJK: ['3C', '3G', '3E', '3D', '3J', '3F', '3I', '3K'],
    CDEFGHKL: ['3C', '3G', '3E', '3D', '3H', '3F', '3L', '3K'],
    CDEFGHJL: ['3C', '3G', '3J', '3D', '3H', '3F', '3L', '3E'],
    CDEFGHJK: ['3C', '3G', '3J', '3D', '3H', '3F', '3E', '3K'],
    CDEFGHIL: ['3C', '3G', '3E', '3D', '3H', '3F', '3L', '3I'],
    CDEFGHIK: ['3C', '3G', '3E', '3D', '3H', '3F', '3I', '3K'],
    CDEFGHIJ: ['3C', '3G', '3J', '3D', '3H', '3F', '3E', '3I'],
    BFGHIJKL: ['3H', '3J', '3B', '3F', '3I', '3G', '3L', '3K'],
    BEGHIJKL: ['3E', '3J', '3I', '3B', '3H', '3G', '3L', '3K'],
    BEFHIJKL: ['3E', '3J', '3B', '3F', '3I', '3H', '3L', '3K'],
    BEFGIJKL: ['3E', '3J', '3B', '3F', '3I', '3G', '3L', '3K'],
    BEFGHJKL: ['3E', '3J', '3B', '3F', '3H', '3G', '3L', '3K'],
    BEFGHIKL: ['3E', '3G', '3B', '3F', '3I', '3H', '3L', '3K'],
    BEFGHIJL: ['3E', '3J', '3B', '3F', '3H', '3G', '3L', '3I'],
    BEFGHIJK: ['3E', '3J', '3B', '3F', '3H', '3G', '3I', '3K'],
    BDGHIJKL: ['3H', '3J', '3B', '3D', '3I', '3G', '3L', '3K'],
    BDFHIJKL: ['3H', '3J', '3B', '3D', '3I', '3F', '3L', '3K'],
    BDFGIJKL: ['3I', '3G', '3B', '3D', '3J', '3F', '3L', '3K'],
    BDFGHJKL: ['3H', '3G', '3B', '3D', '3J', '3F', '3L', '3K'],
    BDFGHIKL: ['3H', '3G', '3B', '3D', '3I', '3F', '3L', '3K'],
    BDFGHIJL: ['3H', '3G', '3B', '3D', '3J', '3F', '3L', '3I'],
    BDFGHIJK: ['3H', '3G', '3B', '3D', '3J', '3F', '3I', '3K'],
    BDEHIJKL: ['3E', '3J', '3B', '3D', '3I', '3H', '3L', '3K'],
    BDEGIJKL: ['3E', '3J', '3B', '3D', '3I', '3G', '3L', '3K'],
    BDEGHJKL: ['3E', '3J', '3B', '3D', '3H', '3G', '3L', '3K'],
    BDEGHIKL: ['3E', '3G', '3B', '3D', '3I', '3H', '3L', '3K'],
    BDEGHIJL: ['3E', '3J', '3B', '3D', '3H', '3G', '3L', '3I'],
    BDEGHIJK: ['3E', '3J', '3B', '3D', '3H', '3G', '3I', '3K'],
    BDEFIJKL: ['3E', '3J', '3B', '3D', '3I', '3F', '3L', '3K'],
    BDEFHJKL: ['3E', '3J', '3B', '3D', '3H', '3F', '3L', '3K'],
    BDEFHIKL: ['3E', '3I', '3B', '3D', '3H', '3F', '3L', '3K'],
    BDEFHIJL: ['3E', '3J', '3B', '3D', '3H', '3F', '3L', '3I'],
    BDEFHIJK: ['3E', '3J', '3B', '3D', '3H', '3F', '3I', '3K'],
    BDEFGJKL: ['3E', '3G', '3B', '3D', '3J', '3F', '3L', '3K'],
    BDEFGIKL: ['3E', '3G', '3B', '3D', '3I', '3F', '3L', '3K'],
    BDEFGIJL: ['3E', '3G', '3B', '3D', '3J', '3F', '3L', '3I'],
    BDEFGIJK: ['3E', '3G', '3B', '3D', '3J', '3F', '3I', '3K'],
    BDEFGHKL: ['3E', '3G', '3B', '3D', '3H', '3F', '3L', '3K'],
    BDEFGHJL: ['3H', '3G', '3B', '3D', '3J', '3F', '3L', '3E'],
    BDEFGHJK: ['3H', '3G', '3B', '3D', '3J', '3F', '3E', '3K'],
    BDEFGHIL: ['3E', '3G', '3B', '3D', '3H', '3F', '3L', '3I'],
    BDEFGHIK: ['3E', '3G', '3B', '3D', '3H', '3F', '3I', '3K'],
    BDEFGHIJ: ['3H', '3G', '3B', '3D', '3J', '3F', '3E', '3I'],
    BCGHIJKL: ['3H', '3J', '3B', '3C', '3I', '3G', '3L', '3K'],
    BCFHIJKL: ['3H', '3J', '3B', '3C', '3I', '3F', '3L', '3K'],
    BCFGIJKL: ['3I', '3G', '3B', '3C', '3J', '3F', '3L', '3K'],
    BCFGHJKL: ['3H', '3G', '3B', '3C', '3J', '3F', '3L', '3K'],
    BCFGHIKL: ['3H', '3G', '3B', '3C', '3I', '3F', '3L', '3K'],
    BCFGHIJL: ['3H', '3G', '3B', '3C', '3J', '3F', '3L', '3I'],
    BCFGHIJK: ['3H', '3G', '3B', '3C', '3J', '3F', '3I', '3K'],
    BCEHIJKL: ['3E', '3J', '3B', '3C', '3I', '3H', '3L', '3K'],
    BCEGIJKL: ['3E', '3J', '3B', '3C', '3I', '3G', '3L', '3K'],
    BCEGHJKL: ['3E', '3J', '3B', '3C', '3H', '3G', '3L', '3K'],
    BCEGHIKL: ['3E', '3G', '3B', '3C', '3I', '3H', '3L', '3K'],
    BCEGHIJL: ['3E', '3J', '3B', '3C', '3H', '3G', '3L', '3I'],
    BCEGHIJK: ['3E', '3J', '3B', '3C', '3H', '3G', '3I', '3K'],
    BCEFIJKL: ['3E', '3J', '3B', '3C', '3I', '3F', '3L', '3K'],
    BCEFHJKL: ['3E', '3J', '3B', '3C', '3H', '3F', '3L', '3K'],
    BCEFHIKL: ['3E', '3I', '3B', '3C', '3H', '3F', '3L', '3K'],
    BCEFHIJL: ['3E', '3J', '3B', '3C', '3H', '3F', '3L', '3I'],
    BCEFHIJK: ['3E', '3J', '3B', '3C', '3H', '3F', '3I', '3K'],
    BCEFGJKL: ['3E', '3G', '3B', '3C', '3J', '3F', '3L', '3K'],
    BCEFGIKL: ['3E', '3G', '3B', '3C', '3I', '3F', '3L', '3K'],
    BCEFGIJL: ['3E', '3G', '3B', '3C', '3J', '3F', '3L', '3I'],
    BCEFGIJK: ['3E', '3G', '3B', '3C', '3J', '3F', '3I', '3K'],
    BCEFGHKL: ['3E', '3G', '3B', '3C', '3H', '3F', '3L', '3K'],
    BCEFGHJL: ['3H', '3G', '3B', '3C', '3J', '3F', '3L', '3E'],
    BCEFGHJK: ['3H', '3G', '3B', '3C', '3J', '3F', '3E', '3K'],
    BCEFGHIL: ['3E', '3G', '3B', '3C', '3H', '3F', '3L', '3I'],
    BCEFGHIK: ['3E', '3G', '3B', '3C', '3H', '3F', '3I', '3K'],
    BCEFGHIJ: ['3H', '3G', '3B', '3C', '3J', '3F', '3E', '3I'],
    BCDHIJKL: ['3H', '3J', '3B', '3C', '3I', '3D', '3L', '3K'],
    BCDGIJKL: ['3I', '3G', '3B', '3C', '3J', '3D', '3L', '3K'],
    BCDGHJKL: ['3H', '3G', '3B', '3C', '3J', '3D', '3L', '3K'],
    BCDGHIKL: ['3H', '3G', '3B', '3C', '3I', '3D', '3L', '3K'],
    BCDGHIJL: ['3H', '3G', '3B', '3C', '3J', '3D', '3L', '3I'],
    BCDGHIJK: ['3H', '3G', '3B', '3C', '3J', '3D', '3I', '3K'],
    BCDFIJKL: ['3C', '3J', '3B', '3D', '3I', '3F', '3L', '3K'],
    BCDFHJKL: ['3C', '3J', '3B', '3D', '3H', '3F', '3L', '3K'],
    BCDFHIKL: ['3C', '3I', '3B', '3D', '3H', '3F', '3L', '3K'],
    BCDFHIJL: ['3C', '3J', '3B', '3D', '3H', '3F', '3L', '3I'],
    BCDFHIJK: ['3C', '3J', '3B', '3D', '3H', '3F', '3I', '3K'],
    BCDFGJKL: ['3C', '3G', '3B', '3D', '3J', '3F', '3L', '3K'],
    BCDFGIKL: ['3C', '3G', '3B', '3D', '3I', '3F', '3L', '3K'],
    BCDFGIJL: ['3C', '3G', '3B', '3D', '3J', '3F', '3L', '3I'],
    BCDFGIJK: ['3C', '3G', '3B', '3D', '3J', '3F', '3I', '3K'],
    BCDFGHKL: ['3C', '3G', '3B', '3D', '3H', '3F', '3L', '3K'],
    BCDFGHJL: ['3C', '3G', '3B', '3D', '3H', '3F', '3L', '3J'],
    BCDFGHJK: ['3H', '3G', '3B', '3C', '3J', '3F', '3D', '3K'],
    BCDFGHIL: ['3C', '3G', '3B', '3D', '3H', '3F', '3L', '3I'],
    BCDFGHIK: ['3C', '3G', '3B', '3D', '3H', '3F', '3I', '3K'],
    BCDFGHIJ: ['3H', '3G', '3B', '3C', '3J', '3F', '3D', '3I'],
    BCDEIJKL: ['3E', '3J', '3B', '3C', '3I', '3D', '3L', '3K'],
    BCDEHJKL: ['3E', '3J', '3B', '3C', '3H', '3D', '3L', '3K'],
    BCDEHIKL: ['3E', '3I', '3B', '3C', '3H', '3D', '3L', '3K'],
    BCDEHIJL: ['3E', '3J', '3B', '3C', '3H', '3D', '3L', '3I'],
    BCDEHIJK: ['3E', '3J', '3B', '3C', '3H', '3D', '3I', '3K'],
    BCDEGJKL: ['3E', '3G', '3B', '3C', '3J', '3D', '3L', '3K'],
    BCDEGIKL: ['3E', '3G', '3B', '3C', '3I', '3D', '3L', '3K'],
    BCDEGIJL: ['3E', '3G', '3B', '3C', '3J', '3D', '3L', '3I'],
    BCDEGIJK: ['3E', '3G', '3B', '3C', '3J', '3D', '3I', '3K'],
    BCDEGHKL: ['3E', '3G', '3B', '3C', '3H', '3D', '3L', '3K'],
    BCDEGHJL: ['3H', '3G', '3B', '3C', '3J', '3D', '3L', '3E'],
    BCDEGHJK: ['3H', '3G', '3B', '3C', '3J', '3D', '3E', '3K'],
    BCDEGHIL: ['3E', '3G', '3B', '3C', '3H', '3D', '3L', '3I'],
    BCDEGHIK: ['3E', '3G', '3B', '3C', '3H', '3D', '3I', '3K'],
    BCDEGHIJ: ['3H', '3G', '3B', '3C', '3J', '3D', '3E', '3I'],
    BCDEFJKL: ['3C', '3J', '3B', '3D', '3E', '3F', '3L', '3K'],
    BCDEFIKL: ['3C', '3E', '3B', '3D', '3I', '3F', '3L', '3K'],
    BCDEFIJL: ['3C', '3J', '3B', '3D', '3E', '3F', '3L', '3I'],
    BCDEFIJK: ['3C', '3J', '3B', '3D', '3E', '3F', '3I', '3K'],
    BCDEFHKL: ['3C', '3E', '3B', '3D', '3H', '3F', '3L', '3K'],
    BCDEFHJL: ['3C', '3J', '3B', '3D', '3H', '3F', '3L', '3E'],
    BCDEFHJK: ['3C', '3J', '3B', '3D', '3H', '3F', '3E', '3K'],
    BCDEFHIL: ['3C', '3E', '3B', '3D', '3H', '3F', '3L', '3I'],
    BCDEFHIK: ['3C', '3E', '3B', '3D', '3H', '3F', '3I', '3K'],
    BCDEFHIJ: ['3C', '3J', '3B', '3D', '3H', '3F', '3E', '3I'],
    BCDEFGKL: ['3C', '3G', '3B', '3D', '3E', '3F', '3L', '3K'],
    BCDEFGJL: ['3C', '3G', '3B', '3D', '3J', '3F', '3L', '3E'],
    BCDEFGJK: ['3C', '3G', '3B', '3D', '3J', '3F', '3E', '3K'],
    BCDEFGIL: ['3C', '3G', '3B', '3D', '3E', '3F', '3L', '3I'],
    BCDEFGIK: ['3C', '3G', '3B', '3D', '3E', '3F', '3I', '3K'],
    BCDEFGIJ: ['3C', '3G', '3B', '3D', '3J', '3F', '3E', '3I'],
    BCDEFGHL: ['3C', '3G', '3B', '3D', '3H', '3F', '3L', '3E'],
    BCDEFGHK: ['3C', '3G', '3B', '3D', '3H', '3F', '3E', '3K'],
    BCDEFGHJ: ['3H', '3G', '3B', '3C', '3J', '3F', '3D', '3E'],
    BCDEFGHI: ['3C', '3G', '3B', '3D', '3H', '3F', '3E', '3I'],
    AFGHIJKL: ['3H', '3J', '3I', '3F', '3A', '3G', '3L', '3K'],
    AEGHIJKL: ['3E', '3J', '3I', '3A', '3H', '3G', '3L', '3K'],
    AEFHIJKL: ['3E', '3J', '3I', '3F', '3A', '3H', '3L', '3K'],
    AEFGIJKL: ['3E', '3J', '3I', '3F', '3A', '3G', '3L', '3K'],
    AEFGHJKL: ['3E', '3G', '3J', '3F', '3A', '3H', '3L', '3K'],
    AEFGHIKL: ['3E', '3G', '3I', '3F', '3A', '3H', '3L', '3K'],
    AEFGHIJL: ['3E', '3G', '3J', '3F', '3A', '3H', '3L', '3I'],
    AEFGHIJK: ['3E', '3G', '3J', '3F', '3A', '3H', '3I', '3K'],
    ADGHIJKL: ['3H', '3J', '3I', '3D', '3A', '3G', '3L', '3K'],
    ADFHIJKL: ['3H', '3J', '3I', '3D', '3A', '3F', '3L', '3K'],
    ADFGIJKL: ['3I', '3G', '3J', '3D', '3A', '3F', '3L', '3K'],
    ADFGHJKL: ['3H', '3G', '3J', '3D', '3A', '3F', '3L', '3K'],
    ADFGHIKL: ['3H', '3G', '3I', '3D', '3A', '3F', '3L', '3K'],
    ADFGHIJL: ['3H', '3G', '3J', '3D', '3A', '3F', '3L', '3I'],
    ADFGHIJK: ['3H', '3G', '3J', '3D', '3A', '3F', '3I', '3K'],
    ADEHIJKL: ['3E', '3J', '3I', '3D', '3A', '3H', '3L', '3K'],
    ADEGIJKL: ['3E', '3J', '3I', '3D', '3A', '3G', '3L', '3K'],
    ADEGHJKL: ['3E', '3G', '3J', '3D', '3A', '3H', '3L', '3K'],
    ADEGHIKL: ['3E', '3G', '3I', '3D', '3A', '3H', '3L', '3K'],
    ADEGHIJL: ['3E', '3G', '3J', '3D', '3A', '3H', '3L', '3I'],
    ADEGHIJK: ['3E', '3G', '3J', '3D', '3A', '3H', '3I', '3K'],
    ADEFIJKL: ['3E', '3J', '3I', '3D', '3A', '3F', '3L', '3K'],
    ADEFHJKL: ['3H', '3J', '3E', '3D', '3A', '3F', '3L', '3K'],
    ADEFHIKL: ['3H', '3E', '3I', '3D', '3A', '3F', '3L', '3K'],
    ADEFHIJL: ['3H', '3J', '3E', '3D', '3A', '3F', '3L', '3I'],
    ADEFHIJK: ['3H', '3J', '3E', '3D', '3A', '3F', '3I', '3K'],
    ADEFGJKL: ['3E', '3G', '3J', '3D', '3A', '3F', '3L', '3K'],
    ADEFGIKL: ['3E', '3G', '3I', '3D', '3A', '3F', '3L', '3K'],
    ADEFGIJL: ['3E', '3G', '3J', '3D', '3A', '3F', '3L', '3I'],
    ADEFGIJK: ['3E', '3G', '3J', '3D', '3A', '3F', '3I', '3K'],
    ADEFGHKL: ['3H', '3G', '3E', '3D', '3A', '3F', '3L', '3K'],
    ADEFGHJL: ['3H', '3G', '3J', '3D', '3A', '3F', '3L', '3E'],
    ADEFGHJK: ['3H', '3G', '3J', '3D', '3A', '3F', '3E', '3K'],
    ADEFGHIL: ['3H', '3G', '3E', '3D', '3A', '3F', '3L', '3I'],
    ADEFGHIK: ['3H', '3G', '3E', '3D', '3A', '3F', '3I', '3K'],
    ADEFGHIJ: ['3H', '3G', '3J', '3D', '3A', '3F', '3E', '3I'],
    ACGHIJKL: ['3H', '3J', '3I', '3C', '3A', '3G', '3L', '3K'],
    ACFHIJKL: ['3H', '3J', '3I', '3C', '3A', '3F', '3L', '3K'],
    ACFGIJKL: ['3I', '3G', '3J', '3C', '3A', '3F', '3L', '3K'],
    ACFGHJKL: ['3H', '3G', '3J', '3C', '3A', '3F', '3L', '3K'],
    ACFGHIKL: ['3H', '3G', '3I', '3C', '3A', '3F', '3L', '3K'],
    ACFGHIJL: ['3H', '3G', '3J', '3C', '3A', '3F', '3L', '3I'],
    ACFGHIJK: ['3H', '3G', '3J', '3C', '3A', '3F', '3I', '3K'],
    ACEHIJKL: ['3E', '3J', '3I', '3C', '3A', '3H', '3L', '3K'],
    ACEGIJKL: ['3E', '3J', '3I', '3C', '3A', '3G', '3L', '3K'],
    ACEGHJKL: ['3E', '3G', '3J', '3C', '3A', '3H', '3L', '3K'],
    ACEGHIKL: ['3E', '3G', '3I', '3C', '3A', '3H', '3L', '3K'],
    ACEGHIJL: ['3E', '3G', '3J', '3C', '3A', '3H', '3L', '3I'],
    ACEGHIJK: ['3E', '3G', '3J', '3C', '3A', '3H', '3I', '3K'],
    ACEFIJKL: ['3E', '3J', '3I', '3C', '3A', '3F', '3L', '3K'],
    ACEFHJKL: ['3H', '3J', '3E', '3C', '3A', '3F', '3L', '3K'],
    ACEFHIKL: ['3H', '3E', '3I', '3C', '3A', '3F', '3L', '3K'],
    ACEFHIJL: ['3H', '3J', '3E', '3C', '3A', '3F', '3L', '3I'],
    ACEFHIJK: ['3H', '3J', '3E', '3C', '3A', '3F', '3I', '3K'],
    ACEFGJKL: ['3E', '3G', '3J', '3C', '3A', '3F', '3L', '3K'],
    ACEFGIKL: ['3E', '3G', '3I', '3C', '3A', '3F', '3L', '3K'],
    ACEFGIJL: ['3E', '3G', '3J', '3C', '3A', '3F', '3L', '3I'],
    ACEFGIJK: ['3E', '3G', '3J', '3C', '3A', '3F', '3I', '3K'],
    ACEFGHKL: ['3H', '3G', '3E', '3C', '3A', '3F', '3L', '3K'],
    ACEFGHJL: ['3H', '3G', '3J', '3C', '3A', '3F', '3L', '3E'],
    ACEFGHJK: ['3H', '3G', '3J', '3C', '3A', '3F', '3E', '3K'],
    ACEFGHIL: ['3H', '3G', '3E', '3C', '3A', '3F', '3L', '3I'],
    ACEFGHIK: ['3H', '3G', '3E', '3C', '3A', '3F', '3I', '3K'],
    ACEFGHIJ: ['3H', '3G', '3J', '3C', '3A', '3F', '3E', '3I'],
    ACDHIJKL: ['3H', '3J', '3I', '3C', '3A', '3D', '3L', '3K'],
    ACDGIJKL: ['3I', '3G', '3J', '3C', '3A', '3D', '3L', '3K'],
    ACDGHJKL: ['3H', '3G', '3J', '3C', '3A', '3D', '3L', '3K'],
    ACDGHIKL: ['3H', '3G', '3I', '3C', '3A', '3D', '3L', '3K'],
    ACDGHIJL: ['3H', '3G', '3J', '3C', '3A', '3D', '3L', '3I'],
    ACDGHIJK: ['3H', '3G', '3J', '3C', '3A', '3D', '3I', '3K'],
    ACDFIJKL: ['3C', '3J', '3I', '3D', '3A', '3F', '3L', '3K'],
    ACDFHJKL: ['3H', '3J', '3F', '3C', '3A', '3D', '3L', '3K'],
    ACDFHIKL: ['3H', '3F', '3I', '3C', '3A', '3D', '3L', '3K'],
    ACDFHIJL: ['3H', '3J', '3F', '3C', '3A', '3D', '3L', '3I'],
    ACDFHIJK: ['3H', '3J', '3F', '3C', '3A', '3D', '3I', '3K'],
    ACDFGJKL: ['3C', '3G', '3J', '3D', '3A', '3F', '3L', '3K'],
    ACDFGIKL: ['3C', '3G', '3I', '3D', '3A', '3F', '3L', '3K'],
    ACDFGIJL: ['3C', '3G', '3J', '3D', '3A', '3F', '3L', '3I'],
    ACDFGIJK: ['3C', '3G', '3J', '3D', '3A', '3F', '3I', '3K'],
    ACDFGHKL: ['3H', '3G', '3F', '3C', '3A', '3D', '3L', '3K'],
    ACDFGHJL: ['3C', '3G', '3J', '3D', '3A', '3F', '3L', '3H'],
    ACDFGHJK: ['3H', '3G', '3J', '3C', '3A', '3F', '3D', '3K'],
    ACDFGHIL: ['3H', '3G', '3F', '3C', '3A', '3D', '3L', '3I'],
    ACDFGHIK: ['3H', '3G', '3F', '3C', '3A', '3D', '3I', '3K'],
    ACDFGHIJ: ['3H', '3G', '3J', '3C', '3A', '3F', '3D', '3I'],
    ACDEIJKL: ['3E', '3J', '3I', '3C', '3A', '3D', '3L', '3K'],
    ACDEHJKL: ['3H', '3J', '3E', '3C', '3A', '3D', '3L', '3K'],
    ACDEHIKL: ['3H', '3E', '3I', '3C', '3A', '3D', '3L', '3K'],
    ACDEHIJL: ['3H', '3J', '3E', '3C', '3A', '3D', '3L', '3I'],
    ACDEHIJK: ['3H', '3J', '3E', '3C', '3A', '3D', '3I', '3K'],
    ACDEGJKL: ['3E', '3G', '3J', '3C', '3A', '3D', '3L', '3K'],
    ACDEGIKL: ['3E', '3G', '3I', '3C', '3A', '3D', '3L', '3K'],
    ACDEGIJL: ['3E', '3G', '3J', '3C', '3A', '3D', '3L', '3I'],
    ACDEGIJK: ['3E', '3G', '3J', '3C', '3A', '3D', '3I', '3K'],
    ACDEGHKL: ['3H', '3G', '3E', '3C', '3A', '3D', '3L', '3K'],
    ACDEGHJL: ['3H', '3G', '3J', '3C', '3A', '3D', '3L', '3E'],
    ACDEGHJK: ['3H', '3G', '3J', '3C', '3A', '3D', '3E', '3K'],
    ACDEGHIL: ['3H', '3G', '3E', '3C', '3A', '3D', '3L', '3I'],
    ACDEGHIK: ['3H', '3G', '3E', '3C', '3A', '3D', '3I', '3K'],
    ACDEGHIJ: ['3H', '3G', '3J', '3C', '3A', '3D', '3E', '3I'],
    ACDEFJKL: ['3C', '3J', '3E', '3D', '3A', '3F', '3L', '3K'],
    ACDEFIKL: ['3C', '3E', '3I', '3D', '3A', '3F', '3L', '3K'],
    ACDEFIJL: ['3C', '3J', '3E', '3D', '3A', '3F', '3L', '3I'],
    ACDEFIJK: ['3C', '3J', '3E', '3D', '3A', '3F', '3I', '3K'],
    ACDEFHKL: ['3H', '3E', '3F', '3C', '3A', '3D', '3L', '3K'],
    ACDEFHJL: ['3H', '3J', '3F', '3C', '3A', '3D', '3L', '3E'],
    ACDEFHJK: ['3H', '3J', '3E', '3C', '3A', '3F', '3D', '3K'],
    ACDEFHIL: ['3H', '3E', '3F', '3C', '3A', '3D', '3L', '3I'],
    ACDEFHIK: ['3H', '3E', '3F', '3C', '3A', '3D', '3I', '3K'],
    ACDEFHIJ: ['3H', '3J', '3E', '3C', '3A', '3F', '3D', '3I'],
    ACDEFGKL: ['3C', '3G', '3E', '3D', '3A', '3F', '3L', '3K'],
    ACDEFGJL: ['3C', '3G', '3J', '3D', '3A', '3F', '3L', '3E'],
    ACDEFGJK: ['3C', '3G', '3J', '3D', '3A', '3F', '3E', '3K'],
    ACDEFGIL: ['3C', '3G', '3E', '3D', '3A', '3F', '3L', '3I'],
    ACDEFGIK: ['3C', '3G', '3E', '3D', '3A', '3F', '3I', '3K'],
    ACDEFGIJ: ['3C', '3G', '3J', '3D', '3A', '3F', '3E', '3I'],
    ACDEFGHL: ['3H', '3G', '3F', '3C', '3A', '3D', '3L', '3E'],
    ACDEFGHK: ['3H', '3G', '3E', '3C', '3A', '3F', '3D', '3K'],
    ACDEFGHJ: ['3H', '3G', '3J', '3C', '3A', '3F', '3D', '3E'],
    ACDEFGHI: ['3H', '3G', '3E', '3C', '3A', '3F', '3D', '3I'],
    ABGHIJKL: ['3H', '3J', '3B', '3A', '3I', '3G', '3L', '3K'],
    ABFHIJKL: ['3H', '3J', '3B', '3A', '3I', '3F', '3L', '3K'],
    ABFGIJKL: ['3I', '3J', '3B', '3F', '3A', '3G', '3L', '3K'],
    ABFGHJKL: ['3H', '3J', '3B', '3F', '3A', '3G', '3L', '3K'],
    ABFGHIKL: ['3H', '3G', '3B', '3A', '3I', '3F', '3L', '3K'],
    ABFGHIJL: ['3H', '3J', '3B', '3F', '3A', '3G', '3L', '3I'],
    ABFGHIJK: ['3H', '3J', '3B', '3F', '3A', '3G', '3I', '3K'],
    ABEHIJKL: ['3E', '3J', '3B', '3A', '3I', '3H', '3L', '3K'],
    ABEGIJKL: ['3E', '3J', '3B', '3A', '3I', '3G', '3L', '3K'],
    ABEGHJKL: ['3E', '3J', '3B', '3A', '3H', '3G', '3L', '3K'],
    ABEGHIKL: ['3E', '3G', '3B', '3A', '3I', '3H', '3L', '3K'],
    ABEGHIJL: ['3E', '3J', '3B', '3A', '3H', '3G', '3L', '3I'],
    ABEGHIJK: ['3E', '3J', '3B', '3A', '3H', '3G', '3I', '3K'],
    ABEFIJKL: ['3E', '3J', '3B', '3A', '3I', '3F', '3L', '3K'],
    ABEFHJKL: ['3E', '3J', '3B', '3F', '3A', '3H', '3L', '3K'],
    ABEFHIKL: ['3E', '3I', '3B', '3F', '3A', '3H', '3L', '3K'],
    ABEFHIJL: ['3E', '3J', '3B', '3F', '3A', '3H', '3L', '3I'],
    ABEFHIJK: ['3E', '3J', '3B', '3F', '3A', '3H', '3I', '3K'],
    ABEFGJKL: ['3E', '3J', '3B', '3F', '3A', '3G', '3L', '3K'],
    ABEFGIKL: ['3E', '3G', '3B', '3A', '3I', '3F', '3L', '3K'],
    ABEFGIJL: ['3E', '3J', '3B', '3F', '3A', '3G', '3L', '3I'],
    ABEFGIJK: ['3E', '3J', '3B', '3F', '3A', '3G', '3I', '3K'],
    ABEFGHKL: ['3E', '3G', '3B', '3F', '3A', '3H', '3L', '3K'],
    ABEFGHJL: ['3H', '3J', '3B', '3F', '3A', '3G', '3L', '3E'],
    ABEFGHJK: ['3H', '3J', '3B', '3F', '3A', '3G', '3E', '3K'],
    ABEFGHIL: ['3E', '3G', '3B', '3F', '3A', '3H', '3L', '3I'],
    ABEFGHIK: ['3E', '3G', '3B', '3F', '3A', '3H', '3I', '3K'],
    ABEFGHIJ: ['3H', '3J', '3B', '3F', '3A', '3G', '3E', '3I'],
    ABDHIJKL: ['3I', '3J', '3B', '3D', '3A', '3H', '3L', '3K'],
    ABDGIJKL: ['3I', '3J', '3B', '3D', '3A', '3G', '3L', '3K'],
    ABDGHJKL: ['3H', '3J', '3B', '3D', '3A', '3G', '3L', '3K'],
    ABDGHIKL: ['3I', '3G', '3B', '3D', '3A', '3H', '3L', '3K'],
    ABDGHIJL: ['3H', '3J', '3B', '3D', '3A', '3G', '3L', '3I'],
    ABDGHIJK: ['3H', '3J', '3B', '3D', '3A', '3G', '3I', '3K'],
    ABDFIJKL: ['3I', '3J', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABDFHJKL: ['3H', '3J', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABDFHIKL: ['3H', '3I', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABDFHIJL: ['3H', '3J', '3B', '3D', '3A', '3F', '3L', '3I'],
    ABDFHIJK: ['3H', '3J', '3B', '3D', '3A', '3F', '3I', '3K'],
    ABDFGJKL: ['3F', '3J', '3B', '3D', '3A', '3G', '3L', '3K'],
    ABDFGIKL: ['3I', '3G', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABDFGIJL: ['3F', '3J', '3B', '3D', '3A', '3G', '3L', '3I'],
    ABDFGIJK: ['3F', '3J', '3B', '3D', '3A', '3G', '3I', '3K'],
    ABDFGHKL: ['3H', '3G', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABDFGHJL: ['3H', '3G', '3B', '3D', '3A', '3F', '3L', '3J'],
    ABDFGHJK: ['3H', '3G', '3B', '3D', '3A', '3F', '3J', '3K'],
    ABDFGHIL: ['3H', '3G', '3B', '3D', '3A', '3F', '3L', '3I'],
    ABDFGHIK: ['3H', '3G', '3B', '3D', '3A', '3F', '3I', '3K'],
    ABDFGHIJ: ['3H', '3G', '3B', '3D', '3A', '3F', '3I', '3J'],
    ABDEIJKL: ['3E', '3J', '3B', '3A', '3I', '3D', '3L', '3K'],
    ABDEHJKL: ['3E', '3J', '3B', '3D', '3A', '3H', '3L', '3K'],
    ABDEHIKL: ['3E', '3I', '3B', '3D', '3A', '3H', '3L', '3K'],
    ABDEHIJL: ['3E', '3J', '3B', '3D', '3A', '3H', '3L', '3I'],
    ABDEHIJK: ['3E', '3J', '3B', '3D', '3A', '3H', '3I', '3K'],
    ABDEGJKL: ['3E', '3J', '3B', '3D', '3A', '3G', '3L', '3K'],
    ABDEGIKL: ['3E', '3G', '3B', '3A', '3I', '3D', '3L', '3K'],
    ABDEGIJL: ['3E', '3J', '3B', '3D', '3A', '3G', '3L', '3I'],
    ABDEGIJK: ['3E', '3J', '3B', '3D', '3A', '3G', '3I', '3K'],
    ABDEGHKL: ['3E', '3G', '3B', '3D', '3A', '3H', '3L', '3K'],
    ABDEGHJL: ['3H', '3J', '3B', '3D', '3A', '3G', '3L', '3E'],
    ABDEGHJK: ['3H', '3J', '3B', '3D', '3A', '3G', '3E', '3K'],
    ABDEGHIL: ['3E', '3G', '3B', '3D', '3A', '3H', '3L', '3I'],
    ABDEGHIK: ['3E', '3G', '3B', '3D', '3A', '3H', '3I', '3K'],
    ABDEGHIJ: ['3H', '3J', '3B', '3D', '3A', '3G', '3E', '3I'],
    ABDEFJKL: ['3E', '3J', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABDEFIKL: ['3E', '3I', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABDEFIJL: ['3E', '3J', '3B', '3D', '3A', '3F', '3L', '3I'],
    ABDEFIJK: ['3E', '3J', '3B', '3D', '3A', '3F', '3I', '3K'],
    ABDEFHKL: ['3H', '3E', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABDEFHJL: ['3H', '3J', '3B', '3D', '3A', '3F', '3L', '3E'],
    ABDEFHJK: ['3H', '3J', '3B', '3D', '3A', '3F', '3E', '3K'],
    ABDEFHIL: ['3H', '3E', '3B', '3D', '3A', '3F', '3L', '3I'],
    ABDEFHIK: ['3H', '3E', '3B', '3D', '3A', '3F', '3I', '3K'],
    ABDEFHIJ: ['3H', '3J', '3B', '3D', '3A', '3F', '3E', '3I'],
    ABDEFGKL: ['3E', '3G', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABDEFGJL: ['3E', '3G', '3B', '3D', '3A', '3F', '3L', '3J'],
    ABDEFGJK: ['3E', '3G', '3B', '3D', '3A', '3F', '3J', '3K'],
    ABDEFGIL: ['3E', '3G', '3B', '3D', '3A', '3F', '3L', '3I'],
    ABDEFGIK: ['3E', '3G', '3B', '3D', '3A', '3F', '3I', '3K'],
    ABDEFGIJ: ['3E', '3G', '3B', '3D', '3A', '3F', '3I', '3J'],
    ABDEFGHL: ['3H', '3G', '3B', '3D', '3A', '3F', '3L', '3E'],
    ABDEFGHK: ['3H', '3G', '3B', '3D', '3A', '3F', '3E', '3K'],
    ABDEFGHJ: ['3H', '3G', '3B', '3D', '3A', '3F', '3E', '3J'],
    ABDEFGHI: ['3H', '3G', '3B', '3D', '3A', '3F', '3E', '3I'],
    ABCHIJKL: ['3I', '3J', '3B', '3C', '3A', '3H', '3L', '3K'],
    ABCGIJKL: ['3I', '3J', '3B', '3C', '3A', '3G', '3L', '3K'],
    ABCGHJKL: ['3H', '3J', '3B', '3C', '3A', '3G', '3L', '3K'],
    ABCGHIKL: ['3I', '3G', '3B', '3C', '3A', '3H', '3L', '3K'],
    ABCGHIJL: ['3H', '3J', '3B', '3C', '3A', '3G', '3L', '3I'],
    ABCGHIJK: ['3H', '3J', '3B', '3C', '3A', '3G', '3I', '3K'],
    ABCFIJKL: ['3I', '3J', '3B', '3C', '3A', '3F', '3L', '3K'],
    ABCFHJKL: ['3H', '3J', '3B', '3C', '3A', '3F', '3L', '3K'],
    ABCFHIKL: ['3H', '3I', '3B', '3C', '3A', '3F', '3L', '3K'],
    ABCFHIJL: ['3H', '3J', '3B', '3C', '3A', '3F', '3L', '3I'],
    ABCFHIJK: ['3H', '3J', '3B', '3C', '3A', '3F', '3I', '3K'],
    ABCFGJKL: ['3C', '3J', '3B', '3F', '3A', '3G', '3L', '3K'],
    ABCFGIKL: ['3I', '3G', '3B', '3C', '3A', '3F', '3L', '3K'],
    ABCFGIJL: ['3C', '3J', '3B', '3F', '3A', '3G', '3L', '3I'],
    ABCFGIJK: ['3C', '3J', '3B', '3F', '3A', '3G', '3I', '3K'],
    ABCFGHKL: ['3H', '3G', '3B', '3C', '3A', '3F', '3L', '3K'],
    ABCFGHJL: ['3H', '3G', '3B', '3C', '3A', '3F', '3L', '3J'],
    ABCFGHJK: ['3H', '3G', '3B', '3C', '3A', '3F', '3J', '3K'],
    ABCFGHIL: ['3H', '3G', '3B', '3C', '3A', '3F', '3L', '3I'],
    ABCFGHIK: ['3H', '3G', '3B', '3C', '3A', '3F', '3I', '3K'],
    ABCFGHIJ: ['3H', '3G', '3B', '3C', '3A', '3F', '3I', '3J'],
    ABCEIJKL: ['3E', '3J', '3B', '3A', '3I', '3C', '3L', '3K'],
    ABCEHJKL: ['3E', '3J', '3B', '3C', '3A', '3H', '3L', '3K'],
    ABCEHIKL: ['3E', '3I', '3B', '3C', '3A', '3H', '3L', '3K'],
    ABCEHIJL: ['3E', '3J', '3B', '3C', '3A', '3H', '3L', '3I'],
    ABCEHIJK: ['3E', '3J', '3B', '3C', '3A', '3H', '3I', '3K'],
    ABCEGJKL: ['3E', '3J', '3B', '3C', '3A', '3G', '3L', '3K'],
    ABCEGIKL: ['3E', '3G', '3B', '3A', '3I', '3C', '3L', '3K'],
    ABCEGIJL: ['3E', '3J', '3B', '3C', '3A', '3G', '3L', '3I'],
    ABCEGIJK: ['3E', '3J', '3B', '3C', '3A', '3G', '3I', '3K'],
    ABCEGHKL: ['3E', '3G', '3B', '3C', '3A', '3H', '3L', '3K'],
    ABCEGHJL: ['3H', '3J', '3B', '3C', '3A', '3G', '3L', '3E'],
    ABCEGHJK: ['3H', '3J', '3B', '3C', '3A', '3G', '3E', '3K'],
    ABCEGHIL: ['3E', '3G', '3B', '3C', '3A', '3H', '3L', '3I'],
    ABCEGHIK: ['3E', '3G', '3B', '3C', '3A', '3H', '3I', '3K'],
    ABCEGHIJ: ['3H', '3J', '3B', '3C', '3A', '3G', '3E', '3I'],
    ABCEFJKL: ['3E', '3J', '3B', '3C', '3A', '3F', '3L', '3K'],
    ABCEFIKL: ['3E', '3I', '3B', '3C', '3A', '3F', '3L', '3K'],
    ABCEFIJL: ['3E', '3J', '3B', '3C', '3A', '3F', '3L', '3I'],
    ABCEFIJK: ['3E', '3J', '3B', '3C', '3A', '3F', '3I', '3K'],
    ABCEFHKL: ['3H', '3E', '3B', '3C', '3A', '3F', '3L', '3K'],
    ABCEFHJL: ['3H', '3J', '3B', '3C', '3A', '3F', '3L', '3E'],
    ABCEFHJK: ['3H', '3J', '3B', '3C', '3A', '3F', '3E', '3K'],
    ABCEFHIL: ['3H', '3E', '3B', '3C', '3A', '3F', '3L', '3I'],
    ABCEFHIK: ['3H', '3E', '3B', '3C', '3A', '3F', '3I', '3K'],
    ABCEFHIJ: ['3H', '3J', '3B', '3C', '3A', '3F', '3E', '3I'],
    ABCEFGKL: ['3E', '3G', '3B', '3C', '3A', '3F', '3L', '3K'],
    ABCEFGJL: ['3E', '3G', '3B', '3C', '3A', '3F', '3L', '3J'],
    ABCEFGJK: ['3E', '3G', '3B', '3C', '3A', '3F', '3J', '3K'],
    ABCEFGIL: ['3E', '3G', '3B', '3C', '3A', '3F', '3L', '3I'],
    ABCEFGIK: ['3E', '3G', '3B', '3C', '3A', '3F', '3I', '3K'],
    ABCEFGIJ: ['3E', '3G', '3B', '3C', '3A', '3F', '3I', '3J'],
    ABCEFGHL: ['3H', '3G', '3B', '3C', '3A', '3F', '3L', '3E'],
    ABCEFGHK: ['3H', '3G', '3B', '3C', '3A', '3F', '3E', '3K'],
    ABCEFGHJ: ['3H', '3G', '3B', '3C', '3A', '3F', '3E', '3J'],
    ABCEFGHI: ['3H', '3G', '3B', '3C', '3A', '3F', '3E', '3I'],
    ABCDIJKL: ['3I', '3J', '3B', '3C', '3A', '3D', '3L', '3K'],
    ABCDHJKL: ['3H', '3J', '3B', '3C', '3A', '3D', '3L', '3K'],
    ABCDHIKL: ['3H', '3I', '3B', '3C', '3A', '3D', '3L', '3K'],
    ABCDHIJL: ['3H', '3J', '3B', '3C', '3A', '3D', '3L', '3I'],
    ABCDHIJK: ['3H', '3J', '3B', '3C', '3A', '3D', '3I', '3K'],
    ABCDGJKL: ['3C', '3J', '3B', '3D', '3A', '3G', '3L', '3K'],
    ABCDGIKL: ['3I', '3G', '3B', '3C', '3A', '3D', '3L', '3K'],
    ABCDGIJL: ['3C', '3J', '3B', '3D', '3A', '3G', '3L', '3I'],
    ABCDGIJK: ['3C', '3J', '3B', '3D', '3A', '3G', '3I', '3K'],
    ABCDGHKL: ['3H', '3G', '3B', '3C', '3A', '3D', '3L', '3K'],
    ABCDGHJL: ['3H', '3G', '3B', '3C', '3A', '3D', '3L', '3J'],
    ABCDGHJK: ['3H', '3G', '3B', '3C', '3A', '3D', '3J', '3K'],
    ABCDGHIL: ['3H', '3G', '3B', '3C', '3A', '3D', '3L', '3I'],
    ABCDGHIK: ['3H', '3G', '3B', '3C', '3A', '3D', '3I', '3K'],
    ABCDGHIJ: ['3H', '3G', '3B', '3C', '3A', '3D', '3I', '3J'],
    ABCDFJKL: ['3C', '3J', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABCDFIKL: ['3C', '3I', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABCDFIJL: ['3C', '3J', '3B', '3D', '3A', '3F', '3L', '3I'],
    ABCDFIJK: ['3C', '3J', '3B', '3D', '3A', '3F', '3I', '3K'],
    ABCDFHKL: ['3H', '3F', '3B', '3C', '3A', '3D', '3L', '3K'],
    ABCDFHJL: ['3C', '3J', '3B', '3D', '3A', '3F', '3L', '3H'],
    ABCDFHJK: ['3H', '3J', '3B', '3C', '3A', '3F', '3D', '3K'],
    ABCDFHIL: ['3H', '3F', '3B', '3C', '3A', '3D', '3L', '3I'],
    ABCDFHIK: ['3H', '3F', '3B', '3C', '3A', '3D', '3I', '3K'],
    ABCDFHIJ: ['3H', '3J', '3B', '3C', '3A', '3F', '3D', '3I'],
    ABCDFGKL: ['3C', '3G', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABCDFGJL: ['3C', '3G', '3B', '3D', '3A', '3F', '3L', '3J'],
    ABCDFGJK: ['3C', '3G', '3B', '3D', '3A', '3F', '3J', '3K'],
    ABCDFGIL: ['3C', '3G', '3B', '3D', '3A', '3F', '3L', '3I'],
    ABCDFGIK: ['3C', '3G', '3B', '3D', '3A', '3F', '3I', '3K'],
    ABCDFGIJ: ['3C', '3G', '3B', '3D', '3A', '3F', '3I', '3J'],
    ABCDFGHL: ['3C', '3G', '3B', '3D', '3A', '3F', '3L', '3H'],
    ABCDFGHK: ['3H', '3G', '3B', '3C', '3A', '3F', '3D', '3K'],
    ABCDFGHJ: ['3H', '3G', '3B', '3C', '3A', '3F', '3D', '3J'],
    ABCDFGHI: ['3H', '3G', '3B', '3C', '3A', '3F', '3D', '3I'],
    ABCDEJKL: ['3E', '3J', '3B', '3C', '3A', '3D', '3L', '3K'],
    ABCDEIKL: ['3E', '3I', '3B', '3C', '3A', '3D', '3L', '3K'],
    ABCDEIJL: ['3E', '3J', '3B', '3C', '3A', '3D', '3L', '3I'],
    ABCDEIJK: ['3E', '3J', '3B', '3C', '3A', '3D', '3I', '3K'],
    ABCDEHKL: ['3H', '3E', '3B', '3C', '3A', '3D', '3L', '3K'],
    ABCDEHJL: ['3H', '3J', '3B', '3C', '3A', '3D', '3L', '3E'],
    ABCDEHJK: ['3H', '3J', '3B', '3C', '3A', '3D', '3E', '3K'],
    ABCDEHIL: ['3H', '3E', '3B', '3C', '3A', '3D', '3L', '3I'],
    ABCDEHIK: ['3H', '3E', '3B', '3C', '3A', '3D', '3I', '3K'],
    ABCDEHIJ: ['3H', '3J', '3B', '3C', '3A', '3D', '3E', '3I'],
    ABCDEGKL: ['3E', '3G', '3B', '3C', '3A', '3D', '3L', '3K'],
    ABCDEGJL: ['3E', '3G', '3B', '3C', '3A', '3D', '3L', '3J'],
    ABCDEGJK: ['3E', '3G', '3B', '3C', '3A', '3D', '3J', '3K'],
    ABCDEGIL: ['3E', '3G', '3B', '3C', '3A', '3D', '3L', '3I'],
    ABCDEGIK: ['3E', '3G', '3B', '3C', '3A', '3D', '3I', '3K'],
    ABCDEGIJ: ['3E', '3G', '3B', '3C', '3A', '3D', '3I', '3J'],
    ABCDEGHL: ['3H', '3G', '3B', '3C', '3A', '3D', '3L', '3E'],
    ABCDEGHK: ['3H', '3G', '3B', '3C', '3A', '3D', '3E', '3K'],
    ABCDEGHJ: ['3H', '3G', '3B', '3C', '3A', '3D', '3E', '3J'],
    ABCDEGHI: ['3H', '3G', '3B', '3C', '3A', '3D', '3E', '3I'],
    ABCDEFKL: ['3C', '3E', '3B', '3D', '3A', '3F', '3L', '3K'],
    ABCDEFJL: ['3C', '3J', '3B', '3D', '3A', '3F', '3L', '3E'],
    ABCDEFJK: ['3C', '3J', '3B', '3D', '3A', '3F', '3E', '3K'],
    ABCDEFIL: ['3C', '3E', '3B', '3D', '3A', '3F', '3L', '3I'],
    ABCDEFIK: ['3C', '3E', '3B', '3D', '3A', '3F', '3I', '3K'],
    ABCDEFIJ: ['3C', '3J', '3B', '3D', '3A', '3F', '3E', '3I'],
    ABCDEFHL: ['3H', '3F', '3B', '3C', '3A', '3D', '3L', '3E'],
    ABCDEFHK: ['3H', '3E', '3B', '3C', '3A', '3F', '3D', '3K'],
    ABCDEFHJ: ['3H', '3J', '3B', '3C', '3A', '3F', '3D', '3E'],
    ABCDEFHI: ['3H', '3E', '3B', '3C', '3A', '3F', '3D', '3I'],
    ABCDEFGL: ['3C', '3G', '3B', '3D', '3A', '3F', '3L', '3E'],
    ABCDEFGK: ['3C', '3G', '3B', '3D', '3A', '3F', '3E', '3K'],
    ABCDEFGJ: ['3C', '3G', '3B', '3D', '3A', '3F', '3E', '3J'],
    ABCDEFGI: ['3C', '3G', '3B', '3D', '3A', '3F', '3E', '3I'],
    ABCDEFGH: ['3H', '3G', '3B', '3C', '3A', '3F', '3D', '3E'],
  };

  /**
   * @param {string[]} grupos - Array de 8 letras (A-L)
   * @returns {Object} Asignaciones por partido
   */

  // ─── EJEMPLOS ────────────────────────────────────────────────────────────────

  // Ejemplo: terceros de L, C, B, H, E, G, F, D

  function asignar_terceros(clasificados) {
    const key = clasificados
      .map((g) => g.toUpperCase())
      .sort()
      .join('');
    if (!TABLA[key]) throw new Error(`Combinación no encontrada: ${key}`);
    const [P79, P85, P81, P74, P82, P77, P87, P80] = TABLA[key];
    return { P74, P77, P79, P80, P81, P82, P85, P87 };
  }

  const PARTIDOS_GRUPOS = {
    ABCDF: 'P74',
    CDFGH: 'P77',
    CEFHI: 'P79',
    EHIJK: 'P80',
    BEFIJ: 'P81',
    AEHIJ: 'P82',
    EFGIJ: 'P85',
    DEIJL: 'P87',
  };

  function mejor_tercero(gruposPosibles, clasificados) {
    const resultado = nombre_torneo.includes('Mundial 2026') ? asignar_terceros(clasificados) : '';
    const partido = PARTIDOS_GRUPOS[gruposPosibles];
    return resultado[partido];
  }

  /* console.log(mejor_tercero('ABCDF', mejores_terceros))
  console.log(mejor_tercero('CDFGH', mejores_terceros))
  console.log(mejor_tercero('BEFIJ', mejores_terceros))
  console.log(mejor_tercero('AEHIJ', mejores_terceros))
  console.log(mejor_tercero('CEFHI', mejores_terceros))
  console.log(mejor_tercero('EHIJK', mejores_terceros))
  console.log(mejor_tercero('EFGIJ', mejores_terceros))
  console.log(mejor_tercero('DEIJL', mejores_terceros)) */

  const clasificados = ['L', 'C', 'B', 'H', 'E', 'G', 'F', 'D'];
  console.log(clasificados);
  console.log(mejores_terceros);

  // Probamos asignar_terceros directamente
  /* console.log(asignar_terceros(clasificados)); */
  // Debería dar: { P74: '3D', P77: '3F', P79: '3C', P80: '3E', P81: '3B', P82: '3H', P85: '3G', P87: '3L' }

  // Probamos mejor_tercero
  /* console.log(mejor_tercero('ABCDF', clasificados)); */
  // Debería dar: '3D'

  let playoffs_spots = {}
  if (grupos > 1) {

    playoffs_spots = {
      ['Mundial 2014']: {
        '1A': [0, 0],
        '2B': [0, 1],
        '1C': [1, 0],
        '2D': [1, 1],
        '1E': [2, 0],
        '2F': [2, 1],
        '1G': [3, 0],
        '2H': [3, 1],
        '1B': [4, 0],
        '2A': [4, 1],
        '1D': [5, 0],
        '2C': [5, 1],
        '1F': [6, 0],
        '2E': [6, 1],
        '1H': [7, 0],
        '2G': [7, 1],
      },
      ['Mundial 2026']: {
        '1E': [0, 0],
        [mejor_tercero('ABCDF', mejores_terceros)]: [0, 1],
        
        '1I': [1, 0],
        [mejor_tercero('CDFGH', mejores_terceros)]: [1, 1],
        
        '2A': [2, 0],
        '2B': [2, 1],
        
        '1F': [3, 0],
        '2C': [3, 1],
        
        '2K': [4, 0],
        '2L': [4, 1],
        
        '1H': [5, 0],
        '2J': [5, 1],
        
        '1D': [6, 0],
        [mejor_tercero('BEFIJ', mejores_terceros)]: [6, 1],
        
        '1G': [7, 0],
        [mejor_tercero('AEHIJ', mejores_terceros)]: [7, 1],
        
        '1C': [8, 0],
        '2F': [8, 1],
        
        '2E': [9, 0],
        '2I': [9, 1],
        
        '1A': [10, 0],
        [mejor_tercero('CEFHI', mejores_terceros)]: [10, 1],
        
        '1L': [11, 0],
        [mejor_tercero('EHIJK', mejores_terceros)]: [11, 1],
        
        '1J': [12, 0],
        '2H': [12, 1],
        
        '2D': [13, 0],
        '2G': [13, 1],
        
        '1B': [14, 0],
        [mejor_tercero('EFGIJ', mejores_terceros)]: [14, 1],
        
        '1K': [15, 0],
        [mejor_tercero('DEIJL', mejores_terceros)]: [15, 1],
      },
      ['Apertura 2025']: {
        "1A": [0, 0],
        "8B": [0, 1],
        
        "2A": [1, 0],
        "7B": [1, 1],
        
        "3A": [2, 0],
        "6B": [2, 1],
        
        "4A": [3, 0],
        "5B": [3, 1],
        
        "5A": [4, 0],
        "4B": [4, 1],
        
        "6A": [5, 0],
        "3B": [5, 1],
        
        "7A": [6, 0],
        "2B": [6, 1],
        
        "8A": [7, 0],
        "1B": [7, 1],
      },
      Sudamericana: {
        '1A': [0, 0],
        '2B': [0, 1],
        '1C': [1, 0],
        '2D': [1, 1],
        '1E': [2, 0],
        '2F': [2, 1],
        '1G': [3, 0],
        '2H': [3, 1],
        '1B': [4, 0],
        '2A': [4, 1],
        '1D': [5, 0],
        '2C': [5, 1],
        '1F': [6, 0],
        '2E': [6, 1],
    '1H': [7, 0],
    '2G': [7, 1],
    },
    Libertadores: {
      '1A': [0, 0],
      '2B': [0, 1],
      '1C': [1, 0],
      '2D': [1, 1],
      '1E': [2, 0],
      '2F': [2, 1],
      '1G': [3, 0],
      '2H': [3, 1],
      '1B': [4, 0],
      '2A': [4, 1],
      '1D': [5, 0],
      '2C': [5, 1],
      '1F': [6, 0],
      '2E': [6, 1],
      '1H': [7, 0],
      '2G': [7, 1],
    }
  };
}
  
  /* let positions_playoffs = {
    '1A': [0, 0],
    '2B': [0, 1],
    '1C': [1, 0],
    '2D': [1, 1],
    '1E': [2, 0],
    '2F': [2, 1],
    '1G': [3, 0],
    '2H': [3, 1],
    '1B': [4, 0],
    '2A': [4, 1],
    '1D': [5, 0],
    '2C': [5, 1],
    '1F': [6, 0],
    '2E': [6, 1],
    '1H': [7, 0],
    '2G': [7, 1],
  }; */

  /* let positions_playoffs = {
    '1E': [0, 0],
    '3A': [0, 1], //

    '1I': [1, 0],
    '3B': [1, 1], //

    '2A': [2, 0],
    '2B': [2, 1],

    '1F': [3, 0],
    '2C': [3, 1],

    '2K': [4, 0],
    '2L': [4, 1],

    '1H': [5, 0],
    '2J': [5, 1],

    '1D': [6, 0],
    '3C': [6, 1],//

    '1G': [7, 0],
    '3D': [7, 1],//

    '1C': [8, 0],
    '2F': [8, 1],

    '2E': [9, 0],
    '2I': [9, 1],

    '1A': [10, 0],
    '3F': [10, 1],//

    '1L': [11, 0],
    '3G': [11, 1],//

    '1J': [12, 0],
    '2H': [12, 1],

    '2D': [13, 0],
    '2G': [13, 1],

    '1B': [14, 0],
    '3H': [14, 1],//
    
    '1K': [15, 0],
    '3J': [15, 1],//
  }; */

  /* let positions_playoffs = {
    "1A": [0, 0],
    "2B": [0, 1],
    "1C": [1, 0],
    "2D": [1, 1],
    "1E": [2, 0],
    "2F": [2, 1],
    "1G": [3, 0],
    "2H": [3, 1],
    "1B": [4, 0],
    "2A": [4, 1],
    "1D": [5, 0],
    "2C": [5, 1],
    "1F": [6, 0],
    "2E": [6, 1],
    "1H": [7, 0],
    "2G": [7, 1],
    }; */

  let positions_playoffs = playoffs_spots[competencia];
  console.log(positions_playoffs);

  /* let positions_playoffs = {
    "1A": [0, 0],
    "8B": [0, 1],

    "2A": [1, 0],
    "7B": [1, 1],

    "3A": [2, 0],
    "6B": [2, 1],

    "4A": [3, 0],
    "5B": [3, 1],

    "5A": [4, 0],
    "4B": [4, 1],

    "6A": [5, 0],
    "3B": [5, 1],

    "7A": [6, 0],
    "2B": [6, 1],

    "8A": [7, 0],
    "1B": [7, 1],
  }; */

  /* let positions_playoffs = {
      '1A': [0, 0],
      '1B': [0, 1],
      '1C': [1, 0],
      '1D': [1, 1],
      '1E': [2, 0],
      '1F': [2, 1],
      '1G': [3, 0],
      '1H': [3, 1],
    } */

  let positions_playoffs4 = {
    0: [0, 0],
    1: [0, 1],
    2: [1, 0],
    3: [1, 1],
    4: [2, 0],
    5: [2, 1],
    6: [3, 0],
    7: [3, 1],
    8: [4, 0],
    9: [4, 1],
    10: [5, 0],
    11: [5, 1],
    12: [6, 0],
    13: [6, 1],
    14: [7, 0],
    15: [7, 1],
  };

  let positions_playoffs2 = {
    0: [0, 0],
    1: [0, 1],
    2: [1, 0],
    3: [1, 1],
    4: [2, 0],
    5: [2, 1],
    6: [3, 0],
    7: [3, 1],
  };

  let positions_playoffs1 = {
    0: [0, 0],
    1: [0, 1],
    2: [1, 0],
    3: [1, 1],
  };

  let positions_playoffs_final = {
    0: [0, 0],
    1: [0, 1],
  };

  // Las rondas siguientes se generan automáticamente:
  // ganador[i] vs ganador[i+1], con i par

  console.log(fechas_playoff[0]);

  console.log(names_playoffs_1[0] !== 'undefined');
  /* let clasificados = yearSlice.filter(d => d.rankInGroup < clasificacion_por_grupo && d.final).slice(0, 32)
  console.log(clasificados) */
  /* fechas_playoff.filter(d => d.fecha == 'Fecha 1/8').forEach((d, i) => {
    Object.assign(d, { position_local: clasificados[i].position });
    Object.assign(d, { position_visitante: clasificados[i+i].position });
  }) */

  /* Object.keys(positions_playoffs).forEach((d, i) => {
    if (i % 2 == 0){
      console.log('par', d)
    } else {
      console.log('impar', d)
    }
  }) */

  fechas_playoff.forEach((d, i) => {
    let filter = yearSlice.filter((e) => e.name == d.local)[0];
    let filter1 = yearSlice.filter((e) => e.name == d.visitante)[0];

    if (names_playoffs_1[0] !== 'undefined') {
      Object.assign(d, { position_local: filter.position });
      Object.assign(d, { position_visitante: filter1.position });
    }
  });

  let yPlayoffs = d3.scaleLinear().range([height + heightBars / 2, margin.top + heightBars / 2]);

  let wks = 0;

  let rondas = [1, 2, 4, 8, 16];
  let arr = ['local', 'visitante'];
  let arr_w = [5, 3, 1.75, 1];
  if (grupos > 1 && names_playoffs_1[0] !== 'undefined') {
    rondas.forEach((pp, ppi) => {
      svg
        .append('text')
        .attrs({
          class: 'years',
          x: width - (width_playoffs * (rondas_playoff - ppi) + space_width_playoff * (rondas_playoff - ppi)) + width_playoffs / 2,
          y: margin.top * 0.8,
        })
        .styles({
          'font-size': heightBars * 0.4,
          fill: '#f1f1f1',
          'font-weight': 600,
          'text-anchor': 'middle',
          'alignment-baseline': 'central',
        })
        .text(playoffs_names[primera_ronda_playoff / pp]);

      /* svg
        .append('rect')
        .attrs({
          class: 'years',
          x: width - (width_playoffs * (rondas_playoff - ppi) + space_width_playoff * (rondas_playoff - ppi)) + width_playoffs / 2 - width_playoffs/2,
          y: margin.top,
          height: height,
          width: width_playoffs,
        })
        .styles({
          fill: 'grey',
          opacity: 0.1
        }) */
    });

    /* let names_playoffs_1 = [...new Set(fechas_playoff.map((d) => d.local || d.visitante))];
    let dates_playoffs_1 = [...new Set(fechas_playoff.map((d) => d.fecha))];

    console.log(names_playoffs_1, dates_playoffs_1);

    let x_Playoffs = d3.scaleLinear().domain([0, 4]).range([width/2, width]);

    let y_Playoffs = d3
      .scaleLinear()
      .domain([names_playoffs_1.length, 0])
      .range([height, margin.top]);

      const strokeWidthBase = (heightBars * 0.35) / 7 * 5;

      const capas = [
        { colorIdx: 0, width: strokeWidthBase * 5 },
        { colorIdx: 1, width: strokeWidthBase * 3 },
        { colorIdx: 2, width: strokeWidthBase * 1.75 },
        { colorIdx: 3, width: strokeWidthBase },
      ];

      const pathLine = d3.line().curve(d3.curveCardinal.tension(1));

    names_playoffs_1
    .forEach((nombre, i) => {
      let wks = 0;
      const points = [];
      const club = nombre.split('-')[0];

      dates_playoffs_1.forEach((o) => {
        const yearSlice1 = fechas_playoff.filter((d) => d.fecha == o);
        console.log(yearSlice1)
        const rank1 = yearSlice1.find((d) => d.local == nombre || d.visitante == nombre)
        console.log(rank1)
        const diff = rank1?.goles_local - rank1?.goles_visitante;
        const ganoLocal = diff > 0 || (diff === 0 && rank1.penales_local > rank1.penales_visitante);

        ganoLocal ? wks++ : '';

        points.push([x_Playoffs(wks), y_Playoffs(i)]);
      });

      const pathD = pathLine(points);

      capas.forEach(({ colorIdx, width }) => {
        svg.append('path')
          .attrs({
            transform: `translate(${margin_left * 2}, 0)`,
            class: 'line',
          })
          .styles({
            fill: 'none',
            stroke: colores(club)[colorIdx],
            'stroke-width': width,
            'stroke-linejoin': 'round',
          })
          .attr('d', pathD);
      });
    }); */

    arr.forEach((dd) => {
      arr_w.forEach((ee, ii) => {
        svg
          .selectAll('.path')
          .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
          .enter()
          .append('path')
          .attrs({
            class: 'line',
          })
          .styles({
            opacity: function (d) {
              const local = parseScore(d.goles_local);
              const visitante = parseScore(d.goles_visitante);

              const ganoLocal = local.goles > visitante.goles || (local.goles === visitante.goles && local.penales > visitante.penales);

              const esLocal = dd === 'local';
              return ganoLocal === esLocal ? 1 : 0;
            },
            fill: 'none',
            stroke: (d) => colores(d[dd].split('-')[0])[ii],
            'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
            'stroke-linejoin': 'round',
          })
          .attr('d', (d) =>
            d3.line().curve(d3.curveStep)([
              [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff, yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff)],
              [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs, yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff)],
            ])
          );

        svg
          .selectAll('.path')
          .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
          .enter()
          .append('path')
          .attrs({
            class: 'line',
          })
          .styles({
            opacity: function (d) {
              const local = parseScore(d.goles_local);
              const visitante = parseScore(d.goles_visitante);

              const ganoLocal = local.goles > visitante.goles || (local.goles === visitante.goles && local.penales > visitante.penales);

              const esLocal = dd === 'local';
              return ganoLocal === esLocal ? 1 : 0;
            },
            fill: 'none',
            stroke: (d) => colores(d[dd].split('-')[0])[ii],
            'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
            'stroke-linejoin': 'round',
          })
          .attr('d', (d) =>
            d3.line().curve(d3.curveStep)([
              [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff, yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff)],
              [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff / 3, yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff)],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff - space_width_playoff / 3,
                yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
              ],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff + width_playoffs,
                yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
              ],
            ])
          );

        if (primera_ronda_playoff >= 4) {
          svg
            .selectAll('.path')
            .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 2}`))
            .enter()
            .append('path')
            .attrs({
              class: 'line',
            })
            .styles({
              opacity: function (d) {
                const local = parseScore(d.goles_local);
                const visitante = parseScore(d.goles_visitante);

                const ganoLocal = local.goles > visitante.goles || (local.goles === visitante.goles && local.penales > visitante.penales);

                const esLocal = dd === 'local';
                return ganoLocal === esLocal ? 1 : 0;
              },
              fill: 'none',
              stroke: (d) => colores(d[dd].split('-')[0])[ii],
              'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
              'stroke-linejoin': 'round',
            })
            .attr('d', (d) =>
              d3.line().curve(d3.curveStep)([
                [
                  width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff,
                  yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
                ],
                [
                  width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff + width_playoffs + space_width_playoff / 3,
                  yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
                ],
                [
                  width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 2 + width_playoffs - space_width_playoff / 3,
                  yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
                ],
                [
                  width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 2 + width_playoffs * 2,
                  yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
                ],
              ])
            );
        }

        if (primera_ronda_playoff >= 8) {
          svg
            .selectAll('.path')
            .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 4}`))
            .enter()
            .append('path')
            .attrs({
              class: 'line',
            })
            .styles({
              opacity: function (d) {
                const local = parseScore(d.goles_local);
                const visitante = parseScore(d.goles_visitante);

                const ganoLocal = local.goles > visitante.goles || (local.goles === visitante.goles && local.penales > visitante.penales);

                const esLocal = dd === 'local';
                return ganoLocal === esLocal ? 1 : 0;
              },
              fill: 'none',
              stroke: (d) => colores(d[dd].split('-')[0])[ii],
              'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
              'stroke-linejoin': 'round',
            })
            .attr('d', (d) =>
              d3.line().curve(d3.curveStep)([
                [
                  width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 2 + width_playoffs,
                  yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
                ],
                [
                  width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 2 + width_playoffs * 2 + space_width_playoff / 3,
                  yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
                ],
                [
                  width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 3 + width_playoffs * 2 - space_width_playoff / 3,
                  yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
                ],
                [
                  width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 3 + width_playoffs * 3,
                  yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
                ],
              ])
            );
        }

        if (primera_ronda_playoff >= 16) {
          svg
            .selectAll('.path')
            .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 8}`))
            .enter()
            .append('path')
            .attrs({
              class: 'line',
            })
            .styles({
              opacity: function (d) {
                const local = parseScore(d.goles_local);
                const visitante = parseScore(d.goles_visitante);

                const ganoLocal = local.goles > visitante.goles || (local.goles === visitante.goles && local.penales > visitante.penales);

                const esLocal = dd === 'local';
                return ganoLocal === esLocal ? 1 : 0;
              },
              fill: 'none',
              stroke: (d) => colores(d[dd].split('-')[0])[ii],
              'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
              'stroke-linejoin': 'round',
            })
            .attr('d', (d) =>
              d3.line().curve(d3.curveStep)([
                [
                  width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 2 + width_playoffs,
                  yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1][0]] == 0 ? -space_height_playoff : space_height_playoff),
                ],
                [
                  width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 2 + width_playoffs * 2 + space_width_playoff / 3,
                  yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1][0]] == 0 ? -space_height_playoff : space_height_playoff),
                ],
                [
                  width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 3 + width_playoffs * 2 - space_width_playoff / 3,
                  yPlayoffs.domain([primera_ronda_playoff / 16, 0])(positions_playoffs_final[positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]][0]) +
                    (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 8) -
                    heightBars / 2 +
                    (positions_playoffs_final[positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
                ],
                [
                  width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 3 + width_playoffs * 3,
                  yPlayoffs.domain([primera_ronda_playoff / 16, 0])(positions_playoffs_final[positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]][0]) +
                    (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 8) -
                    heightBars / 2 +
                    (positions_playoffs_final[positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
                ],
              ])
            );
        }
      });
    });

    // 1. Definir el filtro en el <defs> del SVG
    const defs = svg.append('defs');

    const filter = defs.append('filter').attr('id', 'shadow-top');

    filter
      .append('feDropShadow')
      .attr('dx', 0) // sin desplazamiento horizontal
      .attr('dy', -4) // negativo = hacia arriba
      .attr('stdDeviation', 4) // blur
      .attr('flood-color', 'black')
      .attr('flood-opacity', 0.4);

    // 2. Aplicarlo al rectángulo
    /* svg.append("rect")
  .attr("filter", "url(#shadow-top)");

  svg.append("rect")
  .attr("x", 0).attr("y", 0)
  .attr("width", width).attr("height", height)
  .attr("fill", "black")
  .attr("opacity", 0.15)
  .attr("pointer-events", "none"); // para que no interfiera con eventos */

    /* svg
        .selectAll('.rect')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
        .enter()
        .append('rect')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff,
          y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(1) + (top_n * heightBars + grupos * heightBars/2) / primera_ronda_playoff / 2 - 10/2,
          width: width,
          height: 10,
        })
        .styles({
          fill: 'grey'
        }) */

    arr.forEach((dd) => {
      /* svg
        .selectAll('.rect')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
        .enter()
        .append('rect')
        .style('filter', 'url(#dropshadow)')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars + grupos * heightBars/2) / primera_ronda_playoff / 2 - heightBars/2 - 10/2,
          width: width_playoffs,
          height: 10,

        })
        .styles({
          fill: 'red'
        }) */

      svg
        .selectAll('.rect')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
        .enter()
        .append('rect')
        .style('filter', 'url(#dropshadow)')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
          width: width_playoffs,
          height: heightBars,
        })
        /* .attr("style", d => `outline: 5px solid ${colores(d[dd].split('-')[0])[0]}`) */
        .styles({
          fill: function (d) {
            const local = parseScore(d.goles_local);
            const visitante = parseScore(d.goles_visitante);

            const ganoLocal = local.goles > visitante.goles || (local.goles === visitante.goles && local.penales > visitante.penales);

            const esLocal = dd === 'local';
            return ganoLocal === esLocal ? '#d4d4d4' : '#b6b6b6';
          },
        });

      svg
        .selectAll('.rect')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 2}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('rect')
        .style('filter', 'url(#dropshadow)')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 2 + width_playoffs,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
          width: width_playoffs,
          height: heightBars,
        })
        .styles({
          fill: function (d) {
            const local = parseScore(d.goles_local);
            const visitante = parseScore(d.goles_visitante);

            const ganoLocal = local.goles > visitante.goles || (local.goles === visitante.goles && local.penales > visitante.penales);

            const esLocal = dd === 'local';
            return ganoLocal === esLocal ? '#d4d4d4' : '#b6b6b6';
          },
        });

      /* svg
        .selectAll('.rect')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 4}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('rect')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 1,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars + grupos * heightBars/2) / (primera_ronda_playoff / 2) - heightBars / 2 - 20 / 2,
          width: space_width_playoff * 3 + width_playoffs * 0.5,
          height: 20,
        })
        .styles({
          fill: function(d) {
              const local = parseScore(d.goles_local);
              const visitante = parseScore(d.goles_visitante);

              const ganoLocal =
                local.goles > visitante.goles ||
                (local.goles === visitante.goles && local.penales > visitante.penales);

              const esLocal = dd === 'local';
              return ganoLocal === esLocal ? '#d4d4d4' : '#b6b6b6';
            },
        }) */

      svg
        .selectAll('.rect')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 4}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('rect')
        .style('filter', 'url(#dropshadow)')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 3 + width_playoffs * 2,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
          width: width_playoffs,
          height: heightBars,
        })
        .styles({
          fill: function (d) {
            const local = parseScore(d.goles_local);
            const visitante = parseScore(d.goles_visitante);

            const ganoLocal = local.goles > visitante.goles || (local.goles === visitante.goles && local.penales > visitante.penales);

            const esLocal = dd === 'local';
            return ganoLocal === esLocal ? '#d4d4d4' : '#b6b6b6';
          },
        });

      /* svg
        .selectAll('.rect')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 8}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('rect')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 1,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars + grupos * heightBars/2) / (primera_ronda_playoff / 4) - heightBars / 2 - 20 / 2,
          width: space_width_playoff * 4 + width_playoffs * 1.5,
          height: 20,
        })
        .styles({
          fill: function(d) {
              const local = parseScore(d.goles_local);
              const visitante = parseScore(d.goles_visitante);

              const ganoLocal =
                local.goles > visitante.goles ||
                (local.goles === visitante.goles && local.penales > visitante.penales);

              const esLocal = dd === 'local';
              return ganoLocal === esLocal ? '#d4d4d4' : '#b6b6b6';
            },
        }) */

      svg
        .selectAll('.rect')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 8}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('rect')
        .style('filter', 'url(#dropshadow)')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 4 + width_playoffs * 3,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
          width: width_playoffs,
          height: heightBars,
        })
        .styles({
          fill: function (d) {
            const local = parseScore(d.goles_local);
            const visitante = parseScore(d.goles_visitante);

            const ganoLocal = local.goles > visitante.goles || (local.goles === visitante.goles && local.penales > visitante.penales);

            const esLocal = dd === 'local';
            return ganoLocal === esLocal ? '#d4d4d4' : '#b6b6b6';
          },
        });

      svg
        .selectAll('.text')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
        .enter()
        .append('text')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + heightBars * 1.2,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff),
        })
        .styles({
          opacity: function (d) {
            const local = parseScore(d.goles_local);
            const visitante = parseScore(d.goles_visitante);

            const ganoLocal = local.goles > visitante.goles || (local.goles === visitante.goles && local.penales > visitante.penales);

            const esLocal = dd === 'local';
            return ganoLocal === esLocal ? 1 : 0.5;
          },
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': defaults.name.style.text_anchor,
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text((d) => d[dd].split('-')[0]);

      svg
        .selectAll('.image')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
        .enter()
        .append('image')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + heightBars * 0.5 - defaults.logo.size / 2,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff) - defaults.logo.size / 2,
          height: defaults.logo.size,
          href: (d) => `./escudos/${d[dd].split('-')[0]}.png`,
          opacity: function (d) {
            const local = parseScore(d.goles_local);
            const visitante = parseScore(d.goles_visitante);

            const ganoLocal = local.goles > visitante.goles || (local.goles === visitante.goles && local.penales > visitante.penales);

            const esLocal = dd === 'local';
            return ganoLocal === esLocal ? 1 : 0.5;
          },
        })
        .style('filter', 'url(#dropshadow)');

      svg
        .selectAll('.text')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
        .enter()
        .append('text')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs * 0.875,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size * 1.5,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': 'middle',
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text((d) => d['goles_' + dd] + (d['penales_' + dd] >= 0 ? ' [' + d['penales_' + dd] + ']' : ''));

      svg
        .selectAll('.text')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 2}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('text')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 2 + width_playoffs + heightBars * 1.2,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': defaults.name.style.text_anchor,
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text((d) => d[dd].split('-')[0]);

      svg
        .selectAll('.image')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 2}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('image')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 2 + width_playoffs + heightBars * 0.5 - defaults.logo.size / 2,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - defaults.logo.size / 2,
          height: defaults.logo.size,
          href: (d) => `./escudos/${d[dd].split('-')[0]}.png`,
        })
        .style('filter', 'url(#dropshadow)');

      svg
        .selectAll('.text')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 2}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('text')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 2 + width_playoffs + width_playoffs * 0.875,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size * 1.5,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': 'middle',
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text((d) => d['goles_' + dd] + (d['penales_' + dd] >= 0 ? ' [' + d['penales_' + dd] + ']' : ''));

      svg
        .selectAll('.text')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 4}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('text')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 3 + width_playoffs * 2 + heightBars * 1.2,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': defaults.name.style.text_anchor,
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text((d) => d[dd].split('-')[0]);

      svg
        .selectAll('.image')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 4}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('image')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 3 + width_playoffs * 2 + heightBars * 0.5 - defaults.logo.size / 2,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - defaults.logo.size / 2,
          height: defaults.logo.size,
          href: (d) => `./escudos/${d[dd].split('-')[0]}.png`,
        })
        .style('filter', 'url(#dropshadow)');

      svg
        .selectAll('.text')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 4}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('text')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 3 + width_playoffs * 2 + width_playoffs * 0.875,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size * 1.5,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': 'middle',
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text((d) => d['goles_' + dd] + (d['penales_' + dd] >= 0 ? ' [' + d['penales_' + dd] + ']' : ''));

      svg
        .selectAll('.text')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 8}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('text')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 4 + width_playoffs * 3 + heightBars * 1.2,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': defaults.name.style.text_anchor,
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text((d) => d[dd].split('-')[0]);

      svg
        .selectAll('.image')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 8}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('image')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 4 + width_playoffs * 3 + heightBars * 0.5 - defaults.logo.size / 2,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - defaults.logo.size / 2,
          height: defaults.logo.size,
          href: (d) => `./escudos/${d[dd].split('-')[0]}.png`,
        })
        .style('filter', 'url(#dropshadow)');

      svg
        .selectAll('.text')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 8}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('text')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 4 + width_playoffs * 3 + width_playoffs * 0.875,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size * 1.5,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': 'middle',
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text((d) => d['goles_' + dd] + (d['penales_' + dd] >= 0 ? ' [' + d['penales_' + dd] + ']' : ''));

      /* svg.append("rect")
          .attr("filter", "url(#shadow-top)"); */

      /* svg.selectAll('.rect').data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
        .enter().append("rect")
          .attr("x", width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff).attr("y", (d) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars + grupos * heightBars/2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars/2)
          .attr("width", width_playoffs).attr("height", heightBars)
          .attr("fill", "black")
          .attr("opacity", function fill(d) {
            const diff = d.goles_local - d.goles_visitante;
            const ganoLocal = diff > 0 || (diff === 0 && d.penales_local > d.penales_visitante);
            const esLocal = dd === 'local';

            return ganoLocal === esLocal ? 0 : 0.5;
          })
          .attr("pointer-events", "none"); // para que no interfiera con eventos */
    });

    /* yearSlice.forEach(d => {
      d.rankInGroup <= 1 && d.fecha == '' ? d.fecha = 'Fecha 1/8' : ''
    }) */

    /* if (fechas_playoff.length == 0) {
      svg
        .selectAll(".image")
        .data(
          yearSlice.filter(
            (d, i) =>
              (d.rankInGroup >= 0 &&
                d.rankInGroup <= clasificacion_por_grupo - 1) ||
              (d.rankInGroup >= equipos_por_grupos &&
                d.rankInGroup <=
                  equipos_por_grupos + clasificacion_por_grupo - 1),
          ),
        )
        .enter()
        .append("image")
        .attrs({
          class: "playoffs_names",
          x:
            width -
            (width_playoffs * rondas_playoff +
              space_width_playoff * rondas_playoff +
              space_width_playoff) +
            space_width_playoff +
            heightBars * 0.5 -
            defaults.logo.size / 2,
          y: (d, i) =>
            yPlayoffs.domain([primera_ronda_playoff, 0])(
              positions_playoffs[d.rankInGroup + 1 + d.name.split("-")[1]][0],
            ) +
            (top_n * heightBars) / primera_ronda_playoff / 2 -
            heightBars / 2 +
            (positions_playoffs[d.rankInGroup + 1 + d.name.split("-")[1]][1] ==
            0
              ? -space_height_playoff
              : space_height_playoff) -
            defaults.logo.size / 2,
          height: defaults.logo.size,
          href: (d) => `./escudos/${d.name.split("-")[0]}.png`,
        })
        .styles({
          opacity: 0.7,
        })
        .style("filter", "url(#dropshadow)");

      svg
        .selectAll(".text")
        .data(
          yearSlice.filter(
            (d, i) =>
              (d.rankInGroup >= 0 &&
                d.rankInGroup <= clasificacion_por_grupo - 1) ||
              (d.rankInGroup >= equipos_por_grupos &&
                d.rankInGroup <=
                  equipos_por_grupos + clasificacion_por_grupo - 1),
          ),
        )
        .enter()
        .append("text")
        .attrs({
          class: "playoffs_names",
          x:
            width -
            (width_playoffs * rondas_playoff +
              space_width_playoff * rondas_playoff +
              space_width_playoff) +
            space_width_playoff +
            heightBars * 1.2,
          y: (d, i) =>
            yPlayoffs.domain([primera_ronda_playoff, 0])(
              positions_playoffs[d.rankInGroup + 1 + d.name.split("-")[1]][0],
            ) +
            (top_n * heightBars) / primera_ronda_playoff / 2 -
            heightBars / 2 +
            (positions_playoffs[d.rankInGroup + 1 + d.name.split("-")[1]][1] ==
            0
              ? -space_height_playoff
              : space_height_playoff),
        })
        .styles({
          fill: defaults.name.style.fill,
          "font-size": defaults.name.style.font_size,
          "font-weight": defaults.name.style.font_weight,
          "text-anchor": defaults.name.style.text_anchor,
          "alignment-baseline": defaults.name.style.alignment_baseline,
          opacity: 0.7,
        })
        .text((d) => d.name.split("-")[0]);
    } */
  }

  if (grupos > 1 && /* names_playoffs_1[0] == 'undefined' */ simular_playoffs) {
    console.log(rondas_playoff);
    rondas.forEach((pp, ppi) => {
      svg
        .append('text')
        .attrs({
          class: 'years',
          x: width - (width_playoffs * (rondas_playoff - ppi) + space_width_playoff * (rondas_playoff - ppi)) + width_playoffs / 2,
          y: margin.top * 0.8,
        })
        .styles({
          'font-size': heightBars * 0.4,
          fill: '#f1f1f1',
          'font-weight': 600,
          'text-anchor': 'middle',
          'alignment-baseline': 'central',
        })
        .text(playoffs_names[primera_ronda_playoff / pp]);
    });

    /* svg
          .selectAll('.path')
          .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
          .enter()
          .append('path')
          .attrs({
            class: 'line',
          })
          .styles({
            fill: 'none',
            stroke: 'grey',
            'stroke-width': ((heightBars * 0.35) / 7) * 8,
            'stroke-linejoin': 'round',
          })
          .attr('d', (d, i) => d3.line().curve(d3.curveCardinal.tension(1))([
            [width -
            (width_playoffs * rondas_playoff +
              space_width_playoff * rondas_playoff +
              space_width_playoff) +
            space_width_playoff +
            heightBars * 0.5 -
            defaults.logo.size / 2,       yPlayoffs.domain([primera_ronda_playoff, 0])(i)+
            (top_n * heightBars) / primera_ronda_playoff / 2 -
            heightBars / 2],
            [width -
            (width_playoffs * rondas_playoff +
              space_width_playoff * rondas_playoff +
              space_width_playoff) +
            space_width_playoff +
            heightBars * 0.5 -
            defaults.logo.size / 2 + width_playoffs, yPlayoffs.domain([primera_ronda_playoff, 0])(i)+
            (top_n * heightBars) / primera_ronda_playoff / 2 -
            heightBars / 2]
          ])); */

    svg
      .selectAll('.path')
      .data(d3.range(primera_ronda_playoff * 2))
      .enter()
      .append('path')
      .attrs({
        class: 'line',
      })
      .styles({
        fill: 'none',
        stroke: 'grey',
        'stroke-width': ((heightBars * 0.35) / 7) * 10,
        'stroke-linejoin': 'round',
      })
      .attr('d', (d, i) =>
        d3.line().curve(d3.curveStep)([
          [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 2, yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[Object.keys(positions_playoffs)[i]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[Object.keys(positions_playoffs)[i]][1] == 0 ? -space_height_playoff : space_height_playoff)],
          [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 1 + width_playoffs, yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[Object.keys(positions_playoffs)[i]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[Object.keys(positions_playoffs)[i]][1] == 0 ? -0 : 0)],
        ])
      );

    svg
      .selectAll('.path')
      .data(d3.range(primera_ronda_playoff * 2))
      .enter()
      .append('path')
      .attrs({
        class: 'line',
      })
      .styles({
        fill: 'none',
        stroke: 'grey',
        'stroke-width': ((heightBars * 0.35) / 7) * 10,
        'stroke-linejoin': 'round',
      })
      .attr('d', (d, i) =>
        d3.line().curve(d3.curveStep)([
          [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 1, yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[Object.keys(positions_playoffs)[i]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[Object.keys(positions_playoffs)[i]][1] == 0 ? -0 : 0)],
          [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 1 + width_playoffs + space_width_playoff / 3, yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[Object.keys(positions_playoffs)[i]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[Object.keys(positions_playoffs)[i]][1] == 0 ? -0 : 0)],
          [
            width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff - space_width_playoff / 3,
            yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][1] == 0 ? -0 : 0),
          ],
          [
            width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff + width_playoffs,
            yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][1] == 0 ? -0 : 0),
          ],
        ])
      );

    if (primera_ronda_playoff >= 4) {
      svg
        .selectAll('.path')
        .data(d3.range(primera_ronda_playoff * 2))
        .enter()
        .append('path')
        .attrs({
          class: 'line',
        })
        .styles({
          fill: 'none',
          stroke: 'grey',
          'stroke-width': ((heightBars * 0.35) / 7) * 10,
          'stroke-linejoin': 'round',
        })
        .attr('d', (d, i) =>
          d3.line().curve(d3.curveStep)([
            [
              width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff,
              yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][1] == 0 ? -0 : 0),
            ],
            [
              width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff + width_playoffs + space_width_playoff / 3,
              yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][1] == 0 ? -0 : 0),
            ],
            [
              width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 2 + width_playoffs - space_width_playoff / 3,
              yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][1] == 0 ? -0 : 0),
            ],
            [
              width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 2 + width_playoffs * 2,
              yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][1] == 0 ? -0 : 0),
            ],
          ])
        );
    }

    if (primera_ronda_playoff >= 8) {
      svg
        .selectAll('.path')
        .data(d3.range(primera_ronda_playoff * 2))
        .enter()
        .append('path')
        .attrs({
          class: 'line',
        })
        .styles({
          fill: 'none',
          stroke: 'grey',
          'stroke-width': ((heightBars * 0.35) / 7) * 10,
          'stroke-linejoin': 'round',
        })
        .attr('d', (d, i) => {
          // 1. Navegar la pirámide: de qué partido viene en cada ronda
          const key = Object.keys(positions_playoffs)[i];
          const matchOctavos = positions_playoffs[key][0]; // partido en octavos
          const matchCuartos = positions_playoffs4[matchOctavos][0]; // → cuartos
          const matchSemis = positions_playoffs2[matchCuartos][0]; // → semis
          const matchFinal = positions_playoffs1[matchSemis][0]; // → final

          // 2. Coordenadas X: base + offset por ronda
          const xBase = width + width_playoffs - (width_playoffs + space_width_playoff) * rondas_playoff;
          const s = space_width_playoff;
          const w = width_playoffs;

          const x1 = xBase + 2 * s + w;
          const x2 = xBase + 2 * s + 2 * w + s / 3; // sale de semis
          const x3 = xBase + 3 * s + 2 * w - s / 3; // entra a final
          const x4 = xBase + 3 * s + 3 * w;

          // 3. Coordenadas Y: posición vertical por ronda
          const alturaBase = heightBars * (top_n + grupos / 2);

          const ySemis = yPlayoffs.domain([primera_ronda_playoff / 4, 0])(matchSemis) + alturaBase / (primera_ronda_playoff / 2) - heightBars / 2;

          const yFinal = yPlayoffs.domain([primera_ronda_playoff / 8, 0])(matchFinal) + alturaBase / (primera_ronda_playoff / 4) - heightBars / 2;

          // 4. Dibujar la curva (4 puntos)
          return d3.line().curve(d3.curveStep)([
            [x1, ySemis], // inicio (sale de semis)
            [x2, ySemis], // horizontal →
            [x3, yFinal], // diagonal  ↗ o ↘
            [x4, yFinal], // horizontal → (llega a final)
          ]);
        });
    }

    if (primera_ronda_playoff >= 16) {
      svg
        .selectAll('.path')
        .data(d3.range(primera_ronda_playoff * 2))
        .enter()
        .append('path')
        .attrs({
          class: 'line',
        })
        .styles({
          fill: 'none',
          stroke: 'grey',
          'stroke-width': ((heightBars * 0.35) / 7) * 10,
          'stroke-linejoin': 'round',
        })
        .attr('d', (d, i) => {
          // 1. Navegar la pirámide: de qué partido viene en cada ronda
          const key = Object.keys(positions_playoffs)[i];
          const matchOctavos = positions_playoffs[key][0]; // partido en octavos
          const matchCuartos = positions_playoffs4[matchOctavos][0]; // → cuartos
          const matchSemis = positions_playoffs2[matchCuartos][0]; // → semis
          const matchFinal = positions_playoffs1[matchSemis][0]; // → final
          const matchFinalfinal = positions_playoffs_final[matchFinal][0]; // → final

          // 2. Coordenadas X: base + offset por ronda
          const xBase = width + width_playoffs - (width_playoffs + space_width_playoff) * rondas_playoff;
          const s = space_width_playoff;
          const w = width_playoffs;

          const x1 = xBase + 3 * s + w * 2;
          const x2 = xBase + 3 * s + 3 * w + s / 4; // sale de semis
          const x3 = xBase + 4 * s + 3 * w - s / 4; // entra a final
          const x4 = xBase + 4 * s + 4 * w;

          // 3. Coordenadas Y: posición vertical por ronda
          const alturaBase = heightBars * (top_n + grupos / 2);

          const ySemis = yPlayoffs.domain([primera_ronda_playoff / 8, 0])(matchFinal) + alturaBase / (primera_ronda_playoff / 4) - heightBars / 2;

          const yFinal = yPlayoffs.domain([primera_ronda_playoff / 16, 0])(matchFinalfinal) + alturaBase / (primera_ronda_playoff / 8) - heightBars / 2;

          // 4. Dibujar la curva (4 puntos)
          return d3.line().curve(d3.curveStep)([
            [x1, ySemis], // inicio (sale de semis)
            [x2, ySemis], // horizontal →
            [x3, yFinal], // diagonal  ↗ o ↘
            [x4, yFinal], // horizontal → (llega a final)
          ]);
        });

      /* svg
          .selectAll('.path')
          .data(d3.range(primera_ronda_playoff*2))
          .enter()
          .append('path')
          .attrs({
            class: 'line',
          })
          .styles({
            fill: 'none',
            stroke: 'grey',
            'stroke-width': ((heightBars * 0.35) / 7) * 10,
            'stroke-linejoin': 'round',
          })
          .attr('d', (d, i) =>
            d3.line().curve(d3.curveCardinal.tension(1))([
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 3 + width_playoffs,
                yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]][0]) + (top_n * heightBars + grupos * heightBars/2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][1]][0] == 0 ? -0 : 0),
              ],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 3 + width_playoffs * 3 + space_width_playoff / 3,
                yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]][0]) + (top_n * heightBars + grupos * heightBars/2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][1]][0] == 0 ? -0 : 0),
              ],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 4 + width_playoffs * 3 - space_width_playoff / 3,
                yPlayoffs.domain([primera_ronda_playoff / 16, 0])(positions_playoffs_final[positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]][0]][0]) + (top_n * heightBars + grupos * heightBars/2) / (primera_ronda_playoff / 8) - heightBars / 2 + (positions_playoffs_final[positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]][0]][1] == 0 ? -0 : 0),
              ],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 4 + width_playoffs * 4,
                yPlayoffs.domain([primera_ronda_playoff / 16, 0])(positions_playoffs_final[positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]][0]][0]) + (top_n * heightBars + grupos * heightBars/2) / (primera_ronda_playoff / 8) - heightBars / 2 + (positions_playoffs_final[positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]][0]][1] == 0 ? -0 : 0),
              ],
            ])
          ); */
    }

    /* svg
      .selectAll('.rect')
      .data(d3.range(primera_ronda_playoff * 2))
      .enter()
      .append('rect')
      .attrs({
        class: 'playoffs_names',
        x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff,
        y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[Object.keys(positions_playoffs)[i]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[Object.keys(positions_playoffs)[i]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
        width: width_playoffs,
        height: heightBars,
      })
      .attr('style', (d) => `outline: 1px solid grey`)
      .styles({
        fill: '#dddddd',
      }); */


    svg
      .selectAll('.rect')
      .data(d3.range(primera_ronda_playoff * 2))
      .enter()
      .append('rect')
      .attrs({
        class: 'playoffs_names',
        x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 2 + width_playoffs * 1,
        y: (d, i) => yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
        width: width_playoffs,
        height: heightBars,
      })
      .attr('style', (d) => `outline: 1px solid grey`)
      .styles({
        fill: '#dddddd',
      });

    svg
      .selectAll('.rect')
      .data(d3.range(primera_ronda_playoff * 2))
      .enter()
      .append('rect')
      .attrs({
        class: 'playoffs_names',
        x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 3 + width_playoffs * 2,
        y: (d, i) => yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
        width: width_playoffs,
        height: heightBars,
      })
      .attr('style', (d) => `outline: 1px solid grey`)
      .styles({
        fill: '#dddddd',
      });

    svg
      .selectAll('.rect')
      .data(d3.range(primera_ronda_playoff * 2))
      .enter()
      .append('rect')
      .attrs({
        class: 'playoffs_names',
        x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 4 + width_playoffs * 3,
        y: (d, i) =>
          yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
        width: width_playoffs,
        height: heightBars,
      })
      .attr('style', (d) => `outline: 1px solid grey`)
      .styles({
        fill: '#dddddd',
      });

    svg
      .selectAll('.rect')
      .data(d3.range(primera_ronda_playoff * 2))
      .enter()
      .append('rect')
      /* .style('filter', 'url(#dropshadow)') */
      .attrs({
        class: 'playoffs_names',
        x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 5 + width_playoffs * 4,
        y: (d, i) =>
          yPlayoffs.domain([primera_ronda_playoff / 16, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / (primera_ronda_playoff / 8) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[Object.keys(positions_playoffs)[i]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
        width: width_playoffs,
        height: heightBars,
      })
      .attr('style', (d) => `outline: 1px solid grey`)
      .styles({
        fill: '#dddddd',
      });

    arr.forEach((dd) => {
      /* svg
        .selectAll('.rect')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 2}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('rect')
        .style('filter', 'url(#dropshadow)')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 2 + width_playoffs,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars + grupos * heightBars/2) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars/2,
          width: width_playoffs,
          height: heightBars,
        })
        .styles({
          fill: function fill(d) {
            const diff = d.goles_local - d.goles_visitante;
            const ganoLocal = diff > 0 || (diff === 0 && d.penales_local > d.penales_visitante);
            const esLocal = dd === 'local';

            return ganoLocal === esLocal ? '#d4d4d4' : '#b6b6b6';
          }
        })

        svg
        .selectAll('.rect')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 4}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('rect')
        .style('filter', 'url(#dropshadow)')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 3 + width_playoffs * 2,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars + grupos * heightBars/2) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
          width: width_playoffs,
          height: heightBars,
        })
        .styles({
          fill: function fill(d) {
            const diff = d.goles_local - d.goles_visitante;
            const ganoLocal = diff > 0 || (diff === 0 && d.penales_local > d.penales_visitante);
            const esLocal = dd === 'local';

            return ganoLocal === esLocal ? '#d4d4d4' : '#b6b6b6';
          }
        })

         svg
        .selectAll('.rect')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 8}`).slice(0, primera_ronda_playoff))
        .enter()
        .append('rect')
        .style('filter', 'url(#dropshadow)')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 4 + width_playoffs * 3,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars + grupos * heightBars/2) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
          width: width_playoffs,
          height: heightBars,
        })
        .styles({
          fill: function fill(d) {
            const diff = d.goles_local - d.goles_visitante;
            const ganoLocal = diff > 0 || (diff === 0 && d.penales_local > d.penales_visitante);
            const esLocal = dd === 'local';

            return ganoLocal === esLocal ? '#d4d4d4' : '#b6b6b6';
          }
        })
 */
    });

    const keysSet = new Set(Object.keys(positions_playoffs));

    svg
      .selectAll('.rect')
      .data(yearSlice.filter((d, i) => (d.rankInGroup >= 0 && d.rankInGroup <= clasificacion_por_grupo - 1) || (d.rankInGroup >= equipos_por_grupos && d.rankInGroup <= equipos_por_grupos + clasificacion_por_grupo - 1)).filter((d) => keysSet.has(d.position)))
      .enter()
      .append('rect')
      .attrs({
        x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff,
        y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.rankInGroup + 1 + d.name.split('-')[1]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d.rankInGroup + 1 + d.name.split('-')[1]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
       /*  x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff,
        y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[Object.keys(positions_playoffs)[i]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[Object.keys(positions_playoffs)[i]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2, */
        width: width_playoffs,
        height: heightBars,
      })
      .attr('style', (d) => `outline: 1px solid grey`)
      .styles({
        opacity: 1,
        fill: (d, i) => {
          if (i % 2 == 0) {
            return '#dddddd'
          } else {
            return '#dddddd'
          }
        }
        /* fill: (d, i) => {
          if (d.position.split('')[0] == '1') {
            return '#dddddd'
          } else if (d.position.split('')[0] == '2') {
            return '#dddddd'
          } else if (d.position.split('')[0] == '3') {
            return '#dddddd'
          }
        } */
      })
      /* .style('filter', 'url(#dropshadow)'); */

    svg
      .selectAll('.image')
      .data(yearSlice.filter((d, i) => (d.rankInGroup >= 0 && d.rankInGroup <= clasificacion_por_grupo - 1) || (d.rankInGroup >= equipos_por_grupos && d.rankInGroup <= equipos_por_grupos + clasificacion_por_grupo - 1)).filter((d) => keysSet.has(d.position)))
      .enter()
      .append('image')
      .attrs({
        class: 'playoffs_names',
        x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + heightBars * 0.5 - (defaults.logo.size * 0.8) / 2,
        y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.rankInGroup + 1 + d.name.split('-')[1]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d.rankInGroup + 1 + d.name.split('-')[1]][1] == 0 ? -space_height_playoff : space_height_playoff) - (defaults.logo.size * 0.8) / 2,
        height: defaults.logo.size * 0.8,
        href: (d) => `./escudos/${d.name.split('-')[0]}.png`,
      })
      .styles({
        opacity: 0.7,
      })
      .style('filter', 'url(#dropshadow)');

    svg
      .selectAll('.text')
      .data(yearSlice.filter((d, i) => (d.rankInGroup >= 0 && d.rankInGroup <= clasificacion_por_grupo - 1) || (d.rankInGroup >= equipos_por_grupos && d.rankInGroup <= equipos_por_grupos + clasificacion_por_grupo - 1)).filter((d) => keysSet.has(d.position)))
      .enter()
      .append('text')
      .attrs({
        class: 'playoffs_names',
        x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + heightBars * 1.2,
        y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.rankInGroup + 1 + d.name.split('-')[1]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d.rankInGroup + 1 + d.name.split('-')[1]][1] == 0 ? -space_height_playoff : space_height_playoff),
      })
      .styles({
        fill: defaults.name.style.fill,
        'font-size': defaults.name.style.font_size,
        'font-weight': defaults.name.style.font_weight,
        'text-anchor': defaults.name.style.text_anchor,
        'alignment-baseline': defaults.name.style.alignment_baseline,
        opacity: 0.7,
      })
      .text((d) => d.name.split('-')[0]);

    svg
      .selectAll('.text')
      .data(yearSlice.filter((d, i) => (d.rankInGroup >= 0 && d.rankInGroup <= clasificacion_por_grupo - 1) || (d.rankInGroup >= equipos_por_grupos && d.rankInGroup <= equipos_por_grupos + clasificacion_por_grupo - 1)).filter((d) => keysSet.has(d.position)))
      .enter()
      .append('text')
      .attrs({
        class: 'playoffs_names',
        x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff - heightBars * 0.9,
        y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.rankInGroup + 1 + d.name.split('-')[1]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d.rankInGroup + 1 + d.name.split('-')[1]][1] == 0 ? -space_height_playoff : space_height_playoff),
      })
      .styles({
        fill: defaults.name.style.fill,
        'font-size': defaults.name.style.font_size,
        'font-weight': defaults.name.style.font_weight,
        'text-anchor': defaults.name.style.text_anchor,
        'alignment-baseline': defaults.name.style.alignment_baseline,
        opacity: 0.7,
      })
      .text((d) => d.rankInGroup + 1 + d.name.split('-')[1]);
  }

  let fechasNotPlayed = (i) => {
    let a = () => {
      if (i > fechas_not_played) {
        return x(i - not_played_yet_x * i);
      } else {
        return x(i);
      }
    };

    let b = () => {
      if (i > fechas_not_played) {
        return x(fechas_not_played) - x(fechas_not_played - not_played_yet_x * fechas_not_played);
      } else {
        return 0;
      }
    };

    let c = () => {
      if (i > fechas_not_played && i == dates.length - 1) {
        return x(fechas_not_played) - x(fechas_not_played - not_played_yet_x);
      } else {
        return 0;
      }
    };

    return a() + b() + c();
  };

  svg
    .selectAll('.text')
    .data(dates.slice(0, -1))
    .enter()
    .append('text')
    .attrs({
      class: 'years',
      x: (d, i) => fechasNotPlayed(i),
      y: margin.top * 0.6,
      transform: `translate(${margin_left * 2}, 0)`,
      'clip-path': `url(#ellipse-clip-margin-left)`,
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: '#b5b5b5',
      'font-weight': 600,
      'text-anchor': 'middle',
      'alignment-baseline': 'central',
    })
    .text((semana) => {
      let filterr = data.filter((d) => d.semana == semana && d.vs != 'none').sort((a, b) => parseDate(a.dia_large) - parseDate(b.dia_large));
      let first_date = filterr[0].dia_large;
      let last_date = filterr[filterr.length - 1].dia_large;
      let mismo_mes =
        data
          .filter((d) => d.semana == semana - 1 && d.vs != 'none')
          .sort((a, b) => parseDate(a.dia_large) - parseDate(b.dia_large))[0]
          ?.dia_large.split(' ')[0] == first_date.split(' ')[0];

      if (!mismo_mes) {
        if (first_date == last_date) return filterr[0].dia_large;
        return filterr[0].dia_large + '-' + filterr[filterr.length - 1].dia_large.split(' ')[1];
      } else {
        if (first_date == last_date) return filterr[0].dia_large.split(' ')[1];
        return filterr[0].dia_large.split(' ')[1] + '-' + filterr[filterr.length - 1].dia_large.split(' ')[1];
      }
    });

  svg
    .selectAll('.text')
    .data(dates.slice(0, -1))
    .enter()
    .append('text')
    .attrs({
      class: 'years',
      x: (d, i) =>
        fechasNotPlayed(i) -
        (d < 10 ? heightBars * 0.05 : 0) -
        (d == dates[dates.length - 1]
          ? 'Final'
          : d == dates[0]
            ? d
            : data
                .filter((e) => e.semana == d && e.vs != 'none')[0]
                .fecha2.split(' ')[1]
                .replace('Def.', '')
                .replace('Post.', d)
        )
          .toString()
          .replace('.', '').length *
          heightBars *
          0.175,
      y: margin.top * 0.8,
      transform: `translate(${margin_left * 2}, 0)`,
      'clip-path': `url(#ellipse-clip-margin-left)`,
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: '#b5b5b5',
      'font-weight': 600,
      'text-anchor': 'end',
      'alignment-baseline': 'central',
    })
    .text((semana) => {
      let filterr = data.filter((d) => d.semana == semana && d.vs != 'none' && d.goles_fecha !== not_played_yet);
      return filterr.length > 0 ? filterr.length / 2 : '';
    });

  svg
    .selectAll('.text')
    .data(dates.slice(0, -1))
    .enter()
    .append('text')
    .attrs({
      class: 'years',
      x: (d, i) =>
        fechasNotPlayed(i) +
        (d < 10 ? heightBars * 0.05 : 0) +
        (d == dates[dates.length - 1]
          ? 'Final'
          : d == dates[0]
            ? d
            : data
                .filter((e) => e.semana == d && e.vs != 'none')[0]
                .fecha2.split(' ')[1]
                .replace('Def.', '')
                .replace('Post.', d)
        )
          .toString()
          .replace('.', '').length *
          heightBars *
          0.175,
      y: margin.top * 0.8,
      transform: `translate(${margin_left * 2}, 0)`,
      'clip-path': `url(#ellipse-clip-margin-left)`,
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: '#b5b5b5',
      'font-weight': 600,
      'text-anchor': 'start',
      'alignment-baseline': 'central',
    })
    .text((semana) => {
      let filterr = data.filter((d) => d.semana == semana && d.vs != 'none' && d.goles_fecha !== not_played_yet);
      return filterr.length > 0 ? ('(' + d3.format(',.1f')(d3.sum(filterr, (d) => d.goles_fecha) / (filterr.length / 2)) + ')').replace('.', ',') : '';
    });

  svg
    .selectAll('.text')
    .data(dates)
    .enter()
    .append('text')
    .attrs({
      class: 'years',
      x: (d, i) => fechasNotPlayed(i),
      y: margin.top * 0.8,
      transform: `translate(${margin_left * 2}, 0)`,
      'clip-path': `url(#ellipse-clip-margin-left)`,
    })
    .styles({
      'font-size': heightBars * 0.4,
      fill: '#f1f1f1',
      'font-weight': 600,
      'text-anchor': 'middle',
      'alignment-baseline': 'central',
    })
    .text((d) =>
      d == dates[dates.length - 1]
        ? 'F'
        : d == dates[0]
          ? d
          : data
              .filter((e) => e.semana == d && e.vs != 'none')[0]
              .fecha2.split(' ')[1]
              .replace('Def.', '')
              .replace('Post.', d)
    );

    /* svg
    .append('text')
    .attrs({
      class: 'years',
      x: margin.left * 0.05,
      y: margin.top * 0.1,
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: 'grey',
      'font-weight': 600,
      'text-anchor': 'start',
      'alignment-baseline': 'central',
    })
    .text('Probabilidad*: 100.000 Simulaciones. (100%) = Clasificado a próxima fase a efectos prácticos. (0%) = Afuera.')

    svg
    .append('text')
    .attrs({
      class: 'years',
      x: margin.left * 0.05,
      y: margin.top * 0.225,
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: 'grey',
      'font-weight': 600,
      'text-anchor': 'start',
      'alignment-baseline': 'central',
    })
    .text('Fairplay*: Sistema de puntos en base a las tarjetas. Amarilla: -1, Roja indirecta: -3, Roja directa: -4, Amarilla + Roja directa: -5.')
    

  svg
    .append('text')
    .attrs({
      class: 'years',
      x: margin.left * 0.05,
      y: margin.top * 0.35,
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: 'grey',
      'font-weight': 600,
      'text-anchor': 'start',
      'alignment-baseline': 'central',
    })
    .text('Criterios de desempate: pts > [Enfrentamientos directos: pts > dif > gf] > dif > gf > FairPlay > RankingFIFA')

  svg
    .append('text')
    .attrs({
      class: 'years',
      x: (d, i) => fechasNotPlayed(dates.length-1) + defaults.logo.size / 2,
      y: margin.top * 0.725,
      transform: `translate(${margin_left * 2}, 0)`,
      'clip-path': `url(#ellipse-clip-margin-left)`,
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: 'grey',
      'font-weight': 600,
      'text-anchor': 'start',
      'alignment-baseline': 'central',
    })
    .text('Selección - RankingFIFA - Probabilidad* - Rango de posiciones posibles');

    svg
    .append('text')
    .attrs({
      class: 'years',
      x: (d, i) => fechasNotPlayed(dates.length-1) + defaults.logo.size / 2,
      y: margin.top * 0.85,
      transform: `translate(${margin_left * 2}, 0)`,
      'clip-path': `url(#ellipse-clip-margin-left)`,
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: 'grey',
      'font-weight': 600,
      'text-anchor': 'start',
      'alignment-baseline': 'central',
    })
    .text('PTS - PJ - PG - PE - PP - GF - GC - DIF - FairPlay*'); */

    svg
  .append('text')
  .attrs({
    class: 'years',
    x: margin.left * 0.05,
    y: margin.top * 0.1,
  })
  .styles({
    'font-size': heightBars * 0.25,
    fill: 'grey',
    'font-weight': 600,
    'text-anchor': 'start',
    'alignment-baseline': 'central',
  })
  .text('Probability*: 100,000 Simulations. (100%) = Qualified for next round for all practical purposes. (0%) = Eliminated.')

svg
  .append('text')
  .attrs({
    class: 'years',
    x: margin.left * 0.05,
    y: margin.top * 0.225,
  })
  .styles({
    'font-size': heightBars * 0.25,
    fill: 'grey',
    'font-weight': 600,
    'text-anchor': 'start',
    'alignment-baseline': 'central',
  })
  .text('Fair Play*: Points system based on cards. Yellow: -1, Indirect red: -3, Direct red: -4, Yellow + Direct red: -5.')

svg
  .append('text')
  .attrs({
    class: 'years',
    x: margin.left * 0.05,
    y: margin.top * 0.35,
  })
  .styles({
    'font-size': heightBars * 0.25,
    fill: 'grey',
    'font-weight': 600,
    'text-anchor': 'start',
    'alignment-baseline': 'central',
  })
  .text('Tiebreakers: PTS > [Head-to-head: PTS > GD > GF] > GD > GF > Fair Play > FIFA Ranking')

svg
  .append('text')
  .attrs({
    class: 'years',
    x: (d, i) => fechasNotPlayed(dates.length - 1) + defaults.logo.size / 2,
    y: margin.top * 0.725,
    transform: `translate(${margin_left * 2}, 0)`,
    'clip-path': `url(#ellipse-clip-margin-left)`,
  })
  .styles({
    'font-size': heightBars * 0.25,
    fill: 'grey',
    'font-weight': 600,
    'text-anchor': 'start',
    'alignment-baseline': 'central',
  })
  .text('Team - FIFA Ranking - Probability* - Possible position range')

  /* svg
  .append('text')
  .attrs({
    class: 'years',
    x: barWidth,
    y: margin.top * 0.775,
    transform: `translate(${margin_left * 2}, 0)`,
    'clip-path': `url(#ellipse-clip-margin-left)`,
  })
  .styles({
    'font-size': heightBars * 0.25,
    fill: 'grey',
    'font-weight': 600,
    'text-anchor': 'start',
    'alignment-baseline': 'central',
  })
  .text('Group · Inter-group · Overall') */

svg
  .append('text')
  .attrs({
    class: 'years',
    x: (d, i) => fechasNotPlayed(dates.length - 1) + defaults.logo.size / 2,
    y: margin.top * 0.85,
    transform: `translate(${margin_left * 2}, 0)`,
    'clip-path': `url(#ellipse-clip-margin-left)`,
  })
  .styles({
    'font-size': heightBars * 0.25,
    fill: 'grey',
    'font-weight': 600,
    'text-anchor': 'start',
    'alignment-baseline': 'central',
  })
  .text('PTS - MP - W - D - L - GF - GA - GD - Fair Play*')

     /* const labelGroup = svg
  .append('text')
  .attrs({
    class: 'years',
    x: fechasNotPlayed(dates.length - 1) + defaults.logo.size / 2,
    y: margin.top * 0.85,
    transform: `translate(${margin_left * 2}, 0)`,
    'clip-path': `url(#ellipse-clip-margin-left)`,
  })
  .styles({
    'font-size': heightBars * 0.2,
    'font-weight': 600,
    'text-anchor': 'start',
    'alignment-baseline': 'central',
  });

const segments = [
  { text: 'Puntos - Partidos: Jugados / ', fill: 'grey' },
  { text: 'Ganados',                       fill: '#22c55e' },  // verde
  { text: ' / ',                           fill: 'grey' },
  { text: 'Empatados',                     fill: '#eab308' },  // amarillo
  { text: ' / ',                           fill: 'grey' },
  { text: 'Perdidos',                      fill: '#ef4444' },  // rojo
  { text: ' - Goles: ',                    fill: 'grey' },
  { text: 'A Favor',                       fill: '#22c55e' },  // verde
  { text: ' / ',                           fill: 'grey' },
  { text: 'En Contra',                     fill: '#ef4444' },  // rojo
  { text: ' / Diferencia - ',              fill: 'grey' },
  { text: 'FairPlay',                      fill: '#a855f7' },  // violeta
];

segments.forEach(({ text, fill }) => {
  labelGroup.append('tspan').style('fill', fill).text(text);
}); */

  var defs = svg.append('defs');

  var filter = defs.append('filter').attr('id', 'dropshadow');

  filter.append('feGaussianBlur').attr('in', 'SourceAlpha').attr('stdDeviation', 1).attr('result', 'blur');
  filter.append('feOffset').attr('in', 'blur').attr('dx', 1).attr('dy', 1).attr('result', 'offsetBlur');
  filter.append('feFlood').attr('in', 'offsetBlur').attr('flood-color', '#000').attr('flood-opacity', 1).attr('result', 'offsetColor');
  filter.append('feComposite').attr('in', 'offsetColor').attr('in2', 'offsetBlur').attr('operator', 'in').attr('result', 'offsetBlur');

  var feMerge = filter.append('feMerge');

  feMerge.append('feMergeNode').attr('in', 'offsetBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  const FLAG_COLORS = {
    // ─── CONMEBOL ───────────────────────────────────────────────────
    Argentina: ['#74ACDF', '#FFFFFF', '#74ACDF'],
    Brasil: ['#009739', '#FEDD00', '#009739'],
    Colombia: ['#FCD116', '#FCD116', '#003893', '#CE1126'],
    Ecuador: ['#FFD100', '#FFD100', '#0033A0', '#CE1126'],
    Paraguay: ['#D52B1E', '#FFFFFF', '#0038A8'],
    Uruguay: ['#6da9f1', '#FFFFFF', '#6da9f1', '#FFFFFF', '#6da9f1'],
    // ─── CONCACAF ──────────────────────────────────────────────────
    'Estados Unidos': ['#B31942', '#FFFFFF', '#0A3161'],
    México: ['#006341', '#FFFFFF', '#CE1126'],
    Canadá: ['#FF0000', '#FFFFFF', '#FF0000', '#FFFFFF', '#FF0000'],
    Panamá: ['#FFFFFF', '#D21034', '#005DA6', '#FFFFFF'],
    Haití: ['#00209F', '#D21034'],
    Curazao: ['#002B7F', '#002B7F', '#F9E814'],
    // ─── UEFA ─────────────────────────────────────────────────────
    Francia: ['#002395', '#FFFFFF', '#ED2939'],
    Inglaterra: ['#FFFFFF', '#CE1124', '#FFFFFF'],
    Alemania: ['#000000', '#DD0000', '#FFCC00'],
    España: ['#AA151B', '#F1BF00', '#AA151B'],
    'Países Bajos': ['#AE1C28', '#FFFFFF', '#21468B'],
    Portugal: ['#006600', '#006600', '#FF0000', '#FF0000', '#FF0000'],
    Bélgica: ['#000000', '#FDDA24', '#EF3340'],
    Croacia: ['#FF0000', '#FFFFFF', '#171796'],
    Austria: ['#ED2939', '#FFFFFF', '#ED2939'],
    Suiza: ['#FF0000', '#FFFFFF', '#FF0000'],
    Suecia: ['#006AA7', '#FECC02', '#006AA7'],
    Noruega: ['#EF2B2D', '#FFFFFF', '#002868'],
    Dinamarca: ['#C8102E', '#FFFFFF', '#C8102E'],
    Escocia: ['#003399', '#FFFFFF', '#003399'],
    Turquía: ['#E30A17', '#FFFFFF', '#E30A17'],
    'Bosnia y Herzegovina': ['#002395', '#FECE00', '#002395'],
    'República Checa': ['#FFFFFF', '#11457E', '#D7141A'],
    // ─── AFC ──────────────────────────────────────────────────────
    Japón: ['#FFFFFF', '#BC002D', '#FFFFFF'],
    'Corea del Sur': ['#FFFFFF', '#CD2E3A', '#0047A0'],
    Australia: ['#002868', '#FFCD00', '#002868'],
    'Arabia Saudita': ['#006C35', '#FFFFFF', '#006C35'],
    Irán: ['#239F40', '#FFFFFF', '#DA0000'],
    Irak: ['#CE1126', '#FFFFFF', '#000000'],
    Qatar: ['#8A1538', '#FFFFFF', '#8A1538'],
    Jordania: ['#000000', '#FFFFFF', '#007A3D'],
    Uzbekistán: ['#0099B5', '#FFFFFF', '#1EB53A'],
    // ─── CAF ──────────────────────────────────────────────────────
    Marruecos: ['#C1272D', '#006233', '#C1272D'],
    Senegal: ['#00853F', '#FDEF42', '#E31B23'],
    Nigeria: ['#008751', '#FFFFFF', '#008751'],
    Egipto: ['#CE1126', '#FFFFFF', '#000000'],
    'Costa de Marfil': ['#FF8200', '#FFFFFF', '#009A44'],
    Sudáfrica: ['#007749', '#FFB81C', '#000000', '#FFFFFF', '#002395', '#DE3831'],
    'RD de Congo': ['#007FFF', '#F7D618', '#CE1021'],
    Ghana: ['#EF3340', '#FCD116', '#006B3F'],
    Argelia: ['#006233', '#FFFFFF', '#D21034'],
    Túnez: ['#E70013', '#FFFFFF', '#E70013'],
    'Cabo Verde': ['#003893', '#003893', '#FFFFFF', '#CE1126', '#FFFFFF'],
    // ─── OFC ──────────────────────────────────────────────────────
    'Nueva Zelanda': ['#00247D', '#CC142B', '#FFFFFF'],
    // ─── Los 5 Grandes ─────────────────────────────────────────────
    'River Plate': ['#FFFFFF', '#DC2626', '#FFFFFF'],
    'Boca Juniors': ['#1D3B8A', '#FFD700', '#1D3B8A'],
    Racing: ['#87CEEB', '#FFFFFF', '#87CEEB'],
    Independiente: ['#DC2626', '#FFFFFF', '#DC2626'],
    'San Lorenzo': ['#1A237E', '#DC2626', '#1A237E'],

    // ─── Buenos Aires / GBA ────────────────────────────────────────
    Huracán: ['#FFFFFF', '#E53935', '#FFFFFF', '#E53935', '#FFFFFF'],
    'Vélez Sarsfield': ['#FFFFFF', '#1565C0', '#FFFFFF'],
    'Argentinos Juniors': ['#D32F2F', '#FFFFFF', '#D32F2F'],
    Lanús: ['#722F37', '#FFFFFF', '#722F37'],
    Banfield: ['#2E7D32', '#FFFFFF', '#2E7D32'],
    Tigre: ['#003DA5', '#D2232A', '#003DA5', '#D2232A'],
    Platense: ['#8B6914', '#FFFFFF', '#8B6914'],
    'Barracas Central': ['#CE1126', '#000000', '#CE1126'],
    Riestra: ['#D2232A', '#1A1A1A', '#D2232A'],
    'Defensa y Justicia': ['#FEDD00', '#2E7D32', '#FEDD00'],

    // ─── La Plata ──────────────────────────────────────────────────
    Gimnasia: ['#1A3C6E', '#FFFFFF', '#1A3C6E'],
    Estudiantes: ['#CE1126', '#FFFFFF', '#CE1126'],

    // ─── Rosario ───────────────────────────────────────────────────
    "Newell's Old Boys": ['#D2232A', '#000000'],
    'Rosario Central': ['#003DA5', '#FEDD00', '#003DA5'],

    // ─── Córdoba ───────────────────────────────────────────────────
    Talleres: ['#002F6C', '#FFFFFF', '#002F6C'],
    Belgrano: ['#5DADE2', '#5DADE2', '#FFFFFF'],
    Instituto: ['#E53935', '#FFFFFF', '#E53935'],

    // ─── Interior ──────────────────────────────────────────────────
    'Godoy Cruz': ['#FFFFFF', '#2C3E50', '#FFFFFF'],
    'Atlético Tucumán': ['#4FC3F7', '#FFFFFF', '#4FC3F7'],
    Unión: ['#D32F2F', '#FFFFFF', '#D32F2F'],
    Sarmiento: ['#1B5E20', '#FFFFFF', '#1B5E20'],
    'Central Córdoba': ['#000000', '#FFFFFF', '#000000'],
    'Independiente Rivadavia': ['#003DA5', '#FFFFFF', '#003DA5'],
    Aldosivi: ['green', 'yellow'],
    'San Martín (SJ)': ['green', 'black'],
  };
  const pathLine = d3.line().curve(d3.curveCardinal.tension(1));

  if (grupos > 1) {
    const strokeWidthBase = (heightBars * 0.35) / 7;
    const capas = [
      { colorIdx: 0, width: strokeWidthBase * 5 },
      { colorIdx: 1, width: strokeWidthBase * 3 },
      { colorIdx: 2, width: strokeWidthBase * 1.75 },
      { colorIdx: 3, width: strokeWidthBase },
    ];

    const barWidth = x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + heightBars * 10;

    svg
  .append('text')
  .attrs({
    class: 'years',
    x: barWidth - heightBars*0.1,
    y: margin.top * 0.85,
  })
  .styles({
    'font-size': heightBars * 0.25,
    fill: 'grey',
    'font-weight': 600,
    'text-anchor': 'end',
    'alignment-baseline': 'central',
  })
  .text('Grp. · InterGrp. · Total')

    svg
      .append('rect')
      .attrs({
        class: 'bars_names',
        x: barWidth,
        y: margin.top,
        width: margin_left / 4,
        height: height,
      })
      .styles({
        fill: (d, i) => (i == 0 ? 'url(#areaGradient0)' : i % 2 == 1 ? 'url(#areaGradient0)' : 'url(#areaGradient0)'),
      });

    /* const pathLine = d3.line().curve(d3.curveCardinal.tension(1)); */

    grupos_1.forEach((grupo, indice_grupo) => {
      const offsetGrupo = indice_grupo * (equipos_por_grupos + distancia_entre_grupos);

      // Rect encabezado grupo
      svg
        .selectAll('.rect')
        .data(grupos_1)
        .enter()
        .append('rect')
        .attrs({
          class: 'bars_names_grupos',
          x: 0,
          y: y(offsetGrupo) - heightBars / 2,
          width: barWidth,
          height: heightBars / 2,
        })
        .style('fill', '#ebebeb');

      // Texto grupo
      svg
        .append('text')
        .attrs({
          class: 'name',
          x: margin_left/2,
          y: y(offsetGrupo + 0.75) - (y(1) - y(0)),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': 'middle',
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text(grupo);

        svg
    .selectAll('.text')
    .data(dates.slice(0, -1))
    .enter()
    .append('text')
    .attrs({
      class: 'years',
      x: (d, i) =>
        fechasNotPlayed(i) -
        (d < 10 ? heightBars * 0.05 : 0) -
        (d == dates[dates.length - 1]
          ? 'Final'
          : d == dates[0]
            ? d
            : data
                .filter((e) => e.semana == d && e.vs != 'none')[0]
                .fecha2.split(' ')[1]
                .replace('Def.', '')
                .replace('Post.', d)
        )
          .toString()
          .replace('.', '').length *
          heightBars *
          0.175,
      y: y(offsetGrupo + 0.75) - (y(1) - y(0)),
      transform: `translate(${margin_left * 2}, 0)`,
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: black_color,
      'font-weight': 600,
      'text-anchor': 'end',
      'alignment-baseline': 'central',
    })
    .text((semana) => {
      let filterr = data.filter((d) => d.semana == semana && d.name.split('-')[1] == grupo && d.vs != 'none' && d.goles_fecha !== not_played_yet);
      return filterr.length > 0 ? filterr.length / 2 : '';
    });

  svg
    .selectAll('.text')
    .data(dates.slice(0, -1))
    .enter()
    .append('text')
    .attrs({
      class: 'years',
      x: (d, i) =>
        fechasNotPlayed(i) +
        (d < 10 ? heightBars * 0.05 : 0) +
        (d == dates[dates.length - 1]
          ? 'Final'
          : d == dates[0]
            ? d
            : data
                .filter((e) => e.semana == d && e.vs != 'none')[0]
                .fecha2.split(' ')[1]
                .replace('Def.', '')
                .replace('Post.', d)
        )
          .toString()
          .replace('.', '').length *
          heightBars *
          0.175,
      y: y(offsetGrupo + 0.75) - (y(1) - y(0)),
      transform: `translate(${margin_left * 2}, 0)`,
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: black_color,
      'font-weight': 600,
      'text-anchor': 'start',
      'alignment-baseline': 'central',
    })
    .text((semana) => {
      let filterr = data.filter((d) => d.semana == semana && d.name.split('-')[1] == grupo && d.vs != 'none' && d.goles_fecha !== not_played_yet);
      return filterr.length > 0 ? ('(' + d3.format(',.1f')(d3.sum(filterr, (d) => d.goles_fecha) / (filterr.length / 2)) + ')').replace('.', ',') : '';
    });

  svg
    .selectAll('.text')
    .data(dates)
    .enter()
    .append('text')
    .attrs({
      class: 'years',
      x: (d, i) => fechasNotPlayed(i),
      y: y(offsetGrupo + 0.75) - (y(1) - y(0)),
      transform: `translate(${margin_left * 2}, 0)`,
    })
    .styles({
      'font-size': heightBars * 0.4,
      fill: black_color,
      'font-weight': 600,
      'text-anchor': 'middle',
      'alignment-baseline': 'central',
    })
    .text((d) =>
      d == dates[dates.length - 1]
        ? 'F'
        : d == dates[0]
          ? d
          : data
              .filter((e) => e.semana == d && e.vs != 'none')[0]
              .fecha2.split(' ')[1]
              .replace('Def.', '')
              .replace('Post.', d)
    );

      // Rects equipos
      svg
        .selectAll('.rect')
        .data(yearSlice.slice(indice_grupo * equipos_por_grupos, (indice_grupo + 1) * equipos_por_grupos))
        .enter()
        .append('rect')
        .attrs({
          class: 'bars_names',
          x: 0,
          y: (d, i) => y(i + distancia_entre_grupos + offsetGrupo) - heightBars / 2,
          width: barWidth,
          height: heightBars,
        })
        /* .style('fill', (d, i) => i < clasificacion_por_grupo
      ? (i % 2 === 1 ? '#94e694' : '#76c476')
      : (i % 2 === 1 ? '#dddddd' : '#c2c2c2')
    ); */
        .style('fill', (d, i) => {
          if (i < clasificacion_por_grupo - repechaje) {
            if (i % 2 === 1) {
              return segundo_puesto;
            } else {
              return primer_puesto;
            }
          } else if (i < clasificacion_por_grupo && mejores_terceros.includes(d.position[1])) {
            console.log(mejores_terceros);
            if (i % 2 === 1) {
              return '#d8ffb8';
            } else {
              return tercer_puesto;
            }
          } else {
            if (i % 2 === 1) {
              return '#dddddd';
            } else {
              return '#c2c2c2';
            }
          }
        });

        svg
        .selectAll('.text')
        .data(d3.range(1, equipos_por_grupos + 1))
        .enter()
        .append('text')
        .attrs({
          x: margin_left / 2,
          y: (d, i) => y(i + distancia_entre_grupos + offsetGrupo),
        })
        .styles({
          fill: black_color,
          'font-size': heightBars * 0.5,
          'alignment-baseline': 'central',
          'text-anchor': 'middle',
          'font-weight': 600,
        })
        .text((d) => d);

      /* svg
        .selectAll('.text')
        .data(yearSlice.slice(indice_grupo * equipos_por_grupos, (indice_grupo + 1) * equipos_por_grupos))
        .enter()
        .append('text')
        .attrs({
          x: barWidth - margin_left*1.4,
          y: (d, i) => y(i + distancia_entre_grupos + offsetGrupo),
        })
        .styles({
          fill: grey_color,
          'font-size': heightBars * 0.4,
          'alignment-baseline': 'central',
          'text-anchor': 'end',
          'font-weight': 600,
        })
        .text((d, i) => {
          let mt = (mejores_terceros.indexOf(d.position[1])+1)
          let r;
          r = mt == 0 ? '' : i == 2 ? '('+mt+ '/8)' : ''
          return r;
          }); */

         /*  svg
        .selectAll('.text')
        .data(yearSlice.slice(indice_grupo * equipos_por_grupos, (indice_grupo + 1) * equipos_por_grupos))
        .enter()
        .append('text')
        .attrs({
          x: barWidth - margin_left*1.4,
          y: (d, i) => y(i + distancia_entre_grupos + offsetGrupo),
        })
        .styles({
          fill: grey_color,
          'font-size': heightBars * 0.4,
          'alignment-baseline': 'central',
          'text-anchor': 'end',
          'font-weight': 600,
        })
        .text((d, i) => {
          return mejores_num[i].indexOf(d.name)+1
          }); */

          svg
        .selectAll('.text')
        .data(yearSlice.slice(indice_grupo * equipos_por_grupos, (indice_grupo + 1) * equipos_por_grupos))
        .enter()
        .append('text')
        .attrs({
          x: barWidth - margin_left/3,
          y: (d, i) => y(i + distancia_entre_grupos + offsetGrupo),
        })
        .styles({
          fill: grey_color,
          'font-size': heightBars * 0.3,
          'alignment-baseline': 'central',
          'text-anchor': 'end',
          'font-weight': 600,
        })
        .text((d, i) => {
          let grupo = i+1
          let interGroup = mejores_num[i].indexOf(d.name)+1
          let overall = mejores.indexOf(d.name)+1
          return grupo + ' · ' + interGroup + ' · ' + overall + '';
          }).call(halo1, heightBars * 0.225, 'white');

      // Líneas verticales de fechas
      svg
        .selectAll('.rect')
        .data(dates)
        .enter()
        .append('rect')
        .attrs({
          class: 'lines_years',
          x: (d, i) => fechasNotPlayed(i) - (heightBars * 0.05) / 2,
          y: y(distancia_entre_grupos + offsetGrupo) - heightBars / 2,
          width: heightBars * 0.05,
          height: heightBars * equipos_por_grupos,
          transform: `translate(${margin_left * 2}, 0)`,
        })
        .styles({ fill: black_color, opacity: 0.4 });

      // Rect gradiente lateral
      svg
        .append('rect')
        .attrs({
          class: 'bars_names',
          x: margin_left - 1,
          y: y(offsetGrupo),
          width: margin_left / 4,
          height: heightBars * equipos_por_grupos,
        })
        .style('fill', 'url(#areaGradient0)');

       /*  svg
        .append('rect')
        .attrs({
          class: 'bars_names',
          x: barWidth - margin_left - margin_left / 4,
          y: y(offsetGrupo),
          width: margin_left / 4,
          height: heightBars * equipos_por_grupos,
        })
        .style('fill', 'url(#areaGradient3)'); */

      svg
        .append('rect')
        .attrs({
          class: 'bars_names',
          x: 0,
          y: y(offsetGrupo),
          width: barWidth,
          height: heightBars / 2,
        })
        .style('fill', 'url(#areaGradient1)');

      svg
        .append('rect')
        .attrs({
          class: 'bars_names',
          x: 0,
          y: y(offsetGrupo) - heightBars,
          width: barWidth,
          height: heightBars / 2,
        })
        .style('fill', 'url(#areaGradient2)');

      // Líneas de posición por equipo
      names_1
        .filter((d) => d.split('-')[1] == grupo)
        .forEach((nombre) => {
          let wks = 0;
          const points = [];
          const club = nombre.split('-')[0];

          dates.forEach((o) => {
            const yearSlice1 = sort_teams1(data.filter((d) => d.semana == o && d.name.split('-')[1] == grupo && !isNaN(d.value)));
            const rank1 = yearSlice1.find((d) => d.name == nombre).rank + distancia_entre_grupos + offsetGrupo;

            if (wks > fechas_not_played) wks -= not_played_yet_x;
            if (o == dates[dates.length - 1] && fechas_not_played < dates.length - 1) wks += not_played_yet_x;

            points.push([x(wks), y(rank1)]);
            wks++;
          });

          /* const pathD = pathLine(points); */

          function offsetPoints(points, offset) {
            return points.map((p, i) => {
              let nx, ny;

              if (i === 0) {
                const dx = points[1][0] - points[0][0];
                const dy = points[1][1] - points[0][1];
                const len = Math.sqrt(dx * dx + dy * dy);
                nx = -dy / len;
                ny = dx / len;
              } else if (i === points.length - 1) {
                const dx = points[i][0] - points[i - 1][0];
                const dy = points[i][1] - points[i - 1][1];
                const len = Math.sqrt(dx * dx + dy * dy);
                nx = -dy / len;
                ny = dx / len;
              } else {
                // Normal del segmento anterior
                const dx1 = points[i][0] - points[i - 1][0];
                const dy1 = points[i][1] - points[i - 1][1];
                const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
                const nx1 = -dy1 / len1;
                const ny1 = dx1 / len1;

                // Normal del segmento siguiente
                const dx2 = points[i + 1][0] - points[i][0];
                const dy2 = points[i + 1][1] - points[i][1];
                const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                const nx2 = -dy2 / len2;
                const ny2 = dx2 / len2;

                // Promediar normales
                nx = (nx1 + nx2) / 2;
                ny = (ny1 + ny2) / 2;
                let nlen = Math.sqrt(nx * nx + ny * ny);

                if (nlen < 0.01) {
                  // Segmentos casi opuestos, usar la normal del anterior
                  nx = nx1;
                  ny = ny1;
                } else {
                  // Corrección miter: dividir por cos(θ/2) para mantener ancho constante
                  nx /= nlen * nlen;
                  ny /= nlen * nlen;

                  // Cap para evitar picos en ángulos muy cerrados
                  const miterLen = Math.sqrt(nx * nx + ny * ny);
                  if (miterLen > 2) {
                    nx = (nx / miterLen) * 2;
                    ny = (ny / miterLen) * 2;
                  }
                }
              }

              return [p[0] + nx * offset, p[1] + ny * offset];
            });
          }

          /* function drawFlagPath(svg, points, club, totalWidth = 6, transform = '', className = 'line') {
          const colors = FLAG_COLORS[club];
          if (!colors) {
            console.warn(`No se encontraron colores de bandera para: ${club}`);
            return;
          }
          const stripeWidth = totalWidth / colors.length;

          colors.forEach((color, i) => {
            const middleIndex = (colors.length - 1) / 2;
            const offset = (i - middleIndex) * stripeWidth;

            // Generar puntos desplazados perpendicularmente
            const offsetPts = offsetPoints(points, offset);
            const pathD = pathLine(offsetPts);

            svg.append('path')
              .attr('d', pathD)
              .attr('transform', transform)
              .attr('class', className)
              .style('fill', 'none')
              .style('stroke', color)
              .style('stroke-width', stripeWidth)
              .style('stroke-linejoin', 'round')
              .style('stroke-linecap', 'round');
          });
        } */

          function drawFlagPath(svg, points, club, totalWidth = 6, transform = '', className = 'line') {
            const colors = FLAG_COLORS[club];
            if (!colors) {
              console.warn(`No se encontraron colores de bandera para: ${club}`);
              return;
            }
            const stripeWidth = totalWidth / colors.length;

            // ── SOMBRA ──────────────────────────────────────────
            const shadowPath = pathLine(points);
            svg
              .append('path')
              .attr('d', shadowPath)
              .attr('transform', transform)
              .attr('class', className + ' flag-shadow')
              .style('fill', 'none')
              .style('stroke', 'rgba(0, 0, 0, 1)')
              .style('stroke-width', totalWidth + 2) // un poco más ancho que la bandera
              /* .style('stroke-linejoin', 'round')
              .style('stroke-linecap', 'round') */
              .style('filter', 'blur(1px)');

            // ── FRANJAS ─────────────────────────────────────────
            colors.forEach((color, i) => {
              const middleIndex = (colors.length - 1) / 2;
              const offset = (i - middleIndex) * stripeWidth;

              const offsetPts = offsetPoints(points, offset);
              const pathD = pathLine(offsetPts);

              svg.append('path').attr('d', pathD).attr('transform', transform).attr('class', className).style('fill', 'none').style('stroke', color).style('stroke-width', stripeWidth*1.1).style('stroke-linejoin', 'round')/* .style('stroke-linecap', 'round') */;
            });
          }

          drawFlagPath(svg, points, club, 15, `translate(${margin_left * 2}, 0)`, 'line');
        });
    });

    grupos_1.forEach((grupo, indice_grupo) => {
      names_1
        .filter((d) => d.split('-')[1] == grupo)
        .forEach((nombre) => {
          let wks = 0;

          dates.slice(0).forEach((o) => {
            let yearSlice1 = sort_teams1(data.filter((d) => d.semana == o && d.name.split('-')[1] == grupo && !isNaN(d.value)));

            let rank1 = yearSlice1.find((d) => d.name == nombre).rank + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos);

            wks > fechas_not_played ? (wks = wks - not_played_yet_x) : '';
            o == dates[dates.length - 1] && fechas_not_played < dates.length - 1 ? (wks = wks + not_played_yet_x) : '';

            if (yearSlice1.find((d) => d.name == nombre).vs != 'none') {
              let pts1 = yearSlice1.find((d) => d.name == nombre);

              let names_filter = data.filter((d) => d.name == pts1.name && d.fecha4 == pts1.fecha4);
              let fecha_filter = data.filter((d) => d.name.split('-')[1] == names_filter[0].name.split('-')[1] && d.fecha4 == pts1.fecha4);
              /* console.log(fecha_filter.filter(d => d.value == names_filter[0].value && d.name != names_filter[0].name)) */

              names_filter.forEach((team, i) => {
                let hor = names_filter.length == 2 ? (i == 0 ? heightBars * 0.0 : i == 1 ? -heightBars * 0.3 : 0) : names_filter.length == 3 ? (i == 0 ? heightBars * 0.38 : i == 2 ? -heightBars * 0.38 : 0) : 0;

                let hor_not_played_yet = team.goles_fecha == not_played_yet ? (names_filter.length == 2 ? (i == 0 ? heightBars * 0.18 : i == 1 ? -heightBars * 0.2 : 0) : names_filter.length == 3 ? (i == 0 ? heightBars * 0.0 : i == 2 ? -heightBars * 0.0 : 0) : 0) : 0;

                svg
                  .append('text')
                  .attrs({
                    transform: `translate(${margin_left * 2}, 0)`,
                    x: x(wks) + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor,
                    y: y(rank1) - heightBars * 0.325,
                  })
                  .styles({
                    fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : empate_color,
                    'font-weight': 600,
                    'font-size': defaults.value.style.font_size,
                    'text-anchor': 'middle',
                    'alignment-baseline': 'central',
                  })

                  .call((text) =>
                    text
                      .append('tspan')
                      .attrs({
                        transform: `translate(${margin_left * 2}, 0)`,
                        x: x(wks) - heightBars * 0.06 + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor,
                        y: y(rank1) + (!neutral ? - heightBars * 0.325 : - heightBars * 0.2) + (team.l_or_v == 'V' && !neutral ? heightBars * 0.65 : 0),
                      })
                      .styles({
                        fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : empate_color,
                        'font-weight': 600,
                        'font-size': defaults.value.style.font_size,
                        'text-anchor': 'end',
                        'alignment-baseline': 'central',
                      })
                      .text(`${team.l_or_v == 'V' ? (team.goles_en_contra_fecha == not_played_yet ? '' : team.goles_en_contra_fecha) : team.goles_fecha == not_played_yet ? '' : team.goles_fecha}`)
                      .text(`${team.goles_en_contra_fecha == not_played_yet ? '' : team.l_or_v == 'V' && !neutral ? team.goles_en_contra_fecha : team.goles_fecha}`)
                  )

                  .call((text) =>
                    text
                      .append('tspan')
                      .attrs({
                        transform: `translate(${margin_left * 2}, 0)`,
                        x: x(wks) + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor + hor_not_played_yet,
                        y: y(rank1) + (!neutral ? - heightBars * 0.325 : - heightBars * 0.2) + (team.l_or_v == 'V' && !neutral ? heightBars * 0.65 : 0),
                      })
                      .styles({
                        fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : team.goles_fecha == not_played_yet ? grey_color : empate_color,
                        'font-weight': 600,
                        'font-size': team.goles_fecha == not_played_yet ? defaults.value.style.font_size*0.75 : defaults.value.style.font_size,
                        'text-anchor': 'middle',
                        'alignment-baseline': 'central',
                      })
                      .text(team.goles_fecha == not_played_yet ? '-' : '-')
                  )

                  .call((text) =>
                    text
                      .append('tspan')
                      .attrs({
                        transform: `translate(${margin_left * 2}, 0)`,
                        x: x(wks) + heightBars * 0.06 + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor,
                        y: y(rank1) + (!neutral ? - heightBars * 0.325 : - heightBars * 0.2) + (team.l_or_v == 'V' && !neutral ? heightBars * 0.65 : 0),
                      })
                      .styles({
                        fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : empate_color,
                        'font-weight': 600,
                        'font-size': defaults.value.style.font_size,
                        'text-anchor': 'start',
                        'alignment-baseline': 'central',
                      })
                      .text(`${team.goles_fecha == not_played_yet ? '' : team.l_or_v == 'V' && !neutral ? team.goles_fecha : team.goles_en_contra_fecha}`)
                  )
                  .call(halo1, defaults.value.style.font_size, '#f1f1f1');

                  /* svg
                  .append('image')
                  .style('filter', 'url(#dropshadow)')
                  .attrs({
                    transform: `translate(${margin_left * 2}, 0)`,
                    class: 'line',
                    x: d => {
                      const dir = team.l_or_v == 'V' && !neutral ? -1 : -1;
                      let val = x(wks) + dir * heightBars * 0.3 - defaults.mini_logo.size1 / 2;
                      if (team.goles_fecha != not_played_yet) {
                        val += dir * team.goles_en_contra_fecha.toString().length * heightBars * 0.2;
                      }
                      return val;
                    },
                    y: y(rank1) - heightBars * 0.325 - defaults.mini_logo.size1 / 2 + (team.l_or_v == 'V' && !neutral ? heightBars * 0.65 : 0),
                    height: defaults.mini_logo.size1,
                    href: pts1.vs != 'none' ? `./escudos/${team.name.split('-')[0]}.png` : '',
                  }); */

                  // En tu sección de defs, agregá esto:
              const borderFilter = defs.append('filter').attr('id', 'white-border').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
              borderFilter.append('feMorphology').attrs({ operator: 'dilate', radius: 1.5, in: 'SourceAlpha', result: 'expanded' });
              borderFilter.append('feFlood').attrs({ 'flood-color': 'white', result: 'color' });
              borderFilter.append('feComposite').attrs({ in: 'color', in2: 'expanded', operator: 'in', result: 'border' });
              borderFilter.append('feMerge').selectAll('feMergeNode').data(['border', 'SourceGraphic']).enter().append('feMergeNode').attr('in', d => d);

                svg
                  .append('image')
                  .style('filter', 'url(#white-border)')
                  .attrs({
                    transform: `translate(${margin_left * 2}, 0)`,
                    class: 'line',
                    x: d => {
                      const dir = team.l_or_v == 'V' && !neutral ? -1 : !neutral ? 1 : 0;
                      let val = x(wks) + dir * heightBars * 0.3 - defaults.mini_logo.size1 / 2;
                      if (team.goles_fecha != not_played_yet) {
                        val += dir * team.goles_en_contra_fecha.toString().length * heightBars * 0.2;
                      }
                      return val;
                    },
                    y: y(rank1) + (!neutral ? - heightBars * 0.325 : heightBars * 0.2) - defaults.mini_logo.size1 / 2 + (team.l_or_v == 'V' && !neutral ? heightBars * 0.65 : 0),
                    height: defaults.mini_logo.size1,
                    href: pts1.vs != 'none' ? `./escudos/${team.vs.split('-')[0]}.png` : '',
                    /* opacity: pts1.vs != 'none' ? 0.75 : 1 */
                  });

                  // Calculá esto antes del bloque de svg.append('text')
/* function getCriterioValor(team, names_filter, usarDirecto, ga, statsDirectos, getRankingFIFA) {
  // Si está solo, mostrar puntos directamente
  if (names_filter.length === 1) return team.value;

  const semana = names_filter[0]?.semana; // ajustá según cómo lo tengas

  // Calculá stats directos una sola vez para todos los del grupo
  let sd = null;
  if (usarDirecto) {
    const empatados = names_filter.map(d => d.name);
    sd = statsDirectos(empatados, semana); // ajustá firma según tu implementación
  }

  const teamSD = sd?.[team.name];

  // Buscá el primer criterio donde team difiere de ALGUNO del grupo
  for (const other of names_filter) {
    if (other.name === team.name) continue;
    const otherSD = sd?.[other.name];

    if (usarDirecto && teamSD && otherSD) {
      if (teamSD.pts_directo !== otherSD.pts_directo)
        return teamSD.pts_directo;
      if (teamSD.diff_directo !== otherSD.diff_directo)
        return teamSD.diff_directo >= 0 ? `+${teamSD.diff_directo}` : teamSD.diff_directo;
      if (teamSD.gf_directo !== otherSD.gf_directo)
        return teamSD.gf_directo;
    }

    if (team.diferencia_de_goles !== other.diferencia_de_goles)
      return team.diferencia_de_goles >= 0 ? `+${team.diferencia_de_goles}` : team.diferencia_de_goles;

    if (team.goles !== other.goles)
      return team.goles;

    if ((team.fairPlay ?? 0) !== (other.fairPlay ?? 0))
      return team.fairPlay ?? 0;
  }

  // Todos empatados en todo → mostrar ranking FIFA
  return getRankingFIFA(team.name);
}

const criterioValor = getCriterioValor(team, names_filter); */

                /* svg
                  .append('text')
                  .attrs({
                    transform: `translate(${margin_left * 2}, 0)`,
                    x: x(wks) - heightBars * 0.0 + i * heightBars * 0.8 - (names_filter.length - 1) * (heightBars * 0.4),
                    y: y(rank1),
                  })
                  .styles({
                    fill: black_color,
                    'font-weight': 600,
                    'font-size': heightBars * 0.25,
                    'text-anchor': 'middle',
                    'alignment-baseline': 'central',
                  })
                  .text(() => {
                    if (team.goles_fecha != not_played_yet) {
                      if (fecha_filter.filter(d => d.value == names_filter[0].value && d.name != names_filter[0].name).length > 0) {

                        if (statsDirectos(fecha_filter.filter(d => d.value == names_filter[0].value).map(d => d.name), team.semana)[team.name].pj_directo > 0)
                          return team.value + ' [' + statsDirectos(fecha_filter.filter(d => d.value == names_filter[0].value).map(d => d.name), team.semana)[team.name].pts_directo +']';
                        else
                          return team.value + ' ' + team.diferencia_de_goles
                      } else {
                        return 'no pjdirecto'
                      }
                    }
                  })
                  .call(halo1, heightBars * 0.25, '#f1f1f1') */

                  /* svg
                  .append('text')
                  .attrs({
                    transform: `translate(${margin_left * 2}, 0)`,
                    x: x(wks) - heightBars * 0.0 + i * heightBars * 0.8 - (names_filter.length - 1) * (heightBars * 0.4),
                    y: y(rank1),
                  })
                  .styles({
                    fill: black_color,
                    'font-weight': 600,
                    'font-size': heightBars * 0.25,
                    'text-anchor': 'middle',
                    'alignment-baseline': 'central',
                  })
                  .text(() => {
                    let directos = statsDirectos(fecha_filter.filter(d => d.value == names_filter[0].value).map(d => d.name), team.semana)[team.name]
                    if (team.goles_fecha != not_played_yet) {
                      return team.value + ' [' + directos.pts_directo + ' ' + directos.diff_directo + ' ' + directos.gf_directo + '] ' + team.diferencia_de_goles + ' ' +  team.goles
                    }
                  })
                  .call(halo1, heightBars * 0.25, '#f1f1f1') */

                  if (!nombre_torneo.includes('Mundial')) {

                svg.append('image').attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  class: 'line',
                  x: x(wks) - heightBars * 0.025 + (team.racha1 > 2 ? heightBars * 0.175 : team.racha_derrotas1 > 2 ? heightBars * 0.175 : team.racha_empates1 > 2 ? heightBars * 0.175 : team.racha_sin_victorias1 > 2 ? heightBars * 0.145 : team.racha_sin_derrotas1 > 2 ? heightBars * 0.145 : team.racha_sin_empates1 > 2 ? heightBars * 0.145 : 0) - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + i * heightBars * 0.55 - (names_filter.length - 1) * (heightBars * 0.325),
                  y: y(rank1) + (team.l_or_v == 'V' ? -heightBars * 0.31 : +heightBars * 0.31) - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
                  height: (team.racha1 > 2 ? heightBars * 0.45 : team.racha_derrotas1 > 2 ? heightBars * 0.45 : team.racha_empates1 > 2 ? heightBars * 0.45 : team.racha_sin_victorias1 > 2 ? heightBars * 0.5 : team.racha_sin_derrotas1 > 2 ? heightBars * 0.5 : team.racha_sin_empates1 > 2 ? heightBars * 0.5 : 0) + defaults.subValue.style.font_size * 0.35,
                  href: team.goles_fecha !== not_played_yet ? (team.racha1 > 2 ? `./icons/green_flame2.png` : team.racha_derrotas1 > 2 ? `./icons/red_flame2.png` : team.racha_empates1 > 2 ? `./icons/yellow_flame2.png` : team.racha_sin_victorias1 > 2 ? `./icons/racha_sin_victorias2.png` : team.racha_sin_derrotas1 > 2 ? `./icons/racha_sin_derrotas2.png` : team.racha_sin_empates1 > 2 ? `./icons/racha_sin_empates2.png` : '') : '',
                });

                svg
                  .append('text')
                  .attrs({
                    transform: `translate(${margin_left * 2}, 0)`,
                    class: 'line',
                    x: x(wks) - (team.racha1 > 2 ? heightBars * 0.01 : team.racha_derrotas1 > 2 ? heightBars * 0.01 : team.racha_empates1 > 2 ? heightBars * 0.01 : team.racha_sin_victorias1 > 2 ? heightBars * 0.01 : team.racha_sin_derrotas1 > 2 ? heightBars * 0.01 : team.racha_sin_empates1 > 2 ? heightBars * 0.01 : 0) + i * heightBars * 0.55 - (names_filter.length - 1) * (heightBars * 0.325),
                    y: y(rank1) + (team.l_or_v == 'V' ? -heightBars * 0.31 : +heightBars * 0.31),
                  })
                  .styles({
                    'font-weight': 600,
                    'font-size': defaults.subValue.style.font_size,
                    fill: team.racha1 > 2 ? black_color : team.racha_derrotas1 > 2 ? black_color : team.racha_empates1 > 2 ? black_color : black_color,
                    'text-anchor': 'end',
                    'alignment-baseline': 'central',
                  })
                  .text(team.goles_fecha !== not_played_yet ? (team.racha1 > 2 ? team.racha1 : team.racha_derrotas1 > 2 ? team.racha_derrotas1 : team.racha_empates1 > 2 ? team.racha_empates1 : team.racha_sin_victorias1 > 2 ? team.racha_sin_victorias1 : team.racha_sin_derrotas1 > 2 ? team.racha_sin_derrotas1 : team.racha_sin_empates1 > 2 ? team.racha_sin_empates1 : '') : '')
                  .call(halo1, defaults.subValue.style.font_size, '#f1f1f1');
                }
                

                svg.append('image').attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  class: 'line',
                  x: x(wks) + defaults.value.style.font_size - (defaults.mini_logo.size * 0.45) / 2 + i * heightBars * 0.8 - (names_filter.length - 1) * (heightBars * 0.4),
                  y: y(rank1) - (defaults.mini_logo.size * 0.45) / 2,
                  height: defaults.mini_logo.size * 0.45,
                  href: team.pts_deducted > 0 ? `./icons/redasterisk1.png` : '',
                });

                svg
                  .append('text')
                  .attrs({
                    transform: `translate(${margin_left * 2}, 0)`,
                    x: x(wks) + heightBars * 0.45 + i * heightBars * 0.8 - (names_filter.length - 1) * (heightBars * 0.4),
                    y: y(rank1),
                  })
                  .styles({
                    fill: derrota_color,
                    'font-weight': 600,
                    'font-size': heightBars * 0.18,
                    'text-anchor': 'start',
                    'alignment-baseline': 'central',
                  })
                  .text(`${team.pts_deducted > 0 ? team.pts_deducted : ''} `)
                  .call(halo1, heightBars * 0.18, '#f1f1f1');
              });

              if (!nombre_torneo.includes('Mundial')) {

              svg
                .append('image')
                /* .style('filter', 'url(#dropshadow)') */
                .attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  class: 'line',
                  x: x(wks) + heightBars * 0.8 - defaults.mini_logo.size / 2 + (pts1.vs == 'none' ? -heightBars * 0.8 : 0) + (names_filter.length - 1) * (heightBars * 0.5) + (pts1.l_or_v == 'V' ? -heightBars * 0.35 : heightBars * 0.0) + (pts1.l_or_v == 'V' && pts1.goles_en_contra_fecha == 1 ? heightBars * 0.05 : pts1.goles_en_contra_fecha == 1 ? -heightBars * 0.05 : heightBars * 0.0),
                  y: y(rank1) - heightBars / 3.25 - defaults.mini_logo.size / 2,
                  height: defaults.mini_logo.size,
                  href: pts1.campeonato_ganado_matematicamente == 1 ? `./icons/trofeo1.png` : '',
                });

              }
            } else {
              let pts1 = yearSlice1.find((d) => d.name == nombre);
              svg
                .append('text')
                .attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  x: x(wks) - heightBars * 0.0,
                  y: y(rank1),
                })
                .styles({
                  fill: pts1.campeonato_perdido_matematicamente == 1 ? derrota_color : pts1.campeonato_ganado_matematicamente1 == 1 ? victoria_color : black_color,
                  'font-weight': 600,
                  'font-size': heightBars * 0.25,
                  'text-anchor': 'middle',
                  'alignment-baseline': 'central',
                })
                .text(`${pts1.final != true ? pts1.value : ''}`)
                .call(halo1, heightBars * 0.25, '#f1f1f1');
            }

            let pts1 = yearSlice1.find((d) => d.name == nombre);

            if (!nombre_torneo.includes('Mundial')) {

            svg
              .append('text')
              .attrs({
                transform: `translate(${margin_left * 2}, 0)`,
                class: 'line',
                x: x(wks) + heightBars * 0.01 + weeks * 0.65,
                y: y(rank1) + (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : pts1.racha_sin_empates > 2 ? -heightBars / 3.25 : heightBars / 3.25),
              })
              .styles({
                'font-weight': 600,
                'font-size': defaults.subValue.style.font_size,
                fill: black_color,
                'text-anchor': 'end',
                'alignment-baseline': 'central',
              })
              .text(pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_victorias > 2 ? pts1.racha_sin_victorias : '') : '') : '')
              .call(halo1, defaults.subValue.style.font_size, '#f1f1f1');

            

            svg.append('image').attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: 'line',
              x: x(wks) + heightBars * 0.125 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + weeks * 0.65,
              y: y(rank1) + (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : pts1.racha_sin_empates > 2 ? -heightBars / 3.25 : heightBars / 3.25) - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
              height: defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35,
              href: pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_victorias > 2 ? `./icons/racha_sin_victorias2.png` : '') : '') : '',
            });

            svg
              .append('text')
              .attrs({
                transform: `translate(${margin_left * 2}, 0)`,
                class: 'line',
                x: x(wks) + heightBars * 0.01 + weeks * 0.65,
                y: y(rank1) + heightBars / 3.25,
              })
              .styles({
                'font-weight': 600,
                'font-size': defaults.subValue.style.font_size,
                fill: black_color,
                'text-anchor': 'end',
                'alignment-baseline': 'central',
              })
              .text(pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_derrotas > 2 ? pts1.racha_sin_derrotas : '') : '') : '')
              .call(halo1, defaults.subValue.style.font_size, '#f1f1f1');

            svg.append('image').attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: 'line',
              x: x(wks) + heightBars * 0.125 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + weeks * 0.65,
              y: y(rank1) + heightBars / 3.25 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
              height: defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35,
              href: pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_derrotas > 2 ? `./icons/racha_sin_derrotas2.png` : '') : '') : '',
            });

            svg
              .append('text')
              .attrs({
                transform: `translate(${margin_left * 2}, 0)`,
                class: 'line',
                x: x(wks) + heightBars * 0.01 + weeks * 0.65,
                y: y(rank1) + (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : heightBars / 3.25),
              })
              .styles({
                'font-weight': 600,
                'font-size': defaults.subValue.style.font_size,
                fill: black_color,
                'text-anchor': 'end',
                'alignment-baseline': 'central',
              })
              .text(pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_empates > 2 ? pts1.racha_sin_empates : '') : '') : '')
              .call(halo1, defaults.subValue.style.font_size, '#f1f1f1');

            svg.append('image').attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: 'line',
              x: x(wks) + heightBars * 0.125 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + weeks * 0.65,
              y: y(rank1) + (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : heightBars / 3.25) - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
              height: defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35,
              href: pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_empates > 2 ? `./icons/racha_sin_empates2.png` : '') : '') : '',
            });

          }

            wks++;
          });
        });
    });
  } else {
    svg
      .selectAll('.rect')
      .data(dates)
      .enter()
      .append('rect')
      .attrs({
        class: 'lines_years',
        x: (d, i) => fechasNotPlayed(i) - (heightBars * 0.05) / 2,
        y: y(0) - heightBars / 2,
        width: heightBars * 0.05,
        height: height,
        transform: `translate(${margin_left * 2}, 0)`,
        'clip-path': `url(#ellipse-clip-margin-left)`,
      })
      .styles({
        fill: black_color,
        opacity: 0.4,
      });
    /* svg
      .selectAll('.rect')
      .data(dates)
      .enter()
      .append('rect')
      .attrs({
        class: 'lines_years',
        x: (d, i) => fechasNotPlayed(i) - (heightBars * 0.05) / 2,
        y: y(0) - heightBars / 2,
        width: heightBars * 0.05,
        height: heightBars * equipos_por_grupos,
        transform: `translate(${margin_left * 2}, 0)`,
      })
      .styles({
        fill: black_color,
        opacity: 0.4,
      }); */

    /*  svg
      .append('rect')
      .attrs({
        class: 'bars_names',
        x: margin_left - 1,
        y: y(0),
        width: width,
        height: heightBars * equipos_por_grupos,
      })
      .styles({
        fill: 'url(#areaGradient0)',
      }); */
    /* if (nombre !== 'Defensa y Justicia') return; */

    names_1.forEach((nombre) => {
      let wks = 0;
      const points = [];
      const club = nombre.split('-')[0];

      dates.forEach((o) => {
        const yearSlice1 = sort_teams1(data.filter((d) => d.semana == o && !isNaN(d.value)));
        const rank1 = yearSlice1.find((d) => d.name == nombre).rank;

        if (wks > fechas_not_played) wks -= not_played_yet_x;
        if (o == dates[dates.length - 1] && fechas_not_played < dates.length - 1) wks += not_played_yet_x;

        points.push([x(wks), y(rank1)]);
        wks++;
      });

      /* const pathD = pathLine(points); */

      function offsetPoints(points, offset) {
        return points.map((p, i) => {
          let nx, ny;

          if (i === 0) {
            const dx = points[1][0] - points[0][0];
            const dy = points[1][1] - points[0][1];
            const len = Math.sqrt(dx * dx + dy * dy);
            nx = -dy / len;
            ny = dx / len;
          } else if (i === points.length - 1) {
            const dx = points[i][0] - points[i - 1][0];
            const dy = points[i][1] - points[i - 1][1];
            const len = Math.sqrt(dx * dx + dy * dy);
            nx = -dy / len;
            ny = dx / len;
          } else {
            // Normal del segmento anterior
            const dx1 = points[i][0] - points[i - 1][0];
            const dy1 = points[i][1] - points[i - 1][1];
            const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
            const nx1 = -dy1 / len1;
            const ny1 = dx1 / len1;

            // Normal del segmento siguiente
            const dx2 = points[i + 1][0] - points[i][0];
            const dy2 = points[i + 1][1] - points[i][1];
            const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            const nx2 = -dy2 / len2;
            const ny2 = dx2 / len2;

            // Promediar normales
            nx = (nx1 + nx2) / 2;
            ny = (ny1 + ny2) / 2;
            let nlen = Math.sqrt(nx * nx + ny * ny);

            if (nlen < 0.01) {
              // Segmentos casi opuestos, usar la normal del anterior
              nx = nx1;
              ny = ny1;
            } else {
              // Corrección miter: dividir por cos(θ/2) para mantener ancho constante
              nx /= nlen * nlen;
              ny /= nlen * nlen;

              // Cap para evitar picos en ángulos muy cerrados
              const miterLen = Math.sqrt(nx * nx + ny * ny);
              if (miterLen > 2) {
                nx = (nx / miterLen) * 2;
                ny = (ny / miterLen) * 2;
              }
            }
          }

          return [p[0] + nx * offset, p[1] + ny * offset];
        });
      }

      function drawFlagPath(svg, points, club, totalWidth = 6, transform = '', className = 'line') {
            const colors = FLAG_COLORS[club];
            if (!colors) {
              console.warn(`No se encontraron colores de bandera para: ${club}`);
              return;
            }
            const stripeWidth = totalWidth / colors.length;

            // ── SOMBRA ──────────────────────────────────────────
            const shadowPath = pathLine(points);
            svg
              .append('path')
              .attr('d', shadowPath)
              .attr('transform', transform)
              .attr('class', className + ' flag-shadow')
              .style('fill', 'none')
              .style('stroke', 'rgba(0, 0, 0, 1)')
              .style('stroke-width', totalWidth + 2) // un poco más ancho que la bandera
              /* .style('stroke-linejoin', 'round')
              .style('stroke-linecap', 'round') */
              .style('filter', 'blur(1px)')/* .attr('opacity', d => { if (club != 'Vélez Sarsfield' && club != `Newell's Old Boys`) return 0 }) */;

            // ── FRANJAS ─────────────────────────────────────────
            colors.forEach((color, i) => {
              const middleIndex = (colors.length - 1) / 2;
              const offset = (i - middleIndex) * stripeWidth;

              const offsetPts = offsetPoints(points, offset);
              const pathD = pathLine(offsetPts);

              svg.append('path').attr('d', pathD).attr('transform', transform).attr('class', className).style('fill', 'none').style('stroke', color).style('stroke-width', stripeWidth*1.1).style('stroke-linejoin', 'round')/* .style('stroke-linecap', 'round') *//* .attr('opacity', d => { if (club != 'Vélez Sarsfield' && club != `Newell's Old Boys`) return 0 }) */;
            });
          }

          drawFlagPath(svg, points, club, 15, `translate(${margin_left * 2}, 0)`, 'line');
    });

    names_1.forEach((nombre) => {
      let wks = 0;

      dates.slice(0).forEach((o) => {
        let yearSlice1 = sort_teams1(data.filter((d) => d.semana == o && !isNaN(d.value)));

        let rank1 = yearSlice1.find((d) => d.name == nombre).rank;

        wks > fechas_not_played ? (wks = wks - not_played_yet_x) : '';
        o == dates[dates.length - 1] && fechas_not_played < dates.length - 1 ? (wks = wks + not_played_yet_x) : '';

        if (yearSlice1.find((d) => d.name == nombre).vs != 'none') {
          let pts1 = yearSlice1.find((d) => d.name == nombre);

          let names_filter = data.filter((d) => d.name == pts1.name && d.fecha4 == pts1.fecha4);

          names_filter.forEach((team, i) => {
            let hor = names_filter.length == 2 ? (i == 0 ? heightBars * 0.0 : i == 1 ? -heightBars * 0.3 : 0) : names_filter.length == 3 ? (i == 0 ? heightBars * 0.38 : i == 2 ? -heightBars * 0.38 : 0) : 0;

            let hor_not_played_yet = team.goles_fecha == not_played_yet ? (names_filter.length == 2 ? (i == 0 ? heightBars * 0.18 : i == 1 ? -heightBars * 0.2 : 0) : names_filter.length == 3 ? (i == 0 ? heightBars * 0.0 : i == 2 ? -heightBars * 0.0 : 0) : 0) : 0;

            svg
              .append('text')
              .attrs({
                transform: `translate(${margin_left * 2}, 0)`,
                x: x(wks) + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor,
                y: y(rank1) - heightBars * 0.325,
              })
              .styles({
                fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : empate_color,
                'font-weight': 600,
                'font-size': defaults.value.style.font_size,
                'text-anchor': 'middle',
                'alignment-baseline': 'central',
              })

              .call((text) =>
                text
                  .append('tspan')
                  .attrs({
                    transform: `translate(${margin_left * 2}, 0)`,
                    x: x(wks) - heightBars * 0.06 + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor,
                    y: y(rank1) - heightBars * 0.325 + (team.l_or_v == 'V' ? heightBars * 0.65 : 0),
                  })
                  .styles({
                    fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : empate_color,
                    'font-weight': 600,
                    'font-size': defaults.value.style.font_size,
                    'text-anchor': 'end',
                    'alignment-baseline': 'central',
                  })
                  .text(`${team.l_or_v == 'V' ? (team.goles_en_contra_fecha == not_played_yet ? '' : team.goles_en_contra_fecha) : team.goles_fecha == not_played_yet ? '' : team.goles_fecha}`)
                  .text(`${team.goles_fecha == not_played_yet ? '' : team.l_or_v == 'V' ? team.goles_en_contra_fecha : team.goles_fecha}`)
              )

              .call((text) =>
                text
                  .append('tspan')
                  .attrs({
                    transform: `translate(${margin_left * 2}, 0)`,
                    x: x(wks) + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor + hor_not_played_yet,
                    y: y(rank1) - heightBars * 0.325 + (team.l_or_v == 'V' ? heightBars * 0.65 : 0),
                  })
                  .styles({
                    fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : team.goles_fecha == not_played_yet ? grey_color : empate_color,
                    'font-weight': 600,
                    'font-size': defaults.value.style.font_size,
                    'text-anchor': 'middle',
                    'alignment-baseline': 'central',
                  })
                  .text(`-`)
              )

              .call((text) =>
                text
                  .append('tspan')
                  .attrs({
                    transform: `translate(${margin_left * 2}, 0)`,
                    x: x(wks) + heightBars * 0.06 + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor,
                    y: y(rank1) - heightBars * 0.325 + (team.l_or_v == 'V' ? heightBars * 0.65 : 0),
                  })
                  .styles({
                    fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : empate_color,
                    'font-weight': 600,
                    'font-size': defaults.value.style.font_size,
                    'text-anchor': 'start',
                    'alignment-baseline': 'central',
                  })
                  .text(`${team.goles_fecha == not_played_yet ? '' : team.l_or_v == 'V' ? team.goles_fecha : team.goles_en_contra_fecha}`)
              )
              .call(halo1, defaults.value.style.font_size, '#f1f1f1');

            svg
              .append('image')
              .style('filter', 'url(#dropshadow)')
              .attrs({
                transform: `translate(${margin_left * 2}, 0)`,
                class: 'line',
                x: d => {
                    const dir = team.l_or_v == 'V' ? -1 : 1;
                    let val = x(wks) + dir * heightBars * 0.3 - defaults.mini_logo.size1 / 2;
                    if (team.goles_fecha != not_played_yet) {
                      val += dir * team.goles_en_contra_fecha.toString().length * heightBars * 0.2;
                    }
                    return val;
                  },
                y: y(rank1) - heightBars * 0.325 - defaults.mini_logo.size1 / 2 + (team.l_or_v == 'V' ? heightBars * 0.65 : 0),
                height: defaults.mini_logo.size1,
                href: pts1.vs != 'none' ? `./escudos/${team.vs.split('-')[0]}.png` : '',
              });

            svg
              .append('image')
              /* .style('filter', 'url(#dropshadow)') */
              .attrs({
                transform: `translate(${margin_left * 2}, 0)`,
                class: 'line',
                x: x(wks) + heightBars * 0.2 + (team.goles_fecha == not_played_yet ? (team.l_or_v == 'L' ? heightBars * 0.2 : -heightBars * 0.2) : 0) + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor + hor_not_played_yet + defaults.mini_logo.size1 * 0.35 + (team.l_or_v == 'L' ? -heightBars * 0.95 : 0),
                y: y(rank1) - heightBars * 0.325 - defaults.mini_logo.size1 / 2 + (team.l_or_v == 'V' ? heightBars * 0.65 : 0),
                height: defaults.mini_logo.size1,
                href: pts1.vs != 'none' ? (team.simulado ? `./icons/simulated.png` : '') : '',
              });

            svg
              .append('text')
              .attrs({
                transform: `translate(${margin_left * 2}, 0)`,
                x: x(wks) - heightBars * 0.0 + i * heightBars * 0.8 - (names_filter.length - 1) * (heightBars * 0.4),
                y: y(rank1),
              })
              .styles({
                fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : empate_color,
                'font-weight': 600,
                'font-size': heightBars * 0.225,
                'text-anchor': 'middle',
                'alignment-baseline': 'central',
              })
              .text(`${team.goles_fecha == not_played_yet ? '' : team.value}`)
              .call(halo1, heightBars * 0.225, '#f1f1f1');

            svg.append('image').attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: 'line',
              x: x(wks) - heightBars * 0.025 + (team.racha1 > 2 ? heightBars * 0.175 : team.racha_derrotas1 > 2 ? heightBars * 0.175 : team.racha_empates1 > 2 ? heightBars * 0.175 : team.racha_sin_victorias1 > 2 ? heightBars * 0.145 : team.racha_sin_derrotas1 > 2 ? heightBars * 0.145 : team.racha_sin_empates1 > 2 ? heightBars * 0.145 : 0) - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + i * heightBars * 0.55 - (names_filter.length - 1) * (heightBars * 0.325),
              y: y(rank1) + (team.l_or_v == 'V' ? -heightBars * 0.31 : +heightBars * 0.31) - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
              height: (team.racha1 > 2 ? heightBars * 0.45 : team.racha_derrotas1 > 2 ? heightBars * 0.45 : team.racha_empates1 > 2 ? heightBars * 0.45 : team.racha_sin_victorias1 > 2 ? heightBars * 0.5 : team.racha_sin_derrotas1 > 2 ? heightBars * 0.5 : team.racha_sin_empates1 > 2 ? heightBars * 0.5 : 0) + defaults.subValue.style.font_size * 0.35,
              href: team.goles_fecha !== not_played_yet ? (team.racha1 > 2 ? `./icons/green_flame2.png` : team.racha_derrotas1 > 2 ? `./icons/red_flame2.png` : team.racha_empates1 > 2 ? `./icons/yellow_flame2.png` : team.racha_sin_victorias1 > 2 ? `./icons/racha_sin_victorias2.png` : team.racha_sin_derrotas1 > 2 ? `./icons/racha_sin_derrotas2.png` : team.racha_sin_empates1 > 2 ? `./icons/racha_sin_empates2.png` : '') : '',
            });

            svg
              .append('text')
              .attrs({
                transform: `translate(${margin_left * 2}, 0)`,
                class: 'line',
                x: x(wks) - (team.racha1 > 2 ? heightBars * 0.01 : team.racha_derrotas1 > 2 ? heightBars * 0.01 : team.racha_empates1 > 2 ? heightBars * 0.01 : team.racha_sin_victorias1 > 2 ? heightBars * 0.01 : team.racha_sin_derrotas1 > 2 ? heightBars * 0.01 : team.racha_sin_empates1 > 2 ? heightBars * 0.01 : 0) + i * heightBars * 0.55 - (names_filter.length - 1) * (heightBars * 0.325),
                y: y(rank1) + (team.l_or_v == 'V' ? -heightBars * 0.31 : +heightBars * 0.31),
              })
              .styles({
                'font-weight': 600,
                'font-size': defaults.subValue.style.font_size,
                fill: team.racha1 > 2 ? black_color : team.racha_derrotas1 > 2 ? black_color : team.racha_empates1 > 2 ? black_color : black_color,
                'text-anchor': 'end',
                'alignment-baseline': 'central',
              })
              .text(team.goles_fecha !== not_played_yet ? (team.racha1 > 2 ? team.racha1 : team.racha_derrotas1 > 2 ? team.racha_derrotas1 : team.racha_empates1 > 2 ? team.racha_empates1 : team.racha_sin_victorias1 > 2 ? team.racha_sin_victorias1 : team.racha_sin_derrotas1 > 2 ? team.racha_sin_derrotas1 : team.racha_sin_empates1 > 2 ? team.racha_sin_empates1 : '') : '')
              .call(halo1, defaults.subValue.style.font_size, '#f1f1f1');

            svg.append('image').attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: 'line',
              x: x(wks) + defaults.value.style.font_size - (defaults.mini_logo.size * 0.45) / 2 + i * heightBars * 0.8 - (names_filter.length - 1) * (heightBars * 0.4),
              y: y(rank1) - (defaults.mini_logo.size * 0.45) / 2,
              height: defaults.mini_logo.size * 0.45,
              href: team.pts_deducted > 0 ? `./icons/redasterisk1.png` : '',
            });

            svg
              .append('text')
              .attrs({
                transform: `translate(${margin_left * 2}, 0)`,
                x: x(wks) + heightBars * 0.45 + i * heightBars * 0.8 - (names_filter.length - 1) * (heightBars * 0.4),
                y: y(rank1),
              })
              .styles({
                fill: derrota_color,
                'font-weight': 600,
                'font-size': heightBars * 0.18,
                'text-anchor': 'start',
                'alignment-baseline': 'central',
              })
              .text(`${team.pts_deducted > 0 ? team.pts_deducted : ''} `)
              .call(halo1, heightBars * 0.18, '#f1f1f1');
          });

          svg
            .append('image')
            /* .style('filter', 'url(#dropshadow)') */
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: 'line',
              x: x(wks) + heightBars * 0.8 - defaults.mini_logo.size / 2 + (pts1.vs == 'none' ? -heightBars * 0.8 : 0) + (names_filter.length - 1) * (heightBars * 0.5) + (pts1.l_or_v == 'V' ? -heightBars * 0.35 : heightBars * 0.0) + (pts1.l_or_v == 'V' && pts1.goles_en_contra_fecha == 1 ? heightBars * 0.05 : pts1.goles_en_contra_fecha == 1 ? -heightBars * 0.05 : heightBars * 0.0),
              y: y(rank1) - heightBars / 3.25 - defaults.mini_logo.size / 2,
              height: defaults.mini_logo.size,
              href: pts1.campeonato_ganado_matematicamente == 1 ? `./icons/trofeo1.png` : '',
            });
        } else {
          let pts1 = yearSlice1.find((d) => d.name == nombre);
          svg
            .append('text')
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              x: x(wks) - heightBars * 0.0,
              y: y(rank1),
            })
            .styles({
              fill: pts1.campeonato_perdido_matematicamente == 1 ? derrota_color : pts1.campeonato_ganado_matematicamente1 == 1 ? victoria_color : black_color,
              'font-weight': 600,
              'font-size': heightBars * 0.25,
              'text-anchor': 'middle',
              'alignment-baseline': 'central',
            })
            .text(`${pts1.final != true ? pts1.value : ''}`)
            .call(halo1, heightBars * 0.25, '#f1f1f1');
        }

        let pts1 = yearSlice1.find((d) => d.name == nombre);

        svg
          .append('text')
          .attrs({
            transform: `translate(${margin_left * 2}, 0)`,
            class: 'line',
            x: x(wks) + heightBars * 0.01 + weeks * 0.65,
            y: y(rank1) + (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : pts1.racha_sin_empates > 2 ? -heightBars / 3.25 : heightBars / 3.25),
          })
          .styles({
            'font-weight': 600,
            'font-size': defaults.subValue.style.font_size,
            fill: black_color,
            'text-anchor': 'end',
            'alignment-baseline': 'central',
          })
          .text(pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_victorias > 2 ? pts1.racha_sin_victorias : '') : '') : '')
          .call(halo1, defaults.subValue.style.font_size, '#f1f1f1');

        svg.append('image').attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: 'line',
          x: x(wks) + heightBars * 0.125 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + weeks * 0.65,
          y: y(rank1) + (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : pts1.racha_sin_empates > 2 ? -heightBars / 3.25 : heightBars / 3.25) - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
          height: defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35,
          href: pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_victorias > 2 ? `./icons/racha_sin_victorias2.png` : '') : '') : '',
        });

        svg
          .append('text')
          .attrs({
            transform: `translate(${margin_left * 2}, 0)`,
            class: 'line',
            x: x(wks) + heightBars * 0.01 + weeks * 0.65,
            y: y(rank1) + heightBars / 3.25,
          })
          .styles({
            'font-weight': 600,
            'font-size': defaults.subValue.style.font_size,
            fill: black_color,
            'text-anchor': 'end',
            'alignment-baseline': 'central',
          })
          .text(pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_derrotas > 2 ? pts1.racha_sin_derrotas : '') : '') : '')
          .call(halo1, defaults.subValue.style.font_size, '#f1f1f1');

        svg.append('image').attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: 'line',
          x: x(wks) + heightBars * 0.125 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + weeks * 0.65,
          y: y(rank1) + heightBars / 3.25 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
          height: defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35,
          href: pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_derrotas > 2 ? `./icons/racha_sin_derrotas2.png` : '') : '') : '',
        });

        svg
          .append('text')
          .attrs({
            transform: `translate(${margin_left * 2}, 0)`,
            class: 'line',
            x: x(wks) + heightBars * 0.01 + weeks * 0.65,
            y: y(rank1) + (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : heightBars / 3.25),
          })
          .styles({
            'font-weight': 600,
            'font-size': defaults.subValue.style.font_size,
            fill: black_color,
            'text-anchor': 'end',
            'alignment-baseline': 'central',
          })
          .text(pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_empates > 2 ? pts1.racha_sin_empates : '') : '') : '')
          .call(halo1, defaults.subValue.style.font_size, '#f1f1f1');

        svg.append('image').attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: 'line',
          x: x(wks) + heightBars * 0.125 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + weeks * 0.65,
          y: y(rank1) + (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : heightBars / 3.25) - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
          height: defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35,
          href: pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_empates > 2 ? `./icons/racha_sin_empates2.png` : '') : '') : '',
        });

        wks++;
      });
    });
  }

  var areaGradient0 = svg.append('defs').append('linearGradient').attr('id', 'areaGradient0').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');

  areaGradient0.append('stop').attr('offset', '0%').attr('stop-color', '#000').attr('stop-opacity', 0.2);

  areaGradient0.append('stop').attr('offset', '100%').attr('stop-color', '#000').attr('stop-opacity', 0);

  var areaGradient3 = svg.append('defs').append('linearGradient').attr('id', 'areaGradient3').attr('x1', '100%').attr('y1', '0%').attr('x2', '0%').attr('y2', '0%');

  areaGradient3.append('stop').attr('offset', '0%').attr('stop-color', '#000').attr('stop-opacity', 0.2);

  areaGradient3.append('stop').attr('offset', '100%').attr('stop-color', '#000').attr('stop-opacity', 0);

  var areaGradient1 = svg.append('defs').append('linearGradient').attr('id', 'areaGradient1').attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');

  areaGradient1.append('stop').attr('offset', '0%').attr('stop-color', '#000').attr('stop-opacity', 0.2);

  areaGradient1.append('stop').attr('offset', '100%').attr('stop-color', '#000').attr('stop-opacity', 0);

  var areaGradient2 = svg.append('defs').append('linearGradient').attr('id', 'areaGradient2').attr('x1', '0%').attr('y1', '100%').attr('x2', '0%').attr('y2', '0%');

  areaGradient2.append('stop').attr('offset', '0%').attr('stop-color', '#000').attr('stop-opacity', 0.2);

  areaGradient2.append('stop').attr('offset', '100%').attr('stop-color', '#000').attr('stop-opacity', 0);

  if (grupos > 1) {
    /* grupos_1.forEach((e, index) => {
      svg
        .selectAll('.text')
        .data(d3.range(1, equipos_por_grupos + 1))
        .enter()
        .append('text')
        .attrs({
          x: margin_left / 2,
          y: (d, i) => y(i + 0.5 + index * equipos_por_grupos) + (index * heightBars) / 2,
        })
        .styles({
          fill: black_color,
          'font-size': heightBars * 0.5,
          'alignment-baseline': 'central',
          'text-anchor': 'middle',
          'font-weight': 600,
        })
        .text((d) => d);
    }); */
  } else {
    svg
      .append('rect')
      .attrs({
        class: 'bars_names',
        x: margin_left - 1,
        y: margin.top * 0.5,
        width: margin_left / 4,
        height: height,
      })
      .styles({
        fill: (d, i) => (i == 0 ? 'url(#areaGradient0)' : i % 2 == 1 ? 'url(#areaGradient0)' : 'url(#areaGradient0)'),
      });

    svg
      .selectAll('.text')
      .data(d3.range(1, top_n + 1))
      .enter()
      .append('text')
      .attrs({
        x: margin_left / 2,
        y: (d, i) => y(i),
      })
      .styles({
        fill: black_color,
        'font-size': heightBars * 0.5,
        'alignment-baseline': 'central',
        'text-anchor': 'middle',
        'font-weight': 600,
      })
      .text((d) => d);
  }

  /* svg.append('image').attrs({
    x: margin_left / 2 - (margin_left * 0.8) / 2,
    y: margin.top * 0.8 - ((120 / 204) * margin_left * 0.8) / 2,
    width: margin_left * 0.8,
    href: `./country-flags/flag-of-${data1[0].pais}.png`,
  }); */

  /* svg.append('image').attrs({
    x: margin_left * 0.5 - (heightBars * 0.75) / 2,
    y: margin.top * 0.3 - (heightBars * 0.75) / 2,
    height: heightBars * 0.75,
    href: `./escudos/${nombre_torneo}.png`,
  }); */

  let partidos_siumaldos = data.find(d => d.simulado)

  if (partidos_siumaldos) {

    svg.append('image').attrs({
      x: margin_left * 1.5 - (heightBars * 0.7) / 2,
      y: margin.top * 0.3 - (heightBars * 0.7) / 2,
      height: heightBars * 0.7,
      href: `./icons/simulated.png`,
    });
  
    svg.append('text').attrs({
      x: margin_left * 1.55 + heightBars * 0.7 / 2,
      y: margin.top * 0.3,
    })
    .styles({
        fill: '#f1f1f1',
        'font-size': margin.top * 0.2,
        'font-weight': 600,
        'text-anchor': 'start',
        'alignment-baseline': 'central',
      })
    .text(index1+1 + '/' + totalCasosSimulados.length);
  }

  /* svg.append('text').attrs({
      x: margin_left * 1.55 + heightBars * 0.7 / 2,
      y: margin.top * 0.3,
    })
    .styles({
        fill: '#f1f1f1',
        'font-size': margin.top * 0.2,
        'font-weight': 600,
        'text-anchor': 'start',
        'alignment-baseline': 'central',
      })
    .text(index1+1 + '/' + totalCasosSimulados.length); */


  if (datos_totales) {
    // ── Variables comunes ─────────────────────────────────────────────────────────
    const totalPJ = (d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2;
    const totalPG = d3.sum(yearSlice, (d) => d.partidos_ganados) + d3.sum(yearSlice, (d) => d.partidos_ganados1);
    const totalPE = Math.round((d3.sum(yearSlice, (d) => d.partidos_empatados) + d3.sum(yearSlice, (d) => d.partidos_empatados1)) / 2);
    const totalGF = d3.sum(yearSlice, (d) => d.goles);
    const totalGF1 = d3.sum(yearSlice, (d) => d.goles1);

    const pctPG = d3.format('.0f')((totalPG / totalPJ) * 100);
    const pctPE = d3.format('.0f')((totalPE / totalPJ) * 100);
    const avgG = d3
      .format('.1f')((totalGF + totalGF1) / totalPJ)
      .replace('.', ',');

    // ── Helper común ──────────────────────────────────────────────────────────────
    const dv = defaults.value.style;
    const tspan = (text, { cls, fill, size = margin.top * 0.3, attrs = {}, text: label }) =>
      text
        .append('tspan')
        .attrs({ ...(cls ? { class: cls } : {}), ...attrs })
        .styles({
          fill,
          'font-size': size,
          'font-weight': 600,
          'text-anchor': dv.text_anchor,
          'alignment-baseline': dv.alignment_baseline,
        })
        .text(label);

    // ── Texto principal (común) ───────────────────────────────────────────────────
    const textEl = svg
      .append('text')
      .attrs({ class: 'top', x: margin_left * 2, y: margin.top * 0.33 })
      .styles({
        fill: defaults.name.style.fill,
        'font-size': defaults.name.style.font_size,
        'font-weight': defaults.name.style.font_weight,
        'text-anchor': defaults.name.style.text_anchor,
        'alignment-baseline': defaults.name.style.alignment_baseline,
      })
      .call((t) => tspan(t, { cls: 'pj_top', fill: 'lightgrey', text: `${Math.round(totalPJ)} ` }))
      .call((t) => tspan(t, { cls: 'pg_top', fill: victoria_color, text: `${totalPG} ` }))
      .call((t) => tspan(t, { cls: 'pg_por_top', fill: victoria_color, text: `(${pctPG}%) ` }));

    if (localia) {
      const played = data.filter((e) => e.final != true);
      const winsBy = (loc) => d3.sum(played, (e) => (e.l_or_v == loc && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0));
      const goalsBy = (loc) => d3.sum(played, (e) => (e.l_or_v == loc && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0));

      const winText_L = `${winsBy('L')} (${d3.format('.0%')(winsBy('L') / totalPJ)}) `;
      const winText_V = `${winsBy('V')} (${d3.format('.0%')(winsBy('V') / totalPJ)})\xa0\xa0 `;
      const goalText_L = `${goalsBy('L')} (${d3
        .format('.1f')(goalsBy('L') / totalPJ)
        .replace('.', ',')}) `;
      const goalText_V = `${goalsBy('V')} (${d3
        .format('.1f')(goalsBy('V') / totalPJ)
        .replace('.', ',')})  `;

      const tspanSub = (text, { fill, dy, dx = 0, text: label }) => tspan(text, { fill, size: margin.top * 0.2, attrs: { dy, ...(dx ? { dx } : {}) }, text: label });

      textEl
        .call((t) => tspanSub(t, { fill: victoria_color, dy: -heightBars * 0.16, text: winText_L }))
        .call((t) => tspanSub(t, { fill: victoria_color, dy: heightBars * 0.32, dx: -winText_L.length * margin.top * 0.2 * 0.55, text: winText_V }))
        .call((t) => tspan(t, { cls: 'pe_top', fill: empate_color, attrs: { dy: -heightBars * 0.16 }, text: `${totalPE} ` }))
        .call((t) => tspan(t, { cls: 'pe_por_top', fill: empate_color, text: `(${pctPE}%)\xa0\xa0\xa0` }))
        .call((t) => tspan(t, { cls: 'gf_top', fill: 'lightgrey', text: `${totalGF} ` }))
        .call((t) => tspan(t, { cls: 'avg_g_top', fill: 'lightgrey', text: `(${avgG}) ` }))
        .call((t) => tspanSub(t, { fill: 'lightgrey', dy: -heightBars * 0.16, text: goalText_L }))
        .call((t) => tspanSub(t, { fill: 'lightgrey', dy: heightBars * 0.32, dx: -goalText_L.length * margin.top * 0.2 * 0.48, text: goalText_V }));
    } else {
      textEl
        .call((t) => tspan(t, { cls: 'pe_top', fill: empate_color, text: `${totalPE} ` }))
        .call((t) => tspan(t, { cls: 'pe_por_top', fill: empate_color, text: `(${pctPE}%)\xa0\xa0\xa0` }))
        .call((t) => tspan(t, { cls: 'gf_top', fill: 'lightgrey', text: `${totalGF} ` }))
        .call((t) => tspan(t, { cls: 'avg_g_top', fill: 'lightgrey', text: `(${avgG}) ` }));
    }
  }
  var rankingSVG = svg.selectAll('.g').data(yearSlice).enter().append('g').attr('class', 'rankingSVG');

  rankingSVG.append('clipPath').attr('id', `ellipse-clip-bars`).append('rect').attrs({
    x: 0,
    y: 0,
    width: width,
    height: height,
  });

  if (localia) {
    if (grupos > 1) {
      grupos_1.forEach((grupo, indice_grupo) => {
        rankingSVG
          .filter((d) => d.name.split('-')[1] == grupo)
          .append('text')
          .attrs({
            class: 'name',
            x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
            y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) + defaults.name.position.y,
          })
          .styles({
            fill: defaults.name.style.fill,
            'font-size': defaults.name.style.font_size,
            'font-weight': defaults.name.style.font_weight,
            'text-anchor': defaults.name.style.text_anchor,
            'alignment-baseline': defaults.name.style.alignment_baseline,
          })
          .text((d) => d.name.split('-')[0])

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'efec',
              })
              .styles({
                fill: (d) => {
                  var myColor = d3.scaleLinear().domain([d3.min(yearSlice, (d) => +formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100)), d3.max(yearSlice, (d) => +formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100))]);
                  var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                  return myColor1(myColor(+formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100)));
                },
                'font-size': heightBars * 0.275,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => (d.partidos_jugados == 0 ? '' : ` (${formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100).replace('.', ',')}%)`))
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.09,
              })
              .styles({
                opacity: 1,
                fill: (d) => {
                  var myColor = d3.scaleLinear().domain([
                    d3.min(
                      yearSlice,
                      (d) =>
                        +formatEfec(
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                          ) /
                            (d3.sum(
                              data.filter((e) => e.name == d.name && e.final != true),
                              (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                            ) *
                              puntos_por_partido)) *
                            100
                        )
                    ),
                    d3.max(
                      yearSlice,
                      (d) =>
                        +formatEfec(
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                          ) /
                            (d3.sum(
                              data.filter((e) => e.name == d.name && e.final != true),
                              (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                            ) *
                              puntos_por_partido)) *
                            100
                        )
                    ),
                  ]);
                  var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                  if (
                    isNaN(
                      +formatEfec(
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                        ) /
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          ) *
                            puntos_por_partido)) *
                          100
                      )
                    )
                  ) {
                    return grey_color;
                  } else {
                    return myColor1(
                      myColor(
                        +formatEfec(
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                          ) /
                            (d3.sum(
                              data.filter((e) => e.name == d.name && e.final != true),
                              (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                            ) *
                              puntos_por_partido)) *
                            100
                        )
                      )
                    );
                  }
                },
                'font-size': heightBars * 0.275 * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) =>
                d.partidos_jugados == 0
                  ? ''
                  : `(${formatEfec(
                      (d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                      ) /
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                        ) *
                          puntos_por_partido)) *
                        100
                    ).replace('.', ',')}%)`.replace('NaN%', 'ND')
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: heightBars * 0.18,
                dx: (d) =>
                  -`(${formatEfec(
                    (d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                    ) /
                      (d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ) *
                        puntos_por_partido)) *
                      100
                  ).replace('.', ',')}%)`
                    .replace('NaN%', 'ND')
                    .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.6,
              })
              .styles({
                opacity: 1,
                fill: (d) => {
                  var myColor = d3.scaleLinear().domain([
                    d3.min(
                      yearSlice,
                      (d) =>
                        +formatEfec(
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                          ) /
                            (d3.sum(
                              data.filter((e) => e.name == d.name && e.final != true),
                              (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                            ) *
                              puntos_por_partido)) *
                            100
                        )
                    ),
                    d3.max(
                      yearSlice,
                      (d) =>
                        +formatEfec(
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                          ) /
                            (d3.sum(
                              data.filter((e) => e.name == d.name && e.final != true),
                              (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                            ) *
                              puntos_por_partido)) *
                            100
                        )
                    ),
                  ]);
                  var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                  if (
                    isNaN(
                      +formatEfec(
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                        ) /
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          ) *
                            puntos_por_partido)) *
                          100
                      )
                    )
                  ) {
                    return grey_color;
                  } else {
                    return myColor1(
                      myColor(
                        +formatEfec(
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                          ) /
                            (d3.sum(
                              data.filter((e) => e.name == d.name && e.final != true),
                              (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                            ) *
                              puntos_por_partido)) *
                            100
                        )
                      )
                    );
                  }
                },
                'font-size': heightBars * 0.275 * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) =>
                d.partidos_jugados == 0
                  ? ''
                  : ` (${formatEfec(
                      (d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                      ) /
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                        ) *
                          puntos_por_partido)) *
                        100
                    ).replace('.', ',')}%)`.replace('NaN%', 'ND')
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.09,
                class: 'goles_por_partido',
                dx: (d) =>
                  -`(${formatEfec(
                    (d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                    ) /
                      (d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ) *
                        puntos_por_partido)) *
                      100
                  ).replace('.', ',')}%)`
                    .replace('NaN%', 'ND')
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.6 +
                  d3.max([
                    `(${formatEfec(
                      (d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                      ) /
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                        ) *
                          puntos_por_partido)) *
                        100
                    ).replace('.', ',')}%)`
                      .replace('NaN%', 'ND')
                      .toString().length,
                    `(${formatEfec(
                      (d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                      ) /
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                        ) *
                          puntos_por_partido)) *
                        100
                    ).replace('.', ',')}%)`
                      .replace('NaN%', 'ND')
                      .toString().length,
                  ]) *
                    defaults.value.style.font_size *
                    0.625 *
                    0.6,
              })
              .styles({
                fill: (d) => {
                  var myColor = d3.scaleLinear().domain([d3.min(yearSlice, (d) => +d3.format('.1f')(d.goles / d.partidos_jugados)), d3.max(yearSlice, (d) => +d3.format('.1f')(d.goles / d.partidos_jugados))]);
                  var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                  return myColor1(myColor(+d3.format('.1f')(d.goles / d.partidos_jugados)));
                },
                'font-size': heightBars * 0.275,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) =>
                d.partidos_jugados == 0
                  ? ''
                  : ` (${d3
                      .format('.1f')(d.goles / d.partidos_jugados)
                      .replace('.', ',')})`
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.09,
              })
              .styles({
                opacity: 1,
                fill: (d) => {
                  var myColor = d3.scaleLinear().domain([
                    d3.min(
                      yearSlice,
                      (d) =>
                        +d3.format('.1f')(
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                          ) /
                            d3.sum(
                              data.filter((e) => e.name == d.name && e.final != true),
                              (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                            )
                        )
                    ),
                    d3.max(
                      yearSlice,
                      (d) =>
                        +d3.format('.1f')(
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                          ) /
                            d3.sum(
                              data.filter((e) => e.name == d.name && e.final != true),
                              (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                            )
                        )
                    ),
                  ]);
                  var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                  if (
                    isNaN(
                      +d3.format('.1f')(
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                        ) /
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          )
                      )
                    )
                  ) {
                    return grey_color;
                  } else {
                    return myColor1(
                      myColor(
                        +d3.format('.1f')(
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                          ) /
                            d3.sum(
                              data.filter((e) => e.name == d.name && e.final != true),
                              (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                            )
                        )
                      )
                    );
                  }
                },
                'font-size': heightBars * 0.275 * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) =>
                d.partidos_jugados == 0
                  ? ''
                  : `(${d3
                      .format('.1f')(
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                        ) /
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          )
                      )
                      .replace('.', ',')
                      .replace('NaN', 'ND')})`
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: heightBars * 0.18,
                dx: -`(1,0)`.toString().length * defaults.value.style.font_size * 0.625 * 0.43,
              })
              .styles({
                opacity: 1,
                fill: (d) => {
                  var myColor = d3.scaleLinear().domain([
                    d3.min(
                      yearSlice,
                      (d) =>
                        +d3.format('.1f')(
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                          ) /
                            d3.sum(
                              data.filter((e) => e.name == d.name && e.final != true),
                              (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                            )
                        )
                    ),
                    d3.max(
                      yearSlice,
                      (d) =>
                        +d3.format('.1f')(
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                          ) /
                            d3.sum(
                              data.filter((e) => e.name == d.name && e.final != true),
                              (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                            )
                        )
                    ),
                  ]);
                  var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                  if (
                    isNaN(
                      +d3.format('.1f')(
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                        ) /
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          )
                      )
                    )
                  ) {
                    return grey_color;
                  } else {
                    return myColor1(
                      myColor(
                        +d3.format('.1f')(
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                          ) /
                            d3.sum(
                              data.filter((e) => e.name == d.name && e.final != true),
                              (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                            )
                        )
                      )
                    );
                  }
                },
                'font-size': heightBars * 0.275 * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) =>
                d.partidos_jugados == 0
                  ? ''
                  : `(${d3
                      .format('.1f')(
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                        ) /
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          )
                      )
                      .replace('.', ',')
                      .replace('NaN', 'ND')})`
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'campeon',
              })
              .styles({
                fill: (d) => {
                  var myColor = d3.scaleLinear().domain([0, 100]);
                  var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                  return myColor1(myColor(probabilidad(d.name).probabilidad));
                },
                'font-size': heightBars * 0.275,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => ' (' + probabilidad(d.name).probabilidad + '%) ' + probabilidad(d.name).posicion + '°')
          )
          .call(halo1, heightBars * 0.2, '#f1f1f1');
      });
    } else {
      rankingSVG
        .append('text')
        .attrs({
          class: 'name',
          x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
          y: (d) => y(d.rank) + defaults.name.position.y,
          'clip-path': `url(#ellipse-clip-margin-bottom)`,
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': defaults.name.style.text_anchor,
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text((d) => d.name.split('-')[0])

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'efec',
            })
            .styles({
              fill: (d) => {
                var myColor = d3.scaleLinear().domain([d3.min(yearSlice, (d) => +formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100)), d3.max(yearSlice, (d) => +formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100))]);
                var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                return myColor1(myColor(+formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100)));
              },
              'font-size': heightBars * 0.275,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados == 0 ? '' : ` (${formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100).replace('.', ',')}%)`))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.09,
            })
            .styles({
              opacity: 1,
              fill: (d) => {
                var myColor = d3.scaleLinear().domain([
                  d3.min(
                    yearSlice,
                    (d) =>
                      +formatEfec(
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                        ) /
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          ) *
                            puntos_por_partido)) *
                          100
                      )
                  ),
                  d3.max(
                    yearSlice,
                    (d) =>
                      +formatEfec(
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                        ) /
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          ) *
                            puntos_por_partido)) *
                          100
                      )
                  ),
                ]);
                var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                if (
                  isNaN(
                    +formatEfec(
                      (d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                      ) /
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                        ) *
                          puntos_por_partido)) *
                        100
                    )
                  )
                ) {
                  return grey_color;
                } else {
                  return myColor1(
                    myColor(
                      +formatEfec(
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                        ) /
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          ) *
                            puntos_por_partido)) *
                          100
                      )
                    )
                  );
                }
              },
              'font-size': heightBars * 0.275 * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) =>
              d.partidos_jugados == 0
                ? ''
                : `(${formatEfec(
                    (d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                    ) /
                      (d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ) *
                        puntos_por_partido)) *
                      100
                  ).replace('.', ',')}%)`.replace('NaN%', 'ND')
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: heightBars * 0.18,
              dx: (d) =>
                -`(${formatEfec(
                  (d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                  ) /
                    (d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                    ) *
                      puntos_por_partido)) *
                    100
                ).replace('.', ',')}%)`
                  .replace('NaN%', 'ND')
                  .toString().length *
                defaults.value.style.font_size *
                0.625 *
                0.6,
            })
            .styles({
              opacity: 1,
              fill: (d) => {
                var myColor = d3.scaleLinear().domain([
                  d3.min(
                    yearSlice,
                    (d) =>
                      +formatEfec(
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                        ) /
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          ) *
                            puntos_por_partido)) *
                          100
                      )
                  ),
                  d3.max(
                    yearSlice,
                    (d) =>
                      +formatEfec(
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                        ) /
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          ) *
                            puntos_por_partido)) *
                          100
                      )
                  ),
                ]);
                var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                if (
                  isNaN(
                    +formatEfec(
                      (d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                      ) /
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                        ) *
                          puntos_por_partido)) *
                        100
                    )
                  )
                ) {
                  return grey_color;
                } else {
                  return myColor1(
                    myColor(
                      +formatEfec(
                        (d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                        ) /
                          (d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          ) *
                            puntos_por_partido)) *
                          100
                      )
                    )
                  );
                }
              },
              'font-size': heightBars * 0.275 * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) =>
              d.partidos_jugados == 0
                ? ''
                : ` (${formatEfec(
                    (d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                    ) /
                      (d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ) *
                        puntos_por_partido)) *
                      100
                  ).replace('.', ',')}%)`.replace('NaN%', 'ND')
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.09,
              class: 'goles_por_partido',
              dx: (d) =>
                -`(${formatEfec(
                  (d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                  ) /
                    (d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                    ) *
                      puntos_por_partido)) *
                    100
                ).replace('.', ',')}%)`
                  .replace('NaN%', 'ND')
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.6 +
                d3.max([
                  `(${formatEfec(
                    (d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                    ) /
                      (d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ) *
                        puntos_por_partido)) *
                      100
                  ).replace('.', ',')}%)`
                    .replace('NaN%', 'ND')
                    .toString().length,
                  `(${formatEfec(
                    (d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                    ) /
                      (d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ) *
                        puntos_por_partido)) *
                      100
                  ).replace('.', ',')}%)`
                    .replace('NaN%', 'ND')
                    .toString().length,
                ]) *
                  defaults.value.style.font_size *
                  0.625 *
                  0.6,
            })
            .styles({
              fill: (d) => {
                var myColor = d3.scaleLinear().domain([d3.min(yearSlice, (d) => +d3.format('.1f')(d.goles / d.partidos_jugados)), d3.max(yearSlice, (d) => +d3.format('.1f')(d.goles / d.partidos_jugados))]);
                var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                return myColor1(myColor(+d3.format('.1f')(d.goles / d.partidos_jugados)));
              },
              'font-size': heightBars * 0.275,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) =>
              d.partidos_jugados == 0
                ? ''
                : ` (${d3
                    .format('.1f')(d.goles / d.partidos_jugados)
                    .replace('.', ',')})`
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.09,
            })
            .styles({
              opacity: 1,
              fill: (d) => {
                var myColor = d3.scaleLinear().domain([
                  d3.min(
                    yearSlice,
                    (d) =>
                      +d3.format('.1f')(
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                        ) /
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          )
                      )
                  ),
                  d3.max(
                    yearSlice,
                    (d) =>
                      +d3.format('.1f')(
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                        ) /
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          )
                      )
                  ),
                ]);
                var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                if (
                  isNaN(
                    +d3.format('.1f')(
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                      ) /
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                        )
                    )
                  )
                ) {
                  return grey_color;
                } else {
                  return myColor1(
                    myColor(
                      +d3.format('.1f')(
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                        ) /
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          )
                      )
                    )
                  );
                }
              },
              'font-size': heightBars * 0.275 * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) =>
              d.partidos_jugados == 0
                ? ''
                : `(${d3
                    .format('.1f')(
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                      ) /
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                        )
                    )
                    .replace('.', ',')
                    .replace('NaN', 'ND')})`
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: heightBars * 0.18,
              dx: -`(1,0)`.toString().length * defaults.value.style.font_size * 0.625 * 0.43,
            })
            .styles({
              opacity: 1,
              fill: (d) => {
                var myColor = d3.scaleLinear().domain([
                  d3.min(
                    yearSlice,
                    (d) =>
                      +d3.format('.1f')(
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                        ) /
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          )
                      )
                  ),
                  d3.max(
                    yearSlice,
                    (d) =>
                      +d3.format('.1f')(
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                        ) /
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          )
                      )
                  ),
                ]);
                var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                if (
                  isNaN(
                    +d3.format('.1f')(
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                      ) /
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                        )
                    )
                  )
                ) {
                  return grey_color;
                } else {
                  return myColor1(
                    myColor(
                      +d3.format('.1f')(
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                        ) /
                          d3.sum(
                            data.filter((e) => e.name == d.name && e.final != true),
                            (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                          )
                      )
                    )
                  );
                }
              },
              'font-size': heightBars * 0.275 * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) =>
              d.partidos_jugados == 0
                ? ''
                : `(${d3
                    .format('.1f')(
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                      ) /
                        d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                        )
                    )
                    .replace('.', ',')
                    .replace('NaN', 'ND')})`
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'campeon',
            })
            .styles({
              fill: (d) => {
                var myColor = d3.scaleLinear().domain([0, 100]);
                var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                return myColor1(myColor(probabilidad(d.name).probabilidad));
              },
              'font-size': heightBars * 0.275,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => ' (' + probabilidad(d.name).probabilidad + '%) ' + probabilidad(d.name).posicion + '°')
        )
        .call(halo1, heightBars * 0.2, '#f1f1f1');
    }
  } else {
    if (grupos > 1) {
      grupos_1.forEach((grupo, indice_grupo) => {
        rankingSVG
          .filter((d) => d.name.split('-')[1] == grupo)
          .append('text')
          .attrs({
            class: 'name',
            x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
            y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) + defaults.name.position.y,
          })
          .styles({
            fill: defaults.name.style.fill,
            'font-size': defaults.name.style.font_size,
            'font-weight': defaults.name.style.font_weight,
            'text-anchor': defaults.name.style.text_anchor,
            'alignment-baseline': defaults.name.style.alignment_baseline,
          })
          .text((d) => countryToEnglish(d.name.split('-')[0]))

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'campeon',
              })
              .styles({
                fill: '#0a48ce',
                'font-size': heightBars * 0.275,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => ' #' + getRankingFIFA1(d.name))
          )

          /* .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'campeon',
              })
              .styles({
                fill: black_color,
                'font-size': heightBars * 0.275,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d, i) => '' + (i == 2 ? ((mejores_terceros.indexOf(d.position[1])+1) !== 0 ? (' (' + (mejores_terceros.indexOf(d.position[1])+1)+'/8)'): '') : ''))
          ) */

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'efec',
              })
              .styles({
                fill: (d) => {
                  var myColor = d3.scaleLinear().domain([d3.min(yearSlice, (d) => +formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100)), d3.max(yearSlice, (d) => +formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100))]);
                  var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                  return myColor1(myColor(+formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100)));
                },
                'font-size': heightBars * 0.275,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => efectividadYPromedioGoles ? (d.partidos_jugados == 0 ? '' : ` (${formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100).replace('.', ',')}%)`) : '')
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'goles_por_partido',
              })
              .styles({
                fill: (d) => {
                  var myColor = d3.scaleLinear().domain([d3.min(yearSlice, (d) => +d3.format('.1f')(d.goles / d.partidos_jugados)), d3.max(yearSlice, (d) => +d3.format('.1f')(d.goles / d.partidos_jugados))]);
                  var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                  return myColor1(myColor(+d3.format('.1f')(d.goles / d.partidos_jugados)));
                },
                'font-size': heightBars * 0.275,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => efectividadYPromedioGoles ?
                d.partidos_jugados == 0
                  ? ''
                  : ` (${d3
                      .format('.1f')(d.goles / d.partidos_jugados)
                      .replace('.', ',')})`
              : '')
          )

          /* .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'campeon',
              })
              .styles({
                fill: '#0a48ce',
                'font-size': heightBars * 0.275,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => ' #' + getRankingFIFA1(d.name) + '')
          ) */

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'campeon',
              })
              .styles({
                fill: (d) => {
                  var myColor = d3.scaleLinear().domain([0, 100]);
                  var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                  return myColor1(myColor(probabilidad(d.name).probabilidad));
                },
                'font-size': heightBars * 0.275,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => ' (' + probabilidad(d.name).probabilidad + '%) ' + probabilidad(d.name).posicion + '°')
          )
          .call(halo1, heightBars * 0.2, '#f1f1f1');
      });
    } else {
      rankingSVG
        .append('text')
        .attrs({
          class: 'name',
          x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
          y: (d, i) => y(i) + defaults.name.position.y, // OJO y(d.rank)
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': defaults.name.style.text_anchor,
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text((d) => d.name.split('-')[0])

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'efec',
            })
            .styles({
              fill: (d) => {
                var myColor = d3.scaleLinear().domain([d3.min(yearSlice, (d) => +formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100)), d3.max(yearSlice, (d) => +formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100))]);
                var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                return myColor1(myColor(+formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100)));
              },
              'font-size': heightBars * 0.275,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados == 0 ? '' : ` (${formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100).replace('.', ',')}%)`))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'goles_por_partido',
            })
            .styles({
              fill: (d) => {
                var myColor = d3.scaleLinear().domain([d3.min(yearSlice, (d) => +d3.format('.1f')(d.goles / d.partidos_jugados)), d3.max(yearSlice, (d) => +d3.format('.1f')(d.goles / d.partidos_jugados))]);
                var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                return myColor1(myColor(+d3.format('.1f')(d.goles / d.partidos_jugados)));
              },
              'font-size': heightBars * 0.275,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) =>
              d.partidos_jugados == 0
                ? ''
                : ` (${d3
                    .format('.1f')(d.goles / d.partidos_jugados)
                    .replace('.', ',')})`
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'campeon',
            })
            .styles({
              fill: (d) => {
                var myColor = d3.scaleLinear().domain([0, 100]);
                var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                return myColor1(myColor(probabilidad(d.name).probabilidad));
              },
              'font-size': heightBars * 0.275,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => ' (' + probabilidad(d.name).probabilidad + '%) ' + probabilidad(d.name).posicion + '°')
        )
        .call(halo1, heightBars * 0.2, '#f1f1f1');

      /* .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'campeon',
            })
            .styles({
              fill: black_color,
              'font-size': heightBars * 0.275,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d, i) => (d.partidos_jugados + d.partidos_jugados1 == 0 ? '' : `${i == 0 && d.partidos_jugados + d.partidos_jugados1 == dates.length - 1 ? ' (Campeón)' : ''}`))
        ) */
    }
  }

  if (localia) {
    if (grupos > 1) {
      grupos_1.forEach((grupo, indice_grupo) => {
        rankingSVG
          .filter((d) => d.name.split('-')[1] == grupo)
          .append('text')
          .attrs({
            x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
            y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) + defaults.value.position.y,
          })
          .styles({
            fill: 'green',
            'font-size': defaults.value.style.font_size,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text('')

          .call((text) =>
            text
              .append('tspan')
              .attrs({})
              .styles({
                fill: black_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => d.value + '')
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
              })
              .styles({
                opacity: 1,
                fill: black_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: heightBars * 0.16,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                    )
                    .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
              })
              .styles({
                opacity: 1,
                fill: black_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
              })
              .styles({
                fill: black_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => '\xa0\xa0\xa0' + d.partidos_jugados)
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
              })
              .styles({
                opacity: 1,
                fill: black_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: heightBars * 0.16,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                    )
                    .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
              })
              .styles({
                opacity: 1,
                fill: black_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                    )
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7 +
                  d3
                    .max([
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ),
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ),
                    ])
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7,
              })
              .styles({
                fill: victoria_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => ' ' + d.partidos_ganados)
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
              })
              .styles({
                opacity: 1,
                fill: victoria_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: heightBars * 0.16,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                    )
                    .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
              })
              .styles({
                opacity: 1,
                fill: victoria_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                    )
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7 +
                  d3
                    .max([
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ),
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ),
                    ])
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7,
              })
              .styles({
                fill: empate_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => ' ' + d.partidos_empatados)
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
              })
              .styles({
                opacity: 1,
                fill: empate_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: heightBars * 0.16,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                    )
                    .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
              })
              .styles({
                opacity: 1,
                fill: empate_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                    )
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7 +
                  d3
                    .max([
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ),
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ),
                    ])
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7,
              })
              .styles({
                fill: derrota_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => ' ' + d.partidos_perdidos)
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
              })
              .styles({
                opacity: 1,
                fill: derrota_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: heightBars * 0.16,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
                    )
                    .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
              })
              .styles({
                opacity: 1,
                fill: derrota_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
                    )
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7 +
                  d3
                    .max([
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ),
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
                      ),
                    ])
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7,
              })
              .styles({
                fill: victoria_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => '\xa0\xa0\xa0' + d.goles)
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
              })
              .styles({
                opacity: 1,
                fill: victoria_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: +heightBars * 0.16,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                    )
                    .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
              })
              .styles({
                opacity: 1,
                fill: victoria_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                    )
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7 +
                  d3
                    .max([
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                      ),
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                      ),
                    ])
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7,
              })
              .styles({
                fill: black_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text('-')
          )

          .call((text) =>
            text
              .append('tspan')
              .styles({
                fill: derrota_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => d.goles_en_contra)
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
              })
              .styles({
                opacity: 1,
                fill: derrota_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: +heightBars * 0.16,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)
                    )
                    .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
              })
              .styles({
                opacity: 1,
                fill: derrota_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'dif',
                dy: -heightBars * 0.08,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)
                    )
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7 +
                  d3
                    .max([
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)
                      ),
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)
                      ),
                    ])
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7,
              })
              .styles({
                fill: (d) => (d.diferencia_de_goles > 0 ? victoria_color : d.diferencia_de_goles < 0 ? derrota_color : empate_color),
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => ' ' + (d.diferencia_de_goles > 0 ? '+' : '') + d.diferencia_de_goles)
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: -heightBars * 0.08,
              })
              .styles({
                opacity: 1,
                fill: (d) =>
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                  ) > 0
                    ? victoria_color
                    : d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                        ) < 0
                      ? derrota_color
                      : empate_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  (d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                  ) > 0
                    ? '+'
                    : '') +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                dy: +heightBars * 0.16,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                    )
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7 -
                  (d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                  ) > 0
                    ? '+'
                    : ''
                  ).toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.6 +
                  (d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                  ) < 0
                    ? '-'
                    : ''
                  ).toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.34,
              })
              .styles({
                opacity: 1,
                fill: (d) =>
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                  ) > 0
                    ? victoria_color
                    : d3.sum(
                          data.filter((e) => e.name == d.name && e.final != true),
                          (e) => (e.l_or_v == 'V' ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                        ) < 0
                      ? derrota_color
                      : empate_color,
                'font-size': defaults.value.style.font_size * 0.625,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text(
                (d) =>
                  '' +
                  (d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                  ) > 0
                    ? '+'
                    : '') +
                  d3.sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                  )
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'dif',
                dy: -heightBars * 0.08,
                dx: (d) =>
                  -d3
                    .sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                    )
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7 +
                  d3
                    .max([
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                      ),
                      d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                      ),
                    ])
                    .toString().length *
                    defaults.value.style.font_size *
                    0.625 *
                    0.7,
              })
              .styles({
                fill: 'black',
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => (d.partidos_jugados1 == 0 ? '' : '\xa0\xa0\xa0['))
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'pts1',
              })
              .styles({
                fill: 'black',
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => (d.partidos_jugados1 == 0 ? '' : d.value1 + '\xa0\xa0\xa0'))
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'pj1',
              })
              .styles({
                fill: 'black',
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => (d.partidos_jugados1 == 0 ? '' : d.partidos_jugados1 + ' '))
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'pg1',
              })
              .styles({
                fill: victoria_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => (d.partidos_jugados1 == 0 ? '' : d.partidos_ganados1 + ' '))
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'pe1',
              })
              .styles({
                fill: empate_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => (d.partidos_jugados1 == 0 ? '' : d.partidos_empatados1 + ' '))
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'pp1',
              })
              .styles({
                fill: derrota_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => (d.partidos_jugados1 == 0 ? '' : d.partidos_perdidos1 + '\xa0\xa0\xa0'))
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'gf1',
              })
              .styles({
                fill: victoria_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => (d.partidos_jugados1 == 0 ? '' : d.goles1))
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'gf1_guion',
              })
              .styles({
                fill: 'black',
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => (d.partidos_jugados1 == 0 ? '' : '-'))
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'gc1',
              })
              .styles({
                fill: derrota_color,
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => (d.partidos_jugados1 == 0 ? '' : d.goles_en_contra1 + ' '))
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'dif1',
              })
              .styles({
                fill: (d) => (d.diferencia_de_goles1 > 0 ? victoria_color : d.diferencia_de_goles1 < 0 ? derrota_color : empate_color),
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => (d.partidos_jugados1 == 0 ? '' : (d.diferencia_de_goles1 > 0 ? '+' : '') + d.diferencia_de_goles1))
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'bracket2',
              })
              .styles({
                fill: 'black',
                'font-size': defaults.value.style.font_size,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => (d.partidos_jugados1 == 0 ? '' : ']'))
          );
      });
    } else {
      rankingSVG
        .append('text')
        .attrs({
          x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
          y: (d, i) => y(i) + defaults.value.position.y,
        })
        .styles({
          fill: 'green',
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline,
        })
        .text('')

        .call((text) =>
          text
            .append('tspan')
            .attrs({})
            .styles({
              fill: black_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => d.value + '')
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
            })
            .styles({
              opacity: 1,
              fill: black_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: heightBars * 0.16,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                  )
                  .toString().length *
                defaults.value.style.font_size *
                0.625 *
                0.7,
            })
            .styles({
              opacity: 1,
              fill: black_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
            })
            .styles({
              fill: black_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => '\xa0\xa0\xa0' + d.partidos_jugados)
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
            })
            .styles({
              opacity: 1,
              fill: black_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: heightBars * 0.16,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
                  .toString().length *
                defaults.value.style.font_size *
                0.625 *
                0.7,
            })
            .styles({
              opacity: 1,
              fill: black_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7 +
                d3
                  .max([
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                    ),
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                    ),
                  ])
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
            })
            .styles({
              fill: victoria_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => ' ' + d.partidos_ganados)
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
            })
            .styles({
              opacity: 1,
              fill: victoria_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: heightBars * 0.16,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
                  .toString().length *
                defaults.value.style.font_size *
                0.625 *
                0.7,
            })
            .styles({
              opacity: 1,
              fill: victoria_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'V' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7 +
                d3
                  .max([
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                    ),
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                    ),
                  ])
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
            })
            .styles({
              fill: empate_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => ' ' + d.partidos_empatados)
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
            })
            .styles({
              opacity: 1,
              fill: empate_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'L' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: heightBars * 0.16,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
                  .toString().length *
                defaults.value.style.font_size *
                0.625 *
                0.7,
            })
            .styles({
              opacity: 1,
              fill: empate_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'V' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7 +
                d3
                  .max([
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                    ),
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                    ),
                  ])
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
            })
            .styles({
              fill: derrota_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => ' ' + d.partidos_perdidos)
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
            })
            .styles({
              opacity: 1,
              fill: derrota_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'L' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: heightBars * 0.16,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
                  .toString().length *
                defaults.value.style.font_size *
                0.625 *
                0.7,
            })
            .styles({
              opacity: 1,
              fill: derrota_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'V' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  )
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7 +
                d3
                  .max([
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
                    ),
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
                    ),
                  ])
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
            })
            .styles({
              fill: victoria_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => '\xa0\xa0\xa0' + d.goles)
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
            })
            .styles({
              opacity: 1,
              fill: victoria_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: +heightBars * 0.16,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                  )
                  .toString().length *
                defaults.value.style.font_size *
                0.625 *
                0.7,
            })
            .styles({
              opacity: 1,
              fill: victoria_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                  )
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7 +
                d3
                  .max([
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                    ),
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                    ),
                  ])
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
            })
            .styles({
              fill: black_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text('-')
        )

        .call((text) =>
          text
            .append('tspan')
            .styles({
              fill: derrota_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => d.goles_en_contra)
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
            })
            .styles({
              opacity: 1,
              fill: derrota_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: +heightBars * 0.16,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)
                  )
                  .toString().length *
                defaults.value.style.font_size *
                0.625 *
                0.7,
            })
            .styles({
              opacity: 1,
              fill: derrota_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'dif',
              dy: -heightBars * 0.08,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)
                  )
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7 +
                d3
                  .max([
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)
                    ),
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)
                    ),
                  ])
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
            })
            .styles({
              fill: (d) => (d.diferencia_de_goles > 0 ? victoria_color : d.diferencia_de_goles < 0 ? derrota_color : empate_color),
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => ' ' + (d.diferencia_de_goles > 0 ? '+' : '') + d.diferencia_de_goles)
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: -heightBars * 0.08,
            })
            .styles({
              opacity: 1,
              fill: (d) =>
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                ) > 0
                  ? victoria_color
                  : d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                      ) < 0
                    ? derrota_color
                    : empate_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                (d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                ) > 0
                  ? '+'
                  : '') +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              dy: +heightBars * 0.16,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                  )
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7 -
                (d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                ) > 0
                  ? '+'
                  : ''
                ).toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.6 +
                (d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                ) < 0
                  ? '-'
                  : ''
                ).toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.34,
            })
            .styles({
              opacity: 1,
              fill: (d) =>
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'V' ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                ) > 0
                  ? victoria_color
                  : d3.sum(
                        data.filter((e) => e.name == d.name && e.final != true),
                        (e) => (e.l_or_v == 'V' ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                      ) < 0
                    ? derrota_color
                    : empate_color,
              'font-size': defaults.value.style.font_size * 0.625,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text(
              (d) =>
                '' +
                (d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                ) > 0
                  ? '+'
                  : '') +
                d3.sum(
                  data.filter((e) => e.name == d.name && e.final != true),
                  (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                )
            )
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'dif',
              dy: -heightBars * 0.08,
              dx: (d) =>
                -d3
                  .sum(
                    data.filter((e) => e.name == d.name && e.final != true),
                    (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                  )
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7 +
                d3
                  .max([
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                    ),
                    d3.sum(
                      data.filter((e) => e.name == d.name && e.final != true),
                      (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha - e.goles_en_contra_fecha : 0)
                    ),
                  ])
                  .toString().length *
                  defaults.value.style.font_size *
                  0.625 *
                  0.7,
            })
            .styles({
              fill: 'black',
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados1 == 0 ? '' : '\xa0\xa0\xa0['))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'pts1',
            })
            .styles({
              fill: 'black',
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados1 == 0 ? '' : d.value1 + '\xa0\xa0\xa0'))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'pj1',
            })
            .styles({
              fill: 'black',
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados1 == 0 ? '' : d.partidos_jugados1 + ' '))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'pg1',
            })
            .styles({
              fill: victoria_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados1 == 0 ? '' : d.partidos_ganados1 + ' '))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'pe1',
            })
            .styles({
              fill: empate_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados1 == 0 ? '' : d.partidos_empatados1 + ' '))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'pp1',
            })
            .styles({
              fill: derrota_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados1 == 0 ? '' : d.partidos_perdidos1 + '\xa0\xa0\xa0'))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'gf1',
            })
            .styles({
              fill: victoria_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados1 == 0 ? '' : d.goles1))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'gf1_guion',
            })
            .styles({
              fill: 'black',
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados1 == 0 ? '' : '-'))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'gc1',
            })
            .styles({
              fill: derrota_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados1 == 0 ? '' : d.goles_en_contra1 + ' '))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'dif1',
            })
            .styles({
              fill: (d) => (d.diferencia_de_goles1 > 0 ? victoria_color : d.diferencia_de_goles1 < 0 ? derrota_color : empate_color),
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados1 == 0 ? '' : (d.diferencia_de_goles1 > 0 ? '+' : '') + d.diferencia_de_goles1))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'bracket2',
            })
            .styles({
              fill: 'black',
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.partidos_jugados1 == 0 ? '' : ']'))
        );
    }
  } else {
    // --- Helpers compartidos (fuera del if/else) ---

    const diffColor = (diff) => (diff > 0 ? victoria_color : diff < 0 ? derrota_color : empate_color);
    const signedDiff = (diff) => (diff > 0 ? '+' : '') + diff;
    const show1 = (d, val) => (d.partidos_jugados1 == 0 ? '' : val);

    const getValorDirecto = (() => {
      const cache = new Map();
      return (d) => {
        if (!cache.has(d)) {
          const empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
          cache.set(d, statsDirectos(empates)[d.name]);
        }
        return cache.get(d);
      };
    })();

    const padding = '';

    const commonStyles = {
      fill: black_color,
      'font-size': defaults.value.style.font_size,
      'font-weight': 600,
      'text-anchor': defaults.value.style.text_anchor,
      'alignment-baseline': defaults.value.style.alignment_baseline,
    };

    const xPos = x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x;

    const tspan = (text, fill, textFn, cls) => {
      const t = text.append('tspan');
      if (cls) t.attr('class', cls);
      t.style('fill', fill || black_color); // fill puede ser función o string
      t.text(textFn);
    };

    const appendAllTspans = (selection) =>
      selection
        .call((text) => {
          // --- Puntos + stats generales ---
          tspan(text, null, (d) => d.value + padding);
          tspan(text, null, (d) => '\xa0\xa0\xa0' + d.partidos_jugados);
          tspan(text, victoria_color, (d) => ' ' + d.partidos_ganados);
          tspan(text, empate_color, (d) => ' ' + d.partidos_empatados);
          tspan(text, derrota_color, (d) => ' ' + d.partidos_perdidos);

          // --- Goles generales ---
          tspan(text, victoria_color, (d) => '\xa0\xa0\xa0' + d.goles);
          tspan(text, null, () => '-');
          tspan(text, derrota_color, (d) => d.goles_en_contra);
          tspan(
            text,
            (d) => diffColor(d.diferencia_de_goles),
            (d) => ' ' + signedDiff(d.diferencia_de_goles)
          );
          /* tspan(text, 'purple', (d) => '\xa0\xa0\xa0' + d.fairPlay); */

          // --- Bloque stats fase 1 [ ... ] ---
          tspan(text, null, (d) => show1(d, '\xa0\xa0\xa0['));
          tspan(text, null, (d) => show1(d, d.value1 + '\xa0\xa0\xa0'));
          tspan(text, null, (d) => show1(d, d.partidos_jugados1 + ' '));
          tspan(text, victoria_color, (d) => show1(d, d.partidos_ganados1 + ' '));
          tspan(text, empate_color, (d) => show1(d, d.partidos_empatados1 + ' '));
          tspan(text, derrota_color, (d) => show1(d, d.partidos_perdidos1 + '\xa0\xa0\xa0'));
          tspan(text, victoria_color, (d) => show1(d, d.goles1));
          tspan(text, null, (d) => show1(d, '-'));
          tspan(text, derrota_color, (d) => show1(d, d.goles_en_contra1 + ' '));
          tspan(
            text,
            (d) => diffColor(d.diferencia_de_goles1),
            (d) => show1(d, signedDiff(d.diferencia_de_goles1))
          );
          tspan(text, null, (d) => show1(d, ']'));

          // --- Bloque stats directos [ ... ] ---
          const v = (d) => getValorDirecto(d);
          const sd = (d, val) => (v(d).pj_directo > 0 ? val : '');

          tspan(text, null, (d) => sd(d, '\xa0\xa0\xa0['));
          tspan(text, null, (d) => sd(d, v(d).pts_directo + '\xa0\xa0\xa0'));
          tspan(text, null, (d) => sd(d, v(d).pj_directo + ' '));
          tspan(text, victoria_color, (d) => sd(d, v(d).pg_directo + ' '));
          tspan(text, empate_color, (d) => sd(d, v(d).pe_directo + ' '));
          tspan(text, derrota_color, (d) => sd(d, v(d).pp_directo + '\xa0\xa0\xa0'));
          tspan(text, victoria_color, (d) => sd(d, v(d).gf_directo));
          tspan(text, null, (d) => sd(d, '-'));
          tspan(text, derrota_color, (d) => sd(d, v(d).gc_directo + ' '));
          tspan(
            text,
            (d) => diffColor(v(d).diff_directo),
            (d) => sd(d, signedDiff(v(d).diff_directo))
          );
          tspan(text, null, (d) => sd(d, ']'));
          tspan(text, 'purple', (d) => '\xa0\xa0\xa0' + d.fairPlay);
        })
        .call(halo1, heightBars * 0.2, '#f1f1f1');

    // --- Renderizado ---

    if (grupos > 1) {
      grupos_1.forEach((grupo, indice_grupo) => {
        rankingSVG
          .filter((d) => d.name.split('-')[1] == grupo)
          .append('text')
          .attrs({
            x: xPos,
            y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) + defaults.value.position.y * 1.5,
          })
          .styles(commonStyles)
          .call(appendAllTspans);
      });
    } else {
      rankingSVG
        .append('text')
        .attrs({
          x: xPos,
          y: (d, i) => y(i) + defaults.value.position.y + defaults.value.style.font_size / 2,
        })
        .styles(commonStyles)
        .call(appendAllTspans);
    }
  }

  if (grupos > 1) {
    grupos_1.forEach((grupo, indice_grupo) => {
      rankingSVG
        .filter((d) => d.name.split('-')[1] == grupo)
        .append('image')
        .style('filter', 'url(#dropshadow)')
        .style('filter', 'url(#white-border)')
        .attrs({
          class: 'logo',
          x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 - (defaults.logo.size1 * 1.1) / 2,
          y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) - (defaults.logo.size1 * 1.1) / 2, //ojo d.rank
          href: (d) => /* getPng(d.name) */ `./escudos/${d.name.split('-')[0]}.png`,
          height: defaults.logo.size1 * 1.1,
        });

      /* rankingSVG
        .filter((d) => d.name.split('-')[1] == grupo)
        .append('circle')
        .attrs({
          cx: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + (defaults.logo.size1 * 1.1) / 3,
          cy: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) + (defaults.logo.size1 * 1.1) / 3, //ojo d.rank
          r: defaults.logo.size1 * 0.235,
          fill: '#f1f1f1'
        }); */

      rankingSVG
        .filter((d) => d.name.split('-')[1] == grupo)
        .append('image')
        .style('filter', 'url(#white-border)')
        .attrs({
          x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 - (defaults.logo.size1 * 0.4) / 2 + (defaults.logo.size1 * 1.1) / 3,
          y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) - (defaults.logo.size1 * 0.4) / 2 + (defaults.logo.size1 * 1.1) / 3, //ojo d.rank
          href: (d) => `./flags/${countryToCode(d.name.split('-')[0])}.svg`,
          height: defaults.logo.size1 * 0.4,
        });
      /* .style('filter', 'url(#dropshadow)'); */
    });
  } else {
    rankingSVG.append('image').style('filter', 'url(#dropshadow)').attrs({
      class: 'logo',
      x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 - (defaults.logo.size1 * 1.1) / 2,
      y: (d, i) => y(i) - (defaults.logo.size1 * 1.1) / 2, // ojo y(d.rank)
      href: (d) => `./escudos/${d.name.split('-')[0]}.png`,
      height: defaults.logo.size1 * 1.1,
    });
  }

  yearSlice.forEach((d) => {
    d.fechas_en_top = d3.sum(
      data.filter((e) => e.name == d.name && e.final != true && e.fecha.replace('Fecha ', '') != 'Def.'),
      (e) => (e.rank == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
    );
  });

  let array_p = [];
  if (stats_on_top) {
    array_p = ['racha', 'racha_empates', 'racha_derrotas', 'racha_sin_victorias', 'racha_sin_empates', 'racha_sin_derrotas', 'goleadas', 'goleadas_en_contra', 'valla_invicta', 'fechas_en_top'];
  }

  function generarPositions(max) {
    const positions = {};
    for (let n = 1; n <= max; n++) {
      const filas = Math.ceil(n / 3);
      const cols = Math.ceil(n / filas);
      const resto = n % cols;
      const offsetsCols = Array.from({ length: cols }, (_, i) => i - (cols - 1) / 2);
      const result = [];
      for (let i = 0; i < n; i++) {
        const esUltimaFila = i >= n - (resto || cols);
        const itemsEnEstaFila = esUltimaFila && resto ? resto : cols;
        const offsetsFilaActual = Array.from({ length: itemsEnEstaFila }, (_, j) => j - (itemsEnEstaFila - 1) / 2);
        const col = i % cols;
        const fila = Math.floor(i / cols);
        const colOffset = esUltimaFila && resto ? offsetsFilaActual[i - (n - resto)] : offsetsCols[col];
        result.push([colOffset, fila]);
      }
      positions[n] = result;
    }
    return positions;
  }

  const positions = generarPositions(15);
  const try_positions = (a, b, c) => {
    try {
      return positions[a][b][c];
    } catch {
      return 0;
    }
  };

  const EXTRAS_HASTA_INDEX = new Set(['racha_derrotas', 'racha_sin_derrotas', 'goleadas_en_contra', 'valla_invicta']);
  const EXTRAS_HASTA_INDEX1 = new Set(['racha_sin_victorias', 'goleadas', 'valla_invicta', 'fechas_en_top']);

  const xBase = x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x;

  const maxPorProp = Object.fromEntries(array_p.map((p) => [p, d3.max(data, (d) => d[p])]));

  // calcLength global (para los elementos de arriba, usa el máximo global)
  function calcLength(slice, extrasSet) {
    let length = 0;
    slice.forEach((ee) => {
      if (extrasSet.has(ee)) length++;
      length += maxPorProp[ee].toString().length;
    });
    return length;
  }

  // calcLength por equipo (para los elementos del ranking, usa el máximo de ese equipo)
  function calcLengthPorDatum(slice, extrasSet, name) {
    let length = 0;
    slice.forEach((ee) => {
      if (extrasSet.has(ee)) length++;
      length += maxByName[name][ee].toString().length;
    });
    return length;
  }

  const commonTextStyles = {
    fill: '#f1f1f1',
    'font-size': defaults.value.style.font_size,
    'font-weight': 600,
    'text-anchor': 'start',
    'alignment-baseline': defaults.value.style.alignment_baseline,
  };

  const commonTextStylesRanking = {
    ...commonTextStyles,
    fill: black_color,
    // text-anchor: 'start' se hereda del spread
  };

  const getRank = grupos > 1 ? (d, indice_grupo) => d.rank + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos) : (d) => d.rank;

  const maxByName = Object.fromEntries(
    [...new Set(data.map((d) => d.name))].map((name) => [
      name,
      Object.fromEntries(
        array_p.map((p) => [
          p,
          d3.max(
            data.filter((e) => e.name == name),
            (e) => e[p]
          ),
        ])
      ),
    ])
  );

  const renderGroup = (dataSlice, indice_grupo, p, index) => {
    const yPos = (d) => y(getRank(d, indice_grupo)) + defaults.final_infos.position.y - heightBars / 3;

    svg
      .selectAll('.text')
      .data(dataSlice)
      .enter()
      .append('text')
      .attrs({
        class: 'final_infos',
        opacity: 1,
        x: (d) => xBase + calcLengthPorDatum(array_p.slice(0, index), EXTRAS_HASTA_INDEX, d.name) * heightBars * 0.225 + index * heightBars * 0.4,
        y: (d) => yPos(d),
      })
      .styles(commonTextStylesRanking)
      .text((d) => maxByName[d.name][p]);

    svg
      .selectAll('.images')
      .data(dataSlice)
      .enter()
      .append('image')
      .attrs({
        class: 'final_infos',
        x: (d) => xBase + calcLengthPorDatum(array_p.slice(0, index + 1), EXTRAS_HASTA_INDEX1, d.name) * heightBars * 0.225 + index * heightBars * 0.4 - heightBars * 0.05,
        y: (d) => yPos(d) - (defaults.final_infos.logos.size * 0.9) / 2,
        href: `./icons/${p}.png`,
        height: defaults.final_infos.logos.size * 0.9,
      });
  };

  // --- Loop principal ---

  array_p.forEach((p, index) => {
    const maxVal = maxPorProp[p];
    const maxValLen = maxVal.toString().length;
    const dataMax = removeDuplicates(data.filter((d) => d[p] == maxVal));

    const lengthHasta = calcLength(array_p.slice(0, index), EXTRAS_HASTA_INDEX);
    const lengthHasta1 = calcLength(array_p.slice(0, index + 1), EXTRAS_HASTA_INDEX1);
    const xComun = xBase + index * heightBars * 0.6;

    // Escudos de los equipos con el máximo (arriba)
    svg
      .selectAll('.img')
      .data(dataMax)
      .enter()
      .append('image')
      .attrs({
        x: (d, i, total) => xComun + lengthHasta * heightBars * 0.225 + try_positions(total.length, i, 0) * defaults.mini_logo.size * 0.55 - defaults.mini_logo.size1 / 2 + ((maxValLen + 1) / 2) * heightBars * 0.225,
        y: (d, i, total) => y(-1) - heightBars / 2.5 - try_positions(total.length, i, 1) * defaults.mini_logo.size * 0.65,
        height: defaults.mini_logo.size1,
        href: (d) => `./escudos/${d.name.split('-')[0]}.png`,
      });

    // Número máximo (arriba)
    svg
      .append('text')
      .attrs({
        class: 'final_infos',
        x: xComun + lengthHasta * heightBars * 0.225,
        y: margin.top * 0.8,
      })
      .styles(commonTextStyles)
      .text(maxVal);

    // Ícono de la propiedad (arriba)
    svg.append('image').attrs({
      class: 'final_infos',
      x: xComun + lengthHasta1 * heightBars * 0.225 - heightBars * 0.05,
      y: margin.top * 0.8 - (defaults.final_infos.logos.size * 0.9) / 2,
      href: `./icons/${p}.png`,
      height: defaults.final_infos.logos.size * 0.9,
    });

    // Stats por equipo en el ranking (por grupo o sin grupos)
    if (grupos > 1) {
      grupos_1.forEach((grupo, indice_grupo) => {
        renderGroup(
          yearSlice.filter((d) => d.name.split('-')[1] == grupo),
          indice_grupo,
          p,
          index
        );
      });
    } else {
      renderGroup(yearSlice, 0, p, index);
    }
  });

  /* svg.append('rect').attrs({
    x: 0,
    y: 0,
    width: width,
    height: height,
    fill: sort_teams1(data.filter(d => d.vs == 'none')).slice(0, 2).map(d => d.name).includes('Racing') ? 'green' : 'red',
    opacity: 0.3
  }); */

  /* console.log(sort_teams1(data.filter(d => d.vs == 'none')).slice(0, 2).map(d => d.name).includes('Racing')) */
};

/* totalCasosSimulados.forEach(d => {
  render(d, nombre_torneo, puntos_por_partido, probabilidades);
}) */

render(totalCasosSimulados[index1], playoffs, nombre_torneo, puntos_por_partido, probabilidades);

if (totalCasosSimulados.length > 1) {

  const timer = d3.interval((e) => {
    render(totalCasosSimulados[index1], playoffs, nombre_torneo, puntos_por_partido, probabilidades);
    index1++
    console.log(index1, totalCasosSimulados.length-1)
    if (index1 >= totalCasosSimulados.length-1) timer.stop(); // Stop after 5 seconds
  }, 200);
}
