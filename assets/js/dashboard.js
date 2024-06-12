import {
    getDataAPIZone01,
} from "./api.js";

const userToken = sessionStorage.getItem('userToken');

if (userToken == "") {
    window.location.href = `/index.html`;
}

const urlData = "https://zone01normandie.org/api/graphql-engine/v1/graphql"

const query = `query{
    user{
      login
      attrs
    }
  }
            `
getDataAPIZone01(urlData, query)
    .then(responseData => {
        header(responseData.data.user)
        profileInformation(responseData.data.user)

    })


const query2 = `query {
  transaction(where: { 
    _or: [
      { type: { _eq: "up" } },
      { type: { _eq: "down" } }
    ]
  }) {
    type
    amount
    path
  }
}
                `

getDataAPIZone01(urlData, query2)
    .then(responseData => {
        ratioAudits(responseData.data.transaction)
    })



const query3 = `query{
  transaction(where: { type: { _eq: "xp" }}){
    type
    amount
    path
  }
}
                `

getDataAPIZone01(urlData, query3)
    .then(responseData => {
        xpAmount(responseData.data.transaction)
    })




const query4 = `query{
  transaction(where: { type: { _like: "skill_%" }}){
    type
    amount
    path
  }
}
                `

getDataAPIZone01(urlData, query4)
    .then(responseData => {
        skillProg(responseData.data.transaction)
    })






function header(responseData) {

    const loginName = document.getElementById('loginName')

    responseData.forEach(element => {
        loginName.innerText = element.login
    });
}

function profileInformation(responseData) {

    responseData.forEach(element => {
        document.getElementById('firstName').innerText += " " + element.attrs.firstName
        document.getElementById("lastName").innerText += " " + element.attrs.lastName
        document.getElementById('phoneNumber').innerText += " " + phoneNumber(element.attrs.Phone)
        document.getElementById('email').innerText += " " + element.attrs.email
        document.getElementById('gender').innerText += " " + element.attrs.gender
        document.getElementById('situation').innerText += " " + element.attrs.Situation
        document.getElementById('addressCity').innerText += " " + element.attrs.addressStreet + " " + element.attrs.addressCity + " " + element.attrs.addressPostalCode + " " + element.attrs.addressCountry
        document.getElementById('birth').innerText += " " + dateOfBirth(element.attrs.dateOfBirth) + " à " + element.attrs.placeOfBirth + " en " + element.attrs.countryOfBirth
    });
}

function ratioAudits(responseData) {
    let up = 0;
    let down = 0;

    responseData.forEach(element => {

        if (element.type == "up") {
            up = up + element.amount
        } else if (element.type == "down") {
            down = down + element.amount
        }
    });


    let big;
    if (up > down) {
        big = up
    } else {
        big = down
    }

    let unity;
    if (big < 1000) {
        unity = "B"
    } else if (big < 1000000) {
        unity = "kB"
    } else if (big < 1000000000) {
        unity = "mB"
    } else if (big < 1000000000000) {
        unity = "gB"
    }



    if (up > down) {
        document.getElementById('rectRatioDone').style.width = "100%"
        let percent = (down / up) * 100
        document.getElementById('rectRatioReceived').style.width = parseFloat(percent.toFixed(0)) + "%"
    } else {
        document.getElementById('rectRatioReceived').style.width = "100%"
        let percent = (up / down) * 100
        document.getElementById('rectRatioDone').style.width = parseFloat(percent.toFixed(0)) + "%"
    }

    switch (unity) {
        case "B":
            document.getElementById('xpRatioDone').innerText = parseFloat(up.toFixed(2)) + " " + unity
            document.getElementById('xpRatioReceived').innerText = parseFloat(down.toFixed(2)) + " " + unity
            break;
        case "kB":
            document.getElementById('xpRatioDone').innerText = parseFloat((up / 1000).toFixed(2)) + " " + unity
            document.getElementById('xpRatioReceived').innerText = parseFloat((down / 1000).toFixed(2)) + " " + unity
            break;
        case "mB":
            document.getElementById('xpRatioDone').innerText = parseFloat((up / 1000000).toFixed(2)) + " " + unity
            document.getElementById('xpRatioReceived').innerText = parseFloat((down / 1000000).toFixed(2)) + " " + unity
            break;
        case "gB":
            document.getElementById('xpRatioDone').innerText = parseFloat((up / 1000000000).toFixed(2)) + " " + unity
            document.getElementById('xpRatioReceived').innerText = parseFloat((down / 1000000000).toFixed(2)) + " " + unity
            break;
    }



    let ration = up / down

    let rationForm = parseFloat(ration.toFixed(1));

    document.getElementById('pRatio').innerText = "Ratio : " + rationForm

}

