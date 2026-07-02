import { procesarDatos } from './data.js';
import { rankingFIFA2026 } from './rankingFIFA2026.js';
import { FLAG_COLORS } from './colores.js';
import { TABLA } from './combinaciones_mundial.js';
import { calcularProbabilidadesEnSegundoPlano } from './simulador.js';

const { totalCasosSimulados, playoffs, nombre_torneo, puntos_por_partido, probabilidades, clasificados_por_competencia, simulacionesTotales, datosBase } = window.__appData ?? (await procesarDatos());

const index = (window.__appIndex ?? 0) % totalCasosSimulados.length;
let index1 = 0;
let final_list1 = totalCasosSimulados[index];
let totalSimulacionesTexto = 10000;
let mostrandoProbabilidades = false;

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
let grey1_color = '#b5b5b5';

let primer_puesto = '#76c476';
let segundo_puesto = '#94e694';
let tercer_puesto = '#e3ffb5';

let not_played_yet = 99;
let not_played_yet_x = 0.4;
let fechas_not_played = 1;

let ingles = true;
let localia = false;
let stats_on_top = false;
let datos_totales = false;
let repechaje = 0;
let simular_playoffs = true;
let neutral = true;
let efectividadYPromedioGoles = false;
let dividir_grupos = false;

let competencia = nombre_torneo;

let punctuation_translation = ['.', ingles ? '.' : ','];

if (nombre_torneo == 'Mundial 2026') {
  repechaje = 1;
}

let clasificacion_por_grupo = clasificados_por_competencia[competencia] + repechaje;

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

