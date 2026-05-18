import { procesarDatos } from './data.js';
import { colores } from './colores.js';
/* global d3 */

const { final_list1, nombre_torneo, clubes, puntos_por_partido, data1, fechas_playoff, probabilidades } = await procesarDatos();

let ress_ratio = '16:9';
let resulution = 2;

let width = (ress_ratio == '16:9' ? 16 : ress_ratio == '1:1' ? 9 : 9) * 120;
let height = (ress_ratio == '16:9' ? 9 : ress_ratio == '1:1' ? 9 : 16) * 120;

width = width * resulution;
height = height * resulution;

let margin = {
  top: ress_ratio == '16:9' ? height * 0.065 : ress_ratio == '1:1' ? height * 0.065 : height * 0.065,
  right: width * 0.05,
  bottom: ress_ratio == '16:9' ? height * 0 : ress_ratio == '1:1' ? height * 0 : height * 0.0,
  left: 100,
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

let not_played_yet = 99;
let not_played_yet_x = 0.4;
let fechas_not_played = 1;

let localia = false;
let stats_on_top = false;
let competencia = 'libertadores';

const clasificados_por_competencia = {
  libertadores: 2,
  argentina: 8,
  mundial: 2,
};

let clasificacion_por_grupo = clasificados_por_competencia[competencia];

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

const render = (data, nombre_torneo, clubes, puntos_por_partido, data1, fechas_playoff, probabilidades) => {
  let top_n = clubes.size;
  let heightBars = (height - (margin.bottom + margin.top)) / (top_n + 2);

  margin = {
    top: ress_ratio == '16:9' ? heightBars * 2 : ress_ratio == '1:1' ? heightBars * 1.5 : heightBars * 1.5,
    right: width * 0.05,
    bottom: ress_ratio == '16:9' ? height * 0 : ress_ratio == '1:1' ? height * 0 : height * 0.0,
    left: 100,
  };

  heightBars = (height - (margin.bottom + margin.top)) / (top_n * 1);

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
    16: '16avos',
    8: 'Octavos',
    4: 'Cuartos',
    2: 'Semifinales',
    1: 'Final',
  };

  let grupos_1 = [...new Set(data.map((d) => d.name.split('-')[1]))].sort();
  let names_1 = [...new Set(data.map((d) => d.name))];

  let grupos = grupos_1.length;

  if (grupos == 1) {
    grupos = 0;
  }

  function probabilidad(name) {
    if (!Object.keys(probabilidades).includes(name)) {
      return [''];
    } else if (Object.keys(probabilidades).includes(name)) {
      return probabilidades[name].probabilidad;
    } else {
      return [''];
    }
  }

  let equipos_por_grupos = top_n / grupos;
  let width_playoffs = 300;
  let space_width_playoff = width_playoffs * 0.5;
  let space_height_playoff = heightBars * 0.5;
  let primera_ronda_playoff = (grupos * clasificacion_por_grupo) / 2;
  let rondas_playoff = playoffs[primera_ronda_playoff];
  let distancia_entre_grupos = 0.5;

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

  let dates = [...new Set(data.map((d) => d.semana).sort((a, b) => a - b))];

  let margin_right = ress_ratio == '16:9' ? heightBars * 11 : ress_ratio == '1:1' ? heightBars * 7.8 : heightBars * 1.74;

  let ticks_slice = ress_ratio == '16:9' ? top_n - 4 : ress_ratio == '1:1' ? +d3.format('.0f')(top_n * 0.4) : +d3.format('.0f')(top_n * 0.25);

  let weeks_i = width - margin_right;

  let margin_left = weeks_i / ticks_slice / 2;
  let weeks_o = weeks_i / ticks_slice;
  let weeks = weeks_o;

  fechas_not_played = d3.max(data, (d) => d.partidos_jugados + d.partidos_jugados1);

  if (grupos > 1) {
    width = weeks * (fechas_not_played + 1) + (weeks - weeks * not_played_yet_x) * (dates.length - 1 - fechas_not_played) + margin_right + (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff);
  } else {
    width = weeks * (fechas_not_played + 1) + (weeks - weeks * not_played_yet_x) * (dates.length - 1 - fechas_not_played) + margin_right;
  }

  console.log(`[${width}, ${height}]`);

  const svg = d3
    .select('body')
    .append('svg')
    .attrs({
      width: width,
      height: grupos > 1 ? height + grupos * (heightBars / 2) : height,
    });

  svg.append('rect').attrs({
    x: 0,
    y: 0,
    width: width,
    height: grupos > 1 ? height + grupos * (heightBars / 2) : height,
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
      'font-size': margin.top * 0.25,
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
        x: ress_ratio != '9:16' ? heightBars * 0 : -heightBars * 0.0,
        y: ress_ratio != '9:16' ? (!stats_on_top ? -heightBars * 0.15 : -heightBars * 0.03) : -heightBars * 0.18,
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
        y: ress_ratio != '9:16' ? (!stats_on_top ? heightBars * 0.25 : heightBars * 0.32) : heightBars * 0.18,
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
        x: ress_ratio != '9:16' ? heightBars * 0 : -heightBars * 0.0,
        y: ress_ratio != '9:16' ? heightBars * 0 : -heightBars * 0.18,
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
      size1: heightBars * 0.3,
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

  function statsDirectos1(nombres) {
    const key = [...nombres].sort().join('|');
    if (cacheStats.has(key)) return cacheStats.get(key);

    const stats = {};
    nombres.forEach((n) => {
      stats[n] = { pts_directo: 0, pj_directo: 0, pg_directo: 0, pe_directo: 0, pp_directo: 0, diff_directo: 0, gf_directo: 0, gc_directo: 0 };
    });

    // Pre-filtrar data UNA sola vez para este subconjunto
    const nombresSet = new Set(nombres);
    const dataRelevante = data.filter((d) => d.goles_fecha !== 99 && nombresSet.has(d.name));

    nombres.forEach((nombre) => {
      const rivales = nombres.filter((d) => d !== nombre);
      rivales.forEach((rival) => {
        let matches = dataRelevante.filter((d) => d.name === nombre && d.vs === rival);
        matches.forEach((match) => {
          if (match) {
            stats[nombre].pts_directo += match.pts_fecha ?? 0;
            stats[nombre].pj_directo += (match ? 1 : 0) ?? 0;
            stats[nombre].pg_directo += (match.goles_fecha > match.goles_en_contra_fecha ? 1 : 0) ?? 0;
            stats[nombre].pe_directo +=( match.goles_fecha == match.goles_en_contra_fecha ? 1 : 0) ?? 0;
            stats[nombre].pp_directo += (match.goles_fecha < match.goles_en_contra_fecha ? 1 : 0) ?? 0;
            stats[nombre].gf_directo += match.goles_fecha ?? 0;
            stats[nombre].gc_directo += match.goles_en_contra_fecha ?? 0;
            stats[nombre].diff_directo += (match.goles_fecha ?? 0) - (match.goles_en_contra_fecha ?? 0);
          }
        });
      });
    });

    cacheStats.set(key, stats);
    return stats;
  }

  let sort_teams1 = (array, { usarDirecto = true } = {}) => {
    array = removeDuplicates(array);

    const cacheStats = new Map();

    function statsDirectos(nombres) {
      const key = [...nombres].sort().join('|');
      if (cacheStats.has(key)) return cacheStats.get(key);

      const stats = {};
      nombres.forEach((n) => {
        stats[n] = { pts_directo: 0, diff_directo: 0, gf_directo: 0 };
      });

      const semanaMax = array[0].semana;
      const nombresSet = new Set(nombres);
      const dataRelevante = data.filter((d) => d.goles_fecha !== 99 && d.semana <= semanaMax && nombresSet.has(d.name));

      nombres.forEach((nombre) => {
        const rivales = nombres.filter((d) => d !== nombre);
        rivales.forEach((rival) => {
          let matches = dataRelevante.filter((d) => d.name === nombre && d.vs === rival);
          matches.forEach((match) => {
            if (match) {
              stats[nombre].pts_directo += match.pts_fecha ?? 0;
              stats[nombre].gf_directo += match.goles_fecha ?? 0;
              stats[nombre].diff_directo += (match.goles_fecha ?? 0) - (match.goles_en_contra_fecha ?? 0);
            }
          });
        });
      });

      cacheStats.set(key, stats);
      return stats;
    }

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
        const sd = statsDirectos(empatados);
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
    array.forEach((d, i) => (d.rankInGroup = i % 4));
    array.forEach((d) => (d.position = d.rankInGroup + 1 + d.name.split('-')[1]));
    array.forEach((d) => (d.fechas_en_top1 = d.rank === 0 ? 1 : 0));

    return array;
  };

  let sort_teams2 = (array, { usarDirecto = true } = {}) => {
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
        const sd = statsDirectos1(empatados);
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
    array.forEach((d, i) => (d.rankInGroup = i % 4));
    array.forEach((d) => (d.position = d.rankInGroup + 1 + d.name.split('-')[1]));
    array.forEach((d) => (d.fechas_en_top1 = d.rank === 0 ? 1 : 0));

    return array;
  };

  let yearSlice = sort_teams2(data.filter((d) => d.semana == dates[dates.length - 1] && !isNaN(d.value)));
  console.log(sort_teams2(data.filter((d) => d.semana == 4 && !isNaN(d.value))))

  let x = d3.scaleLinear().domain([0, ticks_slice]).range([0, weeks_i]);

  let y = d3
    .scaleLinear()
    .domain([top_n, 0])
    .range([height - margin.bottom + heightBars / 2, margin.top + heightBars / 2]);

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

  let positions_playoffs = {
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
  };

  let positions_playoffs4 = {
    0: [0, 0],
    1: [0, 1],
    2: [1, 0],
    3: [1, 1],
    4: [2, 0],
    5: [2, 1],
    6: [3, 0],
    7: [3, 1],
  };

  let positions_playoffs2 = {
    0: [0, 0],
    1: [0, 1],
    2: [1, 0],
    3: [1, 1],
  };

  let positions_playoffs1 = {
    0: [0, 0],
    1: [0, 1],
  };

  fechas_playoff.forEach((d) => {
    let filter = yearSlice.filter((e) => e.name == d.local)[0];
    let filter1 = yearSlice.filter((e) => e.name == d.visitante)[0];

    Object.assign(d, { position_local: filter.position });
    Object.assign(d, { position_visitante: filter1.position });
  });

  let yPlayoffs = d3.scaleLinear().range([height - margin.bottom + heightBars / 2, margin.top + heightBars / 2]);

  let wks = 0;

  if (grupos > 1) {
    let rondas = [1, 2, 4, 8];
    let arr = ['local', 'visitante'];
    let arr_w = [5, 3, 1.75, 1];

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
            opacity: (d) => (d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? (d.penales_local > d.penales_visitante ? 1 : 1) : 1),
            fill: 'none',
            stroke: (d) => (teamColorss[d[dd].split('-')[0]] == undefined ? 'grey' : teamColorss[d[dd].split('-')[0]][ii]),
            'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
            'stroke-linejoin': 'round',
          })
          .attr('d', (d) =>
            d3.line().curve(d3.curveCardinal.tension(1))([
              [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff, yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff)],
              [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs, yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff)],
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
            opacity: (d) => (dd == 'local' ? (d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? (d.penales_local > d.penales_visitante ? 1 : 0) : 0) : d.goles_local < d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? (d.penales_local < d.penales_visitante ? 1 : 0) : 0),
            fill: 'none',
            stroke: (d) => (teamColorss[d[dd].split('-')[0]] == undefined ? 'grey' : teamColorss[d[dd].split('-')[0]][ii]),
            'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
            'stroke-linejoin': 'round',
          })
          .attr('d', (d) =>
            d3.line().curve(d3.curveCardinal.tension(1))([
              [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff, yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff)],
              [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff / 3, yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff)],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff - space_width_playoff / 3,
                yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
              ],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff + width_playoffs,
                yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
              ],
            ])
          );

        svg
          .selectAll('.path')
          .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 2}`))
          .enter()
          .append('path')
          .attrs({
            class: 'line',
          })
          .styles({
            opacity: (d, i) => (dd == 'local' ? (d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? (d.penales_local > d.penales_visitante ? 1 : 0) : 0) : d.goles_local < d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? (d.penales_local < d.penales_visitante ? 1 : 0) : 0),
            fill: 'none',
            stroke: (d) => (teamColorss[d[dd].split('-')[0]] == undefined ? 'grey' : teamColorss[d[dd].split('-')[0]][ii]),
            'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
            'stroke-linejoin': 'round',
          })
          .attr('d', (d) =>
            d3.line().curve(d3.curveCardinal.tension(1))([
              [width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff, yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff)],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff + width_playoffs + space_width_playoff / 3,
                yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
              ],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 2 + width_playoffs - space_width_playoff / 3,
                yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
              ],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 2 + width_playoffs * 2,
                yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
              ],
            ])
          );

        svg
          .selectAll('.path')
          .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff / 4}`))
          .enter()
          .append('path')
          .attrs({
            class: 'line',
          })
          .styles({
            opacity: (d) => (dd == 'local' ? (d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? (d.penales_local > d.penales_visitante ? 1 : 0) : 0) : d.goles_local < d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? (d.penales_local < d.penales_visitante ? 1 : 0) : 0),
            fill: 'none',
            stroke: (d) => (teamColorss[d[dd].split('-')[0]] == undefined ? 'grey' : teamColorss[d[dd].split('-')[0]][ii]),
            'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
            'stroke-linejoin': 'round',
          })
          .attr('d', (d) =>
            d3.line().curve(d3.curveCardinal.tension(1))([
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 2 + width_playoffs,
                yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
              ],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 2 + width_playoffs * 2 + space_width_playoff / 3,
                yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
              ],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 3 + width_playoffs * 2 - space_width_playoff / 3,
                yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
              ],
              [
                width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff * 3 + width_playoffs * 3,
                yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
              ],
            ])
          );
      });

      svg
        .selectAll('.text')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
        .enter()
        .append('text')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + heightBars * 1.2,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff),
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
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
        .enter()
        .append('image')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + heightBars * 0.5 - defaults.logo.size / 2,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff) - defaults.logo.size / 2,
          height: defaults.logo.size,
          href: (d) => `./escudos/${d[dd].split('-')[0]}.png`,
        })
        .style('filter', 'url(#dropshadow)');

      svg
        .selectAll('.text')
        .data(fechas_playoff.filter((d) => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
        .enter()
        .append('text')
        .attrs({
          class: 'playoffs_names',
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff + heightBars * 1.2 + width_playoffs * 0.9,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_' + dd]][0]) + (top_n * heightBars) / primera_ronda_playoff / 2 - heightBars / 2 + (positions_playoffs[d['position_' + dd]][1] == 0 ? -space_height_playoff : space_height_playoff),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size * 1.5,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': defaults.name.style.text_anchor,
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
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
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
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - defaults.logo.size / 2,
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
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 2 + width_playoffs + heightBars * 1.2 + width_playoffs * 0.9,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 2, 0])(positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]) + (top_n * heightBars) / primera_ronda_playoff - heightBars / 2 + (positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size * 1.5,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': defaults.name.style.text_anchor,
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
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
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
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - defaults.logo.size / 2,
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
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 3 + width_playoffs * 2 + heightBars * 1.2 + width_playoffs * 0.9,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]) + (top_n * heightBars) / (primera_ronda_playoff / 2) - heightBars / 2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size * 1.5,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': defaults.name.style.text_anchor,
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
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
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
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff) - defaults.logo.size / 2,
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
          x: width - (width_playoffs * rondas_playoff + space_width_playoff * rondas_playoff + space_width_playoff) + space_width_playoff * 4 + width_playoffs * 3 + heightBars * 1.2 + width_playoffs * 0.9,
          y: (d) => yPlayoffs.domain([primera_ronda_playoff / 8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][0]) + (top_n * heightBars) / (primera_ronda_playoff / 4) - heightBars / 2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_' + dd]][0]][0]][0]][1] == 0 ? -space_height_playoff : space_height_playoff),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size * 1.5,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': defaults.name.style.text_anchor,
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text((d) => d['goles_' + dd] + (d['penales_' + dd] >= 0 ? ' [' + d['penales_' + dd] + ']' : ''));
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
      let filterr = data.filter((d) => d.semana == semana && d.vs != 'none');
      let min_day = d3.min(filterr, (d) => d.year);
      return filterr.find((d) => d.year == min_day).dia_large.split(' ')[0] + ' ' + min_day.slice(2, 4);
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
        ? 'Final'
        : d == dates[0]
          ? d
          : data
              .filter((e) => e.semana == d && e.vs != 'none')[0]
              .fecha2.split(' ')[1]
              .replace('Def.', '')
              .replace('Post.', d)
    );

  if (grupos < 1) {
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
  }

  svg
    .append('clipPath')
    .attr('id', `ellipse-clip-line`)
    .append('rect')
    .attrs({
      class: 'ellipse_clip_line',
      x: -margin_left,
      y: 0,
      width: 0,
      height: y(top_n - 1) + heightBars / 2,
    });

  var defs = svg.append('defs');

  var filter = defs.append('filter').attr('id', 'dropshadow');

  filter.append('feGaussianBlur').attr('in', 'SourceAlpha').attr('stdDeviation', 2).attr('result', 'blur');
  filter.append('feOffset').attr('in', 'blur').attr('dx', 2).attr('dy', 2).attr('result', 'offsetBlur');
  filter.append('feFlood').attr('in', 'offsetBlur').attr('flood-color', '#000').attr('flood-opacity', 1).attr('result', 'offsetColor');
  filter.append('feComposite').attr('in', 'offsetColor').attr('in2', 'offsetBlur').attr('operator', 'in').attr('result', 'offsetBlur');

  var feMerge = filter.append('feMerge');

  feMerge.append('feMergeNode').attr('in', 'offsetBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  if (grupos > 1) {
    grupos_1.forEach((grupo, indice_grupo) => {
      svg
        .selectAll('.rect')
        .data(grupos_1)
        .enter()
        .append('rect')
        .attrs({
          class: 'bars_names_grupos',
          x: 0,
          y: y(indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) - heightBars / 2,
          width: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + heightBars * 10,
          height: heightBars / 2,
        })
        .styles({
          fill: '#ebebeb',
          opacity: (d, i) => (i <= equipos_por_grupos - 1 ? 1 : 1),
        });

      svg
        .append('text')
        .attrs({
          class: 'name',
          x: weeks_o,
          y: y(indice_grupo * (equipos_por_grupos + distancia_entre_grupos) + 0.75) - (y(1) - y(0)),
        })
        .styles({
          fill: defaults.name.style.fill,
          'font-size': defaults.name.style.font_size,
          'font-weight': defaults.name.style.font_weight,
          'text-anchor': defaults.name.style.text_anchor,
          'alignment-baseline': defaults.name.style.alignment_baseline,
        })
        .text('Grupo ' + grupo);

      svg
        .selectAll('.rect')
        .data(yearSlice.slice(indice_grupo * equipos_por_grupos, indice_grupo * equipos_por_grupos + equipos_por_grupos))
        .enter()
        .append('rect')
        .attrs({
          class: 'bars_names',
          x: 0,
          y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) - heightBars / 2,
          width: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + heightBars * 10,
          height: heightBars,
        })
        .styles({
          fill: (d, i) => (i < clasificacion_por_grupo ? (i % 2 == 1 ? '#94e694' : '#76c476') : i % 2 == 1 ? '#dddddd' : '#c2c2c2'),

          opacity: (d, i) => (i <= equipos_por_grupos - 1 ? 1 : 1),
        });

      svg
        .selectAll('.rect')
        .data(dates)
        .enter()
        .append('rect')
        .attrs({
          class: 'lines_years',
          x: (d, i) => fechasNotPlayed(i) - (heightBars * 0.05) / 2,
          y: y(distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) - heightBars / 2,
          width: heightBars * 0.05,
          height: heightBars * equipos_por_grupos,
          transform: `translate(${margin_left * 2}, 0)`,
        })
        .styles({
          fill: black_color,
          opacity: 0.4,
        });

      svg
        .append('rect')
        .attrs({
          class: 'bars_names',
          x: margin_left - 1,
          y: y(indice_grupo * (equipos_por_grupos + distancia_entre_grupos)),
          width: margin_left / 4,
          height: heightBars * equipos_por_grupos,
        })
        .styles({
          fill: 'url(#areaGradient0)',
        });

      names_1
        .filter((d) => d.split('-')[1] == grupo)
        .forEach((nombre) => {
          let wks = 0;

          var points = [];

          dates.slice(0).forEach((o) => {
            let yearSlice1 = sort_teams1(data.filter((d) => d.semana == o && d.name.split('-')[1] == grupo && !isNaN(d.value)));

            let rank1 = yearSlice1.find((d) => d.name == nombre).rank + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos);

            wks > fechas_not_played ? (wks = wks - not_played_yet_x) : '';
            o == dates[dates.length - 1] && fechas_not_played < dates.length - 1 ? (wks = wks + not_played_yet_x) : '';

            points.push([x(wks), y(rank1)]);

            wks++;
          });

          svg
            .append('path')
            /* .style("filter", "url(#dropshadow)") */
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: 'line',
            })
            .styles({
              fill: 'none',
              stroke: colores(nombre.split('-')[0])[0],
              'stroke-width': ((heightBars * 0.35) / 7) * 5,
              'stroke-linejoin': 'round',
            })
            .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points));

          svg
            .append('path')
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: 'line',
            })
            .styles({
              fill: 'none',
              stroke: colores(nombre.split('-')[0])[1],
              'stroke-width': ((heightBars * 0.35) / 7) * 3,
              'stroke-linejoin': 'round',
            })
            .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points));

          svg
            .append('path')
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: 'line',
            })
            .styles({
              fill: 'none',
              stroke: colores(nombre.split('-')[0])[2],
              'stroke-width': ((heightBars * 0.35) / 7) * 1.75,
              'stroke-linejoin': 'round',
            })
            .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points));

          svg
            .append('path')
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: 'line',
            })
            .styles({
              fill: 'none',
              stroke: colores(nombre.split('-')[0])[3],
              'stroke-width': (heightBars * 0.35) / 7,
              'stroke-linejoin': 'round',
            })
            .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points));
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
                      .text(`${team.goles_en_contra_fecha == not_played_yet ? '' : team.l_or_v == 'V' ? team.goles_en_contra_fecha : team.goles_fecha}`)
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
                    x: x(wks) + heightBars * 0.2 + (team.goles_fecha == not_played_yet ? (team.l_or_v == 'V' ? heightBars * 0.2 : -heightBars * 0.2) : 0) + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor + hor_not_played_yet + defaults.mini_logo.size1 * 0.35 + (team.l_or_v == 'V' ? -heightBars * 0.95 : 0),
                    y: y(rank1) - heightBars * 0.325 - defaults.mini_logo.size1 / 2 + (team.l_or_v == 'V' ? heightBars * 0.65 : 0),
                    height: defaults.mini_logo.size1,
                    href: pts1.vs != 'none' ? `./escudos/${team.vs.split('-')[0]}.png` : '',
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
                .style('filter', 'url(#dropshadow)')
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
        height: heightBars * equipos_por_grupos,
        transform: `translate(${margin_left * 2}, 0)`,
      })
      .styles({
        fill: black_color,
        opacity: 0.4,
      });

    svg
      .append('rect')
      .attrs({
        class: 'bars_names',
        x: margin_left - 1,
        y: y(0),
        width: margin_left / 4,
        height: heightBars * equipos_por_grupos,
      })
      .styles({
        fill: 'url(#areaGradient0)',
      });

    names_1.forEach((nombre) => {
      /* if (nombre !== 'Defensa y Justicia') return; */

      let wks = 0;

      var points = [];

      dates.slice(0).forEach((o) => {
        let yearSlice1 = sort_teams1(data.filter((d) => d.semana == o && !isNaN(d.value)));

        let rank1 = yearSlice1.find((d) => d.name == nombre).rank;

        wks > fechas_not_played ? (wks = wks - not_played_yet_x) : '';
        o == dates[dates.length - 1] && fechas_not_played < dates.length - 1 ? (wks = wks + not_played_yet_x) : '';

        points.push([x(wks), y(rank1)]);

        wks++;
      });

      svg
        .append('path')
        .style('filter', 'url(#dropshadow)')
        .attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: 'line',
        })
        .styles({
          fill: 'none',
          stroke: colores(nombre.split('-')[0])[0],
          'stroke-width': ((heightBars * 0.35) / 7) * 5,
          'stroke-linejoin': 'round',
        })
        .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points));

      svg
        .append('path')
        .attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: 'line',
        })
        .styles({
          fill: 'none',
          stroke: colores(nombre.split('-')[0])[1],
          'stroke-width': ((heightBars * 0.35) / 7) * 3,
          'stroke-linejoin': 'round',
        })
        .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points));

      svg
        .append('path')
        .attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: 'line',
        })
        .styles({
          fill: 'none',
          stroke: colores(nombre.split('-')[0])[2],
          'stroke-width': ((heightBars * 0.35) / 7) * 1.75,
          'stroke-linejoin': 'round',
        })
        .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points));

      svg
        .append('path')
        .attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: 'line',
        })
        .styles({
          fill: 'none',
          stroke: colores(nombre.split('-')[0])[3],
          'stroke-width': (heightBars * 0.35) / 7,
          'stroke-linejoin': 'round',
        })
        .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points));
    });

    names_1.forEach((nombre) => {
      /* if (nombre !== 'Defensa y Justicia') return; */

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
                x: x(wks) + heightBars * 0.2 + (team.goles_fecha == not_played_yet ? (team.l_or_v == 'V' ? heightBars * 0.2 : -heightBars * 0.2) : 0) + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor + hor_not_played_yet + defaults.mini_logo.size1 * 0.35 + (team.l_or_v == 'V' ? -heightBars * 0.95 : 0),
                y: y(rank1) - heightBars * 0.325 - defaults.mini_logo.size1 / 2 + (team.l_or_v == 'V' ? heightBars * 0.65 : 0),
                height: defaults.mini_logo.size1,
                href: pts1.vs != 'none' ? `./escudos/${team.vs.split('-')[0]}.png` : '',
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
            .style('filter', 'url(#dropshadow)')
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

  if (grupos > 1) {
    grupos_1.forEach((e, index) => {
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
    });
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

  svg.append('image').attrs({
    x: margin_left / 2 - (margin_left * 0.8) / 2,
    y: margin.top * 0.8 - ((120 / 204) * margin_left * 0.8) / 2,
    width: margin_left * 0.8,
    href: `./country-flags/flag-of-${data1[0].pais}.png`,
  });

  if (localia) {
    svg
      .append('text')
      .attrs({
        class: 'top',
        x: width * 0.1,
        y: margin.top * 0.33,
      })
      .styles({
        fill: defaults.name.style.fill,
        'font-size': defaults.name.style.font_size,
        'font-weight': defaults.name.style.font_weight,
        'text-anchor': defaults.name.style.text_anchor,
        'alignment-baseline': defaults.name.style.alignment_baseline,
      })

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'pj_top',
          })
          .styles({
            fill: 'lightgrey',
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(d3.format('.0f')((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2) + ' ')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'pg_top',
          })
          .styles({
            fill: victoria_color,
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(d3.sum(yearSlice, (d) => d.partidos_ganados) + d3.sum(yearSlice, (d) => d.partidos_ganados1) + ' ')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'pg_por_top',
          })
          .styles({
            fill: victoria_color,
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text('(' + d3.format('.0f')(((d3.sum(yearSlice, (d) => d.partidos_ganados) + d3.sum(yearSlice, (d) => d.partidos_ganados1)) / d3.format('.0f')((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2)) * 100) + '%) ')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            dy: -heightBars * 0.16,
          })
          .styles({
            opacity: 1,
            fill: victoria_color,
            'font-size': margin.top * 0.2,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(
              '' +
              d3.sum(
                data.filter((e) => e.final != true),
                (e) => (e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
              ) +
              ' (' +
              d3.format('.0%')(
                d3.sum(
                  data.filter((e) => e.final != true),
                  (e) => (e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                ) /
                  ((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2)
              ) +
              ') '
          )
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            dy: heightBars * 0.32,
            dx:
              -(
                d3.sum(
                  data.filter((e) => e.final != true),
                  (e) => (e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                ) +
                ' (' +
                d3.format('.0%')(
                  d3.sum(
                    data.filter((e) => e.final != true),
                    (e) => (e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                  ) /
                    ((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2)
                ) +
                ') '
              ).toString().length *
              margin.top *
              0.2 *
              0.55,
          })
          .styles({
            opacity: 1,
            fill: victoria_color,
            'font-size': margin.top * 0.2,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(
              '' +
              d3.sum(
                data.filter((e) => e.final != true),
                (e) => (e.l_or_v == 'V' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
              ) +
              ' (' +
              d3.format('.0%')(
                d3.sum(
                  data.filter((e) => e.final != true),
                  (e) => (e.l_or_v == 'V' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)
                ) /
                  ((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2)
              ) +
              ')\xa0\xa0' +
              ' '
          )
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            dy: -heightBars * 0.16,
            class: 'pe_top',
          })
          .styles({
            fill: empate_color,
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(d3.format('.0f')((d3.sum(yearSlice, (d) => d.partidos_empatados) + d3.sum(yearSlice, (d) => d.partidos_empatados1)) / 2) + ' ')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'pe_por_top',
          })
          .styles({
            fill: empate_color,
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text('(' + d3.format('.0f')((d3.format('.0f')((d3.sum(yearSlice, (d) => d.partidos_empatados) + d3.sum(yearSlice, (d) => d.partidos_empatados1)) / 2) / d3.format('.0f')((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2)) * 100) + '%)\xa0\xa0\xa0')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'gf_top',
          })
          .styles({
            fill: 'lightgrey',
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(d3.sum(yearSlice, (d) => d.goles) + ' ')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'avg_g_top',
          })
          .styles({
            fill: 'lightgrey',
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(
            '(' +
              d3
                .format('.1f')((d3.sum(yearSlice, (d) => d.goles) + d3.sum(yearSlice, (d) => d.goles1)) / d3.format('.0f')((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2))
                .replace('.', ',') +
              ') '
          )
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            dy: -heightBars * 0.16,
          })
          .styles({
            opacity: 1,
            fill: 'lightgrey',
            'font-size': margin.top * 0.2,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(
              '' +
              d3.sum(
                data.filter((e) => e.final != true),
                (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
              ) +
              ' (' +
              d3
                .format('.1f')(
                  d3.sum(
                    data.filter((e) => e.final != true),
                    (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                  ) /
                    ((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2)
                )
                .replace('.', ',') +
              ') '
          )
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            dy: heightBars * 0.32,
            dx:
              -(
                d3.sum(
                  data.filter((e) => e.final != true),
                  (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                ) +
                ' (' +
                d3
                  .format('.1f')(
                    d3.sum(
                      data.filter((e) => e.final != true),
                      (e) => (e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                    ) /
                      ((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2)
                  )
                  .replace('.', ',') +
                ') '
              ).toString().length *
              margin.top *
              0.2 *
              0.505,
          })
          .styles({
            opacity: 1,
            fill: 'lightgrey',
            'font-size': margin.top * 0.2,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(
              '' +
              d3.sum(
                data.filter((e) => e.final != true),
                (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
              ) +
              ' (' +
              d3
                .format('.1f')(
                  d3.sum(
                    data.filter((e) => e.final != true),
                    (e) => (e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                  ) /
                    ((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2)
                )
                .replace('.', ',') +
              ') ' +
              ' '
          )
      );
  } else {
    svg
      .append('text')
      .attrs({
        class: 'top',
        x: width * 0.1,
        y: margin.top * 0.33,
      })
      .styles({
        fill: defaults.name.style.fill,
        'font-size': defaults.name.style.font_size,
        'font-weight': defaults.name.style.font_weight,
        'text-anchor': defaults.name.style.text_anchor,
        'alignment-baseline': defaults.name.style.alignment_baseline,
      })

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'pj_top',
          })
          .styles({
            fill: 'lightgrey',
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(d3.format('.0f')((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2) + ' ')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'pg_top',
          })
          .styles({
            fill: victoria_color,
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(d3.sum(yearSlice, (d) => d.partidos_ganados) + d3.sum(yearSlice, (d) => d.partidos_ganados1) + ' ')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'pg_por_top',
          })
          .styles({
            fill: victoria_color,
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text('(' + d3.format('.0f')(((d3.sum(yearSlice, (d) => d.partidos_ganados) + d3.sum(yearSlice, (d) => d.partidos_ganados1)) / d3.format('.0f')((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2)) * 100) + '%) ')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'pe_top',
          })
          .styles({
            fill: empate_color,
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(d3.format('.0f')((d3.sum(yearSlice, (d) => d.partidos_empatados) + d3.sum(yearSlice, (d) => d.partidos_empatados1)) / 2) + ' ')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'pe_por_top',
          })
          .styles({
            fill: empate_color,
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text('(' + d3.format('.0f')((d3.format('.0f')((d3.sum(yearSlice, (d) => d.partidos_empatados) + d3.sum(yearSlice, (d) => d.partidos_empatados1)) / 2) / d3.format('.0f')((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2)) * 100) + '%)\xa0\xa0\xa0')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'gf_top',
          })
          .styles({
            fill: 'lightgrey',
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(d3.sum(yearSlice, (d) => d.goles) + ' ')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'avg_g_top',
          })
          .styles({
            fill: 'lightgrey',
            'font-size': margin.top * 0.3,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text(
            '(' +
              d3
                .format('.1f')((d3.sum(yearSlice, (d) => d.goles) + d3.sum(yearSlice, (d) => d.goles1)) / d3.format('.0f')((d3.sum(yearSlice, (d) => d.partidos_jugados) + d3.sum(yearSlice, (d) => d.partidos_jugados1)) / 2))
                .replace('.', ',') +
              ') '
          )
      );
  }

  var rankingSVG = svg.selectAll('.g').data(yearSlice).enter().append('g').attr('class', 'rankingSVG');

  rankingSVG.append('clipPath').attr('id', `ellipse-clip-bars`).append('rect').attrs({
    x: 0,
    y: 0,
    width: width,
    height: height,
  });

  if (localia) {
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
            dy: -heightBars * 0.09,
          })
          .styles({
            fill: black_color,
            'font-size': heightBars * 0.275,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text((d) => ' (' + probabilidad(d.name) + '%)')
      );
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
                fill: black_color,
                'font-size': heightBars * 0.275,
                'font-weight': 600,
                'text-anchor': defaults.value.style.text_anchor,
                'alignment-baseline': defaults.value.style.alignment_baseline,
              })
              .text((d) => ' (' + probabilidad(d.name) + '%)')
          ).call(halo1, defaults.value.style.font_size*0.25, '#f1f1f1')
      });
    } else {
      rankingSVG
        .append('text')
        .attrs({
          class: 'name',
          x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
          y: (d, i) => y(i) + defaults.name.position.y, // OJO y(d.rank)
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
              fill: black_color,
              'font-size': heightBars * 0.275,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => ' (' + probabilidad(d.name) + '%)')
        )

        .call((text) =>
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
        )
    }
  }

  if (localia) {
    rankingSVG
      .append('text')
      .attrs({
        x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
        y: (d, i) => y(i) + defaults.value.position.y, // ojo y(d.rank)
        'clip-path': `url(#ellipse-clip-margin-bottom)`,
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
          .text((d) => d.value + (ress_ratio == '16:9' ? '' : ress_ratio == '1:1' ? '\xa0\xa0\xa0' : '\xa0'))
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
  } else {
    if (grupos > 1) {
      grupos_1.forEach((grupo, indice_grupo) => {
        
        const getValorDirecto = (d) => {
        const empates = data
          .filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value)
          .map((e) => e.name);
        return statsDirectos1(empates)[d.name];
      };

        const commonStyles = {
          fill: black_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline,
        };

        const appendTspan = (text, content, fill = black_color, attrs = {}) =>
          text
            .append('tspan')
            .attrs(attrs)
            .styles({
              ...commonStyles,
              fill,
            })
            .text(content);

        const xPos = x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x;

        rankingSVG
          .filter((d) => d.name.split('-')[1] == grupo)
          .append('text')
          .attrs({
            x: xPos,
            y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) + defaults.value.position.y,
          })
          .styles(commonStyles)
          .call((text) => appendTspan(text, (d) => d.value))
          .call((text) => appendTspan(text, (d) => '\xa0\xa0\xa0' + d.partidos_jugados))
          .call((text) => appendTspan(text, (d) => ' ' + d.partidos_ganados, victoria_color))
          .call((text) => appendTspan(text, (d) => ' ' + d.partidos_empatados, empate_color))
          .call((text) => appendTspan(text, (d) => ' ' + d.partidos_perdidos, derrota_color))
          .call((text) => appendTspan(text, (d) => '\xa0\xa0\xa0' + d.goles, victoria_color))
          .call((text) => appendTspan(text, '-', black_color))
          .call((text) => appendTspan(text, (d) => d.goles_en_contra, derrota_color))
          .call((text) =>
            appendTspan(
              text,
              (d) => ' ' + (d.diferencia_de_goles > 0 ? '+' : '') + d.diferencia_de_goles,
              (d) => (d.diferencia_de_goles > 0 ? victoria_color : d.diferencia_de_goles < 0 ? derrota_color : empate_color)
            )
          )
          .call((text) => appendTspan(text, (d) => (d.partidos_jugados1 == 0 ? '' : '\xa0\xa0\xa0['), black_color))
          .call((text) => appendTspan(text, (d) => (d.partidos_jugados1 == 0 ? '' : d.value1 + '\xa0\xa0\xa0'), black_color))
          .call((text) => appendTspan(text, (d) => (d.partidos_jugados1 == 0 ? '' : d.partidos_jugados1 + ' '), black_color))
          .call((text) => appendTspan(text, (d) => (d.partidos_jugados1 == 0 ? '' : d.partidos_ganados1 + ' '), victoria_color))
          .call((text) => appendTspan(text, (d) => (d.partidos_jugados1 == 0 ? '' : d.partidos_empatados1 + ' '), empate_color))
          .call((text) => appendTspan(text, (d) => (d.partidos_jugados1 == 0 ? '' : d.partidos_perdidos1 + ' '), derrota_color))
          .call((text) => appendTspan(text, (d) => (d.partidos_jugados1 == 0 ? '' : d.goles1 + ' '), victoria_color))
          .call((text) => appendTspan(text, (d) => (d.partidos_jugados1 == 0 ? '' : '-'), black_color))
          .call((text) => appendTspan(text, (d) => (d.partidos_jugados1 == 0 ? '' : d.goles_en_contra1 + ' '), derrota_color))
          .call((text) => appendTspan(text, (d) => (d.partidos_jugados1 == 0 ? '' : (d.diferencia_de_goles1 > 0 ? '+' : '') + d.diferencia_de_goles1), derrota_color))
          .call((text) =>
            appendTspan(
              text,
              (d) => (d.partidos_jugados1 == 0 ? '' : (d.diferencia_de_goles1 > 0 ? '+' : '') + d.diferencia_de_goles1),
              (d) => (d.diferencia_de_goles > 0 ? victoria_color : d.diferencia_de_goles < 0 ? derrota_color : empate_color)
            )
          )
          .call((text) => appendTspan(text, (d) => { const v = getValorDirecto(d); return v.pj_directo > 0 ? '\xa0\xa0\xa0[' : '' }, black_color))
          .call((text) => appendTspan(text, (d) => { const v = getValorDirecto(d); return v.pj_directo > 0 ? v.pts_directo + '\xa0\xa0\xa0' : '' }, black_color))
          .call((text) => appendTspan(text, (d) => { const v = getValorDirecto(d); return v.pj_directo > 0 ? v.pj_directo + ' ' : ''; }, black_color))
          .call((text) => appendTspan(text, (d) => { const v = getValorDirecto(d); return v.pj_directo > 0 ? v.pg_directo + ' ' : ''; }, victoria_color))
          .call((text) => appendTspan(text, (d) => { const v = getValorDirecto(d); return v.pj_directo > 0 ? v.pe_directo + ' ' : ''; }, empate_color))
          .call((text) => appendTspan(text, (d) => { const v = getValorDirecto(d); return v.pj_directo > 0 ? v.pp_directo + '\xa0\xa0\xa0' : ''; }, derrota_color))
          .call((text) => appendTspan(text, (d) => { const v = getValorDirecto(d); return v.pj_directo > 0 ? v.gf_directo : ''; }, victoria_color))
          .call((text) => appendTspan(text, (d) => { const v = getValorDirecto(d); return v.pj_directo > 0 ? '-' : ''; }, black_color))
          .call((text) => appendTspan(text, (d) => { const v = getValorDirecto(d); return v.pj_directo > 0 ? v.gc_directo + ' ' : ''; }, derrota_color))
          .call((text) => appendTspan(text, (d) => { const v = getValorDirecto(d); return v.pj_directo > 0 ? (v.diff_directo > 0 ? '+' : '') + v.diff_directo : ''; }, (d) => { const v = getValorDirecto(d); return v.diff_directo > 0 ? victoria_color : v.diff_directo < 0 ? derrota_color : empate_color; }))
          .call((text) => appendTspan(text, (d) => { const v = getValorDirecto(d); return v.pj_directo > 0 ? ']' : ''; }, black_color))
          .call(halo1, defaults.value.style.font_size*0.25, '#f1f1f1')
      });
    } else {
      rankingSVG
        .append('text')
        .attrs({
          x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
          y: (d, i) => y(i) + defaults.value.position.y, //ojo (d.rank)
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
            .text((d) => d.value + (ress_ratio == '16:9' ? '' : ress_ratio == '1:1' ? '\xa0\xa0\xa0' : '\xa0'))
        )

        .call((text) =>
          text
            .append('tspan')
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
        )

        .call((text) =>
          text
            .append('tspan')
            .styles({
              fill: 'black',
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => {
              let empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
              let valor = statsDirectos1(empates)[d.name];
              return valor.pj_directo > 0 ? '\xa0\xa0\xa0[' : '';
            })
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
            .text((d) => {
              let empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
              let valor = statsDirectos1(empates)[d.name];
              return valor.pj_directo > 0 ? valor.pts_directo + '\xa0\xa0\xa0' : '';
            })
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
            .text((d) => {
              let empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
              let valor = statsDirectos1(empates)[d.name];
              return valor.pj_directo > 0 ? valor?.pj_directo + ' ' : '';
            })
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
            .text((d) => {
              let empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
              let valor = statsDirectos1(empates)[d.name];
              return valor.pj_directo > 0 ? valor?.pg_directo + ' ' : '';
            })
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
            .text((d) => {
              let empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
              let valor = statsDirectos1(empates)[d.name];
              return valor.pj_directo > 0 ? valor?.pe_directo + ' ' : '';
            })
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
            .text((d) => {
              let empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
              let valor = statsDirectos1(empates)[d.name];
              return valor.pj_directo > 0 ? valor?.pp_directo + '\xa0\xa0\xa0' : '';
            })
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
            .text((d) => {
              let empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
              let valor = statsDirectos1(empates)[d.name];
              return valor.pj_directo > 0 ? valor?.gf_directo : '';
            })
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
            .text((d) => {
              let empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
              let valor = statsDirectos1(empates)[d.name];
              return valor.pj_directo > 0 ? '-' : '';
            })
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
            .text((d) => {
              let empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
              let valor = statsDirectos1(empates)[d.name];
              return valor.pj_directo > 0 ? valor?.gc_directo + ' ' : '';
            })
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'dif1',
            })
            .styles({
              fill: (d) => {
                let empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
                let valor = statsDirectos1(empates)[d.name];
                return valor.diff_directo > 0 ? victoria_color : valor.diff_directo < 0 ? derrota_color : empate_color;
              },
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => {
              let empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
              let valor = statsDirectos1(empates)[d.name];
              return valor.pj_directo > 0 ? (valor.diff_directo > 0 ? '+' : '') + valor?.diff_directo : '';
            })
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
            .text((d) => {
              let empates = data.filter((e) => e.name.split('-')[1] == d.name.split('-')[1] && e.fecha == '' && e.value == d.value).map((e) => e.name);
              let valor = statsDirectos1(empates)[d.name];
              return valor.pj_directo > 0 ? ']' : '';
            })
        );
    }
  }

  if (grupos > 1) {
    grupos_1.forEach((grupo, indice_grupo) => {
      rankingSVG
        .filter((d) => d.name.split('-')[1] == grupo)
        .append('image')
        .attrs({
          class: 'logo',
          x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 - (defaults.logo.size1 * 1.1) / 2,
          y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) - (defaults.logo.size1 * 1.1) / 2, //ojo d.rank
          href: (d) => /* getPng(d.name) */ `./escudos/${d.name.split('-')[0]}.png`,
          height: defaults.logo.size1 * 1.1,
        });

      rankingSVG
        .filter((d) => d.name.split('-')[1] == grupo)
        .append('text')
        .attrs({
          class: 'info_fecha',
          x: x(dates.length - 1) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
          y: (d, i) => y(i + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) + defaults.name.position.y - heightBars / 3,
          'clip-path': `url(#ellipse-clip-margin-bottom)`,
        })
        .styles({
          fill: black_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline,
        })

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'numero_fecha',
            })
            .styles({
              fill: black_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => d.fecha)
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'goles_fecha',
            })
            .styles({
              fill: black_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => d.goles_fecha)
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'guion',
            })
            .styles({
              fill: black_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => ' ' + d.guion_text_dia + ' ')
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'goles_en_contra_fecha',
            })
            .styles({
              fill: black_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => d.goles_en_contra_fecha + ' ')
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'vs',
            })
            .styles({
              fill: black_color,
              'font-size': defaults.value.style.font_size,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.vs == 'none' ? '' : d.vs))
        )

        .call((text) =>
          text
            .append('tspan')
            .attrs({
              class: 'l_or_v',
            })
            .styles({
              fill: black_color,
              'font-size': heightBars * 0.225,
              'font-weight': 600,
              'text-anchor': defaults.value.style.text_anchor,
              'alignment-baseline': defaults.value.style.alignment_baseline,
            })
            .text((d) => (d.vs == 'none' ? '' : ' (' + d.l_or_v + ')'))
        );
    });
  } else {
    rankingSVG.append('image').attrs({
      class: 'logo',
      x: x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 - (defaults.logo.size1 * 1.1) / 2,
      y: (d, i) => y(i) - (defaults.logo.size1 * 1.1) / 2, // ojo y(d.rank)
      href: (d) => `./escudos/${d.name.split('-')[0]}.png`,
      height: defaults.logo.size1 * 1.1,
    });

    rankingSVG
      .append('text')
      .attrs({
        class: 'info_fecha',
        x: x(dates.length - 1) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
        y: (d, i) => y(i) + defaults.name.position.y - heightBars / 3, // ojo (d.rank)
        'clip-path': `url(#ellipse-clip-margin-bottom)`,
      })
      .styles({
        fill: black_color,
        'font-size': defaults.value.style.font_size,
        'font-weight': 600,
        'text-anchor': defaults.value.style.text_anchor,
        'alignment-baseline': defaults.value.style.alignment_baseline,
      })

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'numero_fecha',
          })
          .styles({
            fill: black_color,
            'font-size': defaults.value.style.font_size,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text((d) => d.fecha)
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'goles_fecha',
          })
          .styles({
            fill: black_color,
            'font-size': defaults.value.style.font_size,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text((d) => d.goles_fecha)
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'guion',
          })
          .styles({
            fill: black_color,
            'font-size': defaults.value.style.font_size,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text((d) => ' ' + d.guion_text_dia + ' ')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'goles_en_contra_fecha',
          })
          .styles({
            fill: black_color,
            'font-size': defaults.value.style.font_size,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text((d) => d.goles_en_contra_fecha + ' ')
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'vs',
          })
          .styles({
            fill: black_color,
            'font-size': defaults.value.style.font_size,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text((d) => (d.vs == 'none' ? '' : d.vs))
      )

      .call((text) =>
        text
          .append('tspan')
          .attrs({
            class: 'l_or_v',
          })
          .styles({
            fill: black_color,
            'font-size': heightBars * 0.225,
            'font-weight': 600,
            'text-anchor': defaults.value.style.text_anchor,
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text((d) => (d.vs == 'none' ? '' : ' (' + d.l_or_v + ')'))
      );
  }

  svg
    .append('clipPath')
    .attr('id', `ellipse-clip-final-info`)
    .append('rect')
    .attrs({
      class: 'clippath_final_info',
      x: 0,
      y: 0,
      width: width - margin_right,
      height: height,
    });

  yearSlice.forEach((d) => {
    d.fechas_en_top = d3.sum(
      data.filter((e) => e.name == d.name && e.final != true && e.fecha.replace('Fecha ', '') != 'Def.'),
      (e) => (e.rank == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
    );
  });

  yearSlice.forEach((d) => {
    d.posicion_promedio = d3.format('.1f')(
      d3.mean(
        data.filter((e) => e.name == d.name && e.final != true),
        (e) => (e.goles_fecha !== not_played_yet ? e.rank + 1 : 0)
      )
    );
  });

  let array_p = [];

  if (stats_on_top) {
    array_p = ['racha', 'racha_empates', 'racha_derrotas', 'racha_sin_victorias', 'racha_sin_empates', 'racha_sin_derrotas', 'goleadas', 'goleadas_en_contra', 'valla_invicta', 'fechas_en_top'];
  }

  let positions = {
    1: [[0, 0]],
    2: [
      [0, 0],
      [0, 1],
    ],
    3: [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    4: [
      [-0.5, 0],
      [-0.5, 1],
      [0.5, 0],
      [0.5, 1],
    ],
    5: [
      [-0.5, 0],
      [-0.5, 1],
      [0.5, 0],
      [0.5, 1],
      [0, 2],
    ],
    6: [
      [-0.5, 0],
      [-0.5, 1],
      [-0.5, 2],
      [0.5, 0],
      [0.5, 1],
      [0.5, 2],
    ],
    7: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
    8: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [-0.5, 2],
      [0.5, 2],
    ],
    9: [
      [0, 0],
      [0, 1],
      [0, 2],
      [-1, 0],
      [-1, 1],
      [-1, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
  };

  let try_positions = (a, b, c) => {
    try {
      return positions[a][b][c];
    } catch {
      console.error('error record');
      return 0;
    }
  };

  array_p.forEach((p, index) => {
    svg
      .selectAll('.img')
      .data(removeDuplicates(data.filter((d) => d[p] == d3.max(data, (d) => d[p]))))
      .enter()
      .append('image')
      .attrs({
        x: (d, i, total) => {
          length = 0;
          array_p.slice(0, index).forEach((ee, oo) => {
            ee == 'racha_derrotas' ? length++ : 0;
            ee == 'racha_sin_derrotas' ? length++ : 0;
            ee == 'goleadas_en_contra' ? length++ : 0;
            ee == 'valla_invicta' ? length++ : 0;
            length = length + d3.max(data, (e) => e[ee]).toString().length;
          });
          return x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + length * heightBars * 0.225 + index * heightBars * 0.4 + try_positions(total.length, i, 0) * defaults.mini_logo.size * 0.65 - defaults.mini_logo.size / 2 + ((d3.max(data, (e) => e[p]).toString().length + 1) / 2) * heightBars * 0.225;
        },
        y: (d, i, total) => y(-1) - heightBars / 2 - try_positions(total.length, i, 1) * defaults.mini_logo.size * 0.7,
        height: defaults.mini_logo.size,
        href: (d) => `./escudos/${d.name.split('-')[0]}.png`,
      });

    svg
      .append('text')
      .attrs({
        class: 'final_infos',
        opacity: 1,
        x: (d) => {
          length = 0;
          array_p.slice(0, index).forEach((ee, oo) => {
            ee == 'racha_derrotas' ? length++ : 0;
            ee == 'racha_sin_derrotas' ? length++ : 0;
            ee == 'goleadas_en_contra' ? length++ : 0;
            ee == 'valla_invicta' ? length++ : 0;
            length = length + d3.max(data, (e) => e[ee]).toString().length;
          });
          return x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + length * heightBars * 0.225 + index * heightBars * 0.4;
        },
        y: margin.top * 0.8,
      })
      .styles({
        fill: '#f1f1f1',
        'font-size': defaults.value.style.font_size,
        'font-weight': 600,
        'text-anchor': 'start',
        'alignment-baseline': defaults.value.style.alignment_baseline,
      })
      .text(d3.max(data, (e) => e[p]));

    svg.append('image').attrs({
      class: 'final_infos',
      x: (d) => {
        length = 0;
        array_p.slice(0, index + 1).forEach((ee, oo) => {
          ee == 'racha_sin_victorias' ? length++ : 0;
          ee == 'goleadas' ? length++ : 0;
          ee == 'valla_invicta' ? length++ : 0;
          ee == 'fechas_en_top' ? length++ : 0;
          length = length + d3.max(data, (e) => e[ee]).toString().length;
        });
        return x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + length * heightBars * 0.225 + index * heightBars * 0.4 - heightBars * 0.05;
      },
      y: margin.top * 0.8 - (defaults.final_infos.logos.size * 0.9) / 2,
      href: `./icons/${p}.png`,
      height: defaults.final_infos.logos.size * 0.9,
    });

    if (grupos > 1) {
      grupos_1.forEach((grupo, indice_grupo) => {
        svg
          .selectAll('.text')
          .data(yearSlice.filter((d) => d.name.split('-')[1] == grupo))
          .enter()
          .append('text')
          .attrs({
            class: 'final_infos',
            opacity: 1,
            x: (d) => {
              length = 0;
              array_p.slice(0, index).forEach((ee, oo) => {
                ee == 'racha_derrotas' ? length++ : 0;
                ee == 'racha_sin_derrotas' ? length++ : 0;
                ee == 'goleadas_en_contra' ? length++ : 0;
                ee == 'valla_invicta' ? length++ : 0;
                length =
                  length +
                  d3
                    .max(
                      data.filter((e) => e.name == d.name),
                      (e) => e[ee]
                    )
                    .toString().length;
              });
              return x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + length * heightBars * 0.225 + index * heightBars * 0.4;
            },
            y: (d) => y(d.rank + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) + defaults.final_infos.position.y - heightBars / 3,
          })
          .styles({
            fill: black_color,
            'font-size': defaults.value.style.font_size,
            'font-weight': 600,
            'text-anchor': 'start',
            'alignment-baseline': defaults.value.style.alignment_baseline,
          })
          .text((d) =>
            d3.max(
              data.filter((e) => e.name == d.name),
              (e) => e[p]
            )
          );

        svg
          .selectAll('.images')
          .data(yearSlice.filter((d) => d.name.split('-')[1] == grupo))
          .enter()
          .append('image')
          .attrs({
            class: 'final_infos',
            x: (d) => {
              length = 0;
              array_p.slice(0, index + 1).forEach((ee, oo) => {
                ee == 'racha_sin_victorias' ? length++ : 0;
                ee == 'goleadas' ? length++ : 0;
                ee == 'valla_invicta' ? length++ : 0;
                ee == 'fechas_en_top' ? length++ : 0;
                length =
                  length +
                  d3
                    .max(
                      data.filter((e) => e.name == d.name),
                      (e) => e[ee]
                    )
                    .toString().length;
              });
              return x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + length * heightBars * 0.225 + index * heightBars * 0.4 - heightBars * 0.05;
            },
            y: (d) => y(d.rank + distancia_entre_grupos + indice_grupo * (equipos_por_grupos + distancia_entre_grupos)) + defaults.final_infos.position.y - heightBars / 3 - (defaults.final_infos.logos.size * 0.9) / 2,
            href: `./icons/${p}.png`,
            height: defaults.final_infos.logos.size * 0.9,
          });
      });
    } else {
      svg
        .selectAll('.text')
        .data(yearSlice)
        .enter()
        .append('text')
        .attrs({
          class: 'final_infos',
          opacity: 1,
          x: (d) => {
            length = 0;
            array_p.slice(0, index).forEach((ee, oo) => {
              ee == 'racha_derrotas' ? length++ : 0;
              ee == 'racha_sin_derrotas' ? length++ : 0;
              ee == 'goleadas_en_contra' ? length++ : 0;
              ee == 'valla_invicta' ? length++ : 0;
              length =
                length +
                d3
                  .max(
                    data.filter((e) => e.name == d.name),
                    (e) => e[ee]
                  )
                  .toString().length;
            });
            return x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + length * heightBars * 0.225 + index * heightBars * 0.4;
          },
          y: (d) => y(d.rank) + defaults.final_infos.position.y - heightBars / 3,
        })
        .styles({
          fill: black_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': 'start',
          'alignment-baseline': defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d3.max(
            data.filter((e) => e.name == d.name),
            (e) => e[p]
          )
        );

      svg
        .selectAll('.images')
        .data(yearSlice)
        .enter()
        .append('image')
        .attrs({
          class: 'final_infos',
          x: (d) => {
            length = 0;
            array_p.slice(0, index + 1).forEach((ee, oo) => {
              ee == 'racha_sin_victorias' ? length++ : 0;
              ee == 'goleadas' ? length++ : 0;
              ee == 'valla_invicta' ? length++ : 0;
              ee == 'fechas_en_top' ? length++ : 0;
              length =
                length +
                d3
                  .max(
                    data.filter((e) => e.name == d.name),
                    (e) => e[ee]
                  )
                  .toString().length;
            });
            return x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) + (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x + length * heightBars * 0.225 + index * heightBars * 0.4 - heightBars * 0.05;
          },
          y: (d) => y(d.rank) + defaults.final_infos.position.y - heightBars / 3 - (defaults.final_infos.logos.size * 0.9) / 2,
          href: `./icons/${p}.png`,
          height: defaults.final_infos.logos.size * 0.9,
        });
    }
  });
};

render(final_list1, nombre_torneo, clubes, puntos_por_partido, data1, fechas_playoff, probabilidades);
