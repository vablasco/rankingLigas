let ress_ratio = '16:9'

let resulution = 2

let width = (ress_ratio == '16:9' ? 16 : ress_ratio == '1:1' ? 9 : 9) * 120
let height = (ress_ratio == '16:9' ? 9 : ress_ratio == '1:1' ? 9 : 16) * 120

width = width * resulution
height = height * resulution

let margin = {
  top: ress_ratio == '16:9' ? height * 0.065 : ress_ratio == '1:1' ? height * 0.065 : height * 0.065,
  right: width * 0.05,
  bottom: ress_ratio == '16:9' ? height * 0 : ress_ratio == '1:1' ? height * 0 : height * 0.0,
  left: 100
}

let teamColorss = {
    Argentina: ['#fff', '#9fcdef', '#9fcdef', '#fff'],
    usa: ['red', 'red', 'red', 'red'],
    germany: ['red', 'red', 'red', 'red'],
    Brasil: ['#ffd100', '#ffd100', '#ffd100', '#009c54'],
    Colombia: ['#ffcc00', '#ffcc00', '#ffcc00', '#ffcc00'],
    Ecuador: ['#001f5b', '#ffce00', '#ffce00', '#001f5b'],
    Uruguay: ['#7fa0d2', '#7fa0d2', '#7fa0d2', '#7fa0d2'],
    Paraguay: ['#e20815', '#fff', '#fff', '#e20815'],
    Bolivia: ['#006200', '#006200', '#006200', '#006200'],
    Venezuela: ['#510e26', '#510e26', '#510e26', '#510e26'],
    Chile: ['#db0e15', '#db0e15', '#db0e15', '#db0e15'],
    Peru: ['#fff', '#fff', '#da061b', '#da061b'],
    'Boca Juniors': ['#005EAE', '#005EAE', '#FFD900', '#FFD900'],
    'River Plate': ['#fff', '#fff', '#E2211C', '#E2211C'],
    'Temperley': ['#fff', '#fff', '#21bbef', '#21bbef'],
    Quilmes: ['#fff', '#fff', '#123567', '#123567'],
    Riestra: ['#fff', '#fff', '#000', '#000'],
    'All Boys': ['#fff', '#fff', '#000', '#000'],
    'Independiente Rivadavia': ['#381972', '#381972', '#fff', '#fff'],
    'San Lorenzo': ['#EC212D', '#EC212D', '#273B56', '#273B56'],
    Banfield: ['#219D3F', '#fff', '#fff', '#219D3F'],
    Independiente: ['#bf0811', '#bf0811', '#fff', '#fff'],
    Ferro: ['#156538', '#156538', '#fff', '#fff'],
    'Deportivo Mandiyú': ['#fff', '#fff', '#14a943', '#14a943'],
    Lanús: ['#62162C', '#62162C', '#fff', '#fff'],
    Racing: ['#00AFE9', '#fff', '#fff', '#00AFE9'],
    'Gimnasia (S)': ['#fff', '#29b0e3', '#29b0e3', '#fff'],
    'Atlético Rafaela': ['#fff', '#0084c9', '#0084c9', '#fff'],
    'Godoy Cruz': ['#0071D5', '#0071D5', '#Fff', '#fff'],
    Colón: ['#D6161C', '#D6161C', '#000', '#000'],
    Huracán: ['#fff', '#fff', 'red', '#fff'],
    'Barracas Central': ['#fff', 'red', 'red', '#fff'],
    'San Martín (T)': ['red', '#fff', '#fff', 'red'],
    'Rosario Central': ['#FFCB05', '#004070', '#004070', '#FFCB05'],
    Arsenal: ['#12ACDE', '#12ACDE', '#DB2E26', '#DB2E26'],
    "Newell's Old Boys": ['#000', '#E81F1F', '#E81F1F', '#E81F1F'],
    Tigre: ['#2A247A', '#2A247A', '#BF1D26', '#BF1D26'],
    Gimnasia: ['#fff', '#fff', '#11195C', '#11195C'],
    'Vélez Sarsfield': ['#fff', '#fff', '#0469c8', '#0469c8'],
    'Argentinos Juniors': ['#FB0306', '#FB0306', '#FB0306', '#fff'],
    Estudiantes: ['#FB0306', '#fff', '#fff', '#FB0306'],
    'Los Andes': ['#fff', '#FB0306', '#FB0306', '#fff'],
    'Nueva Chicago': ['#000', '#116d3d', '#116d3d', '#000'],
    'San Martín (SJ)': ['#000', '#40ab35', '#40ab35', '#000'],
    'Huracán (C)': ['#281371', '#de341a', '#de341a', '#281371'],
    'Chacarita Juniors': ['#000', '#fd1000', '#fd1000', '#000'],
    'Almagro': ['#000', '#6a8ac6', '#6a8ac6', '#000'],
    Olimpo: ['#000', '#ffe700', '#ffe700', '#000'],
    Unión: ['#FB0306', '#fff', '#fff', '#fff'],
    'Deportivo Español': ['#fff', '#dc0c15', '#dc0c15', '#dc0c15'],
    'Tiro Federal': ['#207caa', '#fff', '#fff', '#fff'],
    Sarmiento: ['#008447', '#008447', '#fff', '#fff'],
    Platense: ['#fff', '#fff', '#804b19', '#804b19'],
    Talleres: ['#000c66', '#000c66', '#Fff', '#fff'],
    'Defensa y Justicia': ['#007329', '#007329', '#FFDE00', 'FFDE00'],
    Patronato: ['#1A1310', '#1A1310', '#DB2420', '#DB2420'],
    'Atlético Tucumán': ['#fff', '#62BDF1', '#62BDF1', '#fff'],
    'Central Córdoba': ['#000', '#fff', '#fff', '#000'],
    Aldosivi: ['#00903B', '#00903B', '#FCCB00', '#FCCB00'],
    Belgrano: ['#109fd5', '#109fd5', '#000', '#000'],
    Instituto: ['#fff', '#e31428', '#e31428', '#e31428'],
    'Gimnasia (J)': ['#fff', '#fff', '#20A1E2', '#20A1E2']
  }

let background_color = '#e5e5e5'
let header_color = '#00001a'
let first_place_color = '#90EE90'
let last_place_color = '#dd2222'

let victoria_color = '#00802b'
let empate_color = '#cc9900'
let derrota_color = '#cc2900'
let grey_color = '#616161'
let black_color = '#202020'

let not_played_yet = 99
let not_played_yet_x = 0.4
let fechas_not_played = 1

let fps = 60

if (document.URL.includes('render-d3-video')) {
  window.currentTime = 0
  performance.now = () => window.currentTime
}

cleanString = function (str) {
  return str.replace(new RegExp(/\s/, 'g'), '_').replace('.', '')
}

var BrowserText = (function () {
  var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d')

  /**
   * Measures the rendered width of arbitrary text given the font size and font face
   * @param {string} text The text to measure
   * @param {number} fontSize The font size in pixels
   * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
   * @returns {number} The width of the text
   **/
  function getWidth(text, fontSize, fontFace) {
    context.font = fontSize + 'px ' + fontFace
    return context.measureText(text).width
  }

  return {
    getWidth: getWidth
  }
})()

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
  shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
})

formatDate = d3.utcFormat('%Y-%m-%d')
formatDate1 = d3.utcFormat('%-d %b')
formatDateLarge = d3.utcFormat('%b %d')
let formatEfec = d3.format('.0f')

const render = (data, nombre_torneo, clubes, puntos_por_partido, data1, fechas_playoff, probabilidades) => {
  let partidos_restantes_chile = data.filter(d => d.name == 'Chile' && d.goles_fecha == 99)
  let winRate = 0
  partidos_restantes_chile.forEach(d => {
    let puntos_rival = d3.max(data.filter(e => e.name == d.vs), e => e.value)/d.value 
    if (d.l_or_v == 'V' && puntos_rival > 1) {
      winRate = winRate + 0
    } else if (d.l_or_v == 'V' && puntos_rival < 1) {
      winRate = winRate + 1
    } else if (d.l_or_v == 'L' && puntos_rival < 1) {
      winRate = winRate + 3
    } else if (d.l_or_v == 'L' && puntos_rival > 1 && puntos_rival < 3) {
      winRate = winRate + 1
    } else if (d.l_or_v == 'L' && puntos_rival > 3) {
      winRate = winRate + 0
    }
    d.winRate = winRate
    console.log(puntos_rival)
  })
  console.log(partidos_restantes_chile)
  let start = d3.now()

  let top_n = clubes.size
  let heightBars = (height - (margin.bottom + margin.top)) / (top_n + 2)

  margin = {
    top: ress_ratio == '16:9' ? heightBars * 2 : ress_ratio == '1:1' ? heightBars * 1.5 : heightBars * 1.5,
    right: width * 0.05,
    bottom: ress_ratio == '16:9' ? height * 0 : ress_ratio == '1:1' ? height * 0 : height * 0.0,
    left: 100
  }

  heightBars = (height - (margin.bottom + margin.top)) / (top_n * 1)

  let playoffs = {
    32: 6,
    16: 5,
    8: 4,
    4: 3,
    2: 2,
    1: 1,
  }

  let playoffs_names = {
    32: '32avos',
    16: '16avos',
    8: 'Octavos',
    4: 'Cuartos',
    2: 'Semifinales',
    1: 'Final'
  } 

  let grupos = [...new Set(data.map(d => d.name.split('-')[1]))].length
  let grupos1 = [...new Set(data.map(d => d.name.split('-')[1]))]
  console.log([...new Set(data.map(d => d.name.split('-')[1]))])
  if (grupos == 1) {
    grupos = 0
  }

  console.log(grupos)

  let localia = false
  let clasificacion_por_grupo = 2
  let repechaje = false
  let equipos_por_grupos = top_n/grupos
  let width_playoffs = 300
  let space_width_playoff = width_playoffs*0.5
  let space_height_playoff = heightBars*0.5
  let primera_ronda_playoff = (grupos*clasificacion_por_grupo)/2
  let rondas_playoff = playoffs[primera_ronda_playoff]

  const halo1 = function (text, strokeWidth, color) {
    text
      .select(function () {
        return this.parentNode.insertBefore(this.cloneNode(true), this)
      })
      .styles({
        fill: 'white',
        stroke: 'white',
        'stroke-width': strokeWidth / 3.5,
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        opacity: 1
      })
  }

  let semanas = new Set(data.map((d) => d.semana).sort((a, b) => a - b))
  let dates = [...semanas]

  let margin_right = ress_ratio == '16:9' ? heightBars * 11 : ress_ratio == '1:1' ? heightBars * 7.8 : heightBars * 1.74

  let ticks_slice = ress_ratio == '16:9' ? top_n - 4 : ress_ratio == '1:1' ? +d3.format('.0f')(top_n * 0.4) : +d3.format('.0f')(top_n * 0.25)

  let weeks_i = width - margin_right

  let margin_left = weeks_i / ticks_slice / 2
  let weeks_o = weeks_i / ticks_slice
  let weeks = weeks_o

  let campeon2 = 0

  fechas_not_played = d3.max(data, (d) => d.partidos_jugados + d.partidos_jugados1)

  
  if (grupos>1) {
    width = weeks * (fechas_not_played + 1) + (weeks - weeks * not_played_yet_x) * (dates.length - 1 - fechas_not_played) + margin_right + (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff)
  } else {
    width = weeks * (fechas_not_played + 1) + (weeks - weeks * not_played_yet_x) * (dates.length - 1 - fechas_not_played) + margin_right
  }

  console.log(dates.length + 1, weeks)

  console.log(`[${width}, ${height}]`)

  const svg = d3.select('body').append('svg').attrs({
    width: width,
    height: height
  })

  svg.append('rect').attrs({
    x: 0,
    y: 0,
    width: width,
    height: height,
    fill: background_color
  })

  svg.append('rect').attrs({
    x: 0,
    y: 0,
    width: width,
    height: margin.top,
    fill: header_color
  })

  svg
    .append('text')
    .attrs({
      x: width * 0.5,
      y: margin.top * 0.3
    })
    .styles({
      fill: '#f1f1f1',
      'font-size': margin.top * 0.45,
      'font-weight': 600,
      'text-anchor': 'middle',
      'alignment-baseline': 'central'
    })
    .text(nombre_torneo.replace('_', '/'))

  svg
    .append('text')
    .attrs({
      x: width - margin.top * 0.3,
      y: margin.top * 0.3
    })
    .styles({
      fill: 'lightgrey',
      'font-size': margin.top * 0.25,
      'font-weight': 600,
      'text-anchor': 'end',
      'alignment-baseline': 'central'
    })
    .text('@rankingligas')

  let defaults = {
    bar: {
      style: {
        fill: 'lightgrey'
      }
    },
    name: {
      position: {
        x: ress_ratio != '9:16' ? heightBars * 0 : -heightBars * 0.0,
        y: ress_ratio != '9:16' ? -heightBars * 0.03 : -heightBars * 0.18
      },
      style: {
        fill: black_color,
        font_size: heightBars * 0.4,
        font_weight: 600,
        text_anchor: 'start',
        alignment_baseline: 'central'
      }
    },
    value: {
      position: {
        x: 0,
        y: ress_ratio != '9:16' ? heightBars * 0.32 : heightBars * 0.18
      },
      style: {
        fill: black_color,
        font_size: heightBars * 0.3,
        font_weight: 600,
        text_anchor: 'start',
        alignment_baseline: 'central'
      },
      format: (d) => d3.format(',.0f')(d.value)
    },
    subValue: {
      style: {
        fill: black_color,
        font_size: heightBars * 0.225,
        font_weight: 400,
        text_anchor: 'start',
        alignment_baseline: 'central'
      }
    },
    final_infos: {
      position: {
        x: ress_ratio != '9:16' ? heightBars * 0 : -heightBars * 0.0,
        y: ress_ratio != '9:16' ? heightBars * 0 : -heightBars * 0.18
      },
      logos: {
        size: heightBars * 0.45
      }
    },
    growthValue: {
      position: {
        x: heightBars * 0.25,
        y: heightBars * 0.95
      },
      style: {
        fill: (d) => (d.growthValue > 0 ? 'green' : d.growthValue == 0 ? 'grey' : 'red'),
        font_size: heightBars * 0.4,
        font_weight: 600,
        text_anchor: 'start',
        alignment_baseline: 'central'
      },
      format: (d) => (d.growthValue > 0 ? '+' : '') + d3.format('.2f')(d.growthValue) + '%'
    },
    logo: {
      position: {
        x: -32.5
      },
      size: heightBars * 1.2,
      size1: heightBars * 1.2
    },
    mini_logo: {
      position: {
        x: -32.5
      },
      size: heightBars * 0.5,
      size1: heightBars * 0.5
    },
    yearText: {
      position: {
        x: width - margin.right + 60,
        y: margin.top / 2
      },
      style: {
        fill: black_color,
        font_size: 70,
        font_weight: 400,
        text_anchor: 'end',
        alignment_baseline: 'central'
      }
    }
  }

  function removeDuplicates(books) {
    let newArray = []
    let uniqueObject = {}
    for (let i in books) {
      objTitle = books[i]['name']
      uniqueObject[objTitle] = books[i]
    }
    for (i in uniqueObject) {
      newArray.push(uniqueObject[i])
    }

    return newArray
  }

  /* let sort_teams = (array) => {
    array = removeDuplicates(array)

    array.sort((a, b) => {
      if (b.value1 > a.value1) {
        return 1
      } else if (b.value1 < a.value1) {
        return -1
      } else if (b.value1 == a.value1) {
        if (b.partidos_jugados1 > a.partidos_jugados1) {
          return 1
        } else if (b.partidos_jugados1 < a.partidos_jugados1) {
          return -1
        } else if (b.partidos_jugados1 == a.partidos_jugados1) {
          if (b.diferencia_de_goles1 > a.diferencia_de_goles1) {
            return 1
          } else if (b.diferencia_de_goles1 < a.diferencia_de_goles1) {
            return -1
          } else if (b.diferencia_de_goles1 == a.diferencia_de_goles1) {
            if (b.goles1 > a.goles1) {
              return 1
            } else if (b.goles1 < a.goles1) {
              return -1
            } else if (b.goles1 == a.goles1) {

        if (b.name.split('-')[1] < a.name.split('-')[1]) {
          return 1
        } else if (b.name.split('-')[1] > a.name.split('-')[1]) {
          return -1
        } else if (b.name.split('-')[1] == a.name.split('-')[1]) {
        
          if (b.value > a.value) {
            return 1
          } else if (b.value < a.value) {
            return -1
          } else if (b.value == a.value) {
            if (b.diferencia_de_goles > a.diferencia_de_goles) {
              return 1
            } else if (b.diferencia_de_goles < a.diferencia_de_goles) {
              return -1
            } else if (b.diferencia_de_goles == a.diferencia_de_goles) {
              if (b.goles > a.goles) {
                return 1
              } else if (b.goles < a.goles) {
                return -1
              } else if (b.goles == a.goles) {
                    if (b.value_away > a.value_away) {
                      return 1
                    } else if (b.value_away < a.value_away) {
                      return -1
                    } else {
                      var textA = a.name.toUpperCase()
                      var textB = b.name.toUpperCase()
                      return textA < textB ? -1 : textA > textB ? 1 : 0
                    }
                  }
                }
              }
            }
          }
        }
  }}})
    array.forEach((d, i) => (d.rank = i))
    array.forEach((d, i) => (d.fechas_en_top1 = d.rank == 0 ? 1 : 0))

    return array
  } */

    let sort_teams = (array) => {
      array = removeDuplicates(array)
  
      array.sort((a, b) => {
        if (b.name.split('-')[1] < a.name.split('-')[1]) {
          return 1
        } else if (b.name.split('-')[1] > a.name.split('-')[1]) {
          return -1
        } else if (b.name.split('-')[1] == a.name.split('-')[1]) {
        if (b.value > a.value) {
          return 1
        } else if (b.value < a.value) {
          return -1
        } else if (b.value == a.value) {
          if (b.value1 > a.value1) {
            return 1
          } else if (b.value1 < a.value1) {
            return -1
          } else if (b.value1 == a.value1) {
            if (b.diferencia_de_goles1 > a.diferencia_de_goles1) {
              return 1
            } else if (b.diferencia_de_goles1 < a.diferencia_de_goles1) {
              return -1
            } else if (b.diferencia_de_goles1 == a.diferencia_de_goles1) {
              if (b.goles1 > a.goles1) {
                return 1
              } else if (b.goles1 < a.goles1) {
                return -1
              } else if (b.goles1 == a.goles1) {
                if (b.diferencia_de_goles > a.diferencia_de_goles) {
                  return 1
                } else if (b.diferencia_de_goles < a.diferencia_de_goles) {
                  return -1
                } else if (b.diferencia_de_goles == a.diferencia_de_goles) {
                  if (b.goles > a.goles) {
                    return 1
                  } else if (b.goles < a.goles) {
                    return -1
                  } else if (b.goles == a.goles) {
                    if (b.value_away > a.value_away) {
                      return 1
                    } else if (b.value_away < a.value_away) {
                      return -1
                    } else {
                      var textA = a.name.toUpperCase()
                      var textB = b.name.toUpperCase()
                      return textA < textB ? -1 : textA > textB ? 1 : 0
                    }
                  }
                }
              }
            }
          }
        }
    }})
      array.forEach((d, i) => (d.rank = i))
      array.forEach((d, i) => (d.rankInGroup = i % 4))
      array.forEach((d, i) => (d.position = d.rankInGroup+1+d.name.split('-')[1]))
      array.forEach((d, i) => (d.fechas_en_top1 = d.rank == 0 ? 1 : 0))
  
      return array
    }

    const a = Array.from({length: 32}, (_, i) => i % 4);

    console.log(a)
  

  let yearSlice = sort_teams(data.filter((d) => d.semana == dates[dates.length - 1] && !isNaN(d.value)))
  console.log(yearSlice)

  let x = d3.scaleLinear().domain([0, ticks_slice]).range([0, weeks_i])

  let y = d3
    .scaleLinear()
    .domain([top_n, 0])
    .range([height - margin.bottom + heightBars / 2, margin.top + heightBars / 2])

  let names = new Set(data.map((d) => d.name))

  let lastSlice = sort_teams(data.filter((d) => d.semana == dates[dates.length - 1] && !isNaN(d.value)))

  svg
    .append('clipPath')
    .attr('id', `ellipse-clip-margin-bottom`)
    .append('rect')
    .attrs({
      x: 0,
      y: 0,
      width: width,
      height: y(top_n - 1) + heightBars / 2
    })

  svg
    .append('clipPath')
    .attr('id', `ellipse-clip-margin-left`)
    .append('rect')
    .attrs({
      class: 'ellipse_clip_margin_left',
      x: -margin_left,
      y: 0,
      width: width,
      height: y(top_n - 1) + heightBars / 2
    })

    /* grupos1.forEach((e, index) => {
      svg
      .selectAll('.rect')
      .data(yearSlice.slice(0, top_n))
      .enter()
      .append('rect')
      .attrs({
        class: 'bars_names',
        x: 0,
        y: (d, i) => y(d.rank+(index*equipos_por_grupos)) - heightBars / 2,
        width: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff),
        height: heightBars
      })
      .styles({
        fill: (d, i) => i <= equipos_por_grupos-1 ? (i <= clasificacion_por_grupo-1 || i >= equipos_por_grupos && i <= equipos_por_grupos+clasificacion_por_grupo-1 ? i % 2 == 1 ? '#90EE90' : '#5da15d' : i % 2 == 1 ? '#e5e5e5' : '#919191') : (i <= clasificacion_por_grupo-1 || i >= equipos_por_grupos && i <= equipos_por_grupos+clasificacion_por_grupo-1 ? i % 2 == 1 ? '#90EE90' : '#5da15d' : i % 2 == 1 ? '#e5e5e5' : '#919191'),
        opacity: (d, i) => i <= equipos_por_grupos-1 ? 0.8 : 0.8
      })
    }) */

  if (grupos > 1) {

    grupos1.forEach((e, index) => {
      svg
      .selectAll('.rect')
      .data(yearSlice.slice(0, top_n))
      .enter()
      .append('rect')
      .attrs({
        class: 'bars_names',
        x: 0,
        y: (d, i) => y(d.rank+(index*equipos_por_grupos)) - heightBars / 2,
        width: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff),
        height: heightBars
      })
      .styles({
        fill: (d, i) => i <= equipos_por_grupos-1 ? (i <= clasificacion_por_grupo-1 || i >= equipos_por_grupos && i <= equipos_por_grupos+clasificacion_por_grupo-1 ? i % 2 == 1 ? '#90EE90' : '#5da15d' : i % 2 == 1 ? '#e5e5e5' : '#919191') : (i <= clasificacion_por_grupo-1 || i >= equipos_por_grupos && i <= equipos_por_grupos+clasificacion_por_grupo-1 ? i % 2 == 1 ? '#90EE90' : '#5da15d' : i % 2 == 1 ? '#e5e5e5' : '#919191'),
        opacity: (d, i) => i <= equipos_por_grupos-1 ? 0.8 : 0.8
      })
    })

    /* svg
      .selectAll('.rect')
      .data(yearSlice.slice(0, top_n))
      .enter()
      .append('rect')
      .attrs({
        class: 'bars_names',
        x: 0,
        y: (d, i) => y(d.rank) - heightBars / 2,
        width: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff),
        height: heightBars
      })
      .styles({
        fill: (d, i) => i <= equipos_por_grupos-1 ? (i <= clasificacion_por_grupo-1 || i >= equipos_por_grupos && i <= equipos_por_grupos+clasificacion_por_grupo-1 ? i % 2 == 1 ? '#90EE90' : '#5da15d' : i % 2 == 1 ? '#e5e5e5' : '#919191') : (i <= clasificacion_por_grupo-1 || i >= equipos_por_grupos && i <= equipos_por_grupos+clasificacion_por_grupo-1 ? i % 2 == 1 ? '#90EE90' : '#5da15d' : i % 2 == 1 ? '#e5e5e5' : '#919191'),
        opacity: (d, i) => i <= equipos_por_grupos-1 ? 0.8 : 0.8
      }) */
  } else {
    svg
    .selectAll('.rect')
    .data(yearSlice.slice(0, top_n))
    .enter()
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: 0,
      y: (d, i) => y(d.rank) - heightBars / 2,
      width: width,
      height: heightBars
    })
    .styles({
            fill: (d, i) =>
        i == 0
          ? '#5da15d' /* : i == 17 ? last_place_color */
          : i % 2 == 1
          ? "#e5e5e5"
          : "#919191",

      opacity: (d, i) => i <= equipos_por_grupos-1 ? 0.6 : 0.6
    })
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
    }

    let positions_playoffs4 = {
      0: [0, 0],
      1: [0, 1],
      2: [1, 0],
      3: [1, 1],
      4: [2, 0],
      5: [2, 1],
      6: [3, 0],
      7: [3, 1],
    }

    let positions_playoffs2 = {
      0: [0, 0],
      1: [0, 1],
      2: [1, 0],
      3: [1, 1],
    }

    let positions_playoffs1 = {
      0: [0, 0],
      1: [0, 1],
    }

    console.log(lastSlice)
    console.log(fechas_playoff)
    fechas_playoff.forEach(d => {
      let filter = lastSlice.filter(e => e.name == d.local)[0]
      let filter1 = lastSlice.filter(e => e.name == d.visitante)[0]
      console.log(filter)
      Object.assign(d, { position_local: filter.position })
      Object.assign(d, { position_visitante: filter1.position })
    })
    console.log(fechas_playoff)


    let yPlayoffs = d3
    .scaleLinear()
    .range([height - margin.bottom + heightBars / 2, margin.top + heightBars / 2])

    console.log((heightBars*30), (heightBars*30)/8, primera_ronda_playoff)

    /* svg
    .append('text')
    .attrs({
      class: 'years',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff) + width_playoffs/2,
      y: margin.top * 0.8,
    })
    .styles({
      'font-size': heightBars * 0.4,
      fill: '#f1f1f1',
      'font-weight': 600,
      'text-anchor': 'middle',
      'alignment-baseline': 'central'
    })
    .text(playoffs_names[primera_ronda_playoff]) */

   /*  svg
    .selectAll('.rect')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
    .enter()
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(i) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 - heightBars/2 - space_height_playoff,
      width: width_playoffs,
      height: heightBars
    })
    .styles({
      fill: (d, i) => d.goles_local > d.goles_visitante ? victoria_color : d.goles_local == d.goles_visitante ? d.penales_local > d.penales_visitante ? victoria_color : derrota_color : derrota_color,
      opacity: (d, i) => 0.8
    })
    
    svg
    .selectAll('.rect')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
    .enter()
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(i) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 - heightBars/2 + space_height_playoff,
      width: width_playoffs,
      height: heightBars
    })
    .styles({
      fill: (d, i) => d.goles_local < d.goles_visitante ? victoria_color : d.goles_local == d.goles_visitante ? d.penales_local < d.penales_visitante ? victoria_color : derrota_color : derrota_color,
      opacity: (d, i) => 0.8
    }) */

    let wks = 0

    /* var points = [0, 1107.50625] */