function xpAmount(responseData) {

    let piscineGo = 0;
    let piscineJs = 0;
    let div01 = 0;

    responseData.forEach(element => {

        if (element.path.startsWith('/rouen/piscine-go/') && element.type == "xp") {
            piscineGo = piscineGo + element.amount
        }
        if (element.path.startsWith('/rouen/div-01/piscine-js/') && element.type == "xp") {
            piscineJs = piscineJs + element.amount
        }
        if (element.path.startsWith('/rouen/div-01') && !element.path.includes('/piscine-js/') && element.type === "xp") {
            div01 = div01 + element.amount
        }
    });


    let big;
    if (piscineGo > piscineJs) {
        if (piscineGo > div01) {
            big = piscineGo
        } else {
            big = div01
        }
    } else if (piscineJs > div01) {
        big = piscineJs
    } else {
        big = div01
    }

    if (big == piscineGo) {
        document.getElementById('rectPiscineGo').style.height = 250
        document.getElementById('rectPiscineGo').style.y = 80
        document.getElementById('textNBPiscineGo').setAttribute('y', 60)

        let percent = (div01 / piscineGo) * 100
        percent = parseFloat(percent.toFixed(0))

        document.getElementById('rectDiv01').style.height = (percent * 250) / 100
        document.getElementById('rectDiv01').style.y = 230 - (((percent * 250) / 100) - 100)
        document.getElementById('textNBDiv01').setAttribute('y', (230 - (((percent * 250) / 100) - 100)) - 20)

        percent = (piscineJs / piscineGo) * 100
        percent = parseFloat(percent.toFixed(0))

        document.getElementById('rectPiscineJs').style.height = (percent * 250) / 100
        document.getElementById('rectPiscineJs').style.y = 230 - (((percent * 250) / 100) - 100)
        document.getElementById('textNBPiscineJs').setAttribute('y', (230 - (((percent * 250) / 100) - 100)) - 20)

    } else if (big == div01) {
        document.getElementById('rectDiv01').style.height = 250
        document.getElementById('rectDiv01').style.y = 80
        document.getElementById('textNBDiv01').setAttribute('y', 60)

        let percent = (piscineGo / div01) * 100
        percent = parseFloat(percent.toFixed(0))

        document.getElementById('rectPiscineGo').style.height = (percent * 250) / 100
        document.getElementById('rectPiscineGo').style.y = 230 - (((percent * 250) / 100) - 100)
        document.getElementById('textNBPiscineGo').setAttribute('y', (230 - (((percent * 250) / 100) - 100)) - 20)

        percent = (piscineJs / div01) * 100
        percent = parseFloat(percent.toFixed(0))

        document.getElementById('rectPiscineJs').style.height = (percent * 250) / 100
        document.getElementById('rectPiscineJs').style.y = 230 - (((percent * 250) / 100) - 100)
        document.getElementById('textNBPiscineJs').setAttribute('y', (230 - (((percent * 250) / 100) - 100)) - 20)

    } else {
        document.getElementById('rectPiscineJs').style.height = 250
        document.getElementById('rectPiscineJs').style.y = 80
        document.getElementById('textNBPiscineJs').setAttribute('y', 60)

        let percent = (piscineGo / piscineJs) * 100
        percent = parseFloat(percent.toFixed(0))

        document.getElementById('rectPiscineGo').style.height = (percent * 250) / 100
        document.getElementById('rectPiscineGo').style.y = 230 - (((percent * 250) / 100) - 100)
        document.getElementById('textNBPiscineGo').setAttribute('y', (230 - (((percent * 250) / 100) - 100)) - 20)

        percent = (div01 / piscineJs) * 100
        percent = parseFloat(percent.toFixed(0))

        document.getElementById('rectDiv01').style.height = (percent * 250) / 100
        document.getElementById('rectDiv01').style.y = 230 - (((percent * 250) / 100) - 100)
        document.getElementById('textNBDiv01').setAttribute('y', (230 - (((percent * 250) / 100) - 100)) - 20)
    }

    let unity;
    if (piscineGo < 1000) {
        unity = "B"
    } else if (piscineGo < 1000000) {
        unity = "kB"
    } else if (piscineGo < 1000000000) {
        unity = "mB"
    } else if (piscineGo < 1000000000000) {
        unity = "gB"
    }

    switch (unity) {
        case "B":
            document.getElementById('textNBPiscineGo').textContent = parseFloat(piscineGo.toFixed(2)) + " " + unity
            break;
        case "kB":
            document.getElementById('textNBPiscineGo').textContent = parseFloat((piscineGo / 1000).toFixed(2)) + " " + unity
            break;
        case "mB":
            document.getElementById('textNBPiscineGo').textContent = parseFloat((piscineGo / 1000000).toFixed(2)) + " " + unity
            break;
        case "gB":
            document.getElementById('textNBPiscineGo').textContent = parseFloat((piscineGo / 1000000000).toFixed(2)) + " " + unity
            break;
    }

    if (div01 < 1000) {
        unity = "B"
    } else if (div01 < 1000000) {
        unity = "kB"
    } else if (div01 < 1000000000) {
        unity = "mB"
    } else if (div01 < 1000000000000) {
        unity = "gB"
    }



    switch (unity) {
        case "B":
            document.getElementById('textNBDiv01').textContent = parseFloat(div01.toFixed(2)) + " " + unity
            break;
        case "kB":
            document.getElementById('textNBDiv01').textContent = parseFloat((div01 / 1000).toFixed(2)) + " " + unity
            break;
        case "mB":
            document.getElementById('textNBDiv01').textContent = parseFloat((div01 / 1000000).toFixed(2)) + " " + unity
            break;
        case "gB":
            document.getElementById('textNBDiv01').textContent = parseFloat((div01 / 1000000000).toFixed(2)) + " " + unity
            break;
    }


    if (piscineJs < 1000) {
        unity = "B"
    } else if (piscineJs < 1000000) {
        unity = "kB"
    } else if (piscineJs < 1000000000) {
        unity = "mB"
    } else if (piscineJs < 1000000000000) {
        unity = "gB"
    }


    switch (unity) {
        case "B":
            document.getElementById('textNBPiscineJs').textContent = parseFloat(piscineJs.toFixed(2)) + " " + unity
            break;
        case "kB":
            document.getElementById('textNBPiscineJs').textContent = parseFloat((piscineJs / 1000).toFixed(2)) + " " + unity
            break;
        case "mB":
            document.getElementById('textNBPiscineJs').textContent = parseFloat((piscineJs / 1000000).toFixed(2)) + " " + unity
            break;
        case "gB":
            document.getElementById('textNBPiscineJs').textContent = parseFloat((piscineJs / 1000000000).toFixed(2)) + " " + unity
            break;
    }






}

