async function connectionAPIZone01(url = '', data = {}) {

    const credentials = btoa(`${data.username}:${data.password}`);

    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`
        },
    });
    if (!response.ok) {
        // Si la réponse n'est pas OK, lève une erreur
        const divErrorLogin = document.getElementById('divErrorLogin')
        divErrorLogin.innerHTML = ""
        const pErrorLogin = document.createElement('p')
        divErrorLogin.appendChild(pErrorLogin)
        pErrorLogin.innerHTML = "Identifier or password is not correct"

        document.getElementById('floatingPassword').value = ""

    } else {

        const token = await response.json();
        // Stocker le jeton dans sessionStorage
        sessionStorage.setItem('userToken', token);
        window.location.href = `template/dashboard.html`;
    }

    return response.json(); // parses JSON response into native JavaScript objects
}

async function getDataAPIZone01(url = "", query = {}){

    const userToken = sessionStorage.getItem('userToken');

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
            query: query,
        })
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
    }

    return response.json(); // Assuming the response is JSON
}



export {
    connectionAPIZone01,
    getDataAPIZone01
}