/* 
    dates.slice(0).forEach((o) => {
      let yearSlice1 = sort_teams(data.filter((d) => d.semana == o && !isNaN(d.value)))

      let rank1 = yearSlice1.find((d) => d.name == nombre).rank

      wks > fechas_not_played ? (wks = wks - not_played_yet_x) : ''
      o == dates[dates.length - 1] && fechas_not_played < dates.length - 1 ? (wks = wks + not_played_yet_x) : ''

      points.push([x(wks), y(rank1)])

      wks++
    }) */

    /* svg
      .selectAll('.path')
      .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
      .enter()
      .append('path')
      .attrs({
        class: 'line'
      })
      .styles({
        opacity: (d, i) => d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local > d.penales_visitante ? 1 : 0 : 0,
        fill: 'none',
        stroke: 'black',
        'stroke-width': heightBars,
        'stroke-linejoin': 'round'
      })
      .attr('d', (d, i) => d3.line().curve(d3.curveCardinal.tension(1))([
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff,
        yPlayoffs.domain([primera_ronda_playoff, 0])(i) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2,
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs,
        yPlayoffs.domain([primera_ronda_playoff, 0])(i) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2,
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff,
        yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[i][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2,
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff + width_playoffs,
        yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[i][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2,
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*2 + width_playoffs,
        yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[i][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2,
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*2 + width_playoffs*2,
        yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[i][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2,
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*3 + width_playoffs*2,
        yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[i][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2,
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*3 + width_playoffs*3,
        yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[i][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2,
    ],
])) */

    if (grupos > 1) {

  let rondas = [1, 2, 4, 8]
  let arr = ['local', 'visitante']
  let arr_w = [5, 3, 1.75, 1]

  rondas.forEach((pp, ppi) => {
      svg
      .append('text')
      .attrs({
        class: 'years',
        x: width - (width_playoffs*(rondas_playoff-(ppi))+space_width_playoff*(rondas_playoff-(ppi))) + width_playoffs/2,
        y: margin.top * 0.8,
      })
      .styles({
        'font-size': heightBars * 0.4,
        fill: '#f1f1f1',
        'font-weight': 600,
        'text-anchor': 'middle',
        'alignment-baseline': 'central'
      })
      .text(playoffs_names[primera_ronda_playoff/pp])
    })

  arr.forEach((dd) => {
    arr_w.forEach((ee, ii) => {

      svg
            .selectAll('.path')
            .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
            .enter()
            .append('path')
            .attrs({
              class: 'line'
            })
            .styles({
              opacity: (d, i) => d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local > d.penales_visitante ? 1 : 1 : 1,
              fill: 'none',
              stroke: d => teamColorss[d[dd].split('-')[0]] == undefined ? 'grey' : teamColorss[d[dd].split('-')[0]][ii],
              'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
              'stroke-linejoin': 'round'
            })
            .attr('d', (d, i) => d3.line().curve(d3.curveCardinal.tension(1))([
          [
              width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff,
              yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_'+dd]][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d['position_'+dd]][1] == 0 ? - space_height_playoff : space_height_playoff),
          ],
          [
              width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs,
              yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_'+dd]][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d['position_'+dd]][1] == 0 ? - space_height_playoff : space_height_playoff),
          ],
        ]))

    svg
      .selectAll('.path')
      .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
      .enter()
      .append('path')
      .attrs({
        class: 'line'
      })
      .styles({
        opacity: (d, i) => dd == 'local' ? d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local > d.penales_visitante ? 1 : 0 : 0 :
        d.goles_local < d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local < d.penales_visitante ? 1 : 0 : 0,
        fill: 'none',
        stroke: d => teamColorss[d[dd].split('-')[0]] == undefined ? 'grey' : teamColorss[d[dd].split('-')[0]][ii],
        'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
        'stroke-linejoin': 'round'
      })
      .attr('d', (d, i) => d3.line().curve(d3.curveCardinal.tension(1))([
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff,
        yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_'+dd]][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d['position_'+dd]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff/3,
        yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_'+dd]][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d['position_'+dd]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff - space_width_playoff/3,
        yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff + width_playoffs,
        yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    ]))

    svg
      .selectAll('.path')
      .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`))
      .enter()
      .append('path')
      .attrs({
        class: 'line'
      })
      .styles({
        opacity: (d, i) => dd == 'local' ? d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local > d.penales_visitante ? 1 : 0 : 0 :
        d.goles_local < d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local < d.penales_visitante ? 1 : 0 : 0,
        fill: 'none',
        stroke: d => teamColorss[d[dd].split('-')[0]] == undefined ? 'grey' : teamColorss[d[dd].split('-')[0]][ii],
        'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
        'stroke-linejoin': 'round'
      })
      .attr('d', (d, i) => d3.line().curve(d3.curveCardinal.tension(1))([
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff,
        yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff + width_playoffs + space_width_playoff/3,
        yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*2 + width_playoffs - space_width_playoff/3,
        yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*2 + width_playoffs*2,
        yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
]))

svg
      .selectAll('.path')
      .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`))
      .enter()
      .append('path')
      .attrs({
        class: 'line'
      })
      .styles({
        opacity: (d, i) => dd == 'local' ? d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local > d.penales_visitante ? 1 : 0 : 0 :
        d.goles_local < d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local < d.penales_visitante ? 1 : 0 : 0,
        fill: 'none',
        stroke: d => teamColorss[d[dd].split('-')[0]] == undefined ? 'grey' : teamColorss[d[dd].split('-')[0]][ii],
        'stroke-width': ((heightBars * 0.35) / 7) * ee * 2,
        'stroke-linejoin': 'round'
      })
      .attr('d', (d, i) => d3.line().curve(d3.curveCardinal.tension(1))([
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*2 + width_playoffs,
        yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*2 + width_playoffs*2 + space_width_playoff/3,
        yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*3 + width_playoffs*2 - space_width_playoff/3,
        yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*3 + width_playoffs*3,
        yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
]))

    })


    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_'+dd]][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d['position_'+dd]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d[dd].split('-')[0])

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_'+dd]][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d['position_'+dd]][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d[dd].split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*1.2 + width_playoffs*0.9,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d['position_'+dd]][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d['position_'+dd]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size*1.5,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d['goles_'+dd] + (d['penales_'+dd] >= 0 ? ' [' + d['penales_'+dd] + ']': ''))

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d[dd].split('-')[0])

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d[dd].split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs + heightBars*1.2 + width_playoffs*0.9,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size*1.5,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d['goles_'+dd] + (d['penales_'+dd] >= 0 ? ' [' + d['penales_'+dd] + ']': ''))

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2 + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d[dd].split('-')[0])

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2 + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d[dd].split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2 + heightBars*1.2 + width_playoffs*0.9,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size*1.5,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d['goles_'+dd] + (d['penales_'+dd] >= 0 ? ' [' + d['penales_'+dd] + ']': ''))

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/8}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*4 + width_playoffs*3 + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d[dd].split('-')[0])

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/8}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*4 + width_playoffs*3 + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d[dd].split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/8}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*4 + width_playoffs*3 + heightBars*1.2 + width_playoffs*0.9,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d['position_'+dd]][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size*1.5,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d['goles_'+dd] + (d['penales_'+dd] >= 0 ? ' [' + d['penales_'+dd] + ']': ''))

  })

   /* lastSlice.forEach(d => {
      d.rankInGroup <= 1 && d.fecha == '' ? d.fecha = 'Fecha 1/8' : ''
    }) */

    if (fechas_playoff.length == 0) {
    svg
    .selectAll('.image')
    .data(lastSlice.filter((d, i) => d.rankInGroup >= 0 && d.rankInGroup <= clasificacion_por_grupo-1 || d.rankInGroup >= equipos_por_grupos && d.rankInGroup <= equipos_por_grupos + clasificacion_por_grupo-1))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.rankInGroup+1 + d.name.split('-')[1]][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.rankInGroup+1 + d.name.split('-')[1]][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d.name.split('-')[0]}.png`
    })
    .styles({
      opacity: 0.7
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.text')
    .data(lastSlice.filter((d, i) => d.rankInGroup >= 0 && d.rankInGroup <= clasificacion_por_grupo-1 || d.rankInGroup >= equipos_por_grupos && d.rankInGroup <= equipos_por_grupos + clasificacion_por_grupo-1))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.rankInGroup+1 + d.name.split('-')[1]][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.rankInGroup+1 + d.name.split('-')[1]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline,
      opacity: 0.7
    })
    .text(d => d.name.split('-')[0])

  }

}
  
    /* svg
      .selectAll('.path')
      .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
      .enter()
      .append('path')
      .attrs({
        class: 'line'
      })
      .styles({
        opacity: (d, i) => d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local > d.penales_visitante ? 1 : 1 : 1,
        fill: 'none',
        stroke: d => teamColorss[d.local.split('-')[0]] == undefined ? 'grey' : teamColorss[d.local.split('-')[0]][0],
        'stroke-width': ((heightBars * 0.35) / 7) * 5,
        'stroke-linejoin': 'round'
      })
      .attr('d', (d, i) => d3.line().curve(d3.curveCardinal.tension(1))([
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff,
        yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.position_local][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.position_local][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs,
        yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.position_local][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.position_local][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
  ])) */

/* svg
      .selectAll('.path')
      .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
      .enter()
      .append('path')
      .attrs({
        class: 'line'
      })
      .styles({
        opacity: (d, i) => d.goles_local < d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local < d.penales_visitante ? 1 : 1 : 1,
        fill: 'none',
        stroke: d => teamColorss[d.visitante.split('-')[0]] == undefined ? 'grey' : teamColorss[d.visitante.split('-')[0]][0],
        'stroke-width': ((heightBars * 0.35) / 7) * 5,
        'stroke-linejoin': 'round'
      })
      .attr('d', (d, i) => d3.line().curve(d3.curveCardinal.tension(1))([
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff,
        yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.position_visitante][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.position_visitante][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs,
        yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.position_visitante][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.position_visitante][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
])) */

/* svg
      .selectAll('.path')
      .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
      .enter()
      .append('path')
      .attrs({
        class: 'line'
      })
      .styles({
        opacity: (d, i) => d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local > d.penales_visitante ? 1 : 0 : 0,
        fill: 'none',
        stroke: d => teamColorss[d.local.split('-')[0]] == undefined ? 'grey' : teamColorss[d.local.split('-')[0]][0],
        'stroke-width': heightBars,
        'stroke-linejoin': 'round'
      })
      .attr('d', (d, i) => d3.line().curve(d3.curveCardinal.tension(1))([
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff,
        yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.position_local][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.position_local][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff/3,
        yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.position_local][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.position_local][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff - space_width_playoff/3,
        yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d.position_local][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d.position_local][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff + width_playoffs,
        yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d.position_local][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d.position_local][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
])) */

/* svg
      .selectAll('.path')
      .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`))
      .enter()
      .append('path')
      .attrs({
        class: 'line'
      })
      .styles({
        opacity: (d, i) => d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local > d.penales_visitante ? 1 : 0 : 0,
        fill: 'none',
        stroke: d => teamColorss[d.local.split('-')[0]] == undefined ? 'grey' : teamColorss[d.local.split('-')[0]][0],
        'stroke-width': heightBars,
        'stroke-linejoin': 'round'
      })
      .attr('d', (d, i) => d3.line().curve(d3.curveCardinal.tension(1))([
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff,
        yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d.position_local][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d.position_local][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff + width_playoffs + space_width_playoff/3,
        yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d.position_local][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d.position_local][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*2 + width_playoffs - space_width_playoff/3,
        yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*2 + width_playoffs*2,
        yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
])) */

