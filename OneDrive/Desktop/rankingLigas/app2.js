let ress_ratio = '16:9'

let resulution = 2

let width = (ress_ratio == '16:9' ? 16 : ress_ratio == '1:1' ? 9 : 9) * 120;
let height = (ress_ratio == '16:9' ? 9 : ress_ratio == '1:1' ? 9 : 16) * 120;

width = width * resulution
height = height * resulution

let margin = {
  top: (ress_ratio == '16:9' ? height * 0.065 : ress_ratio == '1:1' ? height * 0.065 : height * 0.065),
  right: width * 0.05,
  bottom: (ress_ratio == '16:9' ? height * 0 : ress_ratio == '1:1' ? height * 0 : height * 0.0),
  left: 100,
};

let background_color = "#f1f1f1";
let header_color = "#00001a";
let first_place_color = "#90EE90";
let last_place_color = "#dd2222";

let victoria_color = "#00802b";
let empate_color = "#cc9900";
let derrota_color = "#cc2900";
let grey_color = '#616161'
let black_color = "#202020";

let not_played_yet = 99
let not_played_yet_x = 0.4
let fechas_not_played = 1

let fps = 60;

if (document.URL.includes("render-d3-video")) {
  window.currentTime = 0;
  performance.now = () => window.currentTime;
}

cleanString = function (str) {
  return str.replace(new RegExp(/\s/, "g"), "_").replace(".", "");
};

var BrowserText = (function () {
  var canvas = document.createElement("canvas"),
    context = canvas.getContext("2d");

  /**
   * Measures the rendered width of arbitrary text given the font size and font face
   * @param {string} text The text to measure
   * @param {number} fontSize The font size in pixels
   * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
   * @returns {number} The width of the text
   **/
  function getWidth(text, fontSize, fontFace) {
    context.font = fontSize + "px " + fontFace;
    return context.measureText(text).width;
  }

  return {
    getWidth: getWidth,
  };
})();

d3.timeFormatDefaultLocale({
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["€", ""],
  dateTime: "%a %b %e %X %Y",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  shortDays: ["Dom", "Lun", "Mar", "Mi", "Jue", "Vie", "Sab"],
  months: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  shortMonths: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
});

formatDate = d3.utcFormat("%Y-%m-%d");
formatDate1 = d3.utcFormat("%-d %b");
formatDateLarge = d3.utcFormat("%b %d");