const render = (data, fechas_playoff, nombre_torneo, puntos_por_partido, probabilidades) => {
  data = data[0]
  let grupos_1 = [...new Set(data.map((d) => d.name.split('-')[1]))].sort();
  let names_1 = [...new Set(data.map((d) => d.name))];

  let grupos = grupos_1.length;
  let top_n = names_1.length;
  let heightBars = 50;

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

  let playoffs_names = {};

  if (ingles) {
    playoffs_names = {
      32: 'Round of 64',
      16: 'Round of 32',
      8: 'Round of 16',
      4: 'Quarterfinals',
      2: 'Semifinals',
      1: 'Final',
    };
  } else {
    playoffs_names = {
      32: '32avos',
      16: 'Dieciseisavos',
      8: 'Octavos',
      4: 'Cuartos',
      2: 'Semifinales',
      1: 'Final',
    };
  }

  if (grupos == 1) {
    grupos = 0;
  }

  const probMap = probabilidades ?? {};

  function probabilidad(name) {
    if (!Object.keys(probMap).includes(name)) {
      return [''];
    } else if (Object.keys(probMap).includes(name)) {
      return probMap[name];
    } else {
      return [''];
    }
  }

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

  let names_playoffs_1 = [...new Set(fechas_playoff.map((d) => d.local || d.visitante))];

  let dates = [...new Set(data.map((d) => d.semana).sort((a, b) => a - b))];

  let margin_right = margin.right;

  fechas_not_played = d3.max(data, (d) => d.partidos_jugados + d.partidos_jugados1);
  let contFechas = 0;
  for (let i = 1; i < dates.length; i++) {
    let filter = data.filter((d) => d.semana == i);
    let filter1 = filter.find((d) => d.goles_fecha != 99);
    if (filter1 != undefined) {
      contFechas = contFechas + 1;
    }
  }
  fechas_not_played = contFechas;

  let fechas_no_jugadas = dates.length - 1 - fechas_not_played - 1;
  let weeks = heightBars * 2;
  let weeks_i = weeks * dates.length;

  width = weeks * dates.length - weeks * not_played_yet_x * fechas_no_jugadas + heightBars * 9;
  height = top_n * heightBars + margin.top;

  height = grupos > 1 ? height + grupos * (heightBars / 2) : height;

  let margin_left = heightBars;

  if (grupos > 1 && names_playoffs_1.length != 0) {
    width = width + (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff);
  } else if (grupos > 1 && simular_playoffs) {
    width = width + (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff * 1.5);
  }

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
    .text((ingles ? 'World Cup 2026' : nombre_torneo).replace('_', '/'));

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
      const rivales = [...new Set(nombress.filter((d) => d !== nombre))];
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

    return ingles ? map[name] || name : name;
  }

  function getRankingFIFA1(name) {
    const nombre = name.replace(/-[A-L]$/, '');
    return rankingFIFA2026[nombre] || 999;
  }

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

  let mejores_num = {};
  if (grupos > 1) {
    mejores_num = Object.fromEntries(
      Array.from({ length: equipos_por_grupos }, (_, i) => [
        i,
        mejores_terceros_sort([...yearSlice])
          .filter((d) => d.rankInGroup == i)
          .map((d) => d.name),
      ])
    );
  }

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

  const clasificados = ['L', 'C', 'B', 'H', 'E', 'G', 'F', 'D'];

  let playoffs_spots = {};
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
        '1A': [0, 0],
        '8B': [0, 1],

        '2A': [1, 0],
        '7B': [1, 1],

        '3A': [2, 0],
        '6B': [2, 1],

        '4A': [3, 0],
        '5B': [3, 1],

        '5A': [4, 0],
        '4B': [4, 1],

        '6A': [5, 0],
        '3B': [5, 1],

        '7A': [6, 0],
        '2B': [6, 1],

        '8A': [7, 0],
        '1B': [7, 1],
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
      },
    };
  }

  let positions_playoffs = playoffs_spots[competencia];

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
    });

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
            stroke: (d) => FLAG_COLORS(d[dd].split('-')[0])[ii],
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
            stroke: (d) => FLAG_COLORS(d[dd].split('-')[0])[ii],
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
              stroke: (d) => FLAG_COLORS(d[dd].split('-')[0])[ii],
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
              stroke: (d) => FLAG_COLORS(d[dd].split('-')[0])[ii],
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
              stroke: (d) => FLAG_COLORS(d[dd].split('-')[0])[ii],
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

    arr.forEach((dd) => {
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
    });
  }

  if (grupos > 1 && simular_playoffs) {
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
    }

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

    const keysSet = new Set(Object.keys(positions_playoffs));

    svg
      .selectAll('.rect')
      .data(yearSlice.filter((d, i) => (d.rankInGroup >= 0 && d.rankInGroup <= clasificacion_por_grupo - 1) || (d.rankInGroup >= equipos_por_grupos && d.rankInGroup <= equipos_por_grupos + clasificacion_por_grupo - 1)).filter((d) => keysSet.has(d.position)))
      .enter()
      .append('rect')
      .attrs({
        x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff,
        y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.rankInGroup + 1 + d.name.split('-')[1]][0]) + (top_n * heightBars + (grupos * heightBars) / 2) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d.rankInGroup + 1 + d.name.split('-')[1]][1] == 0 ? -space_height_playoff : space_height_playoff) - heightBars / 2,
        width: width_playoffs,
        height: heightBars,
      })
      .attr('style', (d) => `outline: 1px solid grey`)
      .styles({
        opacity: 1,
        fill: (d) => (probabilidad(d.name).posicion == 1 || probabilidad(d.name).posicion == 2 ? '#c6c6c6' : '#dddddd'),
      });

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
        opacity: (d) => (probabilidad(d.name).posicion == 1 || probabilidad(d.name).posicion == 2 ? 1 : 0.6),
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
        opacity: (d) => (probabilidad(d.name).posicion == 1 || probabilidad(d.name).posicion == 2 ? 1 : 0.6),
      })
      .text((d) => countryToEnglish(d.name.split('-')[0]));

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
        opacity: (d) => (probabilidad(d.name).posicion == 1 || probabilidad(d.name).posicion == 2 ? 1 : 0.6),
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
      return filterr.length > 0 ? ('(' + d3.format(',.1f')(d3.sum(filterr, (d) => d.goles_fecha) / (filterr.length / 2)) + ')').replace(punctuation_translation[0], punctuation_translation[1]) : '';
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
        ? 'F.'
        : d == dates[0]
          ? d
          : data
              .filter((e) => e.semana == d && e.vs != 'none')[0]
              .fecha2.split(' ')[1]
              .replace('Def.', '')
              .replace('Post.', d)
    );

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
    .text(ingles ? `Probability*: ${totalSimulacionesTexto} Simulations. (100%) = Qualified. (0%) = Eliminated.` : `Probabilidad*: ${totalSimulacionesTexto} Simulaciones. (100%) = Clasificado. (0%) = Afuera.`);

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
    .text(ingles ? 'Fair Play*: Points system based on cards. Yellow: -1, Indirect red: -3, Direct red: -4, Yellow + Direct red: -5.' : 'Fairplay*: Sistema de puntos en base a las tarjetas. Amarilla: -1, Roja indirecta: -3, Roja directa: -4, Amarilla + Roja directa: -5.');

  if (!mostrandoProbabilidades) {
    svg
      .append('text')
      .attrs({
        class: 'years',
        x: margin.left * 0.05,
        y: margin.top * 0.35,
      })
      .styles({
        'font-size': heightBars * 0.25,
        fill: '#f1f1f1',
        'font-weight': 600,
        'text-anchor': 'start',
        'alignment-baseline': 'central',
      })
      .text(ingles ? 'Calculating probabilities...' : 'Calculando probabilidades...');
  }

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
    .text(ingles ? 'Tiebreakers: PTS > [Head-to-head: PTS > GD > GF] > GD > GF > Fair Play > FIFA Ranking' : 'Criterios de desempate: PTS > [Enfrentamientos directos: PTS > DIF > GF] > DIF > GF > FairPlay > RankingFIFA');

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
      'font-size': heightBars * 0.24,
      fill: 'grey',
      'font-weight': 600,
      'text-anchor': 'start',
      'alignment-baseline': 'central',
    })
    .text(ingles ? 'Team - FIFA Ranking - Probability* - Possible position range' : 'Selección - RankingFIFA - Probabilidad* - Posiciones posibles');

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
      'font-size': heightBars * 0.24,
      fill: 'grey',
      'font-weight': 600,
      'text-anchor': 'start',
      'alignment-baseline': 'central',
    })
    .text(ingles ? 'PTS - MP - W - D - L - GF - GA - GD - Fair Play*' : 'PTS - PJ - PG - PE - PP - GF - GC - DIF - FairPlay*');

  var defs = svg.append('defs');

  var filter = defs.append('filter').attr('id', 'dropshadow');

  filter.append('feGaussianBlur').attr('in', 'SourceAlpha').attr('stdDeviation', 1).attr('result', 'blur');
  filter.append('feOffset').attr('in', 'blur').attr('dx', 1).attr('dy', 1).attr('result', 'offsetBlur');
  filter.append('feFlood').attr('in', 'offsetBlur').attr('flood-color', '#000').attr('flood-opacity', 1).attr('result', 'offsetColor');
  filter.append('feComposite').attr('in', 'offsetColor').attr('in2', 'offsetBlur').attr('operator', 'in').attr('result', 'offsetBlur');

  var feMerge = filter.append('feMerge');

  feMerge.append('feMergeNode').attr('in', 'offsetBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

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
        x: barWidth - heightBars * 0.1,
        y: margin.top * 0.85,
      })
      .styles({
        'font-size': heightBars * 0.24,
        fill: 'grey',
        'font-weight': 600,
        'text-anchor': 'end',
        'alignment-baseline': 'central',
      })
      .text(ingles ? 'Inter Group - Overall' : 'Inter Grupo - General');

    svg
      .append('text')
      .attrs({
        class: 'years',
        x: margin_left / 2,
        y: margin.top * 0.725,
      })
      .styles({
        'font-size': heightBars * 0.24,
        fill: 'grey',
        'font-weight': 600,
        'text-anchor': 'middle',
        'alignment-baseline': 'central',
      })
      .text((ingles ? 'of ' : 'de ') + equipos_por_grupos);

    svg
      .append('text')
      .attrs({
        class: 'years',
        x: margin_left / 2,
        y: margin.top * 0.85,
      })
      .styles({
        'font-size': heightBars * 0.24,
        fill: 'grey',
        'font-weight': 600,
        'text-anchor': 'middle',
        'alignment-baseline': 'central',
      })
      .text(ingles ? 'Group' : 'Grupo');

    svg
      .append('text')
      .attrs({
        class: 'years',
        x: barWidth - heightBars * 0.1,
        y: margin.top * 0.725,
      })
      .styles({
        'font-size': heightBars * 0.24,
        fill: 'grey',
        'font-weight': 600,
        'text-anchor': 'end',
        'alignment-baseline': 'central',
      })
      .text((ingles ? 'of ' : 'de ') + grupos + (ingles ? ' - of ' : ' - de ') + names_1.length);

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

      const xoffset = dividir_grupos ? (indice_grupo >= grupos / 2 ? width - barWidth : 0) : 0;
      const yoffset = dividir_grupos ? -(indice_grupo >= grupos / 2 ? (grupos / 2) * (heightBars * equipos_por_grupos + heightBars / 2) : 0) : 0;

      // Rect encabezado grupo
      svg
        .selectAll('.rect')
        .data(grupos_1)
        .enter()
        .append('rect')
        .attrs({
          class: 'bars_names_grupos',
          x: 0 + xoffset,
          y: y(offsetGrupo) - heightBars / 2 + yoffset,
          width: barWidth,
          height: heightBars / 2,
        })
        .style('fill', '#ebebeb');

      // Texto grupo
      svg
        .append('text')
        .attrs({
          class: 'name',
          x: margin_left / 2 + xoffset,
          y: y(offsetGrupo + 0.75) - (y(1) - y(0)) + yoffset,
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
              0.175 +
            xoffset,
          y: y(offsetGrupo + 0.75) - (y(1) - y(0)) + yoffset,
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
        })
        .call(halo1, heightBars * 0.225, 'white');

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
              0.175 +
            xoffset,
          y: y(offsetGrupo + 0.75) - (y(1) - y(0)) + yoffset,
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
          return filterr.length > 0 ? ('(' + d3.format(',.1f')(d3.sum(filterr, (d) => d.goles_fecha) / (filterr.length / 2)) + ')').replace(punctuation_translation[0], punctuation_translation[1]) : '';
        })
        .call(halo1, heightBars * 0.225, 'white');

      svg
        .selectAll('.text')
        .data(dates)
        .enter()
        .append('text')
        .attrs({
          class: 'years',
          x: (d, i) => fechasNotPlayed(i) + xoffset,
          y: y(offsetGrupo + 0.75) - (y(1) - y(0)) + yoffset,
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
            ? 'F.'
            : d == dates[0]
              ? d
              : data
                  .filter((e) => e.semana == d && e.vs != 'none')[0]
                  .fecha2.split(' ')[1]
                  .replace('Def.', '')
                  .replace('Post.', d)
        )
        .call(halo1, heightBars * 0.225, 'white');

      // Rects equipos
      svg
        .selectAll('.rect')
        .data(yearSlice.slice(indice_grupo * equipos_por_grupos, (indice_grupo + 1) * equipos_por_grupos))
        .enter()
        .append('rect')
        .attrs({
          class: 'bars_names',
          x: 0 + xoffset,
          y: (d, i) => y(i + distancia_entre_grupos + offsetGrupo) - heightBars / 2 + yoffset,
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
            if (i % 2 === 1) {
              return '#d8ffb8';
            } else {
              return tercer_puesto;
            }
          } else if (probabilidad(d.name).probabilidad == 0) {
            if (i % 2 === 1) {
              return '#ffadad';
            } else {
              return '#ff5f5f';
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
          x: margin_left / 2 + xoffset,
          y: (d, i) => y(i + distancia_entre_grupos + offsetGrupo) + yoffset,
        })
        .styles({
          fill: black_color,
          'font-size': heightBars * 0.5,
          'alignment-baseline': 'central',
          'text-anchor': 'middle',
          'font-weight': 600,
        })
        .text((d) => d)
        .call(halo1, heightBars * 0.225, 'white');

      svg
        .selectAll('.text')
        .data(yearSlice.slice(indice_grupo * equipos_por_grupos, (indice_grupo + 1) * equipos_por_grupos))
        .enter()
        .append('text')
        .attrs({
          x: barWidth - margin_left / 3 + xoffset,
          y: (d, i) => y(i + distancia_entre_grupos + offsetGrupo) + yoffset,
        })
        .styles({
          fill: grey_color,
          'font-size': heightBars * 0.325,
          'alignment-baseline': 'central',
          'text-anchor': 'end',
          'font-weight': 600,
        })
        .text((d, i) => {
          let grupo = i + 1;
          let interGroup = mejores_num[i].indexOf(d.name) + 1;
          let overall = mejores.indexOf(d.name) + 1;
          return '' + interGroup + '' + '\xa0\xa0\xa0' + overall + '';
        })
        .call(halo1, heightBars * 0.225, 'white');

      // Líneas verticales de fechas
      svg
        .selectAll('.rect')
        .data(dates)
        .enter()
        .append('rect')
        .attrs({
          class: 'lines_years',
          x: (d, i) => fechasNotPlayed(i) - (heightBars * 0.05) / 2 + xoffset,
          y: y(distancia_entre_grupos + offsetGrupo) - heightBars / 2 + yoffset,
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
          x: margin_left - 1 + xoffset,
          y: y(offsetGrupo) + yoffset,
          width: margin_left / 4,
          height: heightBars * equipos_por_grupos,
        })
        .style('fill', 'url(#areaGradient0)');

      svg
        .append('rect')
        .attrs({
          class: 'bars_names',
          x: 0 + xoffset,
          y: y(offsetGrupo) + yoffset,
          width: barWidth,
          height: heightBars / 2,
        })
        .style('fill', 'url(#areaGradient1)');

      svg
        .append('rect')
        .attrs({
          class: 'bars_names',
          x: 0 + xoffset,
          y: y(offsetGrupo) - heightBars + yoffset,
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
              .style('filter', 'blur(1px)');

            // ── FRANJAS ─────────────────────────────────────────
            colors.forEach((color, i) => {
              const middleIndex = (colors.length - 1) / 2;
              const offset = (i - middleIndex) * stripeWidth;

              const offsetPts = offsetPoints(points, offset);
              const pathD = pathLine(offsetPts);

              svg
                .append('path')
                .attr('d', pathD)
                .attr('transform', transform)
                .attr('class', className)
                .style('fill', 'none')
                .style('stroke', color)
                .style('stroke-width', stripeWidth * 1.1)
                .style('stroke-linejoin', 'round');
            });
          }

          drawFlagPath(svg, points, club, 15, `translate(${margin_left * 2 + xoffset}, ${yoffset})`, 'line');
        });
    });

    grupos_1.forEach((grupo, indice_grupo) => {
      const xoffset = dividir_grupos ? (indice_grupo >= grupos / 2 ? width - barWidth : 0) : 0;
      const yoffset = dividir_grupos ? -(indice_grupo >= grupos / 2 ? (grupos / 2) * (heightBars * equipos_por_grupos + heightBars / 2) : 0) : 0;

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
                    transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
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
                        transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
                        x: x(wks) - heightBars * 0.06 + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor,
                        y: y(rank1) + (!neutral ? -heightBars * 0.325 : -heightBars * 0.2) + (team.l_or_v == 'V' && !neutral ? heightBars * 0.65 : 0),
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
                        transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
                        x: x(wks) + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor + hor_not_played_yet,
                        y: y(rank1) + (!neutral ? -heightBars * 0.325 : -heightBars * 0.2) + (team.l_or_v == 'V' && !neutral ? heightBars * 0.65 : 0),
                      })
                      .styles({
                        fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : team.goles_fecha == not_played_yet ? grey_color : empate_color,
                        'font-weight': 600,
                        'font-size': team.goles_fecha == not_played_yet ? defaults.value.style.font_size * 0.75 : defaults.value.style.font_size,
                        'text-anchor': 'middle',
                        'alignment-baseline': 'central',
                      })
                      .text(team.goles_fecha == not_played_yet ? '-' : '-')
                  )

                  .call((text) =>
                    text
                      .append('tspan')
                      .attrs({
                        transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
                        x: x(wks) + heightBars * 0.06 + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor,
                        y: y(rank1) + (!neutral ? -heightBars * 0.325 : -heightBars * 0.2) + (team.l_or_v == 'V' && !neutral ? heightBars * 0.65 : 0),
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

                // En tu sección de defs, agregá esto:
                const borderFilter = defs.append('filter').attr('id', 'white-border').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
                borderFilter.append('feMorphology').attrs({ operator: 'dilate', radius: 1.5, in: 'SourceAlpha', result: 'expanded' });
                borderFilter.append('feFlood').attrs({ 'flood-color': 'white', result: 'color' });
                borderFilter.append('feComposite').attrs({ in: 'color', in2: 'expanded', operator: 'in', result: 'border' });
                borderFilter
                  .append('feMerge')
                  .selectAll('feMergeNode')
                  .data(['border', 'SourceGraphic'])
                  .enter()
                  .append('feMergeNode')
                  .attr('in', (d) => d);

                svg
                  .append('image')
                  .style('filter', 'url(#white-border)')
                  .attrs({
                    transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
                    class: 'line',
                    x: (d) => {
                      const dir = team.l_or_v == 'V' && !neutral ? -1 : !neutral ? 1 : 0;
                      let val = x(wks) + dir * heightBars * 0.3 - defaults.mini_logo.size1 / 2;
                      if (team.goles_fecha != not_played_yet) {
                        val += dir * team.goles_en_contra_fecha.toString().length * heightBars * 0.2;
                      }
                      return val;
                    },
                    y: y(rank1) + (!neutral ? -heightBars * 0.325 : heightBars * 0.25) - defaults.mini_logo.size1 / 2 + (team.l_or_v == 'V' && !neutral ? heightBars * 0.65 : 0),
                    height: defaults.mini_logo.size1,
                    href: pts1.vs != 'none' ? `./escudos/${team.vs.split('-')[0]}.png` : '',
                    /* opacity: pts1.vs != 'none' ? 0.75 : 1 */
                  });

                svg.append('image').attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  class: 'line',
                  x: (d) => {
                    const dir = team.l_or_v == 'V' && !neutral ? -1 : !neutral ? 1 : 1;
                    let val = x(wks) + dir * heightBars * 0.3 - (defaults.mini_logo.size1 * 0.9) / 2;
                    if (team.goles_fecha != not_played_yet) {
                      val += dir * team.goles_en_contra_fecha.toString().length * heightBars * 0.2;
                    }
                    return val;
                  },
                  y: y(rank1) + (!neutral ? -heightBars * 0.325 : -heightBars * 0.2) - (defaults.mini_logo.size1 * 0.9) / 2 + (team.l_or_v == 'V' && !neutral ? heightBars * 0.65 : 0),
                  height: defaults.mini_logo.size1 * 0.9,
                  href: pts1.vs != 'none' ? (team.simulado ? `./icons/simulated.png` : '') : '',
                });

                svg
                  .append('text')
                  .attrs({
                    transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
                    x: x(wks) - heightBars * 0.0 + i * heightBars * 0.8 - (names_filter.length - 1) * (heightBars * 0.4),
                    y: y(rank1),
                  })
                  .styles({
                    fill: black_color,
                    'font-weight': 600,
                    'font-size': heightBars * 0.16,
                    'text-anchor': 'middle',
                    'alignment-baseline': 'central',
                  })
                  .text(() => {
                    if (team.goles_fecha != not_played_yet) {
                      const empatados = fecha_filter.filter((d) => d.value == names_filter[0].value);

                      if (empatados.length > 1) {
                        const agruparPor = (grupo, getValor) => {
                          const map = new Map();
                          grupo.forEach((t) => {
                            const key = Number(getValor(t));
                            if (!map.has(key)) map.set(key, []);
                            map.get(key).push(t);
                          });
                          return Array.from(map.values());
                        };

                        let grupoActual = empatados;
                        let directosTexto = '';

                        const directosTeam = statsDirectos(
                          grupoActual.map((d) => d.name),
                          team.semana
                        )[team.name];

                        if (directosTeam && directosTeam.pj_directo > 0) {
                          directosTexto = ' [' + directosTeam.pts_directo + ' ' + directosTeam.diff_directo + ' ' + directosTeam.gf_directo + ']';

                          const camposDirectos = ['pts_directo', 'diff_directo', 'gf_directo'];
                          for (const campo of camposDirectos) {
                            const directosDelGrupo = statsDirectos(
                              grupoActual.map((d) => d.name),
                              team.semana
                            );
                            const subgrupos = agruparPor(grupoActual, (t) => {
                              const dt = directosDelGrupo[t.name];
                              return dt ? dt[campo] : NaN;
                            });
                            const miSubgrupo = subgrupos.find((g) => g.some((t) => t.name === team.name));
                            if (miSubgrupo.length === 1) {
                              return team.value + directosTexto;
                            }
                            grupoActual = miSubgrupo;
                          }
                          // si los 3 criterios directos no desempatan dentro de grupoActual, sigue abajo
                        }

                        const criteriosGenerales = [
                          { campo: 'diferencia_de_goles', formato: (t) => (t.diferencia_de_goles > 0 ? ' +' : ' ') + t.diferencia_de_goles },
                          { campo: 'goles', formato: (t) => (t.diferencia_de_goles > 0 ? ' +' : ' ') + t.diferencia_de_goles + ' ' + t.goles },
                          { campo: 'fairPlay', formato: (t) => (t.diferencia_de_goles > 0 ? ' +' : ' ') + t.diferencia_de_goles + ' ' + t.goles + ' ' + t.fairPlay },
                        ];

                        for (const { campo, formato } of criteriosGenerales) {
                          const subgrupos = agruparPor(grupoActual, (t) => t[campo]);
                          const miSubgrupo = subgrupos.find((g) => g.some((t) => t.name === team.name));
                          if (miSubgrupo.length === 1) {
                            return team.value + directosTexto + formato(team);
                          }
                          grupoActual = miSubgrupo;
                        }

                        // último criterio: Ranking FIFA, siempre se muestra si se llegó hasta aquí
                        return team.value + directosTexto + (team.diferencia_de_goles > 0 ? ' +' : ' ') + team.diferencia_de_goles + ' ' + team.goles + ' ' + team.fairPlay + ' #' + getRankingFIFA1(team.name);
                      } else {
                        return team.value;
                      }
                    }
                  })

                  .call(halo1, heightBars * 0.15, '#f1f1f1');

                if (!nombre_torneo.includes('Mundial')) {
                  svg.append('image').attrs({
                    transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
                    class: 'line',
                    x: x(wks) - heightBars * 0.025 + (team.racha1 > 2 ? heightBars * 0.175 : team.racha_derrotas1 > 2 ? heightBars * 0.175 : team.racha_empates1 > 2 ? heightBars * 0.175 : team.racha_sin_victorias1 > 2 ? heightBars * 0.145 : team.racha_sin_derrotas1 > 2 ? heightBars * 0.145 : team.racha_sin_empates1 > 2 ? heightBars * 0.145 : 0) - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + i * heightBars * 0.55 - (names_filter.length - 1) * (heightBars * 0.325),
                    y: y(rank1) + (team.l_or_v == 'V' ? -heightBars * 0.31 : +heightBars * 0.31) - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
                    height: (team.racha1 > 2 ? heightBars * 0.45 : team.racha_derrotas1 > 2 ? heightBars * 0.45 : team.racha_empates1 > 2 ? heightBars * 0.45 : team.racha_sin_victorias1 > 2 ? heightBars * 0.5 : team.racha_sin_derrotas1 > 2 ? heightBars * 0.5 : team.racha_sin_empates1 > 2 ? heightBars * 0.5 : 0) + defaults.subValue.style.font_size * 0.35,
                    href: team.goles_fecha !== not_played_yet ? (team.racha1 > 2 ? `./icons/green_flame2.png` : team.racha_derrotas1 > 2 ? `./icons/red_flame2.png` : team.racha_empates1 > 2 ? `./icons/yellow_flame2.png` : team.racha_sin_victorias1 > 2 ? `./icons/racha_sin_victorias2.png` : team.racha_sin_derrotas1 > 2 ? `./icons/racha_sin_derrotas2.png` : team.racha_sin_empates1 > 2 ? `./icons/racha_sin_empates2.png` : '') : '',
                  });

                  svg
                    .append('text')
                    .attrs({
                      transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
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
                  transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
                  class: 'line',
                  x: x(wks) + defaults.value.style.font_size - (defaults.mini_logo.size * 0.45) / 2 + i * heightBars * 0.8 - (names_filter.length - 1) * (heightBars * 0.4),
                  y: y(rank1) - (defaults.mini_logo.size * 0.45) / 2,
                  height: defaults.mini_logo.size * 0.45,
                  href: team.pts_deducted > 0 ? `./icons/redasterisk1.png` : '',
                });

                svg
                  .append('text')
                  .attrs({
                    transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
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
                    transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
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
                  transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
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
                  transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
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
                transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
                class: 'line',
                x: x(wks) + heightBars * 0.125 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + weeks * 0.65,
                y: y(rank1) + (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : pts1.racha_sin_empates > 2 ? -heightBars / 3.25 : heightBars / 3.25) - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
                height: defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35,
                href: pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_victorias > 2 ? `./icons/racha_sin_victorias2.png` : '') : '') : '',
              });

              svg
                .append('text')
                .attrs({
                  transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
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
                transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
                class: 'line',
                x: x(wks) + heightBars * 0.125 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + weeks * 0.65,
                y: y(rank1) + heightBars / 3.25 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
                height: defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35,
                href: pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_derrotas > 2 ? `./icons/racha_sin_derrotas2.png` : '') : '') : '',
              });

              svg
                .append('text')
                .attrs({
                  transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
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
                transform: `translate(${margin_left * 2 + xoffset}, ${yoffset})`,
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
          .style('filter', 'blur(1px)');

        // ── FRANJAS ─────────────────────────────────────────
        colors.forEach((color, i) => {
          const middleIndex = (colors.length - 1) / 2;
          const offset = (i - middleIndex) * stripeWidth;

          const offsetPts = offsetPoints(points, offset);
          const pathD = pathLine(offsetPts);

          svg
            .append('path')
            .attr('d', pathD)
            .attr('transform', transform)
            .attr('class', className)
            .style('fill', 'none')
            .style('stroke', color)
            .style('stroke-width', stripeWidth * 1.1)
            .style('stroke-linejoin', 'round');
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
                x: (d) => {
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

  if (grupos <= 1) {
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

  let partidos_siumaldos = data.find((d) => d.simulado);

  if (partidos_siumaldos) {
    svg.append('image').attrs({
      x: margin_left * 1.5 - (heightBars * 0.7) / 2,
      y: margin.top * 0.3 - (heightBars * 0.7) / 2,
      height: heightBars * 0.7,
      href: `./icons/simulated.png`,
    });

    svg
      .append('text')
      .attrs({
        x: margin_left * 1.55 + (heightBars * 0.7) / 2,
        y: margin.top * 0.3,
      })
      .styles({
        fill: '#f1f1f1',
        'font-size': margin.top * 0.2,
        'font-weight': 600,
        'text-anchor': 'start',
        'alignment-baseline': 'central',
      })
      .text(index + 1 + '/' + totalCasosSimulados.length);
  }

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
      .replace(punctuation_translation[0], punctuation_translation[1]);

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
        .replace(punctuation_translation[0], punctuation_translation[1])}) `;
      const goalText_V = `${goalsBy('V')} (${d3
        .format('.1f')(goalsBy('V') / totalPJ)
        .replace(punctuation_translation[0], punctuation_translation[1])})  `;

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
          .text((d) => countryToEnglish(d.name.split('-')[0]))

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
              .text((d) => (d.partidos_jugados == 0 ? '' : ` (${formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100).replace(punctuation_translation[0], punctuation_translation[1])}%)`))
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
                    ).replace(punctuation_translation[0], punctuation_translation[1])}%)`.replace('NaN%', 'ND')
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
                  ).replace(punctuation_translation[0], punctuation_translation[1])}%)`
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
                    ).replace(punctuation_translation[0], punctuation_translation[1])}%)`.replace('NaN%', 'ND')
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
                  ).replace(punctuation_translation[0], punctuation_translation[1])}%)`
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
                    ).replace(punctuation_translation[0], punctuation_translation[1])}%)`
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
                    ).replace(punctuation_translation[0], punctuation_translation[1])}%)`
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
                      .replace(punctuation_translation[0], punctuation_translation[1])})`
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
                      .replace(punctuation_translation[0], punctuation_translation[1])
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
                      .replace(punctuation_translation[0], punctuation_translation[1])
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
              .text((d) => ' (' + probabilidad(d.name).probabilidad.toString().replace(punctuation_translation[0], punctuation_translation[1]) + '%) ' + probabilidad(d.name).posicion + '°')
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
        .text((d) => countryToEnglish(d.name.split('-')[0]))

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
            .text((d) => (d.partidos_jugados == 0 ? '' : ` (${formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100).replace(punctuation_translation[0], punctuation_translation[1])}%)`))
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
                  ).replace(punctuation_translation[0], punctuation_translation[1])}%)`.replace('NaN%', 'ND')
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
                ).replace(punctuation_translation[0], punctuation_translation[1])}%)`
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
                  ).replace(punctuation_translation[0], punctuation_translation[1])}%)`.replace('NaN%', 'ND')
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
                ).replace(punctuation_translation[0], punctuation_translation[1])}%)`
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
                  ).replace(punctuation_translation[0], punctuation_translation[1])}%)`
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
                  ).replace(punctuation_translation[0], punctuation_translation[1])}%)`
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
                    .replace(punctuation_translation[0], punctuation_translation[1])})`
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
                    .replace(punctuation_translation[0], punctuation_translation[1])
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
                    .replace(punctuation_translation[0], punctuation_translation[1])
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
            .text((d) => ' (' + probabilidad(d.name).probabilidad.toString().replace(punctuation_translation[0], punctuation_translation[1]) + '%) ' + probabilidad(d.name).posicion + '°')
        )
        .call(halo1, heightBars * 0.2, '#f1f1f1');
    }
  } else {
    if (grupos > 1) {
      grupos_1.forEach((grupo, indice_grupo) => {
        const barWidth = x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + heightBars * 10;

        const xoffset = dividir_grupos ? (indice_grupo >= grupos / 2 ? width - barWidth : 0) : 0;
        const yoffset = dividir_grupos ? -(indice_grupo >= grupos / 2 ? (grupos / 2) * (heightBars * equipos_por_grupos + heightBars / 2) : 0) : 0;

        rankingSVG
          .filter((d) => d.name.split('-')[1] == grupo)
          .append('text')
          .attrs({
            class: 'name',
            x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + xoffset,
            y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) + defaults.name.position.y + yoffset,
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
              .text((d) => (efectividadYPromedioGoles ? (d.partidos_jugados == 0 ? '' : ` (${formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100).replace(punctuation_translation[0], punctuation_translation[1])}%)`) : ''))
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
                efectividadYPromedioGoles
                  ? d.partidos_jugados == 0
                    ? ''
                    : ` (${d3
                        .format('.1f')(d.goles / d.partidos_jugados)
                        .replace(punctuation_translation[0], punctuation_translation[1])})`
                  : ''
              )
          )

          .call((text) =>
            text
              .append('tspan')
              .attrs({
                class: 'campeon',
              })
              .styles({
                fill: (d, i) => {
                  var myColor = d3.scaleLinear().domain([0, 100]);
                  var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color]);

                  return d.simulado ? myColor1(myColor(d.probabilidad)) : myColor1(myColor(probabilidad(d.name).probabilidad));
                },
                'font-size': heightBars * 0.275,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d, i) => (/* d.simulado ? ' (100%) ' + (i+1) + '°': */ d.simulado ? ' (' + d.probabilidad + '%) ' + (i + 1) + '°' : ' (' + probabilidad(d.name).probabilidad + '%) ' + probabilidad(d.name).posicion + '°'))
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
        .text((d) => countryToEnglish(d.name.split('-')[0]))

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
            .text((d) => (d.partidos_jugados == 0 ? '' : ` (${formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100).replace(punctuation_translation[0], punctuation_translation[1])}%)`))
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
                    .replace(punctuation_translation[0], punctuation_translation[1])})`
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
            .text((d) => ' (' + probabilidad(d.name).probabilidad.toString().replace(punctuation_translation[0], punctuation_translation[1]) + '%) ' + probabilidad(d.name).posicion + '°')
        )
        .call(halo1, heightBars * 0.2, '#f1f1f1');
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
        const barWidth = x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + heightBars * 10;

        const xoffset = dividir_grupos ? (indice_grupo >= grupos / 2 ? width - barWidth : 0) : 0;
        const yoffset = dividir_grupos ? -(indice_grupo >= grupos / 2 ? (grupos / 2) * (heightBars * equipos_por_grupos + heightBars / 2) : 0) : 0;
        rankingSVG
          .filter((d) => d.name.split('-')[1] == grupo)
          .append('text')
          .attrs({
            x: xPos + xoffset,
            y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) + defaults.value.position.y * 1.5 + yoffset,
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
      const barWidth = x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + heightBars * 10;

      const xoffset = dividir_grupos ? (indice_grupo >= grupos / 2 ? width - barWidth : 0) : 0;
      const yoffset = dividir_grupos ? -(indice_grupo >= grupos / 2 ? (grupos / 2) * (heightBars * equipos_por_grupos + heightBars / 2) : 0) : 0;
      rankingSVG
        .filter((d) => d.name.split('-')[1] == grupo)
        .append('image')
        .style('filter', 'url(#dropshadow)')
        .style('filter', 'url(#white-border)')
        .attrs({
          class: 'logo',
          x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 - (defaults.logo.size1 * 1.1) / 2 + xoffset,
          y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) - (defaults.logo.size1 * 1.1) / 2 + yoffset, //ojo d.rank
          href: (d) => `./escudos/${d.name.split('-')[0]}.png`,
          height: defaults.logo.size1 * 1.1,
        }).on('click', handleButtonClick);

      rankingSVG
        .filter((d) => d.name.split('-')[1] == grupo)
        .append('image')
        .style('filter', 'url(#white-border)')
        .attrs({
          x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 - (defaults.logo.size1 * 0.4) / 2 + (defaults.logo.size1 * 1.1) / 3 + xoffset,
          y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) - (defaults.logo.size1 * 0.4) / 2 + (defaults.logo.size1 * 1.1) / 3 + yoffset, //ojo d.rank
          href: (d) => `./flags/${countryToCode(d.name.split('-')[0])}.svg`,
          height: defaults.logo.size1 * 0.4,
        });
    });
  } else {
    rankingSVG
      .append('image')
      .style('filter', 'url(#dropshadow)')
      .attrs({
        class: 'logo',
        x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 - (defaults.logo.size1 * 1.1) / 2,
        y: (d, i) => y(i) - (defaults.logo.size1 * 1.1) / 2,
        href: (d) => `./escudos/${d.name.split('-')[0]}.png`,
        height: defaults.logo.size1 * 1.1,
      }).on('click', handleButtonClick);
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
};