/* svg
      .selectAll('.path')
      .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`))
      .enter()
      .append('path')
      .attrs({
        class: 'line'
      })
      .styles({
        opacity: (d, i) => d.goles_local > d.goles_visitante ? 1 : d.goles_local == d.goles_visitante ? d.penales_local > d.penales_visitante ? 1 : 0 : 0,
        fill: 'none',
        stroke: d => teamColorss[d.local.split('-')[0]] == undefined ? 'grey' : teamColorss[d.local.split('-')[0]][0],
        'stroke-width': heightBars,
        'stroke-linejoin': 'round'
      })
      .attr('d', (d, i) => d3.line().curve(d3.curveCardinal.tension(1))([
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*2 + width_playoffs,
        yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*2 + width_playoffs*2 + space_width_playoff/3,
        yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*3 + width_playoffs*2 - space_width_playoff/3,
        yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
    [
        width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs + space_width_playoff*3 + width_playoffs*3,
        yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    ],
])) */

    /* let array14 = fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`)
    let array144 = [...new Set(array14)];
    console.log(array144)
    console.log(lastSlice.filter((d, i) => d.rank >= 0 && d.rank <= 7 || d.rank >= 15 && d.rank <= 22) */

    /* let positions_playoffs = {
      '1A': [0, 0],
      '8B': [0, 1],
      '5A': [1, 1],
      '4B': [1, 0],
      '7A': [2, 1],
      '2B': [2, 0],
      '3A': [3, 0],
      '6B': [3, 1],
      '8A': [4, 1],
      '1B': [4, 0],
      '4A': [5, 0],
      '5B': [5, 1],
      '2A': [6, 0],
      '7B': [6, 1],
      '6A': [7, 1],
      '3B': [7, 0],
    }

    let positions_playoffs4 = {
      0: [0, 0],
      1: [0, 1],
      2: [1, 0],
      3: [1, 1],
      4: [2, 0],
      5: [2, 1],
      6: [3, 0],
      7: [3, 1],
    }

    let positions_playoffs2 = {
      0: [0, 0],
      1: [0, 1],
      2: [1, 0],
      3: [1, 1],
    }

    let positions_playoffs1 = {
      0: [0, 0],
      1: [0, 1],
    } */

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
    }

    let positions_playoffs4 = {
      0: [0, 0],
      1: [0, 1],
      2: [1, 0],
      3: [1, 1],
      4: [2, 0],
      5: [2, 1],
      6: [3, 0],
      7: [3, 1],
    }

    let positions_playoffs2 = {
      0: [0, 0],
      1: [0, 1],
      2: [1, 0],
      3: [1, 1],
    }

    let positions_playoffs1 = {
      0: [0, 0],
      1: [0, 1],
    } */

   /*  console.log(positions_playoffs['1A'][0])
    console.log(positions_playoffs4[positions_playoffs['8B'][0]][1])
    console.log(positions_playoffs4[positions_playoffs['4B'][0]][1])

    console.log(lastSlice) */

   /*  lastSlice.forEach(d => {
      d.rankInGroup <= 1 && d.fecha == '' ? d.fecha = 'Fecha 1/8' : ''
    })

    if (fechas_playoff.length == 0) {
    svg
    .selectAll('.image')
    .data(lastSlice.filter((d, i) => d.rankInGroup >= 0 && d.rankInGroup <= clasificacion_por_grupo-1 || d.rankInGroup >= equipos_por_grupos && d.rankInGroup <= equipos_por_grupos + clasificacion_por_grupo-1))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.rankInGroup+1 + d.name.split('-')[1]][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.rankInGroup+1 + d.name.split('-')[1]][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d.name.split('-')[0]}.png`
    })
    .styles({
      opacity: 0.7
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.text')
    .data(lastSlice.filter((d, i) => d.rankInGroup >= 0 && d.rankInGroup <= clasificacion_por_grupo-1 || d.rankInGroup >= equipos_por_grupos && d.rankInGroup <= equipos_por_grupos + clasificacion_por_grupo-1))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.rankInGroup+1 + d.name.split('-')[1]][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.rankInGroup+1 + d.name.split('-')[1]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline,
      opacity: 0.7
    })
    .text(d => d.name.split('-')[0])

  } */
   
    /* svg
    .selectAll('.text')
    .data(lastSlice.filter((d, i) => d.rank >= 0 && d.rank <= clasificacion_por_grupo-1 || d.rank >= equipos_por_grupos && d.rank <= equipos_por_grupos + clasificacion_por_grupo-1).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(i) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 - space_height_playoff,
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.rank+1 + d.name.split('-')[1])

    svg
    .selectAll('.text')
    .data(lastSlice.filter((d, i) => d.rank >= 0 && d.rank <= clasificacion_por_grupo-1 || d.rank >= equipos_por_grupos && d.rank <= equipos_por_grupos + clasificacion_por_grupo-1).slice(primera_ronda_playoff, primera_ronda_playoff*2).reverse())
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(i) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + space_height_playoff,
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.rank+1 - equipos_por_grupos + d.name.split('-')[1])
 */


    /* svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.position_local][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.position_local][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.local.split('-')[0])

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.position_visitante][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.position_visitante][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.visitante.split('-')[0])

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.position_local][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.position_local][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d.local.split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.position_visitante][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.position_visitante][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d.visitante.split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*1.2 + width_playoffs*0.9,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.position_local][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.position_local][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size*1.5,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.goles_local + (d.penales_local >= 0 ? ' [' + d.penales_local + ']': ''))

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + heightBars*1.2 + width_playoffs*0.9,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(positions_playoffs[d.position_visitante][0]) + ((top_n*heightBars)/primera_ronda_playoff)/2 - heightBars/2 + (positions_playoffs[d.position_visitante][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size*1.5,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.goles_visitante + (d.penales_visitante >= 0 ? ' [' + d.penales_visitante + ']': '')) */

    /* svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs*0.25 - defaults.logo.size / 2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(i) + heightBars*Math.trunc(top_n/(primera_ronda_playoff*2)) - defaults.logo.size / 2,
      height: defaults.logo.size,
      href: d => `./escudos/${d.name.split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs*0.75 - defaults.logo.size / 2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(i) + heightBars*Math.trunc(top_n/(primera_ronda_playoff*2)) - defaults.logo.size / 2,
      height: defaults.logo.size,
      href: d => `./escudos/${d.vs.split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs*0.40,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(i) + heightBars*Math.trunc(top_n/(primera_ronda_playoff*2)),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.goles_fecha)

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff + width_playoffs*0.60,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff, 0])(i) + heightBars*Math.trunc(top_n/(primera_ronda_playoff*2)),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': 'end',
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.goles_en_contra_fecha) */

    /* svg
    .append('text')
    .attrs({
      class: 'years',
      x: width - (width_playoffs*(rondas_playoff-1)+space_width_playoff*(rondas_playoff-1)) + width_playoffs/2,
      y: margin.top * 0.8,
    })
    .styles({
      'font-size': heightBars * 0.4,
      fill: '#f1f1f1',
      'font-weight': 600,
      'text-anchor': 'middle',
      'alignment-baseline': 'central'
    })
    .text(playoffs_names[primera_ronda_playoff/2]) */

    /* svg
    .selectAll('.rect')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(i) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 - heightBars/2 - space_height_playoff,
      width: width_playoffs,
      height: heightBars
    })
    .styles({
      fill: (d, i) => d.goles_local > d.goles_visitante ? victoria_color : d.goles_local == d.goles_visitante ? d.penales_local > d.penales_visitante ? victoria_color : derrota_color : derrota_color,
      opacity: (d, i) => 0.8
    })

    svg
    .selectAll('.rect')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(i) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 - heightBars/2 + space_height_playoff,
      width: width_playoffs,
      height: heightBars
    })
    .styles({
      fill: (d, i) => d.goles_local < d.goles_visitante ? victoria_color : d.goles_local == d.goles_visitante ? d.penales_local < d.penales_visitante ? victoria_color : derrota_color : derrota_color,
      opacity: (d, i) => 0.8
    }) */

    /* svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d.position_local][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d.position_local][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.local.split('-')[0])

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d.position_visitante][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.visitante.split('-')[0])

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d.position_local][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d.position_local][0]][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d.local.split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d.position_visitante][0]][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d.visitante.split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs + heightBars*1.2 + width_playoffs*0.9,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d.position_local][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d.position_local][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size*1.5,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.goles_local + (d.penales_local >= 0 ? ' [' + d.penales_local + ']': ''))

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs + heightBars*1.2 + width_playoffs*0.9,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]) + ((top_n*heightBars)/primera_ronda_playoff) - heightBars/2 + (positions_playoffs4[positions_playoffs[d.position_visitante][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size*1.5,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.goles_visitante + (d.penales_visitante >= 0 ? ' [' + d.penales_visitante + ']': '')) */

    /* svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff/2))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(i) - heightBars/2 + heightBars*Math.trunc(top_n/(primera_ronda_playoff/2*2)) - space_height_playoff,
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.name.split('-')[0])

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/2}`).slice(0, primera_ronda_playoff/2))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*2 + width_playoffs,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/2, 0])(i) - heightBars/2 + heightBars*Math.trunc(top_n/(primera_ronda_playoff/2*2)) + space_height_playoff,
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.vs.split('-')[0]) */

   /*  svg
    .append('text')
    .attrs({
      class: 'years',
      x: width - (width_playoffs*(rondas_playoff-2)+space_width_playoff*(rondas_playoff-2)) + width_playoffs/2,
      y: margin.top * 0.8,
    })
    .styles({
      'font-size': heightBars * 0.4,
      fill: '#f1f1f1',
      'font-weight': 600,
      'text-anchor': 'middle',
      'alignment-baseline': 'central'
    })
    .text(playoffs_names[primera_ronda_playoff/4]) */

    /* svg
    .selectAll('.rect')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(i) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 - heightBars/2 - space_height_playoff,
      width: width_playoffs,
      height: heightBars
    })
    .styles({
      fill: (d, i) => d.goles_local > d.goles_visitante ? victoria_color : d.goles_local == d.goles_visitante ? d.penales_local > d.penales_visitante ? victoria_color : derrota_color : derrota_color,
      opacity: (d, i) => 0.8
    })

    svg
    .selectAll('.rect')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(i) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 - heightBars/2 + space_height_playoff,
      width: width_playoffs,
      height: heightBars
    })
    .styles({
      fill: (d, i) => d.goles_local < d.goles_visitante ? victoria_color : d.goles_local == d.goles_visitante ? d.penales_local < d.penales_visitante ? victoria_color : derrota_color : derrota_color,
      opacity: (d, i) => 0.8
    }) */

    /* svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2 + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.local.split('-')[0])

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2 + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.visitante.split('-')[0])

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2 + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d.local.split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2 + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d.visitante.split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2 + heightBars*1.2 + width_playoffs*0.9,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size*1.5,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.goles_local + (d.penales_local >= 0 ? ' [' + d.penales_local + ']': ''))

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2 + heightBars*1.2 + width_playoffs*0.9,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/2)) - heightBars/2 + (positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size*1.5,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.goles_visitante + (d.penales_visitante >= 0 ? ' [' + d.penales_visitante + ']': '')) */

    /* svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff/4))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(i) - heightBars/2 + heightBars*Math.trunc(top_n/(primera_ronda_playoff/4*2)) - space_height_playoff,
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.name.split('-')[0])

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff/4))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*3 + width_playoffs*2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(i) - heightBars/2 + heightBars*Math.trunc(top_n/(primera_ronda_playoff/4*2)) + space_height_playoff,
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.vs.split('-')[0]) */ 

    /* svg
    .append('text')
    .attrs({
      class: 'years',
      x: width - (width_playoffs*(rondas_playoff-3)+space_width_playoff*(rondas_playoff-3)) + width_playoffs/2,
      y: margin.top * 0.8,
    })
    .styles({
      'font-size': heightBars * 0.4,
      fill: '#f1f1f1',
      'font-weight': 600,
      'text-anchor': 'middle',
      'alignment-baseline': 'central'
    })
    .text(playoffs_names[primera_ronda_playoff/8]) */

    /* svg
    .selectAll('.rect')
    .data(yearSlice.slice(0, primera_ronda_playoff/8))
    .enter()
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*4 + width_playoffs*3,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/8, 0])(i) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 - heightBars/2 - space_height_playoff,
      width: width_playoffs,
      height: heightBars
    })
    .styles({
      fill: (d, i) => '#919191',
      opacity: (d, i) => 0.8
    })

    svg
    .selectAll('.rect')
    .data(yearSlice.slice(0, primera_ronda_playoff/8))
    .enter()
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*4 + width_playoffs*3,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/8, 0])(i) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 - heightBars/2 + space_height_playoff,
      width: width_playoffs,
      height: heightBars
    })
    .styles({
      fill: (d, i) => '#919191',
      opacity: (d, i) => 0.8
    }) */

    /* svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/8}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*4 + width_playoffs*3 + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.local.split('-')[0])

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/8}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*4 + width_playoffs*3 + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.visitante.split('-')[0])

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/8}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*4 + width_playoffs*3 + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d.local.split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/8}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*4 + width_playoffs*3 + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff) - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => `./escudos/${d.visitante.split('-')[0]}.png`
    })
    .style('filter', 'url(#dropshadow)')

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/8}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*4 + width_playoffs*3 + heightBars*1.2 + width_playoffs*0.9,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_local][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size*1.5,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.goles_local + (d.penales_local >= 0 ? ' [' + d.penales_local + ']': ''))

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/8}`).slice(0, primera_ronda_playoff))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*4 + width_playoffs*3 + heightBars*1.2 + width_playoffs*0.9,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/8, 0])(positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]][0]][0]) + ((top_n*heightBars)/(primera_ronda_playoff/4)) - heightBars/2 + (positions_playoffs1[positions_playoffs2[positions_playoffs4[positions_playoffs[d.position_visitante][0]][0]][0]][1] == 0 ? - space_height_playoff : space_height_playoff),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size*1.5,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.goles_visitante + (d.penales_visitante >= 0 ? ' [' + d.penales_visitante + ']': '')) */

    /* svg
    .selectAll('.rect')
    .data(yearSlice.slice(0, 1))
    .enter()
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: width - width_playoffs - space_width_playoff,
      y: (d, i) => yPlayoffs.domain([1, 0])(i) + ((top_n*heightBars)/(2)) - heightBars/2 - heightBars/2,
      width: width_playoffs,
      height: heightBars
    })
    .styles({
      fill: (d, i) => '#919191',
      opacity: (d, i) => 0.8
    })

    svg
    .selectAll('.text')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/1`))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - width_playoffs - space_width_playoff + heightBars*1.2,
      y: (d, i) => yPlayoffs.domain([1, 0])(i) + ((top_n*heightBars)/(2)) - heightBars/2,
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => {
      if (d.goles_local > d.goles_visitante) {
        return d.local.split('-')[0]
      } else if (d.goles_local < d.goles_visitante) {
        return d.visitante.split('-')[0]
      } else if (d.goles_local == d.goles_visitante) {
        if (d.penales_local > d.penales_visitante) {
          return d.local.split('-')[0]
        } else {
          return d.visitante.split('-')[0]
        }
      }
    })

    svg
    .selectAll('.image')
    .data(fechas_playoff.filter(d => d.fecha == `Fecha 1/1`))
    .enter()
    .append('image')
    .attrs({
      class: 'playoffs_names',
      x: width - width_playoffs - space_width_playoff + heightBars*0.5 - defaults.logo.size/2,
      y: (d, i) => yPlayoffs.domain([1, 0])(i) + ((top_n*heightBars)/(2)) - heightBars/2 - defaults.logo.size/2,
      height: defaults.logo.size,
      href: d => {
        if (d.goles_local > d.goles_visitante) {
          return `./escudos/${d.local.split('-')[0]}.png`
        } else if (d.goles_local < d.goles_visitante) {
          return `./escudos/${d.visitante.split('-')[0]}.png`
        } else if (d.goles_local == d.goles_visitante) {
          if (d.penales_local > d.penales_visitante) {
            return `./escudos/${d.local.split('-')[0]}.png`
          } else {
            return `./escudos/${d.visitante.split('-')[0]}.png`
          }
        }
      }
    })
    .style('filter', 'url(#dropshadow)')
 */
    /* svg
    .selectAll('.text')
    .data(data.filter(d => d.fecha == `Fecha 1/${primera_ronda_playoff/4}`).slice(0, primera_ronda_playoff/4))
    .enter()
    .append('text')
    .attrs({
      class: 'playoffs_names',
      x: width - (width_playoffs*rondas_playoff+space_width_playoff*rondas_playoff+space_width_playoff) + space_width_playoff*4 + width_playoffs*3,
      y: (d, i) => yPlayoffs.domain([primera_ronda_playoff/4, 0])(i) - heightBars/2 + heightBars*Math.trunc(top_n/(primera_ronda_playoff/4*2)),
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text(d => d.name.split('-')[0]) */

    /* svg
    .selectAll('.rect')
    .data(yearSlice.slice(0, top_n))
    .enter()
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: 0,
      y: (d, i) => y(d.rank) - heightBars / 2,
      width: margin_left,
      height: heightBars
    })
    .styles({
      fill: (d, i) => (i <= 7 || i >= 15 && i <= 22 ? i % 2 == 1 ? '#90EE90' : '#5da15d' : 'none'),
      opacity: (d, i) => 0.8
    }) */

    /* svg
    .selectAll('.rect')
    .data(yearSlice.slice(0, top_n))
    .enter()
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: 0,
      y: (d, i) => y(15) - heightBars / 2,
      width: width-margin_right,
      height: 1
    })
    .styles({
      fill: black_color,
      opacity: (d, i) => 0.6
    }) */

  let fechasNotPlayed = (i) => {
    let a = () => {
      if (i > fechas_not_played) {
        return x(i - not_played_yet_x * i)
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
      if (i > fechas_not_played && i == dates.length - 1) {
        return x(fechas_not_played) - x(fechas_not_played - not_played_yet_x)
      } else {
        return 0
      }
    }

    return a() + b() + c()
  }

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
      'clip-path': `url(#ellipse-clip-margin-left)`
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: '#b5b5b5',
      'font-weight': 600,
      'text-anchor': 'middle',
      'alignment-baseline': 'central'
    })
    .text((semana) => {
      let filterr = data.filter((d) => d.semana == semana && d.vs != 'none')
      let min_day = d3.min(filterr, (d) => d.year)
      return filterr.find((d) => d.year == min_day).dia_large.split(' ')[0] + " " + min_day.slice(2,4)
    })

  svg
    .selectAll('.text')
    .data(dates.slice(0, -1))
    .enter()
    .append('text')
    .attrs({
      class: 'years',
      x: (d, i) => fechasNotPlayed(i) /* - heightBars * 0.3 */ - (d < 10 ? heightBars * 0.05 : 0) - (d == dates[dates.length - 1] ? 'Final' : d == dates[0] ? d : data.filter((e) => e.semana == d && e.vs != 'none')[0].fecha2.split(' ')[1].replace('Def.', '').replace('Post.', d)).toString().replace('.', '').length * heightBars*0.175,
      y: margin.top * 0.8,
      transform: `translate(${margin_left * 2}, 0)`,
      'clip-path': `url(#ellipse-clip-margin-left)`
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: '#b5b5b5',
      'font-weight': 600,
      'text-anchor': 'end',
      'alignment-baseline': 'central'
    })
    .text((semana) => {
      let filterr = data.filter((d) => d.semana == semana && d.vs != 'none' && d.goles_fecha !== not_played_yet)
      return filterr.length > 0 ? filterr.length / 2 : ''
    })

  svg
    .selectAll('.text')
    .data(dates.slice(0, -1))
    .enter()
    .append('text')
    .attrs({
      class: 'years',
      x: (d, i) => fechasNotPlayed(i) /* + heightBars * 0.3 */ + (d < 10 ? heightBars * 0.05 : 0) + (d == dates[dates.length - 1] ? 'Final' : d == dates[0] ? d : data.filter((e) => e.semana == d && e.vs != 'none')[0].fecha2.split(' ')[1].replace('Def.', '').replace('Post.', d)).toString().replace('.', '').length * heightBars*0.175,
      y: margin.top * 0.8,
      transform: `translate(${margin_left * 2}, 0)`,
      'clip-path': `url(#ellipse-clip-margin-left)`
    })
    .styles({
      'font-size': heightBars * 0.25,
      fill: '#b5b5b5',
      'font-weight': 600,
      'text-anchor': 'start',
      'alignment-baseline': 'central'
    })
    .text((semana) => {
      let filterr = data.filter((d) => d.semana == semana && d.vs != 'none' && d.goles_fecha !== not_played_yet)
      return filterr.length > 0 ? ('(' + d3.format(',.1f')(d3.sum(filterr, (d) => d.goles_fecha) / (filterr.length / 2)) + ')').replace('.', ',') : ''
    })

    console.log(dates)

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
      'clip-path': `url(#ellipse-clip-margin-left)`
    })
    .styles({
      'font-size': heightBars * 0.4,
      fill: '#f1f1f1',
      'font-weight': 600,
      'text-anchor': 'middle',
      'alignment-baseline': 'central'
    })
    .text((d) => (d == dates[dates.length - 1] ? 'Final' : d == dates[0] ? d : data.filter((e) => e.semana == d && e.vs != 'none')[0].fecha2.split(' ')[1].replace('Def.', '').replace('Post.', d)))

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
      'clip-path': `url(#ellipse-clip-margin-left)`
    })
    .styles({
      fill: black_color,
      opacity: 0.4
    })

  svg
    .append('clipPath')
    .attr('id', `ellipse-clip-line`)
    .append('rect')
    .attrs({
      class: 'ellipse_clip_line',
      x: -margin_left,
      y: 0,
      width: 0,
      height: y(top_n - 1) + heightBars / 2
    })

  /* let teamColorss = {
    Argentina: ['#fff', '#9fcdef', '#9fcdef', '#fff'],
    Brasil: ['#ffd100', '#ffd100', '#ffd100', '#009c54'],
    Colombia: ['#ffcc00', '#ffcc00', '#ffcc00', '#ffcc00'],
    Ecuador: ['#001f5b', '#ffce00', '#ffce00', '#001f5b'],
    Uruguay: ['#7fa0d2', '#7fa0d2', '#7fa0d2', '#7fa0d2'],
    Paraguay: ['#e20815', '#fff', '#fff', '#e20815'],
    Bolivia: ['#006200', '#006200', '#006200', '#006200'],
    Venezuela: ['#510e26', '#510e26', '#510e26', '#510e26'],
    Chile: ['#db0e15', '#db0e15', '#db0e15', '#db0e15'],
    Peru: ['#fff', '#fff', '#da061b', '#da061b'],
    'Boca Juniors': ['#005EAE', '#005EAE', '#FFD900', '#FFD900'],
    'River Plate': ['#fff', '#fff', '#E2211C', '#E2211C'],
    'Temperley': ['#fff', '#fff', '#21bbef', '#21bbef'],
    Quilmes: ['#fff', '#fff', '#123567', '#123567'],
    Riestra: ['#fff', '#fff', '#000', '#000'],
    'All Boys': ['#fff', '#fff', '#000', '#000'],
    'Independiente Rivadavia': ['#381972', '#381972', '#fff', '#fff'],
    'San Lorenzo': ['#EC212D', '#EC212D', '#273B56', '#273B56'],
    Banfield: ['#219D3F', '#fff', '#fff', '#219D3F'],
    Independiente: ['#bf0811', '#bf0811', '#fff', '#fff'],
    Ferro: ['#156538', '#156538', '#fff', '#fff'],
    'Deportivo Mandiyú': ['#fff', '#fff', '#14a943', '#14a943'],
    Lanús: ['#62162C', '#62162C', '#fff', '#fff'],
    Racing: ['#00AFE9', '#fff', '#fff', '#00AFE9'],
    'Gimnasia (S)': ['#fff', '#29b0e3', '#29b0e3', '#fff'],
    'Atlético Rafaela': ['#fff', '#0084c9', '#0084c9', '#fff'],
    'Godoy Cruz': ['#0071D5', '#0071D5', '#Fff', '#fff'],
    Colón: ['#D6161C', '#D6161C', '#000', '#000'],
    Huracán: ['#fff', '#fff', 'red', '#fff'],
    'Barracas Central': ['#fff', 'red', 'red', '#fff'],
    'San Martín (T)': ['red', '#fff', '#fff', 'red'],
    'Rosario Central': ['#FFCB05', '#004070', '#004070', '#FFCB05'],
    Arsenal: ['#12ACDE', '#12ACDE', '#DB2E26', '#DB2E26'],
    "Newell's Old Boys": ['#000', '#E81F1F', '#E81F1F', '#E81F1F'],
    Tigre: ['#2A247A', '#2A247A', '#BF1D26', '#BF1D26'],
    Gimnasia: ['#fff', '#fff', '#11195C', '#11195C'],
    'Vélez Sarsfield': ['#fff', '#fff', '#0469c8', '#0469c8'],
    'Argentinos Juniors': ['#FB0306', '#FB0306', '#FB0306', '#fff'],
    Estudiantes: ['#FB0306', '#fff', '#fff', '#FB0306'],
    'Los Andes': ['#fff', '#FB0306', '#FB0306', '#fff'],
    'Nueva Chicago': ['#000', '#116d3d', '#116d3d', '#000'],
    'San Martín (SJ)': ['#000', '#40ab35', '#40ab35', '#000'],
    'Huracán (C)': ['#281371', '#de341a', '#de341a', '#281371'],
    'Chacarita Juniors': ['#000', '#fd1000', '#fd1000', '#000'],
    'Almagro': ['#000', '#6a8ac6', '#6a8ac6', '#000'],
    Olimpo: ['#000', '#ffe700', '#ffe700', '#000'],
    Unión: ['#FB0306', '#fff', '#fff', '#fff'],
    'Deportivo Español': ['#fff', '#dc0c15', '#dc0c15', '#dc0c15'],
    'Tiro Federal': ['#207caa', '#fff', '#fff', '#fff'],
    Sarmiento: ['#008447', '#008447', '#fff', '#fff'],
    Platense: ['#fff', '#fff', '#804b19', '#804b19'],
    Talleres: ['#000c66', '#000c66', '#Fff', '#fff'],
    'Defensa y Justicia': ['#007329', '#007329', '#FFDE00', 'FFDE00'],
    Patronato: ['#1A1310', '#1A1310', '#DB2420', '#DB2420'],
    'Atlético Tucumán': ['#fff', '#62BDF1', '#62BDF1', '#fff'],
    'Central Córdoba': ['#000', '#fff', '#fff', '#000'],
    Aldosivi: ['#00903B', '#00903B', '#FCCB00', '#FCCB00'],
    Belgrano: ['#109fd5', '#109fd5', '#000', '#000'],
    Instituto: ['#fff', '#e31428', '#e31428', '#e31428'],
    'Gimnasia (J)': ['#fff', '#fff', '#20A1E2', '#20A1E2']
  } */

  var defs = svg.append('defs')

  var filter = defs.append('filter').attr('id', 'dropshadow')

  filter.append('feGaussianBlur').attr('in', 'SourceAlpha').attr('stdDeviation', 2).attr('result', 'blur')
  filter.append('feOffset').attr('in', 'blur').attr('dx', 2).attr('dy', 2).attr('result', 'offsetBlur')
  filter.append('feFlood').attr('in', 'offsetBlur').attr('flood-color', '#000').attr('flood-opacity', 1).attr('result', 'offsetColor')
  filter.append('feComposite').attr('in', 'offsetColor').attr('in2', 'offsetBlur').attr('operator', 'in').attr('result', 'offsetBlur')

  var feMerge = filter.append('feMerge')

  feMerge.append('feMergeNode').attr('in', 'offsetBlur')
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

  names.forEach((nombre) => {
    let wks = 0

    var points = []

    dates.slice(0).forEach((o) => {
      let yearSlice1 = sort_teams(data.filter((d) => d.semana == o && !isNaN(d.value)))

      let rank1 = yearSlice1.find((d) => d.name == nombre).rank

      wks > fechas_not_played ? (wks = wks - not_played_yet_x) : ''
      o == dates[dates.length - 1] && fechas_not_played < dates.length - 1 ? (wks = wks + not_played_yet_x) : ''

      points.push([x(wks), y(rank1)])

      wks++
    })

    svg
      .append('path')
      /* .style('filter', 'url(#dropshadow)') */
      .attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: 'line'
      })
      .styles({
        fill: 'none',
        stroke: teamColorss[nombre.split('-')[0]] == undefined ? 'grey' : teamColorss[nombre.split('-')[0]][0],
        'stroke-width': ((heightBars * 0.35) / 7) * 5,
        'stroke-linejoin': 'round'
      })
      .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points))

    svg
      .append('path')
      .attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: 'line'
      })
      .styles({
        fill: 'none',
        stroke: teamColorss[nombre.split('-')[0]] == undefined ? 'grey' : teamColorss[nombre.split('-')[0]][1],
        'stroke-width': ((heightBars * 0.35) / 7) * 3,
        'stroke-linejoin': 'round'
      })
      .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points))

    svg
      .append('path')
      .attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: 'line'
      })
      .styles({
        fill: 'none',
        stroke: teamColorss[nombre.split('-')[0]] == undefined ? 'grey' : teamColorss[nombre.split('-')[0]][2],
        'stroke-width': ((heightBars * 0.35) / 7) * 1.75,
        'stroke-linejoin': 'round'
      })
      .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points))

    svg
      .append('path')
      .attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: 'line'
      })
      .styles({
        fill: 'none',
        stroke: teamColorss[nombre.split('-')[0]] == undefined ? 'grey' : teamColorss[nombre.split('-')[0]][3],
        'stroke-width': (heightBars * 0.35) / 7,
        'stroke-linejoin': 'round'
      })
      .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points))
  })

  names.forEach((nombre) => {
    let wks = 0

    dates.slice(0).forEach((o, i) => {
      let yearSlice1 = sort_teams(data.filter((d) => d.semana == o && !isNaN(d.value)))

      let campeon1 = 0

      yearSlice1.forEach((d) => {
        d.puntos_del_primero = yearSlice1[0].value + yearSlice1[0].value1
        d.puntos_de_diferencia_con_el_primero = d.puntos_del_primero - (d.value + d.value1)
        d.partidos_totales = dates.length - 1
        d.partidos_en_juego = d.partidos_jugados +d.partidos_jugados1
        d.puntos_en_juego = (d.partidos_totales - d.partidos_en_juego) * puntos_por_partido
        d.puntos_de_margen_de_error = d.puntos_en_juego - d.puntos_de_diferencia_con_el_primero
        d.campeonato_perdido_matematicamente = d.puntos_de_margen_de_error < 0 ? 1 : 2
      })

      yearSlice1.slice(1).forEach((d) => {
        campeon1 += d.campeonato_perdido_matematicamente
      })

      campeon1 = campeon1 / (clubes.size - 1)

      campeon1 === 1 ? campeon2++ : (campeon2 = 0)

      yearSlice1.forEach((d, i) => {
        i == 0 && campeon1 == 1 && campeon2 == 1 ? (d.campeonato_ganado_matematicamente = 1) : (d.campeonato_ganado_matematicamente = 0)
      })

      yearSlice1.forEach((d, i) => {
        i == 0 && campeon1 == 1 ? (d.campeonato_ganado_matematicamente1 = 1) : (d.campeonato_ganado_matematicamente1 = 0)
      })

      let rank1 = yearSlice1.find((d) => d.name == nombre).rank

      wks > fechas_not_played ? (wks = wks - not_played_yet_x) : ''
      o == dates[dates.length - 1] && fechas_not_played < dates.length - 1 ? (wks = wks + not_played_yet_x) : ''

      if (yearSlice1.find((d) => d.name == nombre).vs != 'none') {
        let pts1 = yearSlice1.find((d) => d.name == nombre)

        let names_filter = data.filter((d) => d.name == pts1.name && d.fecha4 == pts1.fecha4)

        names_filter.forEach((team, i) => {
          let hor =
            names_filter.length == 2
              ? i == 0
                ? heightBars * 0.0
                : i == 1
                ? -heightBars * 0.3
                : 0
              : names_filter.length == 3
              ? i == 0
                ? heightBars * 0.38
                : i == 2
                ? -heightBars * 0.38
                : 0
              : 0

          let hor_not_played_yet =
            team.goles_fecha == not_played_yet
              ? names_filter.length == 2
                ? i == 0
                  ? heightBars * 0.18
                  : i == 1
                  ? -heightBars * 0.2
                  : 0
                : names_filter.length == 3
                ? i == 0
                  ? heightBars * 0.0
                  : i == 2
                  ? -heightBars * 0.0
                  : 0
                : 0
              : 0

          svg
            .append('text')
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              x: x(wks) + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor,
              y: y(rank1) - heightBars * 0.325
            })
            .styles({
              fill:
                team.goles_fecha > team.goles_en_contra_fecha ? victoria_color : team.goles_fecha < team.goles_en_contra_fecha ? derrota_color : empate_color,
              'font-weight': 600,
              'font-size': defaults.value.style.font_size,
              'text-anchor': 'middle',
              'alignment-baseline': 'central'
            })

            .call((text) =>
              text
                .append('tspan')
                .attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  x: x(wks) - heightBars * 0.06 + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor,
                  y: y(rank1) - heightBars * 0.325 + (team.l_or_v == 'V' ? heightBars * 0.65 : 0)
                })
                .styles({
                  fill:
                    team.goles_fecha > team.goles_en_contra_fecha
                      ? victoria_color
                      : team.goles_fecha < team.goles_en_contra_fecha
                      ? derrota_color
                      : empate_color,
                  'font-weight': 600,
                  'font-size': defaults.value.style.font_size,
                  'text-anchor': 'end',
                  'alignment-baseline': 'central'
                })
                .text(
                  `${
                    team.l_or_v == 'V'
                      ? team.goles_en_contra_fecha == not_played_yet
                        ? ''
                        : team.goles_en_contra_fecha
                      : team.goles_fecha == not_played_yet
                      ? ''
                      : team.goles_fecha
                  }`
                )
                .text(`${team.goles_en_contra_fecha == not_played_yet ? '' : team.goles_fecha}`)
            )

            .call((text) =>
              text
                .append('tspan')
                .attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  x: x(wks) + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor + hor_not_played_yet,
                  y: y(rank1) - heightBars * 0.325 + (team.l_or_v == 'V' ? heightBars * 0.65 : 0)
                })
                .styles({
                  fill:
                    team.goles_fecha > team.goles_en_contra_fecha
                      ? victoria_color
                      : team.goles_fecha < team.goles_en_contra_fecha
                      ? derrota_color
                      : team.goles_fecha == not_played_yet
                      ? grey_color
                      : empate_color,
                  'font-weight': 600,
                  'font-size': defaults.value.style.font_size,
                  'text-anchor': 'middle',
                  'alignment-baseline': 'central'
                })
                .text(`-`)
            )

            .call((text) =>
              text
                .append('tspan')
                .attrs({
                  transform: `translate(${margin_left * 2}, 0)`,
                  x: x(wks) + heightBars * 0.06 + i * heightBars * 1.3 - (names_filter.length - 1) * (heightBars * 0.65) + hor,
                  y: y(rank1) - heightBars * 0.325 + (team.l_or_v == 'V' ? heightBars * 0.65 : 0)
                })
                .styles({
                  fill:
                    team.goles_fecha > team.goles_en_contra_fecha
                      ? victoria_color
                      : team.goles_fecha < team.goles_en_contra_fecha
                      ? derrota_color
                      : empate_color,
                  'font-weight': 600,
                  'font-size': defaults.value.style.font_size,
                  'text-anchor': 'start',
                  'alignment-baseline': 'central'
                })
                .text(`${team.goles_fecha == not_played_yet ? '' : team.goles_en_contra_fecha}`)
            )
            .call(halo1, defaults.value.style.font_size, '#f1f1f1')

          svg
            .append('image')
            .style('filter', 'url(#dropshadow)')
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: 'line',
              x:
                x(wks) +
                heightBars * 0.2 +
                (team.goles_fecha == not_played_yet ? -heightBars * 0.2 : 0) +
                i * heightBars * 1.3 -
                (names_filter.length - 1) * (heightBars * 0.65) +
                hor +
                hor_not_played_yet,
              y: y(rank1) - heightBars * 0.325 - defaults.mini_logo.size1 / 2 + (team.l_or_v == 'V' ? heightBars * 0.65 : 0),
              height: defaults.mini_logo.size1,
              href: pts1.vs != 'none' ? `./escudos/${team.vs.split('-')[0]}.png` : ''
            })

          svg
            .append('text')
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              x: x(wks) - heightBars * 0.0 + i * heightBars * 0.8 - (names_filter.length - 1) * (heightBars * 0.4),
              y: y(rank1)
            })
            .styles({
              fill:
                team.campeonato_perdido_matematicamente == 1 || names_filter[names_filter.length - 1].campeonato_perdido_matematicamente == 1
                  ? derrota_color
                  : team.campeonato_ganado_matematicamente1 == 1 || names_filter[names_filter.length - 1].campeonato_ganado_matematicamente1 == 1
                  ? victoria_color
                  : black_color,
              'font-weight': 600,
              'font-size': heightBars * 0.225,
              'text-anchor': 'middle',
              'alignment-baseline': 'central'
            })
            .text(`${team.goles_fecha == not_played_yet ? '' : team.value}`)
            .call(halo1, heightBars * 0.225, '#f1f1f1')

          svg.append('image').attrs({
            transform: `translate(${margin_left * 2}, 0)`,
            class: 'line',
            x:
              x(wks) -
              heightBars * 0.025 +
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
              (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 +
              i * heightBars * 0.55 -
              (names_filter.length - 1) * (heightBars * 0.325),
            y:
              y(rank1) +
              (team.l_or_v == 'V' ? -heightBars * 0.31 : +heightBars * 0.31) -
              (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
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
                : 0) +
              defaults.subValue.style.font_size * 0.35,
            href:
              team.goles_fecha !== not_played_yet
                ? team.racha1 > 2
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
                  : ''
                : ''
          })

          svg
            .append('text')
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              class: 'line',
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
                  : 0) +
                i * heightBars * 0.55 -
                (names_filter.length - 1) * (heightBars * 0.325),
              y: y(rank1) + (team.l_or_v == 'V' ? -heightBars * 0.31 : +heightBars * 0.31)
            })
            .styles({
              'font-weight': 600,
              'font-size': defaults.subValue.style.font_size,
              fill: team.racha1 > 2 ? black_color : team.racha_derrotas1 > 2 ? black_color : team.racha_empates1 > 2 ? black_color : black_color,
              'text-anchor': 'end',
              'alignment-baseline': 'central'
            })
            .text(
              team.goles_fecha !== not_played_yet
                ? team.racha1 > 2
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
                  : ''
                : ''
            )
            .call(halo1, defaults.subValue.style.font_size, '#f1f1f1')

          svg.append('image').attrs({
            transform: `translate(${margin_left * 2}, 0)`,
            class: 'line',
            x:
              x(wks) +
              defaults.value.style.font_size -
              (defaults.mini_logo.size * 0.45) / 2 +
              i * heightBars * 0.8 -
              (names_filter.length - 1) * (heightBars * 0.4),
            y: y(rank1) - (defaults.mini_logo.size * 0.45) / 2,
            height: defaults.mini_logo.size * 0.45,
            href: team.pts_deducted > 0 ? `./icons/redasterisk1.png` : ''
          })

          svg
            .append('text')
            .attrs({
              transform: `translate(${margin_left * 2}, 0)`,
              x: x(wks) + heightBars * 0.45 + i * heightBars * 0.8 - (names_filter.length - 1) * (heightBars * 0.4),
              y: y(rank1)
            })
            .styles({
              fill: derrota_color,
              'font-weight': 600,
              'font-size': heightBars * 0.18,
              'text-anchor': 'start',
              'alignment-baseline': 'central'
            })
            .text(`${team.pts_deducted > 0 ? team.pts_deducted : ''} `)
            .call(halo1, heightBars * 0.18, '#f1f1f1')
        })

        svg.append('image').style('filter', 'url(#dropshadow)').attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: 'line',
          x:
            x(wks) +
            heightBars * 0.8 -
            defaults.mini_logo.size / 2 +
            (pts1.vs == 'none' ? -heightBars * 0.8 : 0) +
            (names_filter.length - 1) * (heightBars * 0.5) +
            (pts1.l_or_v == 'V' ? -heightBars * 0.35 : heightBars * 0.0) +
            (pts1.l_or_v == 'V' && pts1.goles_en_contra_fecha == 1
              ? heightBars * 0.05
              : pts1.goles_en_contra_fecha == 1
              ? -heightBars * 0.05
              : heightBars * 0.0),
          y: y(rank1) - heightBars / 3.25 - defaults.mini_logo.size / 2,
          height: defaults.mini_logo.size,
          href: pts1.campeonato_ganado_matematicamente == 1 ? `./icons/trofeo1.png` : ''
        })
      } else {
        let pts1 = yearSlice1.find((d) => d.name == nombre)
        svg
          .append('text')
          .attrs({
            transform: `translate(${margin_left * 2}, 0)`,
            x: x(wks) - heightBars * 0.0,
            y: y(rank1)
          })
          .styles({
            fill: pts1.campeonato_perdido_matematicamente == 1 ? derrota_color : pts1.campeonato_ganado_matematicamente1 == 1 ? victoria_color : black_color,
            'font-weight': 600,
            'font-size': heightBars * 0.25,
            'text-anchor': 'middle',
            'alignment-baseline': 'central'
          })
          .text(`${pts1.final != true ? pts1.value : ''}`)
          .call(halo1, heightBars * 0.25, '#f1f1f1')
      }

      let pts1 = yearSlice1.find((d) => d.name == nombre)

      svg
        .append('text')
        .attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: 'line',
          x: x(wks) + heightBars * 0.01 + weeks * 0.65,
          y: y(rank1) + (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : pts1.racha_sin_empates > 2 ? -heightBars / 3.25 : heightBars / 3.25)
        })
        .styles({
          'font-weight': 600,
          'font-size': defaults.subValue.style.font_size,
          fill: black_color,
          'text-anchor': 'end',
          'alignment-baseline': 'central'
        })
        .text(
          pts1.goles_fecha !== not_played_yet
            ? pts1.semana == dates[dates.length - 2]
              ? pts1.racha_sin_victorias > 2
                ? pts1.racha_sin_victorias
                : ''
              : ''
            : ''
        )
        .call(halo1, defaults.subValue.style.font_size, '#f1f1f1')

      svg.append('image').attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: 'line',
        x: x(wks) + heightBars * 0.125 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + weeks * 0.65,
        y:
          y(rank1) +
          (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : pts1.racha_sin_empates > 2 ? -heightBars / 3.25 : heightBars / 3.25) -
          (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
        height: defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35,
        href:
          pts1.goles_fecha !== not_played_yet
            ? pts1.semana == dates[dates.length - 2]
              ? pts1.racha_sin_victorias > 2
                ? `./icons/racha_sin_victorias2.png`
                : ''
              : ''
            : ''
      })

      svg
        .append('text')
        .attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: 'line',
          x: x(wks) + heightBars * 0.01 + weeks * 0.65,
          y: y(rank1) + heightBars / 3.25
        })
        .styles({
          'font-weight': 600,
          'font-size': defaults.subValue.style.font_size,
          fill: black_color,
          'text-anchor': 'end',
          'alignment-baseline': 'central'
        })
        .text(
          pts1.goles_fecha !== not_played_yet
            ? pts1.semana == dates[dates.length - 2]
              ? pts1.racha_sin_derrotas > 2
                ? pts1.racha_sin_derrotas
                : ''
              : ''
            : ''
        )
        .call(halo1, defaults.subValue.style.font_size, '#f1f1f1')

      svg.append('image').attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: 'line',
        x: x(wks) + heightBars * 0.125 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + weeks * 0.65,
        y: y(rank1) + heightBars / 3.25 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
        height: defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35,
        href:
          pts1.goles_fecha !== not_played_yet
            ? pts1.semana == dates[dates.length - 2]
              ? pts1.racha_sin_derrotas > 2
                ? `./icons/racha_sin_derrotas2.png`
                : ''
              : ''
            : ''
      })

      svg
        .append('text')
        .attrs({
          transform: `translate(${margin_left * 2}, 0)`,
          class: 'line',
          x: x(wks) + heightBars * 0.01 + weeks * 0.65,
          y: y(rank1) + (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : heightBars / 3.25)
        })
        .styles({
          'font-weight': 600,
          'font-size': defaults.subValue.style.font_size,
          fill: black_color,
          'text-anchor': 'end',
          'alignment-baseline': 'central'
        })
        .text(
          pts1.goles_fecha !== not_played_yet ? (pts1.semana == dates[dates.length - 2] ? (pts1.racha_sin_empates > 2 ? pts1.racha_sin_empates : '') : '') : ''
        )
        .call(halo1, defaults.subValue.style.font_size, '#f1f1f1')

      svg.append('image').attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: 'line',
        x: x(wks) + heightBars * 0.125 - (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2 + weeks * 0.65,
        y:
          y(rank1) +
          (pts1.racha_sin_derrotas > 2 ? -heightBars / 3.25 : heightBars / 3.25) -
          (defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35) / 2,
        height: defaults.mini_logo.size + defaults.subValue.style.font_size * 0.35,
        href:
          pts1.goles_fecha !== not_played_yet
            ? pts1.semana == dates[dates.length - 2]
              ? pts1.racha_sin_empates > 2
                ? `./icons/racha_sin_empates2.png`
                : ''
              : ''
            : ''
      })

      wks++
    })
  })

  /* let names_playoffs = new Set([...new Set(fechas_playoff.map((d) => d.local)), ...new Set(fechas_playoff.map((d) => d.visitante))])
  console.log(names_playoffs)

  names.forEach((nombre) => {
    let wks = 0

    var points = []

    dates.slice(0).forEach((o) => {
      let yearSlice1 = sort_teams(data.filter((d) => d.semana == o && !isNaN(d.value)))

      let rank1 = yearSlice1.find((d) => d.name == nombre).rank

      wks > fechas_not_played ? (wks = wks - not_played_yet_x) : ''
      o == dates[dates.length - 1] && fechas_not_played < dates.length - 1 ? (wks = wks + not_played_yet_x) : ''

      points.push([x(wks), y(rank1)])

      wks++
    })

    svg
      .append('path')
      .style('filter', 'url(#dropshadow)')
      .attrs({
        transform: `translate(${margin_left * 2}, 0)`,
        class: 'line'
      })
      .styles({
        fill: 'none',
        stroke: teamColorss[nombre.split('-')[0]] == undefined ? 'grey' : teamColorss[nombre.split('-')[0]][0],
        'stroke-width': ((heightBars * 0.35) / 7) * 5,
        'stroke-linejoin': 'round'
      })
      .attr('d', d3.line().curve(d3.curveCardinal.tension(1))(points))
  }) */

  var areaGradient0 = svg
    .append('defs')
    .append('linearGradient')
    .attr('id', 'areaGradient0')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%')

  areaGradient0.append('stop').attr('offset', '0%').attr('stop-color', '#000').attr('stop-opacity', 0.2)

  areaGradient0.append('stop').attr('offset', '100%').attr('stop-color', '#000').attr('stop-opacity', 0)

  svg
    .append('rect')
    .attrs({
      class: 'bars_names',
      x: margin_left - 1,
      y: margin.top * 0.5,
      width: margin_left / 4,
      height: height
    })
    .styles({
      fill: (d, i) => (i == 0 ? 'url(#areaGradient0)' : i % 2 == 1 ? 'url(#areaGradient0)' : 'url(#areaGradient0)')
    })