function skillProg(responseData) {

    var data = [{
            name: "skill_unix",
            color: "red",
            value: 0
        },
        {
            name: "skill_docker",
            color: "pink",
            value: 0
        },
        {
            name: "skill_css",
            color: "blue",
            value: 0
        },
        {
            name: "skill_sql",
            color: "green",
            value: 0
        },
        {
            name: "skill_js",
            color: "yellow",
            value: 0
        },
        {
            name: "skill_prog",
            color: "purple",
            value: 0
        },
        {
            name: "skill_html",
            color: "orange",
            value: 0
        },
        {
            name: "skill_algo",
            color: "brown",
            value: 0
        },
        {
            name: "skill_sys-admin",
            color: "aquamarine",
            value: 0
        },
        {
            name: "skill_go",
            color: "cyan",
            value: 0
        },
        {
            name: "skill_front-end",
            color: "lime",
            value: 0
        },
        {
            name: "skill_back-end",
            color: "silver",
            value: 0
        },
        {
            name: "skill_stats",
            color: "blueviolet",
            value: 0
        },
        {
            name: "skill_ai",
            color: "fuchsia",
            value: 0
        },
        {
            name: "skill_game",
            color: "salmon",
            value: 0
        },
        {
            name: "skill_tcp",
            color: "gray",
            value: 0
        },
    ];

    data.forEach(elements => {
        responseData.forEach(element => {
            if (element.type == elements.name) {
                elements.value += element.amount
            }
        });
    });

    let dataValue = [];
    data.forEach(element => {
        dataValue.push(element.value)
    });

    const total = dataValue.reduce((acc, val) => acc + val, 0);
    let cumulativeAngle = 0;

    // Trier du plus petit au plus grand
    data.sort((a, b) => a.value - b.value);

    data.forEach(element => {
        const sliceAngle = (element.value / total) * 2 * Math.PI;
        const x1 = Math.cos(cumulativeAngle);
        const y1 = Math.sin(cumulativeAngle);
        cumulativeAngle += sliceAngle;
        const x2 = Math.cos(cumulativeAngle);
        const y2 = Math.sin(cumulativeAngle);
        const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

        const pathData = [
            `M 0 0`,
            `L ${x1} ${y1}`,
            `A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`
        ].join(' ');

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", element.color);

        document.getElementById("slices").appendChild(path);
    });

    const legendGraph = document.getElementById('legendGraphSkills');

    const leftSection = document.createElement('div');
    leftSection.className = 'legendSection';
    legendGraph.appendChild(leftSection);

    const rightSection = document.createElement('div');
    rightSection.className = 'legendSection';
    legendGraph.appendChild(rightSection);

    const middleIndex = Math.ceil(data.length / 2);

    data.forEach((element, index) => {
        const divOneLegend = document.createElement('div');
        divOneLegend.className = "legendItem";

        const divColor = document.createElement('div');
        divColor.className = "legendColor";
        divColor.style.backgroundColor = element.color;

        const p = document.createElement('p');
        p.innerText = element.name.split('_')[1] + " : " + element.value;

        divOneLegend.appendChild(divColor);
        divOneLegend.appendChild(p);

        if (index < middleIndex) {
            leftSection.appendChild(divOneLegend);
        } else {
            rightSection.appendChild(divOneLegend);
        }
    });
}


const divDisconnect = document.getElementById('divDisconnect')
divDisconnect.addEventListener('click', () => {
    sessionStorage.setItem('userToken', "");
    window.location.href = `/index.html`;
})

function phoneNumber(params) {
    // Suppression des caractères non numériques
    let digits = params.replace(/\D/g, '');

    // Vérification que le numéro contient 10 chiffres
    if (digits.length !== 10) {
        return 'Numéro invalide';
    }

    // Formatage du numéro en groupes de deux chiffres
    let formattedNumber = digits.replace(/(\d{2})(?=\d)/g, '$1 ');

    return formattedNumber.trim();

}

function dateOfBirth(params) {
    // Création d'un objet Date à partir de la chaîne ISO 8601
    let date = new Date(params);

    // Tableau des noms des mois
    const months = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];

    // Extraction du jour, du mois et de l'année
    let day = date.getDate();
    let month = months[date.getMonth()]; // Les mois commencent à 0
    let year = date.getFullYear();

    // Formatage de la date en jour mois année
    return `${day} ${month} ${year}`;
}