/* totalCasosSimulados.forEach(d => {
  render(d, nombre_torneo, puntos_por_partido, probabilidades);
}) */

render(totalCasosSimulados[index1], playoffs, nombre_torneo, puntos_por_partido, probabilidades);

/* const button = document.getElementById("myButton"); */

// 2. Define the action to take when clicked
/* function handleButtonClick() {
  console.log(index1)
  index1++;
  render(totalCasosSimulados[index1], playoffs, nombre_torneo, puntos_por_partido, probabilidades);
} */

function filtrarPorValor(simulaciones, equipo, valor) {
    return simulaciones.filter((sim) => sim[2][equipo] === valor);
  } 
  console.log(totalCasosSimulados)

  let sort_selecciones = (array, seleccion) => {

    array.sort((a, b) => {
    const getEquipo = (sim, equipo) =>
      sim[1]?.find((t) => t.equipo === equipo) || sim[0]?.find((t) => t.equipo === equipo);

    const equipoA = getEquipo(a, seleccion);
    const equipoB = getEquipo(b, seleccion);

    const clasA = a[2]?.[seleccion] === 1 ? 0 : 1;
    const clasB = b[2]?.[seleccion] === 1 ? 0 : 1;
    if (clasA !== clasB) return clasA - clasB;

    const posA = equipoA?.pos ?? 999;
    const posB = equipoB?.pos ?? 999;

    if (posA !== posB) return posA - posB;

    const ptsA = equipoA?.pts ?? 0;
    const ptsB = equipoB?.pts ?? 0;

    if (ptsA !== ptsB) return ptsB - ptsA;

    const diffA = equipoA?.diff ?? 0;
    const diffB = equipoB?.diff ?? 0;

    if (diffA !== diffB) return diffB - diffA;

    const gfA = equipoA?.gf ?? 0;
    const gfB = equipoB?.gf ?? 0;

    if (gfA !== gfB) return gfB - gfA;

    return 0;
  });
return array;
};
  