/*     grupos1.forEach((e, index) => {
      svg
      .selectAll('.text')
      .data(d3.range(1, equipos_por_grupos+1))
      .enter()
      .append('text')
      .attrs({
        x: margin_left / 2,
        y: (d, i) => y(i+(index*equipos_por_grupos))
      })
      .styles({
        fill: black_color,
        'font-size': heightBars * 0.5,
        'alignment-baseline': 'central',
        'text-anchor': 'middle',
        'font-weight': 600
      })
      .text((d) => d)
    })
 */
  if (grupos>1) {

    grupos1.forEach((e, index) => {
      svg
      .selectAll('.text')
      .data(d3.range(1, equipos_por_grupos+1))
      .enter()
      .append('text')
      .attrs({
        x: margin_left / 2,
        y: (d, i) => y(i+(index*equipos_por_grupos))
      })
      .styles({
        fill: black_color,
        'font-size': heightBars * 0.5,
        'alignment-baseline': 'central',
        'text-anchor': 'middle',
        'font-weight': 600
      })
      .text((d) => d)
    })

    /* svg
      .selectAll('.text')
      .data(d3.range(1, top_n + 1-equipos_por_grupos))
      .enter()
      .append('text')
      .attrs({
        x: margin_left / 2,
        y: (d, i) => y(i)
      })
      .styles({
        fill: black_color,
        'font-size': heightBars * 0.5,
        'alignment-baseline': 'central',
        'text-anchor': 'middle',
        'font-weight': 600
      })
      .text((d) => d)
  
      svg
      .selectAll('.text')
      .data(d3.range(1, top_n + 1))
      .enter()
      .append('text')
      .attrs({
        x: margin_left / 2,
        y: (d, i) => y(i+equipos_por_grupos)
      })
      .styles({
        fill: black_color,
        'font-size': heightBars * 0.5,
        'alignment-baseline': 'central',
        'text-anchor': 'middle',
        'font-weight': 600
      })
      .text((d) => d) */
  } else {
    svg
      .selectAll('.text')
      .data(d3.range(1, top_n + 1))
      .enter()
      .append('text')
      .attrs({
        x: margin_left / 2,
        y: (d, i) => y(i)
      })
      .styles({
        fill: black_color,
        'font-size': heightBars * 0.5,
        'alignment-baseline': 'central',
        'text-anchor': 'middle',
        'font-weight': 600
      })
      .text((d) => d)
  }


  svg.append('image').attrs({
    x: margin_left / 2 - (margin_left * 0.8) / 2,
    y: margin.top * 0.8 - ((120 / 204) * margin_left * 0.8) / 2,
    width: margin_left * 0.8,
    href: `./country-flags/flag-of-${data1[0].pais}.png`
  })

  if (localia) {

  svg
    .append('text')
    .attrs({
      class: 'top',
      x: width * 0.1,
      y: margin.top * 0.33
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'pj_top'
        })
        .styles({
          fill: 'lightgrey',
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(d3.format('.0f')((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2) + ' ')
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'pg_top'
        })
        .styles({
          fill: victoria_color,
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(d3.sum(lastSlice, (d) => d.partidos_ganados) + d3.sum(lastSlice, (d) => d.partidos_ganados1) + ' ')
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'pg_por_top'
        })
        .styles({
          fill: victoria_color,
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(
          '(' +
            d3.format('.0f')(
              ((d3.sum(lastSlice, (d) => d.partidos_ganados) + d3.sum(lastSlice, (d) => d.partidos_ganados1)) /
                d3.format('.0f')((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2)) *
                100
            ) +
            '%) '
        )
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          dy: -heightBars * 0.16
        })
        .styles({
          opacity: 1,
          fill: victoria_color,
          'font-size': margin.top * 0.2,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(
          (d) =>
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
                ((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2)
            ) +
            ') '
        )
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          dy: heightBars * 0.32,
          dx: (d) =>
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
                  ((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2)
              ) +
              ') '
            ).toString().length *
            margin.top *
            0.2 *
            0.55
        })
        .styles({
          opacity: 1,
          fill: victoria_color,
          'font-size': margin.top * 0.2,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(
          (d) =>
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
                ((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2)
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
          class: 'pe_top'
        })
        .styles({
          fill: empate_color,
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(d3.format('.0f')((d3.sum(lastSlice, (d) => d.partidos_empatados) + d3.sum(lastSlice, (d) => d.partidos_empatados1)) / 2) + ' ')
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'pe_por_top'
        })
        .styles({
          fill: empate_color,
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(
          '(' +
            d3.format('.0f')(
              (d3.format('.0f')((d3.sum(lastSlice, (d) => d.partidos_empatados) + d3.sum(lastSlice, (d) => d.partidos_empatados1)) / 2) /
                d3.format('.0f')((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2)) *
                100
            ) +
            '%)\xa0\xa0\xa0'
        )
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'gf_top'
        })
        .styles({
          fill: 'lightgrey',
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(d3.sum(lastSlice, (d) => d.goles) + ' ')
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'avg_g_top'
        })
        .styles({
          fill: 'lightgrey',
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(
          '(' +
            d3
              .format('.1f')(
                (d3.sum(lastSlice, (d) => d.goles) + d3.sum(lastSlice, (d) => d.goles1)) /
                  d3.format('.0f')((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2)
              )
              .replace('.', ',') +
            ') '
        )
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          dy: -heightBars * 0.16
        })
        .styles({
          opacity: 1,
          fill: 'lightgrey',
          'font-size': margin.top * 0.2,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(
          (d) =>
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
                  ((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2)
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
          dx: (d) =>
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
                    ((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2)
                )
                .replace('.', ',') +
              ') '
            ).toString().length *
            margin.top *
            0.2 *
            0.505
        })
        .styles({
          opacity: 1,
          fill: 'lightgrey',
          'font-size': margin.top * 0.2,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(
          (d) =>
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
                  ((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2)
              )
              .replace('.', ',') +
            ') ' +
            ' '
        )
    )

  } else {

    svg
    .append('text')
    .attrs({
      class: 'top',
      x: width * 0.1,
      y: margin.top * 0.33
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'pj_top'
        })
        .styles({
          fill: 'lightgrey',
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(d3.format('.0f')((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2) + ' ')
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'pg_top'
        })
        .styles({
          fill: victoria_color,
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(d3.sum(lastSlice, (d) => d.partidos_ganados) + d3.sum(lastSlice, (d) => d.partidos_ganados1) + ' ')
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'pg_por_top'
        })
        .styles({
          fill: victoria_color,
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(
          '(' +
            d3.format('.0f')(
              ((d3.sum(lastSlice, (d) => d.partidos_ganados) + d3.sum(lastSlice, (d) => d.partidos_ganados1)) /
                d3.format('.0f')((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2)) *
                100
            ) +
            '%) '
        )
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'pe_top'
        })
        .styles({
          fill: empate_color,
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(d3.format('.0f')((d3.sum(lastSlice, (d) => d.partidos_empatados) + d3.sum(lastSlice, (d) => d.partidos_empatados1)) / 2) + ' ')
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'pe_por_top'
        })
        .styles({
          fill: empate_color,
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(
          '(' +
            d3.format('.0f')(
              (d3.format('.0f')((d3.sum(lastSlice, (d) => d.partidos_empatados) + d3.sum(lastSlice, (d) => d.partidos_empatados1)) / 2) /
                d3.format('.0f')((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2)) *
                100
            ) +
            '%)\xa0\xa0\xa0'
        )
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'gf_top'
        })
        .styles({
          fill: 'lightgrey',
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(d3.sum(lastSlice, (d) => d.goles) + ' ')
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'avg_g_top'
        })
        .styles({
          fill: 'lightgrey',
          'font-size': margin.top * 0.3,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text(
          '(' +
            d3
              .format('.1f')(
                (d3.sum(lastSlice, (d) => d.goles) + d3.sum(lastSlice, (d) => d.goles1)) /
                  d3.format('.0f')((d3.sum(lastSlice, (d) => d.partidos_jugados) + d3.sum(lastSlice, (d) => d.partidos_jugados1)) / 2)
              )
              .replace('.', ',') +
            ') '
        )
    )
  }

  var rankingSVG = svg.selectAll('.g').data(yearSlice).enter().append('g').attr('class', 'rankingSVG')

  rankingSVG.append('clipPath').attr('id', `ellipse-clip-bars`).append('rect').attrs({
    x: 0,
    y: 0,
    width: width,
    height: height
  })

  if (localia) {

  rankingSVG
    .append('text')
    .attrs({
      class: 'name',
      x:
        x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) +
        (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) +
        margin_left * 2 +
        defaults.logo.size / 2 +
        defaults.name.position.x,
      y: (d) => y(d.rank) + defaults.name.position.y,
      'clip-path': `url(#ellipse-clip-margin-bottom)`
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text((d) => d.name.split('-')[0])

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'efec'
        })
        .styles({
          fill: (d) => {
            var myColor = d3
              .scaleLinear()
              .domain([
                d3.min(yearSlice, (d) => +formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100)),
                d3.max(yearSlice, (d) => +formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100))
              ])
            var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color])

            return myColor1(myColor(+formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100)))
          },
          'font-size': heightBars * 0.275,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d, i) => (d.partidos_jugados == 0 ? '' : ` (${formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100).replace('.', ',')}%)`))
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          dy: -heightBars * 0.09
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
              )
            ])
            var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color])

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
              return grey_color
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
              )
            }
          },
          'font-size': heightBars * 0.275 * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d, i) =>
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
            0.6
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
              )
            ])
            var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color])

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
              return grey_color
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
              )
            }
          },
          'font-size': heightBars * 0.275 * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d, i) =>
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
                .toString().length
            ]) *
              defaults.value.style.font_size *
              0.625 *
              0.6
        })
        .styles({
          fill: (d) => {
            var myColor = d3
              .scaleLinear()
              .domain([
                d3.min(yearSlice, (d) => +d3.format('.1f')(d.goles / d.partidos_jugados)),
                d3.max(yearSlice, (d) => +d3.format('.1f')(d.goles / d.partidos_jugados))
              ])
            var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color])

            return myColor1(myColor(+d3.format('.1f')(d.goles / d.partidos_jugados)))
          },
          'font-size': heightBars * 0.275,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d, i) =>
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
          dy: -heightBars * 0.09
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
              )
            ])
            var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color])

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
              return grey_color
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
              )
            }
          },
          'font-size': heightBars * 0.275 * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d, i) =>
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
          dx: (d) => -`(1,0)`.toString().length * defaults.value.style.font_size * 0.625 * 0.43
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
              )
            ])
            var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color])

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
              return grey_color
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
              )
            }
          },
          'font-size': heightBars * 0.275 * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d, i) =>
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
        .text((d, i, total) => ' ' + probabilidades[d.name].probabilidad + '%'
        )
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'campeon',
          dy: -heightBars * 0.09
        })
        .styles({
          fill: black_color,
          'font-size': heightBars * 0.275,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d, i) => (d.partidos_jugados+d.partidos_jugados1 == 0 ? '' : `${i == 0 && d.partidos_jugados+d.partidos_jugados1 == dates.length - 1 ? ' (Campeón)' : ''}`))
    )

  } else {
    rankingSVG
    .append('text')
    .attrs({
      class: 'name',
      x:
        x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) +
        (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) +
        margin_left * 2 +
        defaults.logo.size / 2 +
        defaults.name.position.x,
      y: (d) => y(d.rank) + defaults.name.position.y,
      'clip-path': `url(#ellipse-clip-margin-bottom)`
    })
    .styles({
      fill: defaults.name.style.fill,
      'font-size': defaults.name.style.font_size,
      'font-weight': defaults.name.style.font_weight,
      'text-anchor': defaults.name.style.text_anchor,
      'alignment-baseline': defaults.name.style.alignment_baseline
    })
    .text((d) => d.name.split('-')[0])

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'efec'
        })
        .styles({
          fill: (d) => {
            var myColor = d3
              .scaleLinear()
              .domain([
                d3.min(yearSlice, (d) => +formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100)),
                d3.max(yearSlice, (d) => +formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100))
              ])
            var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color])

            return myColor1(myColor(+formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100)))
          },
          'font-size': heightBars * 0.275,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d, i) => (d.partidos_jugados == 0 ? '' : ` (${formatEfec((d.value / (d.partidos_jugados * puntos_por_partido)) * 100).replace('.', ',')}%)`))
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'goles_por_partido',
        })
        .styles({
          fill: (d) => {
            var myColor = d3
              .scaleLinear()
              .domain([
                d3.min(yearSlice, (d) => +d3.format('.1f')(d.goles / d.partidos_jugados)),
                d3.max(yearSlice, (d) => +d3.format('.1f')(d.goles / d.partidos_jugados))
              ])
            var myColor1 = d3.interpolateRgbBasis([derrota_color, empate_color, victoria_color])

            return myColor1(myColor(+d3.format('.1f')(d.goles / d.partidos_jugados)))
          },
          'font-size': heightBars * 0.275,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d, i) =>
          d.partidos_jugados == 0
            ? ''
            : ` (${d3
                .format('.1f')(d.goles / d.partidos_jugados)
                .replace('.', ',')})`
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "campeon",
        })
        .styles({
          fill: black_color,
          "font-size": heightBars * 0.275,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d, i, total) => ' ' + probabilidades[d.name].probabilidad + '%'
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
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d, i) => (d.partidos_jugados+d.partidos_jugados1 == 0 ? '' : `${i == 0 && d.partidos_jugados+d.partidos_jugados1 == dates.length - 1 ? ' (Campeón)' : ''}`))
    )
  }
  
    if (localia) {

      rankingSVG
    .append('text')
    .attrs({
      x:
        x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) +
        (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) +
        margin_left * 2 +
        defaults.logo.size / 2 +
        defaults.name.position.x,
      y: (d) => y(d.rank) + defaults.value.position.y,
      'clip-path': `url(#ellipse-clip-margin-bottom)`
    })
    .styles({
      fill: 'green',
      'font-size': defaults.value.style.font_size,
      'font-weight': 600,
      'text-anchor': defaults.value.style.text_anchor,
      'alignment-baseline': defaults.value.style.alignment_baseline
    })
    .text((d) => '')

    .call((text) =>
      text
        .append('tspan')
        .attrs({})
        .styles({
          fill: black_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => d.value + (ress_ratio == '16:9' ? '' : ress_ratio == '1:1' ? '\xa0\xa0\xa0' : '\xa0'))
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          dy: -heightBars * 0.08
        })
        .styles({
          opacity: 1,
          fill: black_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
            0.7
        })
        .styles({
          opacity: 1,
          fill: black_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
          dy: -heightBars * 0.08
        })
        .styles({
          fill: black_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => '\xa0\xa0\xa0' + d.partidos_jugados)
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          dy: -heightBars * 0.08
        })
        .styles({
          opacity: 1,
          fill: black_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
            0.7
        })
        .styles({
          opacity: 1,
          fill: black_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
                )
              ])
              .toString().length *
              defaults.value.style.font_size *
              0.625 *
              0.7
        })
        .styles({
          fill: victoria_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => ' ' + d.partidos_ganados)
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          dy: -heightBars * 0.08
        })
        .styles({
          opacity: 1,
          fill: victoria_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
            0.7
        })
        .styles({
          opacity: 1,
          fill: victoria_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
                )
              ])
              .toString().length *
              defaults.value.style.font_size *
              0.625 *
              0.7
        })
        .styles({
          fill: empate_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => ' ' + d.partidos_empatados)
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          dy: -heightBars * 0.08
        })
        .styles({
          opacity: 1,
          fill: empate_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
            0.7
        })
        .styles({
          opacity: 1,
          fill: empate_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
                )
              ])
              .toString().length *
              defaults.value.style.font_size *
              0.625 *
              0.7
        })
        .styles({
          fill: derrota_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => ' ' + d.partidos_perdidos)
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          dy: -heightBars * 0.08
        })
        .styles({
          opacity: 1,
          fill: derrota_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
            0.7
        })
        .styles({
          opacity: 1,
          fill: derrota_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
                )
              ])
              .toString().length *
              defaults.value.style.font_size *
              0.625 *
              0.7
        })
        .styles({
          fill: victoria_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => '\xa0\xa0\xa0' + d.goles)
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          dy: -heightBars * 0.08
        })
        .styles({
          opacity: 1,
          fill: victoria_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
            0.7
        })
        .styles({
          opacity: 1,
          fill: victoria_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
                )
              ])
              .toString().length *
              defaults.value.style.font_size *
              0.625 *
              0.7
        })
        .styles({
          fill: black_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => d.goles_en_contra)
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          dy: -heightBars * 0.08
        })
        .styles({
          opacity: 1,
          fill: derrota_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
            0.7
        })
        .styles({
          opacity: 1,
          fill: derrota_color,
          'font-size': defaults.value.style.font_size * 0.625,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
                )
              ])
              .toString().length *
              defaults.value.style.font_size *
              0.625 *
              0.7
        })
        .styles({
          fill: (d) => (d.diferencia_de_goles > 0 ? victoria_color : d.diferencia_de_goles < 0 ? derrota_color : empate_color),
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => ' ' + (d.diferencia_de_goles > 0 ? '+' : '') + d.diferencia_de_goles)
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          dy: -heightBars * 0.08
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
          'alignment-baseline': defaults.value.style.alignment_baseline
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
              0.34
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
          'alignment-baseline': defaults.value.style.alignment_baseline
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
        .append("tspan")
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
                )
              ])
              .toString().length *
              defaults.value.style.font_size *
              0.625 *
              0.7
        })
        .styles({
          fill: "black",
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0
            ? ""
            : "\xa0\xa0\xa0["
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pts1",
        })
        .styles({
          fill: "black",
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0
            ? ""
            : d.value1 + "\xa0\xa0\xa0"
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pj1",
        })
        .styles({
          fill: "black",
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0 ? "" : d.partidos_jugados1 + " "
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pg1",
        })
        .styles({
          fill: victoria_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0 ? "" : d.partidos_ganados1 + " "
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pe1",
        })
        .styles({
          fill: empate_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0 ? "" : d.partidos_empatados1 + " "
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pp1",
        })
        .styles({
          fill: derrota_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0 ? "" : d.partidos_perdidos1 + "\xa0\xa0\xa0"
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "gf1",
        })
        .styles({
          fill: victoria_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => (d.partidos_jugados1 == 0 ? "" : d.goles1))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "gf1_guion",
        })
        .styles({
          fill: "black",
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => (d.partidos_jugados1 == 0 ? "" : "-"))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "gc1",
        })
        .styles({
          fill: derrota_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => (d.partidos_jugados1 == 0 ? "" : d.goles_en_contra1 + " "))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "dif1",
        })
        .styles({
          fill: d => d.diferencia_de_goles1 > 0 ? victoria_color : d.diferencia_de_goles1 < 0 ? derrota_color : empate_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0
            ? ""
            : (d.diferencia_de_goles1 > 0 ? "+" : "") + d.diferencia_de_goles1
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "bracket2",
        })
        .styles({
          fill: "black",
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => (d.partidos_jugados1 == 0 ? "" : "]"))
    );

  } else {
    rankingSVG
    .append('text')
    .attrs({
      x:
        x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) +
        (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) +
        margin_left * 2 +
        defaults.logo.size / 2 +
        defaults.name.position.x,
      y: (d) => y(d.rank) + defaults.value.position.y,
      'clip-path': `url(#ellipse-clip-margin-bottom)`
    })
    .styles({
      fill: 'green',
      'font-size': defaults.value.style.font_size,
      'font-weight': 600,
      'text-anchor': defaults.value.style.text_anchor,
      'alignment-baseline': defaults.value.style.alignment_baseline
    })
    .text((d) => '')

    .call((text) =>
      text
        .append('tspan')
        .attrs({})
        .styles({
          fill: black_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
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
          'alignment-baseline': defaults.value.style.alignment_baseline
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
          'alignment-baseline': defaults.value.style.alignment_baseline
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
          'alignment-baseline': defaults.value.style.alignment_baseline
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
          'alignment-baseline': defaults.value.style.alignment_baseline
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
          'alignment-baseline': defaults.value.style.alignment_baseline
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
          'alignment-baseline': defaults.value.style.alignment_baseline
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
          'alignment-baseline': defaults.value.style.alignment_baseline
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
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => ' ' + (d.diferencia_de_goles > 0 ? '+' : '') + d.diferencia_de_goles)
    )

    .call((text) =>
      text
        .append("tspan")
        .styles({
          fill: "black",
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0
            ? ""
            : "\xa0\xa0\xa0["
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pts1",
        })
        .styles({
          fill: "black",
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0
            ? ""
            : d.value1 + "\xa0\xa0\xa0"
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pj1",
        })
        .styles({
          fill: "black",
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0 ? "" : d.partidos_jugados1 + " "
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pg1",
        })
        .styles({
          fill: victoria_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0 ? "" : d.partidos_ganados1 + " "
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pe1",
        })
        .styles({
          fill: empate_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0 ? "" : d.partidos_empatados1 + " "
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "pp1",
        })
        .styles({
          fill: derrota_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0 ? "" : d.partidos_perdidos1 + "\xa0\xa0\xa0"
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "gf1",
        })
        .styles({
          fill: victoria_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => (d.partidos_jugados1 == 0 ? "" : d.goles1))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "gf1_guion",
        })
        .styles({
          fill: "black",
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => (d.partidos_jugados1 == 0 ? "" : "-"))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "gc1",
        })
        .styles({
          fill: derrota_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => (d.partidos_jugados1 == 0 ? "" : d.goles_en_contra1 + " "))
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "dif1",
        })
        .styles({
          fill: d => d.diferencia_de_goles1 > 0 ? victoria_color : d.diferencia_de_goles1 < 0 ? derrota_color : empate_color,
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) =>
          d.partidos_jugados1 == 0
            ? ""
            : (d.diferencia_de_goles1 > 0 ? "+" : "") + d.diferencia_de_goles1
        )
    )

    .call((text) =>
      text
        .append("tspan")
        .attrs({
          class: "bracket2",
        })
        .styles({
          fill: "black",
          "font-size": defaults.value.style.font_size,
          "font-weight": 600,
          "text-anchor": defaults.value.style.text_anchor,
          "alignment-baseline": defaults.value.style.alignment_baseline,
        })
        .text((d) => (d.partidos_jugados1 == 0 ? "" : "]"))
    );
  }

  rankingSVG.append('image').attrs({
    class: 'logo',
    x:
      x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) +
      (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) +
      margin_left * 2 -
      (defaults.logo.size1 * 1.1) / 2,
    y: (d) => y(d.rank) - (defaults.logo.size1 * 1.1) / 2,
    href: (d) => `./escudos/${d.name.split('-')[0]}.png`,
    height: defaults.logo.size1 * 1.1
  })

  rankingSVG
    .append('text')
    .attrs({
      class: 'info_fecha',
      x: x(dates.length - 1) + margin_left * 2 + defaults.logo.size / 2 + defaults.name.position.x,
      y: (d) => y(d.rank) + defaults.name.position.y - heightBars / 3,
      'clip-path': `url(#ellipse-clip-margin-bottom)`
    })
    .styles({
      fill: black_color,
      'font-size': defaults.value.style.font_size,
      'font-weight': 600,
      'text-anchor': defaults.value.style.text_anchor,
      'alignment-baseline': defaults.value.style.alignment_baseline
    })

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'numero_fecha'
        })
        .styles({
          fill: black_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => d.fecha)
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'goles_fecha'
        })
        .styles({
          fill: black_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => d.goles_fecha)
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'guion'
        })
        .styles({
          fill: black_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => ' ' + d.guion_text_dia + ' ')
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'goles_en_contra_fecha'
        })
        .styles({
          fill: black_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => d.goles_en_contra_fecha + ' ')
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'vs'
        })
        .styles({
          fill: black_color,
          'font-size': defaults.value.style.font_size,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => (d.vs == 'none' ? '' : d.vs))
    )

    .call((text) =>
      text
        .append('tspan')
        .attrs({
          class: 'l_or_v'
        })
        .styles({
          fill: black_color,
          'font-size': heightBars * 0.225,
          'font-weight': 600,
          'text-anchor': defaults.value.style.text_anchor,
          'alignment-baseline': defaults.value.style.alignment_baseline
        })
        .text((d) => (d.vs == 'none' ? '' : ' (' + d.l_or_v + ')'))
    )

  svg
    .append('clipPath')
    .attr('id', `ellipse-clip-final-info`)
    .append('rect')
    .attrs({
      class: 'clippath_final_info',
      x: 0,
      y: 0,
      width: width - margin_right,
      height: height
    })

  lastSlice.forEach((d) => {
    d.fechas_en_top = d3.sum(
      data.filter((e) => e.name == d.name && e.final != true && e.fecha.replace('Fecha ', '') != 'Def.'),
      (e) => (e.rank == 0 && e.goles_fecha !== not_played_yet ? 1 : 0)
    )
  })

  lastSlice.forEach((d) => {
    d.posicion_promedio = d3.format('.1f')(d3.mean(
      data.filter((e) => e.name == d.name && e.final != true),
      (e) => (e.goles_fecha !== not_played_yet ? e.rank+1 : 0)
    ))
  })

  /* lastSlice.forEach((d) => {
    console.log(d.name, d.posicion_promedio)
  }) */

  let array_p = [
    'racha',
    'racha_empates',
    'racha_derrotas',
    'racha_sin_victorias',
    'racha_sin_empates',
    'racha_sin_derrotas',
    'goleadas',
    'goleadas_en_contra',
    'valla_invicta',
    'fechas_en_top',
  ]

  let positions = {
    1: [[0, 0]],
    2: [
      [0, 0],
      [0, 1]
    ],
    3: [
      [0, 0],
      [0, 1],
      [0, 2]
    ],
    4: [
      [-0.5, 0],
      [-0.5, 1],
      [0.5, 0],
      [0.5, 1]
    ],
    5: [
      [-0.5, 0],
      [-0.5, 1],
      [0.5, 0],
      [0.5, 1],
      [0, 2]
    ],
    6: [
      [-0.5, 0],
      [-0.5, 1],
      [-0.5, 2],
      [0.5, 0],
      [0.5, 1],
      [0.5, 2]
    ],
    7: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [0, 2]
    ],
    8: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [-0.5, 2],
      [0.5, 2]
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
      [1, 2]
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
      [1, 2]
    ]
  }

  let try_positions = (a, b, c) => {
    try {
      return positions[a][b][c]
    } catch {
      console.error('error record')
      return 0
    }
  }

  /* console.log(positions[9][0][0])
  console.log(try_positions(10, 0, 0))
  console.log(positions[10][0][0]) */

  array_p.forEach((p, index, total) => {

    svg
      .selectAll('.img')
      .data(removeDuplicates(data.filter((d) => d[p] == d3.max(data, (d) => d[p]))))
      .enter()
      .append('image')
      .attrs({
        x: (d, i, total) => {
          length = 0
          array_p.slice(0, index).forEach((ee, oo) => {
            ee == 'racha_derrotas' ? length++ : 0
            ee == 'racha_sin_derrotas' ? length++ : 0
            ee == 'goleadas_en_contra' ? length++ : 0
            ee == 'valla_invicta' ? length++ : 0
            length = length + d3.max(data, (e) => e[ee]).toString().length
          })
          return (
            x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) +
            (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) +
            margin_left * 2 +
            defaults.logo.size / 2 +
            defaults.name.position.x +
            length * heightBars * 0.225 +
            index * heightBars * 0.4 +
            try_positions(total.length, i, 0) * defaults.mini_logo.size * 0.65 -
            defaults.mini_logo.size / 2 +
            ((d3.max(data, (e) => e[p]).toString().length + 1) / 2) * heightBars * 0.225
          )
        },
        y: (d, i, total) => y(-1) - heightBars / 2 -  try_positions(total.length, i, 1) * defaults.mini_logo.size * 0.7,
        height: defaults.mini_logo.size,
        href: (d) => `./escudos/${d.name.split('-')[0]}.png`
      })

    svg
      .append('text')
      .attrs({
        class: 'final_infos',
        opacity: 1,
        x: (d) => {
          length = 0
          array_p.slice(0, index).forEach((ee, oo) => {
            ee == 'racha_derrotas' ? length++ : 0
            ee == 'racha_sin_derrotas' ? length++ : 0
            ee == 'goleadas_en_contra' ? length++ : 0
            ee == 'valla_invicta' ? length++ : 0
            length = length + d3.max(data, (e) => e[ee]).toString().length
          })
          return (
            x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) +
            (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) +
            margin_left * 2 +
            defaults.logo.size / 2 +
            defaults.name.position.x +
            length * heightBars * 0.225 +
            index * heightBars * 0.4
          )
        },
        y: margin.top * 0.8
      })
      .styles({
        fill: '#f1f1f1',
        'font-size': defaults.value.style.font_size,
        'font-weight': 600,
        'text-anchor': 'start',
        'alignment-baseline': defaults.value.style.alignment_baseline
      })
      .text((d) => d3.max(data, (e) => e[p]))

    svg.append('image').attrs({
      class: 'final_infos',
      x: (d) => {
        length = 0
        array_p.slice(0, index + 1).forEach((ee, oo) => {
          ee == 'racha_sin_victorias' ? length++ : 0
          ee == 'goleadas' ? length++ : 0
          ee == 'valla_invicta' ? length++ : 0
          ee == 'fechas_en_top' ? length++ : 0
          length = length + d3.max(data, (e) => e[ee]).toString().length
        })
        return (
          x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) +
          (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) +
          margin_left * 2 +
          defaults.logo.size / 2 +
          defaults.name.position.x +
          length * heightBars * 0.225 +
          index * heightBars * 0.4 -
          heightBars * 0.05
        )
      },
      y: margin.top * 0.8 - (defaults.final_infos.logos.size * 0.9) / 2,
      href: `./icons/${p}.png`,
      height: defaults.final_infos.logos.size * 0.9
    })
      
    svg
      .selectAll('.text')
      .data(lastSlice)
      .enter()
      .append('text')
      .attrs({
        class: 'final_infos',
        opacity: 1,
        x: (d) => {
          length = 0
          array_p.slice(0, index).forEach((ee, oo) => {
            ee == 'racha_derrotas' ? length++ : 0
            ee == 'racha_sin_derrotas' ? length++ : 0
            ee == 'goleadas_en_contra' ? length++ : 0
            ee == 'valla_invicta' ? length++ : 0
            length =
              length +
              d3
                .max(
                  data.filter((e) => e.name == d.name),
                  (e) => e[ee]
                )
                .toString().length
          })
          return (
            x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) +
            (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) +
            margin_left * 2 +
            defaults.logo.size / 2 +
            defaults.name.position.x +
            length * heightBars * 0.225 +
            index * heightBars * 0.4
          )
        },
        y: (d) => y(d.rank) + defaults.final_infos.position.y - heightBars / 3
      })
      .styles({
        fill: black_color,
        'font-size': defaults.value.style.font_size,
        'font-weight': 600,
        'text-anchor': 'start',
        'alignment-baseline': defaults.value.style.alignment_baseline
      })
      .text((d) =>
        d3.max(
          data.filter((e) => e.name == d.name),
          (e) => e[p]
        )
      )

    svg
      .selectAll('.images')
      .data(lastSlice)
      .enter()
      .append('image')
      .attrs({
        class: 'final_infos',
        x: (d) => {
          length = 0
          array_p.slice(0, index + 1).forEach((ee, oo) => {
            ee == 'racha_sin_victorias' ? length++ : 0
            ee == 'goleadas' ? length++ : 0
            ee == 'valla_invicta' ? length++ : 0
            ee == 'fechas_en_top' ? length++ : 0
            length =
              length +
              d3
                .max(
                  data.filter((e) => e.name == d.name),
                  (e) => e[ee]
                )
                .toString().length
          })
          return (
            x(dates.length - 1 - (dates.length - 1 - fechas_not_played) * not_played_yet_x) +
            (fechas_not_played < dates.length - 1 ? x(1 * not_played_yet_x) : 0) +
            margin_left * 2 +
            defaults.logo.size / 2 +
            defaults.name.position.x +
            length * heightBars * 0.225 +
            index * heightBars * 0.4 -
            heightBars * 0.05
          )
        },
        y: (d) => y(d.rank) + defaults.final_infos.position.y - heightBars / 3 - (defaults.final_infos.logos.size * 0.9) / 2,
        href: `./icons/${p}.png`,
        height: defaults.final_infos.logos.size * 0.9
      })
  })
}