const render = (
  data,
  dias,
  nombre_torneo,
  clubes,
  partidos,
  partidos_n,
  fechas_torneo,
  fechas_torneo2,
  puntos_por_partido,
  data1
) => {
  let start = d3.now();

  let top_n = clubes.size;
  let heightBars = (height - (margin.bottom + margin.top)) / (top_n+2);

  margin = {
    top: (ress_ratio == '16:9' ? heightBars*2 : ress_ratio == '1:1' ? heightBars*1.5 : heightBars*1.5),
    right: width * 0.05,
    bottom: (ress_ratio == '16:9' ? height * 0 : ress_ratio == '1:1' ? height * 0 : height * 0.0),
    left: 100,
  };

  heightBars = (height - (margin.bottom + margin.top)) / (top_n * 1);

  const halo = function (text, strokeWidth, color) {
    text
      .select(function () {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
      .styles({
        fill: color,
        stroke: color,
        "stroke-width": heightBars * 0.07,
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
        opacity: 1,
      });
  };

  const halo1 = function (text, strokeWidth, color) {
    text
      .select(function () {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
      .styles({
        fill: 'white',
        stroke: 'white',
        "stroke-width": strokeWidth/3.5,
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
        opacity: 1,
      });
  };

  let semanas = new Set(data.map((d) => d.semana).sort((a, b) => a - b))
  let dates = [... semanas]

  let margin_right = (ress_ratio == '16:9' ? heightBars * 9.5 : ress_ratio == '1:1' ? heightBars * 7.8 : heightBars * 1.74);

  let ticks_slice = (ress_ratio == '16:9' ? top_n-4 : ress_ratio == '1:1' ? +d3.format('.0f')(top_n*0.4) : +d3.format('.0f')(top_n*0.25))
  
  let weeks_i = width - margin_right;

  let margin_left = weeks_i / ticks_slice / 2;
  let weeks_o = weeks_i / ticks_slice;
  let weeks = weeks_o;

  let campeon2 = 0;

  fechas_not_played = d3.max(data, d => d.partidos_jugados)

  width = (weeks * (fechas_not_played+1) + (weeks-weeks*not_played_yet_x) * ((dates.length-1)-fechas_not_played)) + margin_right

  console.log(dates.length+1, weeks)

  console.log(`[${width}, ${height}]`)

  const svg = d3.select("body").append("svg").attrs({
    width: width,
    height: height,
  });
  
  svg.append("rect").attrs({
    x: 0,
    y: 0,
    width: width,
    height: height,
    fill: background_color,
  });

  svg.append("rect").attrs({
    x: 0,
    y: 0,
    width: width,
    height: margin.top,
    fill: header_color,
  });
  
  svg
    .append("text")
    .attrs({
      x: width * 0.5,
      y: margin.top * 0.3,
    })
    .styles({
      fill: "#f1f1f1",
      "font-size": margin.top * 0.45,
      "font-weight": 600,
      "text-anchor": "middle",
      "alignment-baseline": "central",
    })
    .text(nombre_torneo.replace('_', '/'));

  svg
  .append("text")
  .attrs({
    x: width - margin.top * 0.3,
    y: margin.top * 0.3,
  })
  .styles({
    fill: "lightgrey",
    "font-size": margin.top * 0.25,
    "font-weight": 600,
    "text-anchor": "end",
    "alignment-baseline": "central",
  })
  .text('@rankingligas');

  let defaults = {
    bar: {
      style: {
        fill: "lightgrey",
      },
    },
    name: {
      position: {
        x: (ress_ratio != '9:16' ? heightBars * 0 : -heightBars * 0.0),
        y: (ress_ratio != '9:16' ? -heightBars * 0.03 :  -heightBars * 0.18),
      },
      style: {
        fill: black_color,
        font_size: heightBars * 0.4,
        font_weight: 600,
        text_anchor: "start",
        alignment_baseline: "central",
      },
    },
    value: {
      position: {
        x: 0,
        y: (ress_ratio != '9:16' ? heightBars * 0.32 : heightBars * 0.18),
      },
      style: {
        fill: black_color,
        font_size: heightBars * 0.3,
        font_weight: 600,
        text_anchor: "start",
        alignment_baseline: "central",
      },
      format: (d) => d3.format(",.0f")(d.value),
    },
    subValue: {
      style: {
        fill: black_color,
        font_size: heightBars * 0.225,
        font_weight: 400,
        text_anchor: "start",
        alignment_baseline: "central",
      },
    },
    final_infos : {
      position: {
        x: (ress_ratio != '9:16' ? heightBars * 0 : -heightBars * 0.0),
        y: (ress_ratio != '9:16' ? heightBars * 0 :  -heightBars * 0.18),
      },
      logos: {
        size: heightBars * 0.45
      }
    },
    growthValue: {
      position: {
        x: heightBars * 0.25,
        y: heightBars * 0.95,
      },
      style: {
        fill: (d) =>
          d.growthValue > 0 ? "green" : d.growthValue == 0 ? "grey" : "red",
        font_size: heightBars * 0.4,
        font_weight: 600,
        text_anchor: "start",
        alignment_baseline: "central",
      },
      format: (d) =>
        (d.growthValue > 0 ? "+" : "") + d3.format(".2f")(d.growthValue) + "%",
    },
    logo: {
      position: {
        x: -32.5,
      },
      size: heightBars * 1.2,
      size1: heightBars * 1.2,
    },
    mini_logo: {
      position: {
        x: -32.5,
      },
      size: heightBars * 0.5,
      size1: heightBars * 0.5,
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
        text_anchor: "end",
        alignment_baseline: "central",
      },
    },
  };

  function removeDuplicates(books) {
 
    // Declare a new array
    let newArray = [];
 
    // Declare an empty object
    let uniqueObject = {};
 
    // Loop for the array elements
    for (let i in books) {
 
        // Extract the title
        objTitle = books[i]['name'];
 
        // Use the title as the index
        uniqueObject[objTitle] = books[i];
    }
 
    // Loop to push unique object into array
    for (i in uniqueObject) {
        newArray.push(uniqueObject[i]);
    }
 
    // Display the unique objects
    /* console.log(books, newArray); */

    return newArray
  }

  let books_list = [
    { title: "C++", author: "Bjarne" },
    { title: "Java", author: "James" },
    { title: "Python", author: "Guido" },
    { title: "Java", author: "James" },
  ];

  let sort_teams = (array) => {

    array = removeDuplicates(array)

    array.sort((a, b) => {
      if (b.value > a.value) {
        return 1;
      } else if (b.value < a.value) {
        return -1;
      } else if (b.value == a.value) {
        if (b.value1 > a.value1) {
          return 1;
        } else if (b.value1 < a.value1) {
          return -1;
        } else if (b.value1 == a.value1) {
          if (b.diferencia_de_goles1 > a.diferencia_de_goles1) {
            return 1;
          } else if (b.diferencia_de_goles1 < a.diferencia_de_goles1) {
            return -1;
          } else if (b.diferencia_de_goles1 == a.diferencia_de_goles1) {
            if (b.goles1 > a.goles1) {
              return 1;
            } else if (b.goles1 < a.goles1) {
              return -1;
            } else if (b.goles1 == a.goles1) {
              if (b.diferencia_de_goles > a.diferencia_de_goles) {
                return 1;
              } else if (b.diferencia_de_goles < a.diferencia_de_goles) {
                return -1;
              } else if (b.diferencia_de_goles == a.diferencia_de_goles) {
                if (b.goles > a.goles) {
                  return 1;
                } else if (b.goles < a.goles) {
                  return -1;
                } else if (b.goles == a.goles) {
                  if (b.value_away > a.value_away) {
                    return 1;
                  } else if (b.value_away < a.value_away) {
                    return -1;
                  } else {
                    var textA = a.name.toUpperCase();
                    var textB = b.name.toUpperCase();
                    return textA < textB ? -1 : textA > textB ? 1 : 0;
                  }
                }
              }
            }
          }
        }
      }
    });
    array.forEach((d, i) => (d.rank = i));
    array.forEach((d, i) => (d.fechas_en_top1 = d.rank == 0 ? 1 : 0));

    return array;
  };

  let yearSlice = sort_teams(
    data.filter((d) => d.semana == dates[dates.length-1] && !isNaN(d.value))
  );

  let x = d3.scaleLinear().domain([0, ticks_slice]).range([0, weeks_i]);

  let y = d3
    .scaleLinear()
    .domain([top_n, 0])
    .range([
      height - margin.bottom + heightBars / 2,
      margin.top + heightBars / 2,
    ]);

  let names = new Set(data.map((d) => d.name));

  let lastSlice = sort_teams(
    data.filter((d) => d.semana == dates[dates.length - 1] && !isNaN(d.value))
  );

  svg
    .append("clipPath")
    .attr("id", `ellipse-clip-margin-bottom`)
    .append("rect")
    .attrs({
      x: 0,
      y: 0,
      width: width,
      height: y(top_n - 1) + heightBars / 2,
    });

  svg
    .append("clipPath")
    .attr("id", `ellipse-clip-margin-left`)
    .append("rect")
    .attrs({
      class: "ellipse_clip_margin_left",
      x: -margin_left,
      y: 0,
      width: width,
      height: y(top_n - 1) + heightBars / 2,
    });

  svg
    .selectAll(".rect")
    .data(yearSlice.slice(0, top_n))
    .enter()
    .append("rect")
    .attrs({
      class: "bars_names",
      x: 0,
      y: (d, i) => y(d.rank) - heightBars / 2,
      width: width,
      height: heightBars,
    })
    .styles({
      fill: (d, i) =>
        i == 0
          ? first_place_color /* : i == 17 ? last_place_color */
          : i % 2 == 1
          ? "lightgrey"
          : "darkgrey",
      opacity: (d, i) => (i == 0 ? 0.6 : 0.4),
    });

    let fechasNotPlayed = (i) => {
      let a = () => {
        if (i > fechas_not_played) {
          return x(i - (not_played_yet_x * i)) /* + x(fechas_not_played) - x(fechas_not_played - not_played_yet_x * fechas_not_played) */
        } else {
          return x(i)
        }
      }

      let b = () => {
        if (i > fechas_not_played) {
          return x(fechas_not_played) - x(fechas_not_played - not_played_yet_x * fechas_not_played)
        } else {
          return 0
        }
      }

      let c = () => {
        if (i > fechas_not_played && i == dates.length-1) {
          return x(fechas_not_played) - x(fechas_not_played - not_played_yet_x)
        } else {
          return 0
        }
      }

      return a() + b() + c()
    }

    svg
    .selectAll(".text")
    .data(dates.slice(0, -1))
    .enter()
    .append("text")
    .attrs({
      class: "years",
      x: (d, i) => fechasNotPlayed(i),
      y: margin.top * 0.6,
      transform: `translate(${margin_left * 2}, 0)`,
      "clip-path": `url(#ellipse-clip-margin-left)`,
    })
    .styles({
      "font-size": heightBars * 0.25,
      fill: '#b5b5b5',
      "font-weight": 600,
      "text-anchor": "middle",
      "alignment-baseline": "central",
    })
    .text(semana => {
      let filterr = data.filter(d => d.semana == semana && d.vs != 'none')
      let min_day = d3.min(filterr, d => d.year)
      return filterr.find(d => d.year == min_day).dia_large
    });

    svg
    .selectAll(".text")
    .data(dates.slice(0, -1))
    .enter()
    .append("text")
    .attrs({
      class: "years",
      x: (d, i) => fechasNotPlayed(i) - heightBars*0.3 + (d < 10 ? heightBars*0.13 : 0),
      y: margin.top * 0.8,
      transform: `translate(${margin_left * 2}, 0)`,
      "clip-path": `url(#ellipse-clip-margin-left)`,
    })
    .styles({
      "font-size": heightBars * 0.25,
      fill: '#b5b5b5',
      "font-weight": 600,
      "text-anchor": "end",
      "alignment-baseline": "central",
    })
    .text(semana => {
      let filterr = data.filter(d => d.semana == semana && d.vs != 'none' && d.goles_fecha !== not_played_yet)
      return filterr.length > 0 ? filterr.length/2 : ''
    });

    svg
    .selectAll(".text")
    .data(dates.slice(0, -1))
    .enter()
    .append("text")
    .attrs({
      class: "years",
      x: (d, i) => fechasNotPlayed(i) + heightBars*0.3 - (d < 10 ? heightBars*0.13 : 0),
      y: margin.top * 0.8,
      transform: `translate(${margin_left * 2}, 0)`,
      "clip-path": `url(#ellipse-clip-margin-left)`,
    })
    .styles({
      "font-size": heightBars * 0.25,
      fill: '#b5b5b5',
      "font-weight": 600,
      "text-anchor": "start",
      "alignment-baseline": "central",
    })
    .text(semana => {
      let filterr = data.filter(d => d.semana == semana && d.vs != 'none' && d.goles_fecha !== not_played_yet)
      return filterr.length > 0 ? ('('+d3.format(',.1f')(d3.sum(filterr, d => d.goles_fecha) / (filterr.length/2))+')').replace('.', ',') : ''
    });

  svg
    .selectAll(".text")
    .data(dates)
    .enter()
    .append("text")
    .attrs({
      class: "years",
      x: (d, i) => fechasNotPlayed(i),
      y: margin.top * 0.8,
      transform: `translate(${margin_left * 2}, 0)`,
      "clip-path": `url(#ellipse-clip-margin-left)`,
    })
    .styles({
      "font-size": heightBars * 0.4,
      fill: "#f1f1f1",
      "font-weight": 600,
      "text-anchor": "middle",
      "alignment-baseline": "central",
    })
    .text((d) =>
      d == dates[dates.length - 1]
        ? "Final"
        : d == dates[0]
        ? d
        : data.filter(e => e.semana == d && e.vs != 'none')[0].fecha2.split(' ')[1]
    );

  svg
    .selectAll(".rect")
    .data(dates)
    .enter()
    .append("rect")
    .attrs({
      class: "lines_years",
      x: (d, i) => fechasNotPlayed(i),
      y: y(0) - heightBars / 2,
      width: 2,
      height: height,
      transform: `translate(${margin_left * 2}, 0)`,
      "clip-path": `url(#ellipse-clip-margin-left)`,
    })
    .styles({
      fill: black_color,
      opacity: 0.4,
    });

  svg
    .append("clipPath")
    .attr("id", `ellipse-clip-line`)
    .append("rect")
    .attrs({
      class: "ellipse_clip_line",
      x: -margin_left,
      y: 0,
      width: 0,
      height: y(top_n - 1) + heightBars / 2,
    });

    let teamColorss = {
      'Argentina': ['#fff', '#9fcdef', '#9fcdef', '#fff'],
      'Brasil': ['#ffd100', '#ffd100', '#ffd100', '#009c54'],
      'Colombia': ['#ffcc00', '#ffcc00', '#ffcc00', '#ffcc00'],
      'Ecuador': ['#001f5b', '#ffce00', '#ffce00', '#001f5b'],
      'Uruguay': ['#7fa0d2', '#7fa0d2', '#7fa0d2', '#7fa0d2'],
      'Paraguay': ['#e20815', '#fff', '#fff', '#e20815'],
      'Bolivia': ['#006200', '#006200', '#006200', '#006200'],
      'Venezuela': ['#510e26', '#510e26', '#510e26', '#510e26'],
      'Chile': ['#db0e15', '#db0e15', '#db0e15', '#db0e15'],
      'Peru': ['#fff', '#fff', '#da061b', '#da061b'],
      "Boca Juniors": ["#005EAE", '#005EAE', '#FFD900', '#FFD900'],
      "River Plate": ["#fff", '#fff', '#E2211C', '#E2211C'],
      "Quilmes": ["#fff", '#fff', '#123567', '#123567'],
      "Riestra": ["#fff", '#fff', 'black', 'black'],
      "All Boys": ["#fff", '#fff', 'black', 'black'],
      "Independiente Rivadavia": ["#381972", '#381972', '#fff', '#fff'],
      "San Lorenzo": ["#EC212D", '#EC212D', '#273B56', '#273B56'],
      'Banfield': ["#219D3F", "#fff", '#fff', "#219D3F"],
      'Independiente': ["#bf0811", "#bf0811", '#fff', "#fff"],
      'Lanús': ["#62162C", "#62162C", '#fff', "#fff"],
      'Racing': ["#00AFE9", "#fff", '#fff', "#00AFE9"],
      "Atlético Rafaela": ["#fff", "#0084c9", "#0084c9", '#fff'],
      "Godoy Cruz": ["#0071D5", "#0071D5", '#Fff', '#fff'],
      Colón: ["#D6161C", "#0071D5", '#000', '#000'],
      Huracán: ["#fff", '#fff', "red", '#fff'],
      "Barracas Central": ["#fff", 'red', 'red', '#fff'],
      "San Martín (T)": ["red", '#fff', '#fff', 'red'],
      "Rosario Central": ["#FFCB05", '#004070', '#004070', '#FFCB05'],
      Arsenal: ["#12ACDE", '#12ACDE', '#DB2E26', '#DB2E26'],
      "Newell's Old Boys": ['black', '#E81F1F', '#E81F1F', '#E81F1F'],
      Tigre: ["#2A247A", '#2A247A', '#BF1D26', '#BF1D26'],
      Gimnasia: ["#fff", '#fff', '#11195C', '#11195C'],
      "Vélez Sarsfield": ["#fff", '#fff', '#0469c8', '#0469c8'],
      "Argentinos Juniors": ["#FB0306", '#FB0306', '#FB0306', '#fff'],
      Estudiantes: ["#FB0306", '#fff', 'fff', '#FB0306'],
      Olimpo: ["#000", '#ffe700', '#ffe700', '#000'],
      Unión: ["#FB0306", '#fff', '#fff', '#fff'],
      Sarmiento: ["#008447", '#008447', '#fff', '#fff'],
      Platense: ["#fff", '#fff', '#804b19', '#804b19'],
      Talleres: ["#000c66", '#000c66', '#Fff', '#fff'],
      "Defensa y Justicia": ["#007329", '#007329', '#FFDE00', 'FFDE00'],
      Patronato: ["#1A1310", '#1A1310', '#DB2420', '#DB2420'],
      "Atlético Tucumán": ["#fff", "#62BDF1", "#62BDF1", '#fff'],
      "Central Córdoba": ['black', "#fff", "#fff", 'black'],
      Aldosivi: ["#00903B", "#00903B", "#FCCB00", "#FCCB00"],
      Belgrano: ["#109fd5", "#109fd5", 'black', 'black'],
      Instituto: ["#fff", "#e31428", "#e31428", "#e31428"],
      'Gimnasia (J)': ['#fff', '#fff', '#20A1E2', '#20A1E2'],
    };

  let teamColors = {
    'Argentina': '#76abdd',
    "Boca Juniors": "#005EAE",
    "River Plate": "white",
    "Quilmes": "white",
    "Riestra": "white",
    "All Boys": "white",
    "Independiente Rivadavia": "#381972",
    "San Lorenzo": "#EC212D",
    Banfield: "#219D3F",
    Independiente: "#bf0811",
    Lanús: "#62162C",
    Racing: "#00AFE9",
    "Atlético Rafaela": "#fff",
    "Godoy Cruz": "#0071D5",
    Colón: "#D6161C",
    Huracán: "white",
    "Barracas Central": "white",
    "San Martín (T)": "red",
    "Rosario Central": "#FFCB05",
    Arsenal: "#12ACDE",
    "Newell's Old Boys": black_color,
    Tigre: "#2A247A",
    Gimnasia: "#fff",
    "Vélez Sarsfield": "#fff",
    "Argentinos Juniors": "#FB0306",
    Estudiantes: "#FB0306",
    Olimpo: "#000",
    Unión: "#FB0306",
    Sarmiento: "#008447",
    Platense: "#fff",
    Talleres: "#000c66",
    "Defensa y Justicia": "#007329",
    Patronato: "#1A1310",
    "Atlético Tucumán": "#fff",
    "Central Córdoba": black_color,
    Aldosivi: "#00903B",
    Belgrano: "#109fd5",
    Instituto: "#fff",
    /* 'Gimnasia (J)': '#fff', */
  };

  let teamColors1 = {
    "Boca Juniors": "#005EAE",
    "River Plate": "white",
    "Quilmes": "white",
    "Riestra": "white",
    "All Boys": "white",
    "Independiente Rivadavia": "#381972",
    "San Lorenzo": "#EC212D",
    Banfield: "#fff",
    Independiente: "#bf0811",
    Lanús: "#62162C",
    Racing: "white",
    "Atlético Rafaela": "#0084c9",
    "Godoy Cruz": "#fff",
    Colón: "#000",
    Huracán: "white",
    "Barracas Central": "red",
    "San Martín (T)": "white",
    "Rosario Central": "#004070",
    Arsenal: "#12ACDE",
    "Newell's Old Boys": "#E81F1F",
    Tigre: "#2A247A",
    Gimnasia: "#fff",
    "Vélez Sarsfield": "#fff",
    "Argentinos Juniors": "#FB0306",
    Estudiantes: "#fff",
    Olimpo: "#ffe700",
    Unión: "#fff",
    Sarmiento: "#008447",
    Platense: "#fff",
    Talleres: "#000c66",
    "Defensa y Justicia": "#007329",
    Patronato: "#1A1310",
    "Atlético Tucumán": "#62BDF1",
    "Central Córdoba": "#fff",
    Aldosivi: "#FCCB00",
    Belgrano: "#109fd5",
    Instituto: "#e31428",
    /* 'Gimnasia (J)': '#fff', */
  };

  let teamColors2 = {
    "Boca Juniors": "#FFD900",
    "River Plate": "#E2211C",
    "Quilmes": "#123567",
    "Riestra": "black",
    "All Boys": "black",
    "Independiente Rivadavia": "white",
    "San Lorenzo": "#273B56",
    Banfield: "#fff",
    Independiente: "#fff",
    Lanús: "#fff",
    Racing: "white",
    "Atlético Rafaela": "#0084c9",
    "Godoy Cruz": "#fff",
    Colón: "#000",
    Huracán: "red",
    "Barracas Central": "red",
    "San Martín (T)": "white",
    "Rosario Central": "#004070",
    Arsenal: "#DB2E26",
    "Newell's Old Boys": "#E81F1F",
    Tigre: "#BF1D26",
    Gimnasia: "#11195C",
    "Vélez Sarsfield": "#0469c8",
    "Argentinos Juniors": "#FB0306",
    Estudiantes: "#fff",
    Olimpo: "#ffe700",
    Unión: "#fff",
    Sarmiento: "#fff",
    Platense: "#804b19",
    Talleres: "#fff",
    "Defensa y Justicia": "#FFDE00",
    Patronato: "#DB2420",
    "Atlético Tucumán": "#62BDF1",
    "Central Córdoba": "#fff",
    Aldosivi: "#FCCB00",
    Belgrano: black_color,
    Instituto: "#e31428",
    /* 'Gimnasia (J)': '#20A1E2', */
  };

  let teamColors3 = {
    "Boca Juniors": "#FFD900",
    "River Plate": "#E2211C",
    "Quilmes": "#123567",
    "Riestra": "black",
    "All Boys": "black",
    "Independiente Rivadavia": "white",
    "San Lorenzo": "#273B56",
    Banfield: "#219D3F",
    Independiente: "#fff",
    Lanús: "#fff",
    Racing: "#00AFE9",
    "Atlético Rafaela": "#fff",
    "Godoy Cruz": "#0071D5",
    Colón: "#D6161C",
    Huracán: "white",
    "Barracas Central": "white",
    "San Martín (T)": "red",
    "Rosario Central": "#FFCB05",
    Arsenal: "#DB2E26",
    "Newell's Old Boys": "#E81F1F",
    Tigre: "#BF1D26",
    Gimnasia: "#11195C",
    "Vélez Sarsfield": "#0469c8",
    "Argentinos Juniors": "#fff",
    Estudiantes: "#FB0306",
    Olimpo: "#000",
    Unión: "#fff",
    Sarmiento: "#fff",
    Platense: "#804b19",
    Talleres: "#fff",
    "Defensa y Justicia": "#FFDE00",
    Patronato: "#DB2420",
    "Atlético Tucumán": "#fff",
    "Central Córdoba": black_color,
    Aldosivi: "#00903B",
    Belgrano: black_color,
    Instituto: "#e31428",
    /* 'Gimnasia (J)': '#20A1E2', */
  };

  var defs = svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "dropshadow")

    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 2)
        .attr("result", "blur");
    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 2)
        .attr("dy", 2)
        .attr("result", "offsetBlur")
    filter.append("feFlood")
        .attr("in", "offsetBlur")
        .attr("flood-color", "#000")
        .attr("flood-opacity", 1)
        .attr("result", "offsetColor");
    filter.append("feComposite")
        .attr("in", "offsetColor")
        .attr("in2", "offsetBlur")
        .attr("operator", "in")
        .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

  names.forEach((nombre) => {
    let wks = 0;

    var points = [];

    dates.slice(0).forEach((o) => {
      let yearSlice1 = sort_teams(
        data.filter((d) => d.semana == o && !isNaN(d.value))
      );

      let rank1 = yearSlice1.find((d) => d.name == nombre).rank;
      
      wks > fechas_not_played ? wks = wks-not_played_yet_x : ''
      o == dates[dates.length-1] && fechas_not_played < dates.length-1 ? wks = wks+not_played_yet_x : ''

      points.push([x(wks), y(rank1)]);
      
      wks++;
    });

    svg
      .append("path")
      .style('filter', 'url(#dropshadow)')
      .attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: "line",
        
      })
      .styles({
        fill: "none",
        stroke: teamColorss[nombre] == undefined ? 'grey' : teamColorss[nombre][0],
        "stroke-width": ((heightBars * 0.35) / 7) * 5,
        "stroke-linejoin": "round",
      })
      .attr("d", d3.line().curve(d3.curveCardinal.tension(1))(points));

    svg
      .append("path")
      .attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: "line",
        
      })
      .styles({
        fill: "none",
        stroke: teamColorss[nombre] == undefined ? 'grey' : teamColorss[nombre][1],
        "stroke-width": ((heightBars * 0.35) / 7) * 3,
        "stroke-linejoin": "round",
      })
      .attr("d", d3.line().curve(d3.curveCardinal.tension(1))(points));

    svg
      .append("path")
      .attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: "line",
        
      })
      .styles({
        fill: "none",
        stroke: teamColorss[nombre] == undefined ? 'grey' : teamColorss[nombre][2],
        "stroke-width": ((heightBars * 0.35) / 7) * 1.75,
        "stroke-linejoin": "round",
      })
      .attr("d", d3.line().curve(d3.curveCardinal.tension(1))(points));

    svg
      .append("path")
      .attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: "line",
        
      })
      .styles({
        fill: "none",
        stroke: teamColorss[nombre] == undefined ? 'grey' : teamColorss[nombre][3],
        "stroke-width": (heightBars * 0.35) / 7,
        "stroke-linejoin": "round",
      })
      .attr("d", d3.line().curve(d3.curveCardinal.tension(1))(points)); 
  });

  
  
  names.forEach((nombre) => {
    let wks = 0;

    dates.slice(0).forEach((o, i) => {
      let yearSlice1 = sort_teams(
        data.filter((d) => d.semana == o && !isNaN(d.value))
      );

      let campeon1 = 0;

      yearSlice1.forEach((d) => {
        d.puntos_del_primero = yearSlice1[0].value + yearSlice1[0].value1 ;
        d.puntos_de_diferencia_con_el_primero = d.puntos_del_primero - (d.value + d.value1);
        d.partidos_totales = (/* 27 */ dates.length-1 /* lastSlice.filter((d) => d.name == d.name)[0].partidos_jugados */) 
        d.partidos_en_juego = (d.partidos_jugados/*  + d.partidos_jugados1 */)
        d.puntos_en_juego = (d.partidos_totales - d.partidos_en_juego) * puntos_por_partido;
        d.puntos_de_margen_de_error = d.puntos_en_juego - d.puntos_de_diferencia_con_el_primero;
        d.campeonato_perdido_matematicamente = d.puntos_de_margen_de_error < 0 ? 1 : 2;
      });

      yearSlice1.slice(1).forEach((d) => {
        campeon1 += d.campeonato_perdido_matematicamente;
      });

      campeon1 = campeon1 / (clubes.size - 1);

      campeon1 === 1 ? campeon2++ : (campeon2 = 0);

      yearSlice1.forEach((d, i) => {
        i == 0 && campeon1 == 1 && campeon2 == 1
          ? (d.campeonato_ganado_matematicamente = 1)
          : (d.campeonato_ganado_matematicamente = 0);
      });

      yearSlice1.forEach((d, i) => {
        i == 0 && campeon1 == 1
          ? (d.campeonato_ganado_matematicamente1 = 1)
          : (d.campeonato_ganado_matematicamente1 = 0);
      });

      let rank1 = yearSlice1.find((d) => d.name == nombre).rank;

      wks > fechas_not_played ? wks = wks-not_played_yet_x : ''
      o == dates[dates.length-1] && fechas_not_played < dates.length-1 ? wks = wks+not_played_yet_x : ''

      if (yearSlice1.find((d) => d.name == nombre).vs != "none") {
        let pts1 = yearSlice1.find((d) => d.name == nombre);

        let names_filter = data.filter(d => d.name == pts1.name && d.fecha4 == pts1.fecha4)

        names_filter.forEach((team, i) => {

          let hor = (names_filter.length == 2 ? (team.l_or_v == 'V' && i == 0 ? heightBars*0.3 : team.l_or_v == 'L' && i == 1 ? -heightBars*0.3 : 0) : names_filter.length == 3 ? (team.l_or_v == 'V' && i == 0 ? heightBars*0.7 : team.l_or_v == 'L' && i == 2 ? -heightBars*0.3 : 0) : 0)

          let hor_not_played_yet = (
            names_filter.length == 2 && team.goles_fecha==not_played_yet ? 
              (i == 0 ? heightBars*0.225 : i == 1 ? -heightBars*0.225 : 0) : 
            names_filter.length == 3 && team.goles_fecha==not_played_yet ? 
              (team.l_or_v == 'V' && i == 0 ? heightBars*0.7 : team.l_or_v == 'L' && i == 2 ? -heightBars*0.3 : 0) : 
            0
          )

          svg
            .append("text")
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              x: x(wks) + (i * heightBars * 1.3) - ((names_filter.length-1) * (heightBars * 0.65)) + hor,
              y: y(rank1) - heightBars*0.325,
            })
            .styles({
              fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : empate_color,
              "font-weight": 600,
              "font-size": defaults.value.style.font_size,
              "text-anchor": 'middle',
              "alignment-baseline": "central",
            })

            .call((text) =>
              text
                .append("tspan")
                .attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  x: x(wks) - (heightBars * 0.06) + (i * heightBars * 1.3) - ((names_filter.length-1) * (heightBars * 0.65)) + hor,
                  y: y(rank1) - heightBars*0.325 + (team.l_or_v == 'V' ? heightBars*0.650 : 0),
                })
                .styles({
                  fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : empate_color,
                  "font-weight": 600,
                  "font-size": defaults.value.style.font_size,
                  "text-anchor": 'end',
                  "alignment-baseline": "central",
                })
                .text(`${(/* team.l_or_v == 'V' ?  */
                  team.goles_en_contra_fecha == not_played_yet ? 
                  '' : team.goles_fecha 
                  /* : team.goles_fecha == not_played_yet ? 
                  '' : team.goles_fecha */)}`)
                  /* .text(`${(team.l_or_v == 'V' ? 
                    team.goles_en_contra_fecha == not_played_yet ? 
                    '' : team.goles_en_contra_fecha 
                    : team.goles_fecha == not_played_yet ? 
                    '' : team.goles_fecha)}`) */
            )
            

            .call((text) =>
              text
                .append("tspan")
                .attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  x: x(wks) + (i * heightBars * 1.3) - ((names_filter.length-1) * (heightBars * 0.65)) + hor + hor_not_played_yet,
                  y: y(rank1) - heightBars*0.325 + (team.l_or_v == 'V' ? heightBars*0.650 : 0),
                })
                .styles({
                  fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : team.goles_fecha == not_played_yet ? grey_color : empate_color,
                  "font-weight": 600,
                  "font-size": defaults.value.style.font_size,
                  "text-anchor": 'middle',
                  "alignment-baseline": "central",
                })
                .text(`-`)
            )

            .call((text) =>
              text
                .append("tspan")
                .attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  x: x(wks) + (heightBars * 0.06) + (i * heightBars * 1.3) - ((names_filter.length-1) * (heightBars * 0.65)) + hor,
                  y: y(rank1) - heightBars*0.325 + (team.l_or_v == 'V' ? heightBars*0.650 : 0),
                })
                .styles({
                  fill: team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : empate_color,
                  "font-weight": 600,
                  "font-size": defaults.value.style.font_size,
                  "text-anchor": 'start',
                  "alignment-baseline": "central",
                })
                .text(`${(/* team.l_or_v == 'V' ?  */
                  team.goles_fecha == not_played_yet ? 
                  '' : team.goles_en_contra_fecha/*  : 
                  team.goles_en_contra_fecha == not_played_yet ? 
                  '' : team.goles_en_contra_fecha */)}`)
                /* .text(`${(team.l_or_v == 'V' ? team.goles_fecha == not_played_yet ? '' : team.goles_fecha : team.goles_en_contra_fecha == not_played_yet ? '' : team.goles_en_contra_fecha)}`) */
            )
            .call(halo1, defaults.value.style.font_size, "#f1f1f1")

            svg.append("image")
            .style('filter', 'url(#dropshadow)')
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: "line",
              x: x(wks) + heightBars * 0.475- (defaults.mini_logo.size1 - ((names_filter.length-1) * (heightBars * 0.05))) / 2 /* + (team.l_or_v == 'V' ? -heightBars * 0.66 : heightBars * 0.25) - (team.l_or_v == 'V' && team.goles_en_contra_fecha == 0 ? heightBars * 0.025 : team.goles_en_contra_fecha == 0 ? -heightBars * 0.025 : heightBars * 0.0) + (i * heightBars * 1.3) - ((names_filter.length-1) * (heightBars * 0.65)) */ + hor + (team.goles_fecha==not_played_yet&&team.l_or_v == 'V'?-heightBars * 0.2:0) + (team.goles_fecha==not_played_yet&&team.l_or_v == 'L'?-heightBars * 0.2:0) + hor_not_played_yet,
              y: y(rank1) - heightBars*0.325 - defaults.mini_logo.size1 / 2 + (team.l_or_v == 'V' ? heightBars*0.650 : 0),
              height: defaults.mini_logo.size1,
              href: pts1.vs != "none" ? `./escudos/${team.vs}.png` : "",
            });

            /* svg.append("image")
            .style('filter', 'url(#dropshadow)')
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: "line",
              x: x(wks) - defaults.mini_logo.size / 2,
              y: y(rank1) - defaults.mini_logo.size / 2,
              height: defaults.mini_logo.size,
              href: pts1.vs != "none" ? `./escudos/${team.name}.png` : "",
            }); */

            svg
            .append("text")
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              x: x(wks) - heightBars * 0.0 + (i * heightBars * 0.8) - ((names_filter.length-1) * (heightBars * 0.4)),
              y: y(rank1),
            })
            .styles({
              fill: team.campeonato_perdido_matematicamente == 1 || names_filter[names_filter.length-1].campeonato_perdido_matematicamente == 1 ? derrota_color : team.campeonato_ganado_matematicamente1 == 1 || names_filter[names_filter.length-1].campeonato_ganado_matematicamente1 == 1 ? victoria_color : black_color,
              "font-weight": 600,
              "font-size": heightBars * 0.225, 
              "text-anchor": "middle",
              "alignment-baseline": "central",
            })
            .text(`${team.goles_fecha==not_played_yet?'':team.value}`)

            /* .call((text) =>
              text
                .append("tspan")
                .attrs({
                })
                .styles({
                  fill: team.campeonato_perdido_matematicamente == 1 || names_filter[names_filter.length-1].campeonato_perdido_matematicamente == 1 ? derrota_color : team.campeonato_ganado_matematicamente1 == 1 || names_filter[names_filter.length-1].campeonato_ganado_matematicamente1 == 1 ? victoria_color : black_color,
                  "font-weight": 600,
                  "font-size": heightBars * 0.225, 
                  "text-anchor": "start",
                  "alignment-baseline": "central",
                })
                .text(`${team.goles_fecha==not_played_yet?'':team.value}`)
            )
            

            .call((text) =>
              text
                .append("tspan")
                .attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  y: y(rank1),
                })
                .styles({
                  fill: team.campeonato_perdido_matematicamente == 1 || names_filter[names_filter.length-1].campeonato_perdido_matematicamente == 1 ? derrota_color : team.campeonato_ganado_matematicamente1 == 1 || names_filter[names_filter.length-1].campeonato_ganado_matematicamente1 == 1 ? victoria_color : black_color,
                  "font-weight": 600,
                  "font-size": heightBars * 0.225, 
                  "text-anchor": "start",
                  "alignment-baseline": "central",
                })
                .text(` ${team.goles_fecha!=not_played_yet&&data.filter(d => d.fecha4 == team.fecha4).filter(d => d.value == team.value).length > 1?team.diferencia_de_goles:''}`)
            )

            .call((text) =>
              text
                .append("tspan")
                .attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  y: y(rank1),
                })
                .styles({
                  fill: team.campeonato_perdido_matematicamente == 1 || names_filter[names_filter.length-1].campeonato_perdido_matematicamente == 1 ? derrota_color : team.campeonato_ganado_matematicamente1 == 1 || names_filter[names_filter.length-1].campeonato_ganado_matematicamente1 == 1 ? victoria_color : black_color,
                  "font-weight": 600,
                  "font-size": heightBars * 0.225, 
                  "text-anchor": "start",
                  "alignment-baseline": "central",
                })
                .text(` ${team.goles_fecha!=not_played_yet&&data.filter(d => d.fecha4 == team.fecha4).filter(d => d.value == team.value).length > 1&&data.filter(d => d.fecha4 == team.fecha4).filter(d => d.value == team.value).filter(d => d.diferencia_de_goles == team.diferencia_de_goles).length > 1?team.goles:''}`)
            ) */
            
            .call(halo1, heightBars * 0.225, "#f1f1f1")

            /* svg
            .append("text")
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              x: x(wks) + heightBars * 0.3 + (i * heightBars * 0.8) - ((names_filter.length-1) * (heightBars * 0.4)),
              y: y(rank1),
            })
            .styles({
              fill: team.campeonato_perdido_matematicamente == 1 || names_filter[names_filter.length-1].campeonato_perdido_matematicamente == 1 ? derrota_color : team.campeonato_ganado_matematicamente1 == 1 || names_filter[names_filter.length-1].campeonato_ganado_matematicamente1 == 1 ? victoria_color : black_color,
              "font-weight": 600,
              "font-size": heightBars * 0.225, 
              "text-anchor": "middle",
              "alignment-baseline": "central",
            })
            .text(`${team.goles_fecha!=not_played_yet&&data.filter(d => d.fecha4 == team.fecha4).filter(d => d.value == team.value).length > 1?team.diferencia_de_goles:''}`)
            .call(halo1, heightBars * 0.225, "#f1f1f1") */

           /*  svg
            .append("text")
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              x: x(wks) + heightBars * 0.6 + (i * heightBars * 0.8) - ((names_filter.length-1) * (heightBars * 0.4)),
              y: y(rank1),
            })
            .styles({
              fill: team.campeonato_perdido_matematicamente == 1 || names_filter[names_filter.length-1].campeonato_perdido_matematicamente == 1 ? derrota_color : team.campeonato_ganado_matematicamente1 == 1 || names_filter[names_filter.length-1].campeonato_ganado_matematicamente1 == 1 ? victoria_color : black_color,
              "font-weight": 600,
              "font-size": heightBars * 0.225, 
              "text-anchor": "middle",
              "alignment-baseline": "central",
            })
            .text(`${team.goles_fecha!=not_played_yet&&data.filter(d => d.fecha4 == team.fecha4).filter(d => d.value == team.value).length > 1&&data.filter(d => d.fecha4 == team.fecha4).filter(d => d.value == team.value).filter(d => d.diferencia_de_goles == team.diferencia_de_goles).length > 1?team.goles:''}`)
            .call(halo1, heightBars * 0.225, "#f1f1f1") */

            console.log(data.filter(d => d.fecha4 == 'Fecha 4').filter(d => d.value == 7).filter(d => d.diferencia_de_goles == 3))

            svg.append("image").attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: "line",
              x:
                x(wks) - heightBars * 0.025 +
                (team.racha1 > 2
                  ? heightBars * 0.175
                  : team.racha_derrotas1 > 2
                  ? heightBars * 0.175
                  : team.racha_empates1 > 2
                  ? heightBars * 0.175
                  : team.racha_sin_victorias1 > 2
                  ? heightBars * 0.145
                  : team.racha_sin_derrotas1 > 2
                  ? heightBars * 0.145
                  : team.racha_sin_empates1 > 2
                  ? heightBars * 0.145
                  : 0) -
                (defaults.mini_logo.size+ defaults.subValue.style.font_size*0.35) / 2 + (i * heightBars * 0.55) - ((names_filter.length-1) * (heightBars * 0.325)),
              y: y(rank1) + heightBars / 3.25 - (defaults.mini_logo.size+ defaults.subValue.style.font_size*0.35) / 2,
              height:
                (team.racha1 > 2
                  ? heightBars * 0.45
                  : team.racha_derrotas1 > 2
                  ? heightBars * 0.45
                  : team.racha_empates1 > 2
                  ? heightBars * 0.45
                  : team.racha_sin_victorias1 > 2
                  ? heightBars * 0.5
                  : team.racha_sin_derrotas1 > 2
                  ? heightBars * 0.5
                  : team.racha_sin_empates1 > 2
                  ? heightBars * 0.5
                  : 0) + defaults.subValue.style.font_size*0.35,
              href: team.goles_fecha!==not_played_yet?
                team.racha1 > 2
                  ? `./icons/green_flame2.png`
                  : team.racha_derrotas1 > 2
                  ? `./icons/red_flame2.png`
                  : team.racha_empates1 > 2
                  ? `./icons/yellow_flame2.png`
                  : team.racha_sin_victorias1 > 2
                  ? `./icons/racha_sin_victorias2.png`
                  : team.racha_sin_derrotas1 > 2
                  ? `./icons/racha_sin_derrotas2.png`
                  : team.racha_sin_empates1 > 2
                  ? `./icons/racha_sin_empates2.png`
                  : "":'',
            });

            svg
          .append("text")
          .attrs({
            transform: `translate(${margin_left * 2}, 0)`,
            class: "line",
            x:
              x(wks) -
              (team.racha1 > 2
                ? heightBars * 0.01
                : team.racha_derrotas1 > 2
                ? heightBars * 0.01
                : team.racha_empates1 > 2
                ? heightBars * 0.01
                : team.racha_sin_victorias1 > 2
                ? heightBars * 0.01
                : team.racha_sin_derrotas1 > 2
                ? heightBars * 0.01
                : team.racha_sin_empates1 > 2
                ? heightBars * 0.01
                : 0) + (i * heightBars * 0.55) - ((names_filter.length-1) * (heightBars * 0.325)),
            y: y(rank1) + heightBars / 3.25,
            
          })
          .styles({
            "font-weight": 600,
            "font-size": defaults.subValue.style.font_size,
            fill:
              team.racha1 > 2
                ? black_color
                : team.racha_derrotas1 > 2
                ? black_color
                : team.racha_empates1 > 2
                ? black_color
                : black_color,
            "text-anchor": "end",
            "alignment-baseline": "central",
          })
          .text(
            team.goles_fecha!==not_played_yet?
            team.racha1 > 2
              ? team.racha1
              : team.racha_derrotas1 > 2
              ? team.racha_derrotas1
              : team.racha_empates1 > 2
              ? team.racha_empates1
              : team.racha_sin_victorias1 > 2
              ? team.racha_sin_victorias1
              : team.racha_sin_derrotas1 > 2
              ? team.racha_sin_derrotas1
              : team.racha_sin_empates1 > 2
              ? team.racha_sin_empates1
              : "" : ''
          )
          .call(halo1, defaults.subValue.style.font_size, "#f1f1f1");

          svg.append("image").attrs({
            transform: `translate(${margin_left * 2}, 0)`,
            class: "line",
            x: x(wks) + defaults.value.style.font_size - defaults.mini_logo.size*0.45 / 2 + (i * heightBars * 0.8) - ((names_filter.length-1) * (heightBars * 0.4)),
            y: y(rank1) - defaults.mini_logo.size*0.45 / 2,
            height: defaults.mini_logo.size*0.45,
            href: team.pts_deducted > 0 ? `./icons/redasterisk1.png` : "",
          });

          svg
            .append("text")
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              x: x(wks) + heightBars * 0.45 + (i * heightBars * 0.8) - ((names_filter.length-1) * (heightBars * 0.4)),
              y: y(rank1),
            })
            .styles({
              fill: derrota_color,
              "font-weight": 600,
              "font-size": heightBars * 0.18, 
              "text-anchor": "start",
              "alignment-baseline": "central",
            })
            .text(`${team.pts_deducted > 0 ? team.pts_deducted : ''} `)
            .call(halo1, heightBars * 0.18, "#f1f1f1")

        });

        svg.append("image").attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: "line",
          x:
            x(wks) + heightBars * 0.8 - defaults.mini_logo.size / 2 + (pts1.vs == "none" ? -heightBars * 0.8 : 0) + ((names_filter.length-1) * (heightBars * 0.5)) + (pts1.l_or_v == 'V' ? -heightBars * 0.35 : heightBars * 0.0) + (pts1.l_or_v == 'V' && pts1.goles_en_contra_fecha == 1 ? heightBars * 0.05 : pts1.goles_en_contra_fecha == 1 ? -heightBars * 0.05 : heightBars * 0.0),
          y: y(rank1) - heightBars / 3.25 - defaults.mini_logo.size / 2,
          height: defaults.mini_logo.size,
          href:
            pts1.campeonato_ganado_matematicamente == 1 ? `./icons/trofeo1.png` : "",
          
        });
      } else {
        let pts1 = yearSlice1.find((d) => d.name == nombre);
        svg
            .append("text")
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              x: x(wks) - heightBars * 0.0,
              y: y(rank1),
            })
            .styles({
              fill: pts1.campeonato_perdido_matematicamente == 1 ? derrota_color : pts1.campeonato_ganado_matematicamente1 == 1 ? victoria_color : black_color,
              "font-weight": 600,
              "font-size": heightBars * 0.25, 
              "text-anchor": "middle",
              "alignment-baseline": "central",
            })
            .text(`${pts1.value} `)
            .call(halo1, heightBars * 0.25, "#f1f1f1")
      }

      let pts1 = yearSlice1.find((d) => d.name == nombre);

      svg
        .append("text")
        .attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: "line",
          x:
            x(wks) +
            heightBars * 0.01 +
            (pts1.racha_sin_derrotas > 2
              ? weeks * 0.325
              : pts1.racha_sin_empates > 2
              ? weeks * 0.325
              : weeks * 0.65),
          y: y(rank1) + heightBars / 3.25,
          
        })
        .styles({
          "font-weight": 600,
          "font-size": defaults.subValue.style.font_size,
          fill: black_color,
          "text-anchor": "end",
          "alignment-baseline": "central",
        })
        .text(
          pts1.goles_fecha!==not_played_yet?
          pts1.semana == dates[dates.length - 2]
            ? pts1.racha_sin_victorias > 2
              ? pts1.racha_sin_victorias
              : ""
            : "" : ''
        )
        .call(halo1, defaults.subValue.style.font_size, "#f1f1f1");

      svg.append("image").attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: "line",
        x:
          x(wks) +
          heightBars * 0.125 -
          (defaults.mini_logo.size+ defaults.subValue.style.font_size*0.35) / 2 +
          (pts1.racha_sin_derrotas > 2
            ? weeks * 0.325
            : pts1.racha_sin_empates > 2
            ? weeks * 0.325
            : weeks * 0.65),
        y: y(rank1) + heightBars / 3.25 - (defaults.mini_logo.size+ defaults.subValue.style.font_size*0.35) / 2,
        height: defaults.mini_logo.size+defaults.subValue.style.font_size*0.35,
        href:
        pts1.goles_fecha!==not_played_yet?
          pts1.semana == dates[dates.length - 2]
            ? pts1.racha_sin_victorias > 2
              ? `./icons/racha_sin_victorias2.png`
              : ""
            : "" : '',
        
      });

      svg
        .append("text")
        .attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: "line",
          x: x(wks) + heightBars * 0.01 + weeks * 0.65,
          y: y(rank1) + heightBars / 3.25,
          
        })
        .styles({
          "font-weight": 600,
          "font-size": defaults.subValue.style.font_size,
          fill: black_color,
          "text-anchor": "end",
          "alignment-baseline": "central",
        })
        .text(
          pts1.goles_fecha!==not_played_yet?
          pts1.semana == dates[dates.length - 2]
            ? pts1.racha_sin_derrotas > 2
              ? pts1.racha_sin_derrotas
              : ""
            : "" : ''
        )
        .call(halo1, defaults.subValue.style.font_size, "#f1f1f1");

      svg.append("image").attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: "line",
        x:
          x(wks) +
          heightBars * 0.125 -
          (defaults.mini_logo.size+ defaults.subValue.style.font_size*0.35) / 2 +
          weeks * 0.65,
        y: y(rank1) + heightBars / 3.25 - (defaults.mini_logo.size+ defaults.subValue.style.font_size*0.35) / 2,
        height: defaults.mini_logo.size+ defaults.subValue.style.font_size*0.35,
        href:
        pts1.goles_fecha!==not_played_yet?
          pts1.semana == dates[dates.length - 2]
            ? pts1.racha_sin_derrotas > 2
              ? `./icons/racha_sin_derrotas2.png`
              : ""
            : "" : '',
        
      });

      svg
        .append("text")
        .attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: "line",
          x:
            x(wks) +
            heightBars * 0.01 +
            (pts1.racha_sin_derrotas > 2 ? weeks * 0.325 : weeks * 0.65),
          y: y(rank1) + heightBars / 3.25,
          
        })
        .styles({
          "font-weight": 600,
          "font-size": defaults.subValue.style.font_size,
          fill: black_color,
          "text-anchor": "end",
          "alignment-baseline": "central",
        })
        .text(
          pts1.goles_fecha!==not_played_yet?
          pts1.semana == dates[dates.length - 2]
            ? pts1.racha_sin_empates > 2
              ? pts1.racha_sin_empates
              : ""
            : "" : ''
        )
        .call(halo1, defaults.subValue.style.font_size, "#f1f1f1");

      svg.append("image").attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: "line",
        x:
          x(wks) +
          heightBars * 0.125 -
          (defaults.mini_logo.size+ defaults.subValue.style.font_size*0.35) / 2 +
          (pts1.racha_sin_derrotas > 2 ? weeks * 0.325 : weeks * 0.65),
        y: y(rank1) + heightBars / 3.25 - (defaults.mini_logo.size+ defaults.subValue.style.font_size*0.35) / 2,
        height: defaults.mini_logo.size+ defaults.subValue.style.font_size*0.35,
        href:
        pts1.goles_fecha!==not_played_yet?
          pts1.semana == dates[dates.length - 2]
            ? pts1.racha_sin_empates > 2
              ? `./icons/racha_sin_empates2.png`
              : ""
            : "" : '',
        
      });

      wks++;
    });
  });

  var areaGradient0 = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", "areaGradient0")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  areaGradient0
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", 0.2);

  areaGradient0
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#000")
    .attr("stop-opacity", 0);

  svg
    .append("rect")
    .attrs({
      class: "bars_names",
      x: margin_left - 1,
      y: margin.top * 0.5,
      width: margin_left / 4,
      height: height,
    })
    .styles({
      fill: (d, i) =>
        i == 0
          ? "url(#areaGradient0)"
          : i % 2 == 1
          ? "url(#areaGradient0)"
          : "url(#areaGradient0)",
    });

  svg
    .selectAll(".text")
    .data(d3.range(1, top_n + 1))
    .enter()
    .append("text")
    .attrs({
      x: margin_left / 2,
      y: (d, i) => y(i),
    })
    .styles({
      fill: black_color,
      "font-size": heightBars * 0.5,
      "alignment-baseline": "central",
      "text-anchor": "middle",
      "font-weight": 600,
    })
    .text((d) => d);

  svg
    .append("image")
    .attrs({
      x: margin_left / 2 - (margin_left*0.8)/2,
      y: margin.top * 0.8 - ((120/204)*margin_left*0.8)/2,
      width: margin_left*0.8,
      href: `./country-flags/flag-of-${data1[0].pais}.png`,
    });

    if (ress_ratio != '9:16') {

  svg
    .append("text")
    .attrs({
      class: "top",
      x: width * 0.1,
      y: margin.top * 0.33,
    })
    .styles({
      fill: defaults.name.style.fill,
      "font-size": defaults.name.style.font_size,
      "font-weight": defaults.name.style.font_weight,
      "text-anchor": defaults.name.style.text_anchor,
      "alignment-baseline": defaults.name.style.alignment_baseline,
    })

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pj_top",
        })
        .styles({
          fill: 'lightgrey',
          "font-size": margin.top * 0.3,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text(
          d3.format(".0f")(
            (d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2
          ) + " "
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pg_top",
        })
        .styles({
          fill: victoria_color,
          "font-size": margin.top * 0.3,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d3.sum(lastSlice, (d) => d.partidos_ganados) + d3.sum(lastSlice, (d) => d.partidos_ganados1)) + " ")
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pg_por_top",
        })
        .styles({
          fill: victoria_color,
          "font-size": margin.top * 0.3,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text(
          "(" +
            d3.format(".0f")(
              ((d3.sum(lastSlice, (d) => d.partidos_ganados) + d3.sum(lastSlice, (d) => d.partidos_ganados1)) /
                d3.format(".0f")(
                  (d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2
                )) *
                100
            ) +
            "%) "
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pe_top",
        })
        .styles({
          fill: empate_color,
          "font-size": margin.top * 0.3,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text(
          d3.format(".0f")(
            (d3.sum(lastSlice, (d) => d.partidos_empatados) + d3.sum(lastSlice, (d) => d.partidos_empatados1)) / 2
          ) + " "
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pe_por_top",
        })
        .styles({
          fill: empate_color,
          "font-size": margin.top * 0.3,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text(
          "(" +
            d3.format(".0f")(
              (d3.format(".0f")(
                (d3.sum(lastSlice, (d) => d.partidos_empatados) + d3.sum(lastSlice, (d) => d.partidos_empatados1)) / 2
              ) /
                d3.format(".0f")(
                  (d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2
                )) *
                100
            ) +
            "%)\xa0\xa0\xa0"
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "gf_top",
        })
        .styles({
          fill: 'lightgrey',
          "font-size": margin.top * 0.3,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text(d3.sum(lastSlice, (d) => d.goles) + " ")
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "avg_g_top",
        })
        .styles({
          fill: 'lightgrey',
          "font-size": margin.top * 0.3,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text(
          "(" +
            d3.format(".1f")(
              (d3.sum(lastSlice, (d) => d.goles) + d3.sum(lastSlice, (d) => d.goles1)) /
                d3.format(".0f")(
                  (d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2
                )
            ).replace(".", ",") +
            ") "
        )
    );

      }

  var rankingSVG = svg
    .selectAll(".g")
    .data(yearSlice)
    .enter()
    .append("g")
    .attr("class", "rankingSVG");

  rankingSVG
    .append("clipPath")
    .attr("id", `ellipse-clip-bars`)
    .append("rect")
    .attrs({
      x: 0,
      y: 0,
      width: width,
      height: height,
    });

    let names_corto = {
      "Boca Juniors": "BOC",
      "River Plate": "RIV",
      "San Lorenzo": "SAN",
      Banfield: "BAN",
      Independiente: "IND",
      Lanús: "LAN",
      Racing: "RAC",
      "Godoy Cruz": "GOD",
      Colón: "COL",
      Huracán: "HUR",
      "Barracas Central": "BAR",
      "San Martín (T)": "",
      "Rosario Central": "ROS",
      Arsenal: "ARS",
      "Newell's Old Boys": "NOB",
      Tigre: "TIG",
      Gimnasia: "GIM",
      "Vélez Sarsfield": "VEL",
      "Argentinos Juniors": "ARG",
      Estudiantes: "EST",
      Unión: "UNI",
      Sarmiento: "SAR",
      Platense: "PLA",
      Talleres: "TAL",
      "Defensa y Justicia": "DYJ",
      Patronato: "PAT",
      "Atlético Tucumán": "ATL",
      "Central Córdoba": "CEN",
      Aldosivi: "ALD",
      Belgrano: "BEL",
      Instituto: "INS",
    };

    let formatEfec = d3.format('.0f')

    if (ress_ratio != '9:16') {

  rankingSVG
    .append("text")
    .attrs({
      class: "name",
      x: x((dates.length-1) - ((dates.length-1)-fechas_not_played)*not_played_yet_x) + (fechas_not_played<dates.length-1?x(1*not_played_yet_x):0) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
      y: (d) => y(d.rank) + defaults.name.position.y,
      "clip-path": `url(#ellipse-clip-margin-bottom)`,
    })
    .styles({
      fill: defaults.name.style.fill,
      "font-size": defaults.name.style.font_size,
      "font-weight": defaults.name.style.font_weight,
      "text-anchor": defaults.name.style.text_anchor,
      "alignment-baseline": defaults.name.style.alignment_baseline,
    })
    .text((d) => d.name)

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "efec",
        })
        .styles({
          fill: (d) => {
            var myColor = d3
              .scaleLinear()
              .domain([
                d3.min(
                  yearSlice,
                  (d) =>
                    +formatEfec(
                      (d.value /
                        (d.partidos_jugados * puntos_por_partido)) *
                        100
                    )
                ),
                d3.max(
                  yearSlice,
                  (d) =>
                    +formatEfec(
                      (d.value /
                        (d.partidos_jugados * puntos_por_partido)) *
                        100
                    )
                ),
              ]);
            var myColor1 = d3.interpolateRgbBasis([
              derrota_color,
              empate_color,
              victoria_color,
            ]);

            return myColor1(
              myColor(
                +formatEfec(
                  (d.value /
                    (d.partidos_jugados * puntos_por_partido)) *
                    100
                )
              )
            );
          },
          "font-size": heightBars * 0.275,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d, i) =>
          d.partidos_jugados == 0
            ? ""
            : ` (${formatEfec(
                (d.value / (d.partidos_jugados * puntos_por_partido)) * 100
              ).replace('.', ',')}%)`
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.09
        })
        .styles({
          opacity: 1,
          fill: (d) => {
            var myColor = d3
              .scaleLinear()
              .domain([
                d3.min(
                  yearSlice,
                  (d) =>
                    +formatEfec(
                      (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                /
                (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                * 
                puntos_por_partido)) * 100
                    )
                ),
                d3.max(
                  yearSlice,
                  (d) =>
                    +formatEfec(
                      (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                /
                (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                * 
                puntos_por_partido)) * 100
                    )
                ),
              ]);
            var myColor1 = d3.interpolateRgbBasis([
              derrota_color,
              empate_color,
              victoria_color,
            ]);

            if (isNaN(+formatEfec(
              (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
            /
            (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
            * 
            puntos_por_partido)) * 100
            ))) {
              return grey_color
            } else {

              return myColor1(
                myColor(
                  +formatEfec(
                    (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                  /
                  (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                  * 
                  puntos_por_partido)) * 100
                  )
                )
              );
            }
          },
          "font-size": (heightBars * 0.275)*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d, i) =>
          d.partidos_jugados == 0
            ? ""
            : `(${formatEfec(
                (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                /
                (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
                * 
                puntos_por_partido)) * 100
              ).replace('.', ',')}%)`.replace('NaN%', 'ND')
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: heightBars*0.18,
          dx: d =>  - `(${formatEfec(
            (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
            /
            (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
            * 
            puntos_por_partido)) * 100
          ).replace('.', ',')}%)`.replace('NaN%', 'ND').toString().length*defaults.value.style.font_size*0.625*0.6
        })
        .styles({
          opacity: 1,
          fill: (d) => {
            var myColor = d3
              .scaleLinear()
              .domain([
                d3.min(
                  yearSlice,
                  (d) =>
                    +formatEfec(
                      (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                /
                (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                * 
                puntos_por_partido)) * 100
                    )
                ),
                d3.max(
                  yearSlice,
                  (d) =>
                    +formatEfec(
                      (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                /
                (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                * 
                puntos_por_partido)) * 100
                    )
                ),
              ]);
            var myColor1 = d3.interpolateRgbBasis([
              derrota_color,
              empate_color,
              victoria_color,
            ]);

            if (isNaN(+formatEfec(
              (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
            /
            (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
            * 
            puntos_por_partido)) * 100
            ))) {
              return grey_color
            } else {

              return myColor1(
                myColor(
                  +formatEfec(
                    (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                  /
                  (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                  * 
                  puntos_por_partido)) * 100
                  )
                )
              );
            }

          },
          "font-size": (heightBars * 0.275)*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d, i) =>
          d.partidos_jugados == 0
            ? ""
            : ` (${formatEfec(
                (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
                /
                (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
                * 
                puntos_por_partido)) * 100
              ).replace('.', ',')}%)`.replace('NaN%', 'ND')
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.09,
          class: "goles_por_partido",
          dx: d =>  - `(${formatEfec(
            (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
            /
            (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
            * 
            puntos_por_partido)) * 100
          ).replace('.', ',')}%)`.replace('NaN%', 'ND').toString().length*defaults.value.style.font_size*0.625*0.6
          + d3.max([`(${formatEfec(
            (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
            /
            (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
            * 
            puntos_por_partido)) * 100
          ).replace('.', ',')}%)`.replace('NaN%', 'ND').toString().length, `(${formatEfec(
            (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0)
            /
            (d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
            * 
            puntos_por_partido)) * 100
          ).replace('.', ',')}%)`.replace('NaN%', 'ND').toString().length])*defaults.value.style.font_size*0.625*0.6
        })
        .styles({
          fill: (d) => {
            var myColor = d3
              .scaleLinear()
              .domain([
                d3.min(
                  yearSlice,
                  (d) => +d3.format(".1f")(d.goles / d.partidos_jugados)
                ),
                d3.max(
                  yearSlice,
                  (d) => +d3.format(".1f")(d.goles / d.partidos_jugados)
                ),
              ]);
            var myColor1 = d3.interpolateRgbBasis([
              derrota_color,
              empate_color,
              victoria_color,
            ]);

            return myColor1(
              myColor(+d3.format(".1f")(d.goles / d.partidos_jugados))
            );
          },
          "font-size": heightBars * 0.275,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d, i) =>
          d.partidos_jugados == 0
            ? ""
            : ` (${d3.format(".1f")(d.goles / d.partidos_jugados).replace('.', ',')})`
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.09
        })
        .styles({
          opacity: 1,
          fill: (d) => {
            var myColor = d3
              .scaleLinear()
              .domain([
                d3.min(
                  yearSlice,
                  (d) => +d3.format(".1f")(d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                  / 
                  d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0))
                ),
                d3.max(
                  yearSlice,
                  (d) => +d3.format(".1f")(d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                  / 
                  d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0))
                ),
              ]);
            var myColor1 = d3.interpolateRgbBasis([
              derrota_color,
              empate_color,
              victoria_color,
            ]);

            if (isNaN(+d3.format(".1f")(d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
              / 
              d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)))) {
                return grey_color
              } else {

                return myColor1(
                  myColor(+d3.format(".1f")(d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                  / 
                  d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)))
                );
              }

          },
          "font-size": (heightBars * 0.275)*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d, i) =>
          d.partidos_jugados == 0
            ? ""
            : `(${d3.format(".1f")(
            d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
            / 
            d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0)
          ).replace('.', ',').replace('NaN', 'ND')})`
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: heightBars*0.18,
          dx: d =>  - `(1,0)`.toString().length*defaults.value.style.font_size*0.625*0.43
        })
        .styles({
          opacity: 1,
          fill: (d) => {
            var myColor = d3
              .scaleLinear()
              .domain([
                d3.min(
                  yearSlice,
                  (d) => +d3.format(".1f")(d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                  / 
                  d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0))
                ),
                d3.max(
                  yearSlice,
                  (d) => +d3.format(".1f")(d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                  / 
                  d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0))
                ),
              ]);
            var myColor1 = d3.interpolateRgbBasis([
              derrota_color,
              empate_color,
              victoria_color,
            ]);

            if (isNaN(+d3.format(".1f")(d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
              / 
              d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)))) {
                return grey_color
              } else {

                return myColor1(
                  myColor(
                    +d3.format(".1f")(d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
                    / 
                    d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0))
                  )
                );
              }

          },
          "font-size": (heightBars * 0.275)*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d, i) =>
          d.partidos_jugados == 0
            ? ""
            : `(${d3.format(".1f")(
            d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)
            / 
            d3.sum(data.filter(e => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)
          ).replace('.', ',').replace('NaN', 'ND')})`
        )
    )


    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "campeon",
          dy: -heightBars*0.09,
        })
        .styles({
          fill: black_color,
          "font-size": heightBars * 0.275,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d, i) =>
          d.partidos_jugados == 0
            ? ""
            : `${i == 0 && d.partidos_jugados == dates.length-1 ? " (Campeón)" : ""}`
        )
    )/* .call(halo1, heightBars * 0.1, "#f1f1f1") */

    } else {
      rankingSVG
    .append("text")
    .attrs({
      class: "name",
      x: margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
      y: (d) => y(d.rank) + defaults.name.position.y,
      "clip-path": `url(#ellipse-clip-margin-bottom)`,
    })
    .styles({
      fill: defaults.name.style.fill,
      "font-size": defaults.name.style.font_size,
      "font-weight": defaults.name.style.font_weight,
      "text-anchor": defaults.name.style.text_anchor,
      "alignment-baseline": defaults.name.style.alignment_baseline,
      'text-transform':'uppercase'
    })
    .text((d) => names_corto[d.name])
    }

      if (ress_ratio != '9:16') {

        const pSBC=(p,c0,c1,l)=>{
          let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
          if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
          if(!this.pSBCr)this.pSBCr=(d)=>{
              let n=d.length,x={};
              if(n>9){
                  [r,g,b,a]=d=d.split(","),n=d.length;
                  if(n<3||n>4)return null;
                  x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
              }else{
                  if(n==8||n==6||n<4)return null;
                  if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
                  d=i(d.slice(1),16);
                  if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
                  else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
              }return x};
          h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
          if(!f||!t)return null;
          if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
          else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
          a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
          if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
          else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
      }
              
         rankingSVG
    .append("text")
    .attrs({
      x: x((dates.length-1) - ((dates.length-1)-fechas_not_played)*not_played_yet_x) + (fechas_not_played<dates.length-1?x(1*not_played_yet_x):0) + margin_left*2 + defaults.logo.size / 2 + defaults.name.position.x,
      y: (d) => y(d.rank) + defaults.value.position.y,
      "clip-path": `url(#ellipse-clip-margin-bottom)`,
    })
    .styles({
      fill: "green",
      "font-size": defaults.value.style.font_size,
      "font-weight": 600,
      "text-anchor": defaults.value.style.text_anchor,
      "alignment-baseline": defaults.value.style.alignment_baseline,
    })
    .text((d) => "")

    .call((text) =>
      text
        .append("tspan")
        .attrs({
        })
        .styles({
          fill: black_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => d.value + (ress_ratio == '16:9' ? '': ress_ratio == '1:1' ? "\xa0\xa0\xa0" : "\xa0"))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08
        })
        .styles({
          opacity: 1,
          fill: black_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(
          data.filter((e) => e.name == d.name && e.final != true),
          (e) => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0
        ))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: heightBars*0.16,
          dx: d =>  - d3.sum(
            data.filter((e) => e.name == d.name && e.final != true),
            (e) => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0
          ).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          opacity: 1,
          fill: black_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(
          data.filter((e) => e.name == d.name && e.final != true),
          (e) => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.pts_fecha : 0
        ))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08,
        })
        .styles({
          fill: black_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => "\xa0\xa0\xa0" + d.partidos_jugados)
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08
        })
        .styles({
          opacity: 1,
          fill: black_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(
          data.filter((e) => e.name == d.name && e.final != true),
          (e) => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0
        ))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: heightBars*0.16,
          dx: d =>  - d3.sum(
            data.filter((e) => e.name == d.name && e.final != true),
            (e) => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0
          ).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          opacity: 1,
          fill: black_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(
          data.filter((e) => e.name == d.name && e.final != true),
          (e) => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0
        ))
    )
    

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08,
          dx: d => - d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0).toString().length*defaults.value.style.font_size*0.625*0.7
          + d3.max([d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? 1 : 0), d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? 1 : 0)]).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          fill: victoria_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => ' ' + d.partidos_ganados)    
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08
        })
        .styles({
          opacity: 1,
          fill: victoria_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(
          data.filter((e) => e.name == d.name && e.final != true),
          (e) => e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0
        ))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: heightBars*0.16,
          dx: d =>  - d3.sum(
            data.filter((e) => e.name == d.name && e.final != true),
            (e) => e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0
          ).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          opacity: 1,
          fill: victoria_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(
          data.filter((e) => e.name == d.name && e.final != true),
          (e) => e.l_or_v == 'V' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0
        ))
    )
    

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08,
          dx: d => - d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0).toString().length*defaults.value.style.font_size*0.625*0.7
          + d3.max([d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0), d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.pts_fecha > 1 && e.goles_fecha !== not_played_yet ? 1 : 0)]).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          fill: empate_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => ' ' + d.partidos_empatados)    
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08
        })
        .styles({
          opacity: 1,
          fill: empate_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(
          data.filter((e) => e.name == d.name && e.final != true),
          (e) => e.l_or_v == 'L' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0
        ))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: heightBars*0.16,
          dx: d =>  - d3.sum(
            data.filter((e) => e.name == d.name && e.final != true),
            (e) => e.l_or_v == 'L' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0
          ).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          opacity: 1,
          fill: empate_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(
          data.filter((e) => e.name == d.name && e.final != true),
          (e) => e.l_or_v == 'V' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0
        ))
    )
    

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08,
          dx: d => - d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0).toString().length*defaults.value.style.font_size*0.625*0.7
          + d3.max([d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0), d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.pts_fecha == 1 && e.goles_fecha !== not_played_yet ? 1 : 0)]).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          fill: derrota_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => ' ' + d.partidos_perdidos)
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08
        })
        .styles({
          opacity: 1,
          fill: derrota_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(
          data.filter((e) => e.name == d.name && e.final != true),
          (e) => e.l_or_v == 'L' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0
        ))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: heightBars*0.16,
          dx: d =>  - d3.sum(
            data.filter((e) => e.name == d.name && e.final != true),
            (e) => e.l_or_v == 'L' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0
          ).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          opacity: 1,
          fill: derrota_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(
          data.filter((e) => e.name == d.name && e.final != true),
          (e) => e.l_or_v == 'V' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0
        ))
    )
    

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08,
          dx: d => - d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0).toString().length*defaults.value.style.font_size*0.625*0.7
          + d3.max([d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0), d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.pts_fecha == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)]).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          fill: victoria_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => "\xa0\xa0\xa0" + d.goles)
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08
        })
        .styles({
          opacity: 1,
          fill: victoria_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: + heightBars*0.16,
          dx: d =>  - d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          opacity: 1,
          fill: victoria_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08,
          dx: d => - d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0).toString().length*defaults.value.style.font_size*0.625*0.7
          + d3.max([d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0), d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha : 0)]).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          fill: black_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text("-")
    )

    .call((text) =>
      text
        .append("tspan")
        .styles({
          fill: derrota_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => d.goles_en_contra)
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08
        })
        .styles({
          opacity: 1,
          fill: derrota_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: + heightBars*0.16,
          dx: d =>  - d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          opacity: 1,
          fill: derrota_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "dif",
          dy: - heightBars*0.08,
          dx: d => - d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0).toString().length*defaults.value.style.font_size*0.625*0.7
          + d3.max([d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0), d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_en_contra_fecha : 0)]).toString().length*defaults.value.style.font_size*0.625*0.7
        })
        .styles({
          fill: d => d.diferencia_de_goles > 0 ? victoria_color : d.diferencia_de_goles < 0 ? derrota_color : empate_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text(
          (d) => ' ' + (d.diferencia_de_goles > 0 ? "+" : "") + d.diferencia_de_goles
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: - heightBars*0.08
        })
        .styles({
          opacity: 1,
          fill: d => d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha-e.goles_en_contra_fecha : 0) > 0 ? victoria_color : d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha-e.goles_en_contra_fecha : 0) < 0 ? derrota_color : empate_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + (d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha-e.goles_en_contra_fecha : 0) > 0 ? "+" : "") + d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha-e.goles_en_contra_fecha : 0))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          dy: + heightBars*0.16,
          dx: d =>  - d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha-e.goles_en_contra_fecha : 0).toString().length*defaults.value.style.font_size*0.625*0.7
          - (d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha-e.goles_en_contra_fecha : 0) > 0 ? "+" : "").toString().length*defaults.value.style.font_size*0.625*0.6
          + (d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'L' && e.goles_fecha !== not_played_yet ? e.goles_fecha-e.goles_en_contra_fecha : 0) < 0 ? "-" : "").toString().length*defaults.value.style.font_size*0.625*0.34
        })
        .styles({
          opacity: 1,
          fill: d => d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' ? e.goles_fecha-e.goles_en_contra_fecha : 0) > 0 ? victoria_color : d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' ? e.goles_fecha-e.goles_en_contra_fecha : 0) < 0 ? derrota_color : empate_color,
          "font-size": defaults.value.style.font_size*0.625,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => '' + (d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha-e.goles_en_contra_fecha : 0) > 0 ? "+" : "") + d3.sum(data.filter((e) => e.name == d.name && e.final != true), e => e.l_or_v == 'V' && e.goles_fecha !== not_played_yet ? e.goles_fecha-e.goles_en_contra_fecha : 0))
    )
      } else {
        rankingSVG
    .append("text")
    .attrs({
      class: "diferencia_de_goles",
      x: margin_left*2 + defaults.logo.size / 2 + defaults.name.position.x,
      y: (d) => y(d.rank) + defaults.value.position.y,
      "clip-path": `url(#ellipse-clip-margin-bottom)`,
    })
    .styles({
      fill: "green",
      "font-size": defaults.value.style.font_size,
      "font-weight": 600,
      "text-anchor": defaults.value.style.text_anchor,
      "alignment-baseline": defaults.value.style.alignment_baseline,
    })
    .text((d) => "")

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pts",
        })
        .styles({
          fill: black_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => d.value + (ress_ratio == '16:9' ? "\xa0\xa0\xa0" : ress_ratio == '1:1' ? "\xa0\xa0\xa0" : "\xa0"))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "dif",
        })
        .styles({
          fill: empate_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text(
          (d) => (d.diferencia_de_goles > 0 ? "+" : "") + d.diferencia_de_goles
        )
    )
      }

  rankingSVG.append("image").attrs({
    class: "logo",
    x: x((dates.length-1) - ((dates.length-1)-fechas_not_played)*not_played_yet_x) + (fechas_not_played<dates.length-1?x(1*not_played_yet_x):0) + margin_left * 2 - (defaults.logo.size1*1.1) / 2,
    y: (d) => y(d.rank) - (defaults.logo.size1*1.1) / 2,
    href: (d) => `./escudos/${d.name}.png`,
    height: defaults.logo.size1*1.1,
  });

  /* if (ress_ratio != '9:16') {

  rankingSVG.append("image").attrs({
    class: "logo_vs",
    x: (d) =>
      margin_left * 2 + defaults.logo.size1 / 2 - defaults.mini_logo.size1 / 2 + defaults.name.position.x,
    y: (d) =>
      y(d.rank) +
      defaults.name.position.y -
      heightBars / 3 -
      defaults.mini_logo.size1 / 2,
    href: (d) => (d.vs != "none" ? `./escudos/${d.vs}.png` : ""),
    width: defaults.mini_logo.size1,
  });

} */

  if (ress_ratio != '9:16') {

  rankingSVG
    .append("text")
    .attrs({
      class: "info_fecha",
      x: x(dates.length-1) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
      y: (d) => y(d.rank) + defaults.name.position.y - heightBars / 3,
      "clip-path": `url(#ellipse-clip-margin-bottom)`,
    })
    .styles({
      fill: black_color,
      "font-size": defaults.value.style.font_size,
      "font-weight": 600,
      "text-anchor": defaults.value.style.text_anchor,
      "alignment-baseline": defaults.value.style.alignment_baseline,
    })

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "numero_fecha",
        })
        .styles({
          fill: black_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => d.fecha)
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "goles_fecha",
        })
        .styles({
          fill: black_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => d.goles_fecha)
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "guion",
        })
        .styles({
          fill: black_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => " " + d.guion_text_dia + " ")
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "goles_en_contra_fecha",
        })
        .styles({
          fill: black_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => d.goles_en_contra_fecha + " ")
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "vs",
        })
        .styles({
          fill: black_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => (d.vs == "none" ? "" : d.vs))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "l_or_v",
        })
        .styles({
          fill: black_color,
          "font-size": heightBars * 0.225,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => (d.vs == "none" ? "" : " (" + d.l_or_v + ")"))
    );
    
      }

  svg
    .append("clipPath")
    .attr("id", `ellipse-clip-final-info`)
    .append("rect")
    .attrs({
      class: "clippath_final_info",
      x: 0,
      y: 0,
      width: width - margin_right,
      height: height,
    });

    if (ress_ratio != '9:16') {
  
  /* svg
    .selectAll(".img")
    .data(removeDuplicates(data.filter(d => d.racha == d3.max(data, d => d.racha))))
    .enter()
    .append("image")
    .attrs({
      x: (d, i, total) =>
        width - margin_right
        + defaults.logo.size * 0.8 
        - heightBars * 0.4 * 0.4 
        + heightBars * 0.6 * 0 * 1.2
        - defaults.mini_logo.size/2 + (total.length > 3 ? i % 2 == 0 ? -defaults.mini_logo.size*0.35 : defaults.mini_logo.size*0.35 : 0),
      y: (d, i, total) => y(-1) + defaults.name.position.y - heightBars / 3 - defaults.mini_logo.size/2 - (total.length > 3 ? (Math.trunc(i/2) * defaults.mini_logo.size*0.7) : (i * defaults.mini_logo.size*0.7)),
      height: defaults.mini_logo.size,
      href: d => `./escudos/${d.name}.png`,
    }); */

    lastSlice.forEach(d => {
      d.fechas_en_top = d3.sum(
        data.filter((e) => e.name == d.name && e.final != true),
        (e) => e.rank == 0 && e.goles_fecha !== not_played_yet ? 1 : 0
      )
    })

    let array_p = ['racha', 'racha_empates', 'racha_derrotas', 'racha_sin_victorias', 'racha_sin_empates', 'racha_sin_derrotas', 'goleadas', 'goleadas_en_contra', 'valla_invicta', 'fechas_en_top']

    console.log(lastSlice)

    let records1 = lastSlice.map(d => {

      let filter = data.filter(e => e.name == d.name)
      let array = {}

      array.racha = d3.max(filter, e => e.racha) == 1 ? 0 : d3.max(filter, e => e.racha)
      array.racha_empates = d3.max(filter, e => e.racha_empates) == 1 ? 0 : d3.max(filter, e => e.racha_empates)
      array.racha_derrotas = d3.max(filter, e => e.racha_derrotas) == 1 ? 0 : d3.max(filter, e => e.racha_derrotas)
      array.racha_sin_victorias = d3.max(filter, e => e.racha_sin_victorias) == 1 ? 0 : d3.max(filter, e => e.racha_sin_victorias)
      array.racha_sin_empates = d3.max(filter, e => e.racha_sin_empates) == 1 ? 0 : d3.max(filter, e => e.racha_sin_empates)
      array.racha_sin_derrotas = d3.max(filter, e => e.racha_sin_derrotas) == 1 ? 0 : d3.max(filter, e => e.racha_sin_derrotas)
      array.goleadas = d3.max(filter, e => e.goleadas)
      array.goleadas_en_contra = d3.max(filter, e => e.goleadas_en_contra)
      array.valla_invicta = d3.max(filter, e => e.valla_invicta)
      array.fechas_en_top = d3.max(filter, e => e.fechas_en_top)

      return array
    })

    console.log(records1)

    let records2 = lastSlice.map(d => {

      let filter = data.filter(e => e.name == d.name)
      let array = []

      array.push({'name': 'racha', 'value': d3.max(filter, e => e.racha) == 1 ? 0 : d3.max(filter, e => e.racha)})
      array.push({'name': 'racha_empates', 'value': d3.max(filter, e => e.racha_empates) == 1 ? 0 : d3.max(filter, e => e.racha_empates)})
      array.push({'name': 'racha_derrotas', 'value': d3.max(filter, e => e.racha_derrotas) == 1 ? 0 : d3.max(filter, e => e.racha_derrotas)})
      array.push({'name': 'racha_sin_victorias', 'value': d3.max(filter, e => e.racha_sin_victorias) == 1 ? 0 : d3.max(filter, e => e.racha_sin_victorias)})
      array.push({'name': 'racha_sin_empates', 'value': d3.max(filter, e => e.racha_sin_empates) == 1 ? 0 : d3.max(filter, e => e.racha_sin_empates)})
      array.push({'name': 'racha_sin_derrotas', 'value': d3.max(filter, e => e.racha_sin_derrotas) == 1 ? 0 : d3.max(filter, e => e.racha_sin_derrotas)})
      array.push({'name': 'goleadas', 'value': d3.max(filter, e => e.goleadas)})
      array.push({'name': 'goleadas_en_contra', 'value': d3.max(filter, e => e.goleadas_en_contra)})
      array.push({'name': 'valla_invicta', 'value': d3.max(filter, e => e.valla_invicta)})
      array.push({'name': 'fechas_en_top', 'value': d3.max(filter, e => e.fechas_en_top)})

      array = array.filter(d => d.value !== 0)

      return array
    })

    console.log(records2)

    let records = lastSlice.map(d => {

      let filter = data.filter(e => e.name == d.name)
      let array = [

      d3.max(filter, e => e.racha),
      d3.max(filter, e => e.racha_empates),
      d3.max(filter, e => e.racha_derrotas),
      d3.max(filter, e => e.racha_sin_victorias),
      d3.max(filter, e => e.racha_sin_empates),
      d3.max(filter, e => e.racha_sin_derrotas),
      d3.max(filter, e => e.goleadas),
      d3.max(filter, e => e.goleadas_en_contra),
      d3.max(filter, e => e.valla_invicta),
      d3.max(filter, e => e.fechas_en_top),
      ]
      return array
    })

    console.log(records)

    /* svg
      .selectAll(".g")
      .data(records2)
      .enter()
      .append("g")
      .attrs({
        class: "final_infos",
        transform: (d, i) => `translate (${x((dates.length-1) - ((dates.length-1)-fechas_not_played)*not_played_yet_x) + (fechas_not_played<dates.length-1?x(1*not_played_yet_x):0) + margin_left*2 + defaults.logo.size / 2 + defaults.name.position.x}, ${y(i) +
          defaults.final_infos.position.y -
          heightBars / 3})`,
      })
      .selectAll('.text')
      .data(d => d)
      .enter()
      .append('text')
      .attrs({
        x: (d, i) => {
          let total = 0
          total = total + d.value.toString().length
          return total * heightBars*0.3
        },
        y: 0,
      })
      .styles({
        fill: 'blue',
        "font-size": defaults.value.style.font_size,
        "font-weight": 600,
        "text-anchor": "start",
        "alignment-baseline": defaults.value.style.alignment_baseline,
      })
      .text(d => d.value) */

    /* svg
      .selectAll(".g")
      .data(records)
      .enter()
      .append("g")
      .attrs({
        class: "final_infos",
        transform: (d, i) => `translate (${x((dates.length-1) - ((dates.length-1)-fechas_not_played)*not_played_yet_x) + (fechas_not_played<dates.length-1?x(1*not_played_yet_x):0) + margin_left*2 + defaults.logo.size / 2 + defaults.name.position.x}, ${y(i) +
          defaults.final_infos.position.y -
          heightBars / 3})`,
      })
      .selectAll('.text')
      .data(d => d)
      .enter()
      .append('text')
      .attrs({
        x: (d, i) => {
          length = length + d.toString().length
          return (length * heightBars*0.3)
        },
        y: 0,
      })
      .styles({
        fill: 'blue',
        "font-size": defaults.value.style.font_size,
        "font-weight": 600,
        "text-anchor": "start",
        "alignment-baseline": defaults.value.style.alignment_baseline,
      })
      .text(d => d) */

    array_p.forEach((p, index, total) => {

      svg
      .selectAll(".text")
      .data(lastSlice)
      .enter()
      .append("text")
      .attrs({
        class: "final_infos",
        opacity: 1,
        x: d => {
          length = 0;
          array_p.slice(0, index).forEach((ee, oo) => {
          /* d3.max(data.filter((e) => e.name == d.name), (e) => e[ee]) == (ee == 'racha' || ee == 'racha_empates' || ee == 'racha_derrotas' || ee == 'racha_sin_victorias' || ee == 'racha_sin_empates' || ee == 'racha_sin_derrotas' ? 1 : 0) ? length = length - 2.7 : '' */
          ee == 'racha_derrotas' ? length++ : 0
          ee == 'racha_sin_derrotas' ? length++ : 0
          ee == 'goleadas_en_contra' ? length++ : 0
          ee == 'valla_invicta' ? length++ : 0;length = length + (d3.max(data.filter((e) => e.name == d.name), (e) => e[ee]).toString().length)})
          console.log(length)
          return x((dates.length-1) - ((dates.length-1)-fechas_not_played)*not_played_yet_x) + (fechas_not_played<dates.length-1?x(1*not_played_yet_x):0) + margin_left*2 + defaults.logo.size / 2 + defaults.name.position.x + length * heightBars*0.225 + index * heightBars*0.4
        },
        y: (d) =>
          y(d.rank) +
          defaults.final_infos.position.y -
          heightBars / 3,
      })
      .styles({
        /* opacity: d => d3.max(data.filter((e) => e.name == d.name), (e) => e[p]) == (p == 'racha' || p == 'racha_empates' || p == 'racha_derrotas' || p == 'racha_sin_victorias' || p == 'racha_sin_empates' || p == 'racha_sin_derrotas' ? 1 : 0) ? 0 : 1, */
        fill: black_color,
        "font-size": defaults.value.style.font_size,
        "font-weight": 600,
        "text-anchor": "start",
        "alignment-baseline": defaults.value.style.alignment_baseline,
      })
      .text((d) =>
        d3.max(data.filter((e) => e.name == d.name), (e) => e[p])
      );

      svg
      .selectAll(".images")
      .data(lastSlice)
      .enter()
      .append("image")
      .attrs({
        class: "final_infos",
        /* opacity: d => d3.max(data.filter((e) => e.name == d.name), (e) => e[p]) == (p == 'racha' || p == 'racha_empates' || p == 'racha_derrotas' || p == 'racha_sin_victorias' || p == 'racha_sin_empates' || p == 'racha_sin_derrotas' ? 1 : 0) ? 0 : 1, */
        x: (d) => {
          length = 0;
          array_p.slice(0, index+1).forEach((ee, oo) => {
          /* d3.max(data.filter((e) => e.name == d.name), (e) => e[ee]) == (ee == 'racha' || ee == 'racha_empates' || ee == 'racha_derrotas' || ee == 'racha_sin_victorias' || ee == 'racha_sin_empates' || ee == 'racha_sin_derrotas' ? 1 : 0) ? length = length - 2.7 : '' */
          ee == 'racha_sin_victorias' ? length++ : 0
          ee == 'goleadas' ? length++ : 0
          ee == 'valla_invicta' ? length++ : 0
          ee == 'fechas_en_top' ? length++ : 0;length = length + (d3.max(data.filter((e) => e.name == d.name), (e) => e[ee]).toString().length)})
          console.log(length)
          return width -
          margin_right +
          + (fechas_not_played<dates.length-1?x(1*not_played_yet_x):0) +defaults.logo.size * 0.775 -
          defaults.final_infos.logos.size*0.9 + length * heightBars*0.225 + index * heightBars*0.4},
        y: (d) =>
          y(d.rank) +
          defaults.final_infos.position.y -
          heightBars / 3 -
          defaults.final_infos.logos.size*0.9 / 2,
        href: `./icons/${p}.png`,
        height: defaults.final_infos.logos.size*0.9,
      });
      
    })

  }

};

