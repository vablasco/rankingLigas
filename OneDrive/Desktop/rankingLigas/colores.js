export function colores(name) {

    let teamColorss1 = {
        'River Plate' : ['linea', "#fff", "#E2211C"],
        Estudiantes: ["rayado", "#FB0306", "#fff"],
        Huracán: ['dos lineas', "#fff", "#FB0306"],
        "Argentinos Juniors": ["linea fina", "#FB0306", "#fff"],
        "Newell's Old Boys": ["linea gruesa", "#000", "#E81F1F"],
        "Boca Juniors": ["linea", "#005EAE", "#FFD900"],
        Temperley: ["linea", "#fff", "#21bbef"],
        Quilmes: ["linea", "#fff", "#123567"],
        Riestra: ["linea", "#fff", "#000"],
        "All Boys": ["linea", "#fff", "#000"],
        "Independiente Rivadavia": ["linea", "#381972", "#fff"],
        "San Lorenzo": ["linea", "#EC212D", "#273B56"],
        Banfield: ["rayado", "#fff", "#219D3F"],
        Independiente: ["linea", "#bf0811", "#fff"],
        Ferro: ["linea", "#156538", "#fff"],
        "Deportivo Mandiyú": ["linea", "#fff", "#14a943"],
        Lanús: ["linea", "#62162C", "#fff", "#fff"],
        Racing: ["rayado", "#00AFE9", "#fff"],
        "Gimnasia (S)": ["rayado", "#fff", "#29b0e3"],
        "Atlético Rafaela": ["rayado", "#fff", "#0084c9"],
        "Godoy Cruz": ["linea", "#0071D5", "#Fff"],
        Colón: ["linea", "#D6161C", "#000"],
        "Barracas Central": ["rayado", "#fff", "#FB0306"],
        "San Martín (T)": ["rayado", "#FB0306", "#fff"],
        "Rosario Central": ["rayado", "#FFCB05", "#004070"],
        Arsenal: ["linea", "#12ACDE", "#DB2E26"],
        Tigre: ["linea", "#2A247A", "#BF1D26"],
        Gimnasia: ["linea", "#fff", "#11195C"],
        "Vélez Sarsfield": ["linea", "#fff", "#0469c8"],
        "Los Andes": ["rayado", "#fff", "#FB0306"],
        "Nueva Chicago": ["rayado", "#000", "#116d3d"],
        "San Martín (SJ)": ["rayado", "#000", "#40ab35"],
        "Huracán (C)": ["rayado", "#281371", "#de341a"],
        "Chacarita Juniors": ["rayado", "#000", "#fd1000"],
        Almagro: ["rayado", "#030202", "#6a8ac6"],
        Olimpo: ["rayado", "#000", "#ffe700"],
        Unión: ["linea gruesa", "#FB0306", "#fff"],
        "Deportivo Español": ["linea gruesa", "#fff", "#dc0c15"],
        "Tiro Federal": ["linea gruesa", "#207caa", "#fff"],
        Sarmiento: ["linea", "#008447", "#fff"],
        Platense: ["linea", "#fff", "#804b19"],
        Talleres: ["linea", "#000c66", "#Fff"],
        "Defensa y Justicia": ["linea", "#007329", "#FFDE00"],
        Patronato: ["linea", "#1A1310", "#DB2420"],
        "Atlético Tucumán": ["rayado", "#fff", "#62BDF1"],
        "Central Córdoba": ["rayado", "#000", "#fff"],
        Aldosivi: ["linea", "#00903B", "#FCCB00"],
        Belgrano: ["linea", "#109fd5", "#000"],
        Instituto: ["linea gruesa", "#fff", "#e31428"],
        "Gimnasia (J)": ["linea", "#fff", "#20A1E2"],
        "Bragantino": ["rayado", "#d61f40", "#fff"],
        "Blooming": ["rayado", "#599cd2", "#266faa"],
        Carabobo: ["rayado", "#592022", "#fff"],
        Olimpia: ["rayado", "#000000", "#ffffff"],
        Macara: ["dos lineas", "#3397c4", "#ffffff"],
        Juventud: ["linea", "#ffffff", "#2e5099"],
        'Vasco Da Gama': ["linea", "#000000", "#ffffff"],
        Santos: ["rayado", "#ffffff", "#010101"],
        'Deportivo Recoleta': ["rayado", "#000000", "#cfa747"],
        'Independiente Petrolero': ["rayado", "#e90914", "#ffffff"],
        Botafogo: ["rayado", "#000000", "#fff"],
        Gremio: ["rayado", "#1f1a17", "#0d80bf"],
        Cienciano: ["rayado", "#102051", "#085680"],
        'Atletico Mineiro': ["rayado", "#000000", "#fff"],
        'Audax Italiano': ["rayado", "#049e6e", "#02855b"],
        'Palestino': ["3 colores", "#008954", "#ce2035", '#fff'],
        'Sao Paulo': ["3 colores", "#fe0000", "#000000", '#fff'],
        'Montevideo City Torque': ["rayado", "#72b0e0", "#4e8dbd"],
        'Alianza Atletico': ["linea", "#fdfdfa", "#34348e"],
        'Academia Puerto Cabello': ["rayado", "#ff4d00", "#262a81"],
        'America De Cali': ["rayado", "#b30a0a", "#cc0f0f"],
        'OHiggins': ["rayado", "#5d8dda", "#3e77d3"],
        'Millonarios': ["rayado", "#293378", "#161f5c"],
        'Boston River': ["rayado", "#016634", "#eb3236"],
        'Deportivo Cuenca': ["rayado", "#e6312d", "#9e2b27"],
        'Caracas': ["rayado", "#ee3124", "#7e221f"],
    }

    function colores1(name) {
    if (!Object.keys(teamColorss1).includes(name)) {
        return ['grey', 'grey', 'grey', 'grey']
    } else if (teamColorss1[name][0] == 'linea') {
        return [teamColorss1[name][1], teamColorss1[name][1], teamColorss1[name][2], teamColorss1[name][2]]
    } else if (teamColorss1[name][0] == 'rayado') {
        return [teamColorss1[name][1], teamColorss1[name][2], teamColorss1[name][2], teamColorss1[name][1]]
    } else if (teamColorss1[name][0] == 'dos lineas') {
        return [teamColorss1[name][1], teamColorss1[name][1], teamColorss1[name][2], teamColorss1[name][1]]
    } else if (teamColorss1[name][0] == 'linea fina') {
        return [teamColorss1[name][1], teamColorss1[name][1], teamColorss1[name][1], teamColorss1[name][2]]
    } else if (teamColorss1[name][0] == 'linea gruesa') {
        return [teamColorss1[name][1], teamColorss1[name][2], teamColorss1[name][2], teamColorss1[name][2]]
    } else if (teamColorss1[name][0] == '3 colores') {
        return [teamColorss1[name][1], teamColorss1[name][2], teamColorss1[name][2], teamColorss1[name][3]]
    } else {
        return ['grey', 'grey', 'grey', 'grey']
    }
    
    }

    return colores1(name);
}