Promise.all([d3.csv('/torneos/data2.csv')]).then(([data1]) => {
  /* let torneos = [...new Set(data1.map((d) => d.torneo))]
  data1 = data1.filter(d => d.torneo == 'Torneo Apertura 2008') */

  let data_cruda = data1.map(d => ({ ...d }))

  console.log(structuredClone(data_cruda))

  data_cruda.forEach(d => {
      d.jugado = d.goles_local !== '99' && d.goles_visitante !== '99'
      d.goles_local = d.jugado ? Number(d.goles_local) : null
      d.goles_visitante = d.jugado ? Number(d.goles_visitante) : null
  })

  let nombre_torneo = ress_ratio == '16:9' ? 'Liga Profesional de Fútbol 2023' : ress_ratio == '1:1' ? 'Liga Profesional de Fútbol 2023' : 'LPF 2023'
  nombre_torneo = data1[0].torneo.replace('Torneo ', '')
  let puntos_por_partido = 3
  let year_torneo = parseInt(data1[0].torneo.split(' ').slice(-1))
  year_torneo < 1996 ? (puntos_por_partido = 2) : ''
  data1[0].torneo == 'Torneo Apertura 1995' ? (puntos_por_partido = 3) : ''
  let fecha_adicional = 'Def.'
  let fecha_playoff = '1/'

  function mes(mes) {
    if (mes == 'Jan') {
      return 0
    } else if (mes == 'Feb') {
      return 1
    } else if (mes == 'Mar') {
      return 2
    } else if (mes == 'Apr') {
      return 3
    } else if (mes == 'May') {
      return 4
    } else if (mes == 'Jun') {
      return 5
    } else if (mes == 'Jul') {
      return 6
    } else if (mes == 'Aug') {
      return 7
    } else if (mes == 'Sep') {
      return 8
    } else if (mes == 'Oct') {
      return 9
    } else if (mes == 'Nov') {
      return 10
    } else if (mes == 'Dec') {
      return 11
    }
  }

  data1.forEach((d) => {
    if (d.goles_local.includes('[')) {
      d.penales_local = +d.goles_local.split('[')[1].replace(']', '')
    }
    if (d.goles_visitante.includes('[')) {
      d.penales_visitante = +d.goles_visitante.split('[')[1].replace(']', '')
    }
    d.goles_local = +d.goles_local.split('[')[0]
    d.goles_visitante = +d.goles_visitante.split('[')[0]
    d.pts_local = d.goles_local > d.goles_visitante ? puntos_por_partido : d.goles_local < d.goles_visitante ? 0 : 1
    d.pts_visitante = d.goles_visitante > d.goles_local ? puntos_por_partido : d.goles_visitante < d.goles_local ? 0 : 1
    d.dia = new Date(+d.dia.split(' ')[2], mes(d.dia.split(' ')[0]), +d.dia.split(' ')[1])
    d.dia_large = formatDateLarge(d.dia)
  })

  console.log(data1)

  let deducted = []

  data1.forEach((d) => {
    if (d.visitante == 'fifa') {
      deducted.push({ name: d.local, pts_deducted: d.goles_visitante, dia: formatDate(d.dia) })
    }
  })

  let torneo = data1.filter((d) => d.visitante != 'fifa')

  let dias = new Set(torneo.map((d) => d.dia).sort((a, b) => a - b))
  dias = new Set([...dias].map((d) => formatDate(d)))

  let clubes = new Set([...new Set(torneo.map((d) => d.local)), ...new Set(torneo.map((d) => d.visitante))])

  let fechas_torneo = new Set(torneo.filter((d) => d.fecha.split(' ')[1] != fecha_adicional && !d.fecha.includes('1/')).map((d) => d.fecha))
  console.log(fechas_torneo)

  let fechas_torneo2 = new Set(torneo.filter((d) => d.fecha.split(' ')[1] != fecha_adicional && !d.fecha.includes('1/')).map((d) => d.fecha))
  let fechas_def = torneo.filter((d) => d.fecha.split(' ')[1] == fecha_adicional)
  let fechas_playoff = torneo.filter((d) => d.fecha.includes('1/'))

  console.log(fechas_playoff)

  let fechas_pospuestas = []

  fechas_torneo = [...fechas_torneo]

  fechas_torneo.forEach((fecha, i) => {
    try {
      let fechas = torneo.filter((d) => d.fecha == fecha && d.dia < torneo.filter((d) => d.fecha == fechas_torneo[i + 1])[0].dia)
      fechas.forEach((d) => {
        Object.assign(d, { fecha2: d.fecha })
      })
      fechas_pospuestas.push(fechas)
      let pendiente = torneo.filter((d) => d.fecha == fecha && d.dia > torneo.filter((d) => d.fecha == fechas_torneo[i + 1])[0].dia)
      let dia = d3.min(pendiente, (d) => d.dia)
      pendiente.forEach((d) => {
        Object.assign(d, { fecha2: 'Fecha Post.', fecha5: 'Fecha same' })
      })
      fechas_pospuestas.push(pendiente)
    } catch {
      let fechas = torneo.filter((d) => d.fecha == fecha && d.dia < torneo.filter((d) => d.fecha == fechas_torneo[i - 1])[0].dia)
      fechas.forEach((d) => {
        Object.assign(d, { fecha2: 'Fecha Post.' })
      })
      fechas_pospuestas.push(fechas)
      let pendiente = torneo.filter((d) => d.fecha == fecha && d.dia > torneo.filter((d) => d.fecha == fechas_torneo[i - 1])[0].dia)
      pendiente.forEach((d) => {
        Object.assign(d, { fecha2: d.fecha })
      })
      fechas_pospuestas.push(pendiente)
    }
  })

  fechas_pospuestas = fechas_pospuestas.filter((d) => d.length > 0)
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
    if (d.map((e) => e.fecha2)[0] == 'Fecha Post.' && d.map((e) => e.fecha2).length == clubes.size / 2) {
      num_fecha = num_fecha + 1
    }

    if (fechas_pospuestas[i][0].fecha2 == 'Fecha Post.') {
      d.forEach((e) => {
        Object.assign(e, { fecha4: 'Fecha ' + num_fecha })
      })
    }

    if (fechas_pospuestas[i][0].fecha2 != 'Fecha Post.') {
      num_fecha = num_fecha + 1
      d.forEach((e) => {
        Object.assign(e, { fecha4: 'Fecha ' + num_fecha })
      })
    }
  })

  let total_fechas = []
  fechas_pospuestas.forEach((d) => {
    d.forEach((e) => {
      total_fechas.push(e.fecha4)
    })
  })
  total_fechas = new Set(total_fechas)

  let fechas_pospuestas1 = []

  total_fechas.forEach((fecha) => {
    let fechas = torneo.filter((d) => d.fecha4 == fecha)
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

  fechas_def.forEach((d) => {
    d.fecha2 = 'Fecha Def.'
    d.fecha4 = 'Fecha Def.'
  })

  fechas_pospuestas1.push(fechas_def)

  fechas_pospuestas1.forEach((d, i) => {
    d.forEach((e) => {
      Object.assign(e, { semana: i + 1 })
    })
  })

  let data2 = []

  fechas_pospuestas1.forEach((d, i) => {
    d.forEach((e) => {
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

  let semanas = new Set(data2.map((d) => d.semana).sort((a, b) => a - b))

  console.log(dias)
  console.log(semanas)
  console.log(clubes)
  console.log(fechas_torneo)
  console.log(fechas_torneo2)

  data1.forEach((d) => {
    d.dia = formatDate(d.dia)
  })

  let partidos_n = 0
  let partidos = []

  partidos.push({ semana: 0, partido_n: partidos_n })

  let final_list = []

  semanas.forEach((semana) => {
    let semana_filter = data2.filter((d) => d.semana == semana)

    semana_filter.forEach((d) => {
      partidos_n++
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
        n_partidos: partidos_n
      })
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
      })
    })
    let clubes_semana1 = new Set(semana_filter.map((d) => d.local))
    let clubes_semana2 = new Set(semana_filter.map((d) => d.visitante))
    let clubes_semana3 = new Set([...clubes_semana1, ...clubes_semana2])

    clubes.forEach((club) => {
      if (![...clubes_semana3].includes(club)) {
        final_list.push({
          name: club,
          vs: 'none',
          semana: semana,
          fecha: '',
          pts: 0,
          goles: 0,
          goles_en_contra: 0
        })
      }
    })

    partidos.push({ semana: semana, partido_n: partidos_n })
  })

  let final_list1 = []

  clubes.forEach((club) => {
    let pts_away = 0
    let pts = 0
    let pts_deducted = 0
    let goles = 0
    let goles_en_contra = 0
    let goleadas = 0
    let goleadas_en_contra = 0
    let partidos_jugados = 0
    let partidos_ganados = 0
    let partidos_empatados = 0
    let partidos_perdidos = 0
    let valla_invicta = 0
    let partido_casa = 0
    let victoria_casa = 0
    let empate_casa = 0
    let derrota_casa = 0

    let pts1 = 0
    let goles1 = 0
    let goles_en_contra1 = 0
    let goleadas1 = 0
    let goleadas_en_contra1 = 0
    let partidos_jugados1 = 0
    let partidos_ganados1 = 0
    let partidos_empatados1 = 0
    let partidos_perdidos1 = 0

    let filter_clubes = final_list.filter((d) => d.name == club)

    let racha = 0
    let racha_empates = 0
    let racha_derrotas = 0
    let racha_sin_victorias = 0
    let racha_sin_empates = 0
    let racha_sin_derrotas = 0

    filter_clubes.forEach((d, i) => {
      if (d.fecha.includes(fecha_adicional)) {
        pts1 = pts1 + d.pts
        goles1 = goles1 + d.goles
        goles_en_contra1 = goles_en_contra1 + d.goles_en_contra
        d.goles - d.goles_en_contra >= 3 ? goleadas++ : ''
        d.goles_en_contra - d.goles >= 3 ? goleadas_en_contra++ : ''
        d.vs != 'none' ? partidos_jugados1++ : ''
        d.pts == puntos_por_partido ? partidos_ganados1++ : d.pts == 1 ? partidos_empatados1++ : d.vs != 'none' ? partidos_perdidos1++ : ''

        if (d.vs != 'none') {
          if (d.pts == puntos_por_partido) {
            racha++
          } else {
            racha = 0
          }
          if (d.pts == 0) {
            racha_derrotas++
          } else {
            racha_derrotas = 0
          }
          if (d.pts == 1) {
            racha_empates++
          } else {
            racha_empates = 0
          }
          if (d.pts < puntos_por_partido) {
            racha_sin_victorias++
          } else {
            racha_sin_victorias = 0
          }
          if (d.pts > 0) {
            racha_sin_derrotas++
          } else {
            racha_sin_derrotas = 0
          }
          if (d.pts != 1) {
            racha_sin_empates++
          } else {
            racha_sin_empates = 0
          }
          if (d.goles_en_contra == 0) {
            valla_invicta++
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
          valla_invicta: valla_invicta
        })
      } else {
        let may_deducted = deducted.filter((e) => e.name == d.name && e.dia == d.dia)[0]
        pts_deducted = 0
        if (may_deducted) {
          pts_deducted = may_deducted.pts_deducted
          pts = pts - pts_deducted
        }

        if (d.goles == not_played_yet) {
          pts = pts - 1
          goles = goles - not_played_yet
          goles_en_contra = goles_en_contra - not_played_yet
          racha_empates = racha_empates - 1
          racha_sin_victorias = racha_sin_victorias - 1
          racha_sin_derrotas = racha_sin_derrotas - 1
          racha_sin_empates = racha_sin_empates - 1
          empate_casa = empate_casa - 1
          partidos_jugados = partidos_jugados - 1
          partidos_empatados = partidos_empatados - 1
        }

        pts_away = d.l_or_v == 'V' && d.goles !== not_played_yet ? pts_away + d.goles : pts_away + 0
        pts = pts + d.pts
        goles = goles + d.goles
        goles_en_contra = goles_en_contra + d.goles_en_contra
        d.goles - d.goles_en_contra >= 3 ? goleadas++ : ''
        d.goles_en_contra - d.goles >= 3 ? goleadas_en_contra++ : ''
        d.vs != 'none' ? partidos_jugados++ : ''
        d.pts == puntos_por_partido ? partidos_ganados++ : d.pts == 1 ? partidos_empatados++ : d.vs != 'none' ? partidos_perdidos++ : ''

        if (d.vs != 'none') {
          if (d.pts == puntos_por_partido) {
            racha++
          } else {
            racha = 0
          }
          if (d.pts == 0) {
            racha_derrotas++
          } else {
            racha_derrotas = 0
          }
          if (d.pts == 1) {
            racha_empates++
          } else {
            racha_empates = 0
          }
          if (d.pts < puntos_por_partido) {
            racha_sin_victorias++
          } else {
            racha_sin_victorias = 0
          }
          if (d.pts > 0) {
            racha_sin_derrotas++
          } else {
            racha_sin_derrotas = 0
          }
          if (d.pts != 1) {
            racha_sin_empates++
          } else {
            racha_sin_empates = 0
          }
          if (d.goles_en_contra == 0) {
            valla_invicta++
          }
          if (d.l_or_v == 'L') {
            partido_casa++
          }
          if (d.pts == puntos_por_partido && d.l_or_v == 'L') {
            victoria_casa++
          }
          if (d.pts == 1 && d.l_or_v == 'L') {
            empate_casa++
          }
          if (d.pts == 0 && d.l_or_v == 'L') {
            derrota_casa++
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
          derrota_casa: derrota_casa
        })
      }
    })

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
      goleadas_en_contra: final_list1[final_list1.length - 1].goleadas_en_contra
    })
  })

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
    racha_sin_empates: 0
  })

  final_list1
    .filter((d) => d.vs != 'none')
    .forEach((d, i) => {
      if (final_list1.filter((d) => d.vs != 'none')[i - 1] != undefined && final_list1.filter((d) => d.vs != 'none')[i + 1] != undefined) {
        Object.assign(d, {
          racha1:
            final_list1.filter((d) => d.vs != 'none')[i + 1].name != d.name
              ? d.racha
              : final_list1.filter((d) => d.vs != 'none')[i + 1].racha < d.racha
              ? d.racha
              : final_list1.filter((d) => d.vs != 'none')[i + 1].name != d.name
              ? d.racha
              : 0
        })

        Object.assign(d, {
          racha_derrotas1:
            final_list1.filter((d) => d.vs != 'none')[i + 1].name != d.name
              ? d.racha_derrotas
              : final_list1.filter((d) => d.vs != 'none')[i + 1].racha_derrotas < d.racha_derrotas
              ? d.racha_derrotas
              : final_list1.filter((d) => d.vs != 'none')[i + 1].name != d.name
              ? d.racha_derrotas
              : 0
        })

        Object.assign(d, {
          racha_empates1:
            final_list1.filter((d) => d.vs != 'none')[i + 1].name != d.name
              ? d.racha_empates
              : final_list1.filter((d) => d.vs != 'none')[i + 1].racha_empates < d.racha_empates
              ? d.racha_empates
              : final_list1.filter((d) => d.vs != 'none')[i + 1].name != d.name
              ? d.racha_empates
              : 0
        })

        if (final_list1.filter((d) => d.vs != 'none')[i - 1].name != d.name) {
          Object.assign(d, { racha_sin_victorias1: 0 })
        } else {
          if (d.racha_sin_victorias < final_list1.filter((d) => d.vs != 'none')[i - 1].racha_sin_victorias) {
            Object.assign(d, {
              racha_sin_victorias1: final_list1.filter((d) => d.vs != 'none')[i - 1].racha_sin_victorias
            })
          } else {
            if (final_list1.filter((d) => d.vs != 'none')[i + 1].name != d.name) {
              Object.assign(d, { racha_sin_victorias1: 0 })
            } else {
              Object.assign(d, { racha_sin_victorias1: 0 })
            }
          }
        }

        if (final_list1.filter((d) => d.vs != 'none')[i - 1].name != d.name) {
          Object.assign(d, { racha_sin_derrotas1: 0 })
        } else {
          if (d.racha_sin_derrotas < final_list1.filter((d) => d.vs != 'none')[i - 1].racha_sin_derrotas) {
            Object.assign(d, {
              racha_sin_derrotas1: final_list1.filter((d) => d.vs != 'none')[i - 1].racha_sin_derrotas
            })
          } else {
            if (final_list1.filter((d) => d.vs != 'none')[i + 1].name != d.name) {
              Object.assign(d, { racha_sin_derrotas1: 0 })
            } else {
              Object.assign(d, { racha_sin_derrotas1: 0 })
            }
          }
        }
        if (final_list1.filter((d) => d.vs != 'none')[i - 1].name != d.name) {
          Object.assign(d, { racha_sin_empates1: 0 })
        } else {
          if (d.racha_sin_empates < final_list1.filter((d) => d.vs != 'none')[i - 1].racha_sin_empates) {
            Object.assign(d, {
              racha_sin_empates1: final_list1.filter((d) => d.vs != 'none')[i - 1].racha_sin_empates
            })
          } else {
            if (final_list1.filter((d) => d.vs != 'none')[i + 1].name != d.name) {
              Object.assign(d, { racha_sin_empates1: 0 })
            } else {
              Object.assign(d, { racha_sin_empates1: 0 })
            }
          }
        }
      }
    })

  final_list1 = final_list1.filter((d) => d.name != 'hola')

   // **************************************

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

  let gana_local = 0.40;
  let empate = 0.25;
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

  let probabilidades = (calcularProbabilidades(data_cruda, 1, 50000));
  console.table(probabilidades)

  render(final_list1, nombre_torneo, clubes, puntos_por_partido, data1, fechas_playoff, probabilidades)
})

