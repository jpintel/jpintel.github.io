import {
    connectionAPIZone01,
} from "./api.js";

var formLogin = document.getElementById('formLogin')

formLogin.addEventListener('submit', async (event) => {

    event.preventDefault()

    var formData = new FormData(formLogin)

    const identifier = formData.get('identifier')
    const password = formData.get('password')

    const data = {
        username: identifier,
        password: password
    };

    var urlLogin = "https://zone01normandie.org/api/auth/signin"

    connectionAPIZone01(urlLogin, data)
})