let casos = totalCasosSimulados;
let seleccion = null;

function construirListaPuntos(casos, nombreSeleccion) {
  return casos
    .map((caso, idx) => {
      const equipo = caso[1].find((d) => d.equipo == nombreSeleccion);
      const pos = equipo ? equipo.pos : 'N/A';
      const pj = equipo ? equipo.pj : 'N/A';
      const pg = equipo ? equipo.pg : 'N/A';
      const pe = equipo ? equipo.pe : 'N/A';
      const pp = equipo ? equipo.pp : 'N/A';
      const pts = equipo ? equipo.pts : 'N/A';
      const diff = equipo ? equipo.diff : 'N/A';
      const gf = equipo ? equipo.gf : 'N/A';
      const gc = equipo ? equipo.gc : 'N/A';
      return `${idx + 1}: ${pos}° \xa0 ${pts} \xa0 ${pj} ${pg} ${pe} ${pp} \xa0 ${gf}-${gc} ${diff}`;
    })
    .join('\n');
}

function openSeleccionModal(casos, nombreSeleccion) {
  const maxIndex = casos.length - 1;
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;

  const dialog = document.createElement('div');
  dialog.style.cssText = `
    width: min(95vw, 700px);
    max-height: 85vh;
    background: #ffffff;
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    display: flex;
    flex-direction: column;
  `;

  const title = document.createElement('h2');
  title.textContent = `Selecciona un caso para ${nombreSeleccion}`;
  title.style.margin = '0 0 10px';
  title.style.fontSize = '1.15rem';
  title.style.background = 'transparent';
  title.style.color = '#000';

  const info = document.createElement('p');
  info.textContent = `Total: ${casos.length} casos. Elige un índice entre 1 y ${maxIndex + 1}.`;
  info.style.cssText = 'margin: 0 0 14px; color: #333; font-size: 0.95rem; background: transparent;';

  let selectedIndex = index1;

  const list = document.createElement('div');
  list.style.cssText = `
    flex: 1 1 auto;
    margin: 0 0 14px;
    padding: 8px;
    background: #ffffff;
    border-radius: 12px;
    overflow: auto;
    max-height: 50vh;
    display: grid;
    gap: 4px;
  `;

  const items = casos.map((caso, idx) => {
    const item = document.createElement('button');
    const equipo = caso[1].find((d) => d.equipo == nombreSeleccion);
    const pos = equipo ? equipo.pos : 'N/A';
    const pj = equipo ? equipo.pj : 'N/A';
    const pg = equipo ? equipo.pg : 'N/A';
    const pe = equipo ? equipo.pe : 'N/A';
    const pp = equipo ? equipo.pp : 'N/A';
    const pts = equipo ? equipo.pts : 'N/A';
    const diff = equipo ? equipo.diff : 'N/A';
    const gf = equipo ? equipo.gf : 'N/A';
    const gc = equipo ? equipo.gc : 'N/A';
    const clasificado = caso[2]?.[nombreSeleccion] === 1;
    const baseColor = clasificado ? '#d4f8d4' : '#f8d4d4';
    item.type = 'button';
    item.textContent = `${idx + 1}: ${pos}° \xa0 ${pts} \xa0 ${pj} ${pg} ${pe} ${pp} \xa0 ${gf}-${gc} ${diff}`;
    item.style.cssText = `
      text-align: left;
      width: 100%;
      padding: 10px 12px;
      border: 1px solid transparent;
      border-radius: 10px;
      background: ${baseColor};
      cursor: pointer;
      font-family: inherit;
      white-space: pre-wrap;
      transition: background 0.2s ease, border-color 0.2s ease;
    `;
    item.addEventListener('click', () => {
      selectedIndex = idx;
      items.forEach((other, otherIdx) => {
        const otherCasosIndex = other.dataset.index;
        const otherClasificado = casos[otherIdx][2]?.[nombreSeleccion] === 1;
        const otherBase = otherClasificado ? '#ecf9ed' : '#fdecea';
        other.style.borderColor = otherIdx === selectedIndex ? '#007bff' : 'transparent';
        other.style.background = otherIdx === selectedIndex ? (otherClasificado ? '#d4f1d7' : '#f8d2d2') : otherBase;
      });
      item.scrollIntoView({ block: 'nearest' });
    });
    item.dataset.index = idx;
    list.appendChild(item);
    return item;
  });

  if (items[selectedIndex]) {
    const selectedClasificado = casos[selectedIndex][2]?.[nombreSeleccion] === 1;
    items[selectedIndex].style.borderColor = '#007bff';
    items[selectedIndex].style.background = selectedClasificado ? '#a5e6a5' : '#f5a5a5';
  }

  const buttons = document.createElement('div');
  buttons.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; background: #ffffff; padding: 10px 0 0; margin-top: 0;';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancelar';
  cancelButton.style.cssText = `
    padding: 10px 18px;
    border: none;
    border-radius: 10px;
    background: #dcdcdc;
    color: #111;
    cursor: pointer;
  `;

  const okButton = document.createElement('button');
  okButton.textContent = 'Aceptar';
  okButton.style.cssText = `
    padding: 10px 18px;
    border: none;
    border-radius: 10px;
    background: #007bff;
    color: white;
    cursor: pointer;
  `;

  buttons.appendChild(cancelButton);
  buttons.appendChild(okButton);
  dialog.appendChild(title);
  dialog.appendChild(info);
  dialog.appendChild(list);
  dialog.appendChild(buttons);
  modal.appendChild(dialog);
  document.body.appendChild(modal);

  function closeModal() {
    if (modal.parentNode) modal.parentNode.removeChild(modal);
  }

  cancelButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  okButton.addEventListener('click', () => {
    if (selectedIndex < 0 || selectedIndex > maxIndex) {
      alert(`Selecciona un caso válido entre 1 y ${maxIndex + 1}.`);
      return;
    }
    closeModal();
    index1 = selectedIndex;
    render(casos[index1], playoffs, nombre_torneo, puntos_por_partido, probabilidades);
    console.log(index1, casos.length, casos[index1][1].filter((d) => d.equipo == nombreSeleccion)[0].pts, nombreSeleccion);
    index1++;
  });
}

function handleButtonClick(event, d) {
  if (!d) {
    console.log('Click en el botón normal');
    return;
  }

  const nombreSeleccion = d.name;
  if (nombreSeleccion !== seleccion) {
    index1 = 0;
    seleccion = nombreSeleccion;
  }

  /* casos = filtrarPorValor(totalCasosSimulados, nombreSeleccion, 1); */
  casos = sort_selecciones(casos, nombreSeleccion);

  if (casos.length === 0) {
    alert(`No hay casos disponibles para ${nombreSeleccion}.`);
    return;
  }

  openSeleccionModal(casos, nombreSeleccion);
}

/* // 3. Attach the event listener to the button
button.addEventListener("click", handleButtonClick);

if (datosBase && (!probabilidades || Object.keys(probabilidades).length === 0)) {
  calcularProbabilidadesEnSegundoPlano({
    partidos: datosBase.partidos,
    puntosPorPartido: puntos_por_partido,
    competencia: nombre_torneo,
    clasificacionPorGrupo: clasificados_por_competencia[competencia] + repechaje,
    repechaje,
  }).then((resultado) => {
    window.__appProbabilidades = resultado;
    mostrandoProbabilidades = true;
    const currentData = totalCasosSimulados[index];
    if (currentData) {
      console.log(currentData, playoffs, nombre_torneo, puntos_por_partido, resultado);
      render(currentData, playoffs, nombre_torneo, puntos_por_partido, resultado);
    }
  });
} */