function simularGrupoArgentina(iteraciones = 100000) {
  const equipos = ["Argentina", "Polonia", "México", "Arabia Saudita"];
  let clasificaciones = { "Argentina": 0, "Polonia": 0, "México": 0, "Arabia Saudita": 0 };

  function jugarPartido() {
      const resultado = Math.random();
      if (resultado < 1 / 3) return [3, 0, 2, 0]; // Gana el primer equipo con 2-0
      if (resultado < 2 / 3) return [0, 3, 0, 2]; // Gana el segundo equipo con 0-2
      return [1, 1, 1, 1]; // Empate 1-1
  }

  for (let i = 0; i < iteraciones; i++) {
      let puntos = { "Argentina": 0, "Polonia": 1, "México": 1, "Arabia Saudita": 3 };
      let diferenciaGoles = { "Argentina": -1, "Polonia": 0, "México": 0, "Arabia Saudita": 1 };
      let golesAFavor = { "Argentina": 1, "Polonia": 0, "México": 0, "Arabia Saudita": 2 };

      let partidos = [["Polonia", "Arabia Saudita"], ["Argentina", "México"], ["Polonia", "Argentina"], ["Arabia Saudita", "México"]];
      
      for (let [equipo1, equipo2] of partidos) {
          let [puntos1, puntos2, goles1, goles2] = jugarPartido();
          puntos[equipo1] += puntos1;
          puntos[equipo2] += puntos2;
          diferenciaGoles[equipo1] += (goles1 - goles2);
          diferenciaGoles[equipo2] += (goles2 - goles1);
          golesAFavor[equipo1] += goles1;
          golesAFavor[equipo2] += goles2;
      }
      
      let tablaOrdenada = Object.entries(puntos).sort((a, b) => {
          if (b[1] !== a[1]) return b[1] - a[1]; // Ordenar por puntos
          if (diferenciaGoles[b[0]] !== diferenciaGoles[a[0]]) return diferenciaGoles[b[0]] - diferenciaGoles[a[0]]; // Diferencia de goles
          return golesAFavor[b[0]] - golesAFavor[a[0]]; // Goles a favor
      });
      
      let clasificados = [tablaOrdenada[0][0], tablaOrdenada[1][0]];
      clasificados.forEach(equipo => clasificaciones[equipo]++);
  }

  for (let equipo in clasificaciones) {
      clasificaciones[equipo] = ((clasificaciones[equipo] / iteraciones) * 100).toFixed(2) + "%";
  }
  
  return clasificaciones;
}