Promise.all([d3.csv("data2.csv")]).then(([data1]) => {
  /* let torneos = [...new Set(data1.map((d) => d.torneo))]
  data1 = data1.filter(d => d.torneo == 'Torneo Final 2013') */

  let nombre_torneo = (ress_ratio == '16:9' ? "Liga Profesional de Fútbol 2023" : ress_ratio == '1:1' ? "Liga Profesional de Fútbol 2023" : "LPF 2023")
  nombre_torneo = data1[0].torneo.replace('Torneo ', '')
  let puntos_por_partido = 3;
  let year_torneo = parseInt(data1[0].torneo.split(' ').slice(-1))
  year_torneo < 1996 ? puntos_por_partido = 2 : ''
  data1[0].torneo == 'Torneo Apertura 1995' ? puntos_por_partido = 3 : ''
  let fecha_adicional = "Def."

  function mes(mes) {
    if (mes == "Jan") {
      return 0;
    } else if (mes == "Feb") {
      return 1;
    } else if (mes == "Mar") {
      return 2;
    } else if (mes == "Apr") {
      return 3;
    } else if (mes == "May") {
      return 4;
    } else if (mes == "Jun") {
      return 5;
    } else if (mes == "Jul") {
      return 6;
    } else if (mes == "Aug") {
      return 7;
    } else if (mes == "Sep") {
      return 8;
    } else if (mes == "Oct") {
      return 9;
    } else if (mes == "Nov") {
      return 10;
    } else if (mes == "Dec") {
      return 11;
    }
  }

  data1.forEach((d) => {
    d.goles_local = +d.goles_local;
    d.goles_visitante = +d.goles_visitante;
    d.pts_local =
      d.goles_local > d.goles_visitante
        ? puntos_por_partido
        : d.goles_local < d.goles_visitante
        ? 0
        : 1;
    d.pts_visitante =
      d.goles_visitante > d.goles_local
        ? puntos_por_partido
        : d.goles_visitante < d.goles_local
        ? 0
        : 1;
      /* d.dia_large = d.dia.split(' ').slice(0, -1).join(' ') */
      d.dia = new Date(
        +d.dia.split(" ")[2],
        mes(d.dia.split(" ")[0]),
        +d.dia.split(" ")[1]
      );
      /* d.dia = new Date(d.dia) */
      d.dia_large = formatDateLarge(d.dia)
      /* d.fecha = 'Fecha '+d.fecha */
  });

  let deducted = []

  data1.forEach(d => {
    if (d.visitante == 'fifa') {
      deducted.push({'name': d.local, 'pts_deducted': d.goles_visitante, 'dia': formatDate(d.dia)})
    }
  })

  let torneo = data1.filter(d => d.visitante != 'fifa');

  let dias = new Set(torneo.map((d) => d.dia).sort((a, b) => a - b));
  dias = new Set([...dias].map((d) => formatDate(d)));

  let clubes = new Set([...new Set(torneo.map((d) => d.local)), ...new Set(torneo.map((d) => d.visitante))]);

  let fechas_torneo = new Set(torneo.filter((d) => d.fecha.split(" ")[1] != fecha_adicional).map((d) => d.fecha));

  let fechas_torneo2 = new Set(
    torneo.filter((d) => d.fecha.split(" ")[1] != fecha_adicional).map((d) => d.fecha)
  );
  let fechas_def = torneo.filter(d => d.fecha.split(" ")[1] == fecha_adicional)

  let fechas_pospuestas = []

  fechas_torneo = [... fechas_torneo]

  fechas_torneo.forEach((fecha, i) => {
    try {
      let fechas = torneo.filter(d => d.fecha == fecha && d.dia < torneo.filter(d => d.fecha == fechas_torneo[i+1])[0].dia)
      fechas.forEach(d => {
        Object.assign(d, {'fecha2': d.fecha})
      })
      fechas_pospuestas.push(fechas);
      let pendiente = torneo.filter(d => d.fecha == fecha && d.dia > torneo.filter(d => d.fecha == fechas_torneo[i+1])[0].dia)
      let dia = d3.min(pendiente, d => d.dia)
      pendiente.forEach(d => {

          Object.assign(d, {'fecha2': 'Fecha Post.', 'fecha5': 'Fecha same'})
        
      })
      fechas_pospuestas.push(pendiente);

    }
    catch {
      let fechas = torneo.filter(d => d.fecha == fecha && d.dia < torneo.filter(d => d.fecha == fechas_torneo[i-1])[0].dia)
      fechas.forEach(d => {
        Object.assign(d, {'fecha2': 'Fecha Post.'})
      })
      fechas_pospuestas.push(fechas);
      let pendiente = torneo.filter(d => d.fecha == fecha && d.dia > torneo.filter(d => d.fecha == fechas_torneo[i-1])[0].dia)
      pendiente.forEach(d => {
        Object.assign(d, {'fecha2': d.fecha})
      })
      fechas_pospuestas.push(pendiente);
    }
  })

  fechas_pospuestas = fechas_pospuestas.filter(d => d.length > 0)
  fechas_pospuestas = fechas_pospuestas.sort((a, b) => {
    if (a[0].dia > b[0].dia) {
      return 1
    } else if (a[0].dia < b[0].dia) {
      return -1
    } else {
      return 0
    }
  })

  let fechas_final = []

  let num_fecha = 0

  fechas_pospuestas.forEach((d, i) => {

    if (d.map(e => e.fecha2)[0] == 'Fecha Post.' && d.map(e => e.fecha2).length == clubes.size/2) {
      num_fecha = num_fecha + 1
    }

    if (fechas_pospuestas[i][0].fecha2 == 'Fecha Post.') {
      d.forEach(e => {
        Object.assign(e, {'fecha4': 'Fecha '+num_fecha})
      })
    }

    if (fechas_pospuestas[i][0].fecha2 != 'Fecha Post.') {
      num_fecha = num_fecha + 1
      d.forEach(e => {
        Object.assign(e, {'fecha4': 'Fecha '+num_fecha})
      })
    }
  })

  let total_fechas = []
  fechas_pospuestas.forEach(d => {
    d.forEach(e => {
      total_fechas.push(e.fecha4)
    })
  })
  total_fechas = new Set(total_fechas)

  let fechas_pospuestas1 = []

  total_fechas.forEach(fecha => {
    let fechas = torneo.filter(d => d.fecha4 == fecha)
    fechas_pospuestas1.push(fechas)
  })

  fechas_pospuestas1 = fechas_pospuestas1.sort((a, b) => {
    if (a[0].dia > b[0].dia) {
      return 1
    } else if (a[0].dia < b[0].dia) {
      return -1
    } else {
      return 0
    }
  })

  fechas_def.forEach(d => {
    d.fecha2 = 'Fecha Def.'
    d.fecha4 = 'Fecha Def.'
  })

  fechas_pospuestas1.push(fechas_def)

  fechas_pospuestas1.forEach((d, i) => {
    d.forEach(e => {
      Object.assign(e, {'semana': i+1})
    })
  })

  let data2 = []

  fechas_pospuestas1.forEach((d, i) => {
    d.forEach(e => {
      data2.push(e)

    })
  })

  data2 = data2.sort((a, b) => {
    if (a.dia > b.dia) {
      return 1
    } else if (a.dia < b.dia) {
      return -1
    } else {
      return 0
    }
  })

  console.log(data2)

  let semanas = new Set(data2.map((d) => d.semana).sort((a, b) => a - b));

  console.log(dias);
  console.log(semanas)
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
        l_or_v: "L",
        vs: d.visitante,
        semana: semana,
        fecha: d.fecha,
        fecha2: d.fecha2,
        fecha4: d.fecha4,
        pts: d.pts_local,
        goles: d.goles_local,
        goles_en_contra: d.goles_visitante,
        n_partidos: partidos_n,
      });
      final_list.push({
        dia: d.dia,
        dia_large: d.dia_large,
        name: d.visitante,
        l_or_v: "V",
        vs: d.local,
        semana: semana,
        fecha: d.fecha,
        fecha2: d.fecha2,
        fecha4: d.fecha4,
        pts: d.pts_visitante,
        goles: d.goles_visitante,
        goles_en_contra: d.goles_local,
      });
      
    });
    let clubes_semana1 = new Set(semana_filter.map((d) => d.local));
    let clubes_semana2 = new Set(semana_filter.map((d) => d.visitante));
    let clubes_semana3 = new Set([...clubes_semana1, ...clubes_semana2]);

    clubes.forEach((club) => {
      if (![...clubes_semana3].includes(club)) {
        final_list.push({
          name: club,
          vs: "none",
          semana: semana,
          fecha: "",
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
    let partido_casa = 0
    let victoria_casa = 0
    let empate_casa = 0
    let derrota_casa = 0

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

    filter_clubes.forEach((d, i) => {

      if (d.fecha.includes(fecha_adicional)) {
        pts1 = pts1 + d.pts;
        goles1 = goles1 + d.goles;
        goles_en_contra1 = goles_en_contra1 + d.goles_en_contra;
        d.goles - d.goles_en_contra >= 3 ? goleadas++ : "";
        d.goles_en_contra - d.goles >= 3 ? goleadas_en_contra++ : "";
        d.vs != "none" ? partidos_jugados1++ : "";
        d.pts == puntos_por_partido
          ? partidos_ganados1++
          : d.pts == 1
          ? partidos_empatados1++
          : d.vs != "none"
          ? partidos_perdidos1++
          : "";

          if (d.vs != "none") {
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
          goles_fecha: d.vs != "none" ? d.goles : "",
          goles_en_contra_fecha: d.vs != "none" ? d.goles_en_contra : "",
          vs_text_dia: d.vs != "none" ? "vs" : "",
          guion_text_dia: d.vs != "none" ? "-" : "",
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
        });
      } else {
        let may_deducted = deducted.filter(e => e.name == d.name && e.dia == d.dia)[0]
        pts_deducted = 0
        if (may_deducted) {
          pts_deducted = may_deducted.pts_deducted
          pts = pts - pts_deducted
        }

        if (d.goles==not_played_yet){
          pts = pts -1
          goles = goles - not_played_yet;
          goles_en_contra = goles_en_contra - not_played_yet;
          racha_empates = racha_empates - 1;
          racha_sin_victorias = racha_sin_victorias - 1;
          racha_sin_derrotas = racha_sin_derrotas - 1;
          racha_sin_empates = racha_sin_empates - 1;
          empate_casa = empate_casa - 1
          partidos_jugados = partidos_jugados - 1;
          partidos_empatados = partidos_empatados - 1;
        }

        pts_away = d.l_or_v == 'V' && d.goles!==not_played_yet ? pts_away + d.goles : pts_away + 0;
        pts = pts + d.pts;
        goles = goles + d.goles;
        goles_en_contra = goles_en_contra + d.goles_en_contra;
        d.goles - d.goles_en_contra >= 3 ? goleadas++ : "";
        d.goles_en_contra - d.goles >= 3 ? goleadas_en_contra++ : "";
        d.vs != "none" ? partidos_jugados++ : "";
        d.pts == puntos_por_partido
          ? partidos_ganados++
          : d.pts == 1
          ? partidos_empatados++
          : d.vs != "none"
          ? partidos_perdidos++
          : "";

        if (d.vs != "none") {
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
          goles_fecha: d.vs != "none" ? d.goles : "",
          goles_en_contra_fecha: d.vs != "none" ? d.goles_en_contra : "",
          vs_text_dia: d.vs != "none" ? "vs" : "",
          guion_text_dia: d.vs != "none" ? "-" : "",
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
        });
      }
    });

    final_list1.push({
      name: club,
      vs: "none",
      year: [...dias][[...dias].length - 1].split("-")[0] + "-12-31",
      final: true,
      fecha: "",
      semana: semanas.size+1,
      value: final_list1[final_list1.length - 1].value,
      value_away: final_list1[final_list1.length - 1].value_away,
      lastValue: 0,
      pts_fecha: 0,
      pts_deducted: 0,
      goles: final_list1[final_list1.length - 1].goles,
      goles_en_contra: final_list1[final_list1.length - 1].goles_en_contra,
      diferencia_de_goles:
        final_list1[final_list1.length - 1].diferencia_de_goles,
      goles_fecha: "",
      goles_en_contra_fecha: "",
      vs_text_dia: "",
      guion_text_dia: "",
      partidos_jugados: final_list1[final_list1.length - 1].partidos_jugados,
      partidos_ganados: final_list1[final_list1.length - 1].partidos_ganados,
      partidos_empatados:
        final_list1[final_list1.length - 1].partidos_empatados,
      partidos_perdidos: final_list1[final_list1.length - 1].partidos_perdidos,
      value1: final_list1[final_list1.length - 1].value1,
      partidos_jugados1: final_list1[final_list1.length - 1].partidos_jugados1,
      partidos_ganados1: final_list1[final_list1.length - 1].partidos_ganados1,
      partidos_empatados1:
        final_list1[final_list1.length - 1].partidos_empatados1,
      partidos_perdidos1:
        final_list1[final_list1.length - 1].partidos_perdidos1,
      goles1: final_list1[final_list1.length - 1].goles1,
      goles_en_contra1: final_list1[final_list1.length - 1].goles_en_contra1,
      diferencia_de_goles1:
        final_list1[final_list1.length - 1].diferencia_de_goles1,
      goleadas: final_list1[final_list1.length - 1].goleadas,
      goleadas_en_contra:
        final_list1[final_list1.length - 1].goleadas_en_contra,
    });
  });

  final_list1.push({
    name: "hola",
    vs: "chau",
    year: [...dias][0].split("-")[0] + "-01-01",
    fecha: "",
    semana: 0,
    value: 0,
    lastValue: 0,
    pts_fecha: 0,
    goles: 0,
    goles_en_contra: 0,
    diferencia_de_goles: 0,
    goles_fecha: "",
    goles_en_contra_fecha: "",
    vs_text_dia: "",
    guion_text_dia: "",
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
  });

  final_list1
    .filter((d) => d.vs != "none")
    .forEach((d, i) => {
      if (
        final_list1.filter((d) => d.vs != "none")[i - 1] != undefined &&
        final_list1.filter((d) => d.vs != "none")[i + 1] != undefined
      ) {
        Object.assign(d, {
          racha1:
            final_list1.filter((d) => d.vs != "none")[i + 1].name != d.name
              ? d.racha
              : final_list1.filter((d) => d.vs != "none")[i + 1].racha < d.racha
              ? d.racha
              : final_list1.filter((d) => d.vs != "none")[i + 1].name != d.name
              ? d.racha
              : 0,
        });

        Object.assign(d, {
          racha_derrotas1:
            final_list1.filter((d) => d.vs != "none")[i + 1].name != d.name
              ? d.racha_derrotas
              : final_list1.filter((d) => d.vs != "none")[i + 1]
                  .racha_derrotas < d.racha_derrotas
              ? d.racha_derrotas
              : final_list1.filter((d) => d.vs != "none")[i + 1].name != d.name
              ? d.racha_derrotas
              : 0,
        });

        Object.assign(d, {
          racha_empates1:
            final_list1.filter((d) => d.vs != "none")[i + 1].name != d.name
              ? d.racha_empates
              : final_list1.filter((d) => d.vs != "none")[i + 1].racha_empates <
                d.racha_empates
              ? d.racha_empates
              : final_list1.filter((d) => d.vs != "none")[i + 1].name != d.name
              ? d.racha_empates
              : 0,
        });

        if (final_list1.filter((d) => d.vs != "none")[i - 1].name != d.name) {
          Object.assign(d, { racha_sin_victorias1: 0 });
        } else {
          if (
            d.racha_sin_victorias <
            final_list1.filter((d) => d.vs != "none")[i - 1].racha_sin_victorias
          ) {
            Object.assign(d, {
              racha_sin_victorias1: final_list1.filter((d) => d.vs != "none")[
                i - 1
              ].racha_sin_victorias,
            });
          } else {
            if (
              final_list1.filter((d) => d.vs != "none")[i + 1].name != d.name
            ) {
              Object.assign(d, { racha_sin_victorias1: 0 });
            } else {
              Object.assign(d, { racha_sin_victorias1: 0 });
            }
          }
        }

        if (final_list1.filter((d) => d.vs != "none")[i - 1].name != d.name) {
          Object.assign(d, { racha_sin_derrotas1: 0 });
        } else {
          if (
            d.racha_sin_derrotas <
            final_list1.filter((d) => d.vs != "none")[i - 1].racha_sin_derrotas
          ) {
            Object.assign(d, {
              racha_sin_derrotas1: final_list1.filter((d) => d.vs != "none")[
                i - 1
              ].racha_sin_derrotas,
            });
          } else {
            if (
              final_list1.filter((d) => d.vs != "none")[i + 1].name != d.name
            ) {
              Object.assign(d, { racha_sin_derrotas1: 0 });
            } else {
              Object.assign(d, { racha_sin_derrotas1: 0 });
            }
          }
        }
        if (final_list1.filter((d) => d.vs != "none")[i - 1].name != d.name) {
          Object.assign(d, { racha_sin_empates1: 0 });
        } else {
          if (
            d.racha_sin_empates <
            final_list1.filter((d) => d.vs != "none")[i - 1].racha_sin_empates
          ) {
            Object.assign(d, {
              racha_sin_empates1: final_list1.filter((d) => d.vs != "none")[
                i - 1
              ].racha_sin_empates,
            });
          } else {
            if (
              final_list1.filter((d) => d.vs != "none")[i + 1].name != d.name
            ) {
              Object.assign(d, { racha_sin_empates1: 0 });
            } else {
              Object.assign(d, { racha_sin_empates1: 0 });
            }
          }
        }
      }
    });

  final_list1 = final_list1.filter((d) => d.name != "hola");

  render(
    final_list1,
    dias,
    nombre_torneo,
    clubes,
    partidos,
    partidos_n,
    fechas_torneo.size,
    fechas_torneo2.size,
    puntos_por_partido,
    data1
  );
});