console.log(simularGrupoArgentina());

// Define the teams
const teams = ['Team A', 'Team B', 'Team C', 'Team D'];

// Initialize team stats
let standings = teams.reduce((acc, team) => {
    acc[team] = { points: 0, wins: 0, draws: 0, losses: 0 };
    return acc;
}, {});

// Function to simulate a match between two teams
function simulateMatch(team1, team2) {
    // Random result: 0 = draw, 1 = team1 wins, 2 = team2 wins
    const result = Math.floor(Math.random() * 3);
    
    if (result === 0) { // Draw
        standings[team1].points += 1;
        standings[team2].points += 1;
        standings[team1].draws += 1;
        standings[team2].draws += 1;
    } else if (result === 1) { // Team1 wins
        standings[team1].points += 3;
        standings[team1].wins += 1;
        standings[team2].losses += 1;
    } else { // Team2 wins
        standings[team2].points += 3;
        standings[team2].wins += 1;
        standings[team1].losses += 1;
    }
}

// Simulate all matches (home and away)
function playRoundRobin() {
    for (let i = 0; i < teams.length; i++) {
        for (let j = 0; j < teams.length; j++) {
            if (i !== j) { // Teams don't play themselves
                simulateMatch(teams[i], teams[j]); // Home match
                simulateMatch(teams[j], teams[i]); // Away match
            }
        }
    }
}

// Display results
function displayStandings() {
    console.log('Final Standings:');
    console.log('Team\t\tPoints\tW\tD\tL');
    teams.forEach(team => {
        const stats = standings[team];
        console.log(`${team.padEnd(12)}\t${stats.points}\t${stats.wins}\t${stats.draws}\t${stats.losses}`);
    });

    // Determine winner
    const sortedTeams = Object.entries(standings)
        .sort((a, b) => b[1].points - a[1].points);
    console.log(`\nWinner: ${sortedTeams[0][0]} with ${sortedTeams[0][1].points} points`);
}

// Run multiple simulations to calculate odds
function runSimulations(numSimulations) {
    const winCount = {};

    for (let sim = 0; sim < numSimulations; sim++) {
        // Reset standings for each simulation
        standings = teams.reduce((acc, team) => {
            acc[team] = { points: 0, wins: 0, draws: 0, losses: 0 };
            return acc;
        }, {});

        playRoundRobin();
        
        // Find winner
        const sortedTeams = Object.entries(standings)
            .sort((a, b) => b[1].points - a[1].points);
        const winner = sortedTeams[0][0];
        winCount[winner] = (winCount[winner] || 0) + 1;
    }

    console.log(`\nSimulated ${numSimulations} tournaments. Winning odds:`);
    teams.forEach(team => {
        const wins = winCount[team] || 0;
        const percentage = ((wins / numSimulations) * 100).toFixed(2);
        console.log(`${team}: ${percentage}% (${wins} wins)`);
    });
}

// Run one tournament and show standings
console.log('Single Tournament Simulation:');
playRoundRobin();
displayStandings();

// Run 1000 simulations to estimate odds
console.log('\nRunning 1000 Simulations...');
runSimulations(1000);

/* // Define the teams
const teams = ['Team A', 'Team B', 'Team C', 'Team D'];

// Initialize team stats
let standings = teams.reduce((acc, team) => {
    acc[team] = { points: 0, wins: 0, draws: 0, losses: 0 };
    return acc;
}, {});

// Function to simulate a match between two teams
function simulateMatch(team1, team2) {
    // Random result: 0 = draw, 1 = team1 wins, 2 = team2 wins
    const result = Math.floor(Math.random() * 3);
    
    if (result === 0) { // Draw
        standings[team1].points += 1;
        standings[team2].points += 1;
        standings[team1].draws += 1;
        standings[team2].draws += 1;
    } else if (result === 1) { // Team1 wins
        standings[team1].points += 3;
        standings[team1].wins += 1;
        standings[team2].losses += 1;
    } else { // Team2 wins
        standings[team2].points += 3;
        standings[team2].wins += 1;
        standings[team1].losses += 1;
    }
}

// Function to play first three rounds with fixed results
function playFixedRounds() {
    // Round 1
    standings['Team A'].points += 3; // Team A beats Team B
    standings['Team A'].wins += 1;
    standings['Team B'].losses += 1;
    standings['Team C'].points += 1; // Team C draws with Team D
    standings['Team D'].points += 1;
    standings['Team C'].draws += 1;
    standings['Team D'].draws += 1;

    // Round 2
    standings['Team A'].points += 3; // Team A beats Team C
    standings['Team A'].wins += 1;
    standings['Team C'].losses += 1;
    standings['Team D'].points += 3; // Team D beats Team B
    standings['Team D'].wins += 1;
    standings['Team B'].losses += 1;

    // Round 3
    standings['Team A'].points += 3; // Team A beats Team D
    standings['Team A'].wins += 1;
    standings['Team D'].losses += 1;
    standings['Team C'].points += 3; // Team C beats Team B
    standings['Team C'].wins += 1;
    standings['Team B'].losses += 1;
}

// Simulate remaining matches (home and away)
function playRemainingMatches() {
    const matches = [
        ['Team B', 'Team D'], // Team B's remaining home match
        ['Team C', 'Team A'], ['Team C', 'Team D'], // Team C's remaining home matches
        ['Team D', 'Team A'], ['Team D', 'Team C'], // Team D's home matches
        ['Team A', 'Team B'], // Team A vs Team B away (Round 1 was home)
        ['Team A', 'Team C'], // Team A vs Team C away (Round 2 was home)
        ['Team B', 'Team C']  // Team B vs Team C away (Round 3 was home)
    ];

    matches.forEach(([home, away]) => simulateMatch(home, away));
}

// Display results
function displayStandings() {
    console.log('Final Standings:');
    console.log('Team\t\tPoints\tW\tD\tL');
    teams.forEach(team => {
        const stats = standings[team];
        console.log(`${team.padEnd(12)}\t${stats.points}\t${stats.wins}\t${stats.draws}\t${stats.losses}`);
    });

    // Determine winner
    const sortedTeams = Object.entries(standings)
        .sort((a, b) => b[1].points - a[1].points);
    console.log(`\nWinner: ${sortedTeams[0][0]} with ${sortedTeams[0][1].points} points`);
}

// Run multiple simulations to calculate odds
function runSimulations(numSimulations) {
    const winCount = {};

    for (let sim = 0; sim < numSimulations; sim++) {
        // Reset standings for each simulation
        standings = teams.reduce((acc, team) => {
            acc[team] = { points: 0, wins: 0, draws: 0, losses: 0 };
            return acc;
        }, {});

        playFixedRounds(); // Fixed first three rounds
        playRemainingMatches(); // Simulate the rest
        
        // Find winner
        const sortedTeams = Object.entries(standings)
            .sort((a, b) => b[1].points - a[1].points);
        const winner = sortedTeams[0][0];
        winCount[winner] = (winCount[winner] || 0) + 1;
    }

    console.log(`\nSimulated ${numSimulations} tournaments. Winning odds:`);
    teams.forEach(team => {
        const wins = winCount[team] || 0;
        const percentage = ((wins / numSimulations) * 100).toFixed(2);
        console.log(`${team}: ${percentage}% (${wins} wins)`);
    });
}

// Run one tournament and show standings
console.log('Single Tournament Simulation:');
playFixedRounds();
playRemainingMatches();
displayStandings();

// Run 1000 simulations to estimate odds
console.log('\nRunning 1000 Simulations...');
runSimulations(1000); */

/* // Define the teams
const teams = ['Team A', 'Team B', 'Team C', 'Team D'];

// Initialize team stats
let standings = teams.reduce((acc, team) => {
    acc[team] = { points: 0, wins: 0, draws: 0, losses: 0 };
    return acc;
}, {});

// Function to simulate a match with home advantage (70% chance for home win)
function simulateMatch(homeTeam, awayTeam) {
    // Random number between 0 and 1
    const result = Math.random();
    
    if (result < 0.70) { // 70% chance home team wins
        standings[homeTeam].points += 3;
        standings[homeTeam].wins += 1;
        standings[awayTeam].losses += 1;
    } else if (result < 0.85) { // 15% chance draw (70% to 85%)
        standings[homeTeam].points += 1;
        standings[awayTeam].points += 1;
        standings[homeTeam].draws += 1;
        standings[awayTeam].draws += 1;
    } else { // 15% chance away team wins (85% to 100%)
        standings[awayTeam].points += 3;
        standings[awayTeam].wins += 1;
        standings[homeTeam].losses += 1;
    }
}

// Function to play first three rounds with fixed results
function playFixedRounds() {
    // Round 1
    standings['Team A'].points += 3; // Team A beats Team B (home)
    standings['Team A'].wins += 1;
    standings['Team B'].losses += 1;
    standings['Team C'].points += 1; // Team C draws with Team D (home)
    standings['Team D'].points += 1;
    standings['Team C'].draws += 1;
    standings['Team D'].draws += 1;

    // Round 2
    standings['Team A'].points += 3; // Team A beats Team C (home)
    standings['Team A'].wins += 1;
    standings['Team C'].losses += 1;
    standings['Team D'].points += 3; // Team D beats Team B (home)
    standings['Team D'].wins += 1;
    standings['Team B'].losses += 1;

    // Round 3
    standings['Team A'].points += 3; // Team A beats Team D (home)
    standings['Team A'].wins += 1;
    standings['Team D'].losses += 1;
    standings['Team C'].points += 3; // Team C beats Team B (home)
    standings['Team C'].wins += 1;
    standings['Team B'].losses += 1;
}

// Simulate remaining matches (home and away)
function playRemainingMatches() {
    const matches = [
        ['Team B', 'Team D'], // Team B's remaining home match
        ['Team C', 'Team A'], ['Team C', 'Team D'], // Team C's remaining home matches
        ['Team D', 'Team A'], ['Team D', 'Team C'], // Team D's home matches
        ['Team A', 'Team B'], // Team A vs Team B away (Round 1 was home)
        ['Team A', 'Team C'], // Team A vs Team C away (Round 2 was home)
        ['Team B', 'Team C']  // Team B vs Team C away (Round 3 was home)
    ];

    matches.forEach(([home, away]) => simulateMatch(home, away));
}

// Display results
function displayStandings() {
    console.log('Final Standings:');
    console.log('Team\t\tPoints\tW\tD\tL');
    teams.forEach(team => {
        const stats = standings[team];
        console.log(`${team.padEnd(12)}\t${stats.points}\t${stats.wins}\t${stats.draws}\t${stats.losses}`);
    });

    // Determine winner
    const sortedTeams = Object.entries(standings)
        .sort((a, b) => b[1].points - a[1].points);
    console.log(`\nWinner: ${sortedTeams[0][0]} with ${sortedTeams[0][1].points} points`);
}

// Run multiple simulations to calculate odds
function runSimulations(numSimulations) {
    const winCount = {};

    for (let sim = 0; sim < numSimulations; sim++) {
        // Reset standings for each simulation
        standings = teams.reduce((acc, team) => {
            acc[team] = { points: 0, wins: 0, draws: 0, losses: 0 };
            return acc;
        }, {});

        playFixedRounds(); // Fixed first three rounds
        playRemainingMatches(); // Simulate the rest
        
        // Find winner
        const sortedTeams = Object.entries(standings)
            .sort((a, b) => b[1].points - a[1].points);
        const winner = sortedTeams[0][0];
        winCount[winner] = (winCount[winner] || 0) + 1;
    }

    console.log(`\nSimulated ${numSimulations} tournaments. Winning odds:`);
    teams.forEach(team => {
        const wins = winCount[team] || 0;
        const percentage = ((wins / numSimulations) * 100).toFixed(2);
        console.log(`${team}: ${percentage}% (${wins} wins)`);
    });
}

// Run one tournament and show standings
console.log('Single Tournament Simulation:');
playFixedRounds();
playRemainingMatches();
displayStandings();

// Run 1000 simulations to estimate odds
console.log('\nRunning 1000 Simulations...');
runSimulations(1000); */

/* // Define the teams
const teams = ['Team A', 'Team B', 'Team C', 'Team D'];

// Initialize team stats
let standings = teams.reduce((acc, team) => {
    acc[team] = { points: 0, wins: 0, draws: 0, losses: 0 };
    return acc;
}, {});

// Function to simulate a match with home advantage (70% chance for home win)
function simulateMatch(homeTeam, awayTeam) {
    // Random number between 0 and 1
    const result = Math.random();
    
    if (result < 0.70) { // 70% chance home team wins
        standings[homeTeam].points += 3;
        standings[homeTeam].wins += 1;
        standings[awayTeam].losses += 1;
    } else if (result < 0.85) { // 15% chance draw (70% to 85%)
        standings[homeTeam].points += 1;
        standings[awayTeam].points += 1;
        standings[homeTeam].draws += 1;
        standings[awayTeam].draws += 1;
    } else { // 15% chance away team wins (85% to 100%)
        standings[awayTeam].points += 3;
        standings[awayTeam].wins += 1;
        standings[homeTeam].losses += 1;
    }
}

// Function to play first four rounds with fixed results (all home wins/draws)
function playFixedRounds() {
    // Round 1
    standings['Team A'].points += 3; // Team A beats Team B (home)
    standings['Team A'].wins += 1;
    standings['Team B'].losses += 1;
    standings['Team C'].points += 1; // Team C draws with Team D (home)
    standings['Team D'].points += 1;
    standings['Team C'].draws += 1;
    standings['Team D'].draws += 1;

    // Round 2
    standings['Team A'].points += 3; // Team A beats Team C (home)
    standings['Team A'].wins += 1;
    standings['Team C'].losses += 1;
    standings['Team D'].points += 3; // Team D beats Team B (home)
    standings['Team D'].wins += 1;
    standings['Team B'].losses += 1;

    // Round 3
    standings['Team A'].points += 3; // Team A beats Team D (home)
    standings['Team A'].wins += 1;
    standings['Team D'].losses += 1;
    standings['Team C'].points += 3; // Team C beats Team B (home)
    standings['Team C'].wins += 1;
    standings['Team B'].losses += 1;

    // Round 4
    standings['Team D'].points += 3; // Team D beats Team B (home)
    standings['Team D'].wins += 1;
    standings['Team B'].losses += 1;
    standings['Team A'].points += 3; // Team A beats Team C (home)
    standings['Team A'].wins += 1;
    standings['Team C'].losses += 1;
}

// Simulate remaining matches (home and away)
function playRemainingMatches() {
    const matches = [
        ['Team B', 'Team C'], // Team B vs Team C (home)
        ['Team C', 'Team D'], // Team C vs Team D (home)
        ['Team D', 'Team A'], // Team D vs Team A (home)
        ['Team A', 'Team B'], // Team A vs Team B (away, Round 1 was home)
    ];

    matches.forEach(([home, away]) => simulateMatch(home, away));
}

// Display results
function displayStandings() {
    console.log('Final Standings:');
    console.log('Team\t\tPoints\tW\tD\tL');
    teams.forEach(team => {
        const stats = standings[team];
        console.log(`${team.padEnd(12)}\t${stats.points}\t${stats.wins}\t${stats.draws}\t${stats.losses}`);
    });

    // Determine winner (must have highest points, considering remaining matches)
    const sortedTeams = Object.entries(standings)
        .sort((a, b) => b[1].points - a[1].points);
    console.log(`\nWinner: ${sortedTeams[0][0]} with ${sortedTeams[0][1].points} points`);
}

// Run multiple simulations to calculate odds
function runSimulations(numSimulations) {
    const winCount = {};

    for (let sim = 0; sim < numSimulations; sim++) {
        // Reset standings for each simulation
        standings = teams.reduce((acc, team) => {
            acc[team] = { points: 0, wins: 0, draws: 0, losses: 0 };
            return acc;
        }, {});

        playFixedRounds(); // Fixed first four rounds
        playRemainingMatches(); // Simulate the rest
        
        // Find winner (Team B can't win with 0 points and max 12 remaining)
        const sortedTeams = Object.entries(standings)
            .sort((a, b) => b[1].points - a[1].points);
        const winner = sortedTeams[0][0];
        winCount[winner] = (winCount[winner] || 0) + 1;
    }

    console.log(`\nSimulated ${numSimulations} tournaments. Winning odds:`);
    teams.forEach(team => {
        const wins = winCount[team] || 0;
        const percentage = ((wins / numSimulations) * 100).toFixed(2);
        console.log(`${team}: ${percentage}% (${wins} wins)`);
    });
}

// Run one tournament and show standings
console.log('Single Tournament Simulation:');
playFixedRounds();
playRemainingMatches();
displayStandings();

// Run 1000 simulations to estimate odds
console.log('\nRunning 1000 Simulations...');
runSimulations(1000); */