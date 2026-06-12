const countryForm = document.getElementById("countryForm");
const result = document.getElementById("result");
const error = document.getElementById("error");
const successMessage = document.getElementById("successMessage");

const userName = document.querySelector('#name');
const email = document.querySelector('#email');
const pass1 = document.querySelector('#password1');
const pass2 = document.querySelector('#password2');
const resetBtn = document.querySelector('#reset');
const submitBtn = document.querySelector('#submit');

//https://cozmic-octopus.github.io/frag-app/ 

const regionTranslations = {
    Europe: "Europa",
    Asia: "Azja",
    Africa: "Afryka",
    Americas: "Ameryka",
    Antarctic: "Antarktyda"
};

function showOrHideErrorMessage(input, text) {
    const box = input.parentElement;
    const errMess = box.querySelector('.err_mess');
    errMess.textContent = text;
}

resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.err_mess').forEach(err => {
        err.textContent = '';
    });
    successMessage.textContent = '';
});

// walidacja
function checkInputLength(input, minLength) {
    const fieldName = input.previousElementSibling?.textContent
        .toLowerCase()
        .replace('*', "")
        .replace(':', "");

    if (input.value.trim().length < minLength) {
        showOrHideErrorMessage(
            input,
            `Pole ${fieldName} powinno zawierać minimum ${minLength} znaków.`
        );
    } else {
        showOrHideErrorMessage(input, "");
    }
}

function checkPasswords() {
    if (pass1.value !== pass2.value) {
        showOrHideErrorMessage(pass2, "Hasła są różne");
    } else {
        showOrHideErrorMessage(pass2, "");
    }
}

function checkEmail() {
    const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;

    if (!re.test(email.value)) {
        showOrHideErrorMessage(email, "Adres email jest niepoprawny");
    } else {
        showOrHideErrorMessage(email, "");
    }
}

// sprawdzenie formularza
function isFormValid() {
    const errors = document.querySelectorAll('.err_mess');
    return [...errors].every(err => err.textContent.trim() === "");
}

// submit formularza
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    checkInputLength(userName, 3);
    checkInputLength(pass1, 8);
    checkPasswords();
    checkEmail();

    if (isFormValid()) {
        successMessage.textContent = "Formularz został uzupełniony poprawnie ✔";
    } else {
        successMessage.textContent = "";
    }
});

countryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = document
        .getElementById("country")
        .value
        .trim()
        .toLowerCase();

    if (input.length < 2) {
        error.textContent = "Wpisz co najmniej 2 znaki";
        return;
    }

    error.textContent = "";
    result.innerHTML = "Ładowanie...";

    fetchCountry(input);
});

function fetchCountry(input) {
    fetch("https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags,translations")
        .then(res => {
            if (!res.ok) {
                throw new Error("Błąd pobierania danych");
            }
            return res.json();
        })
        .then(data => {
            const country = data.find(c => {
                const plName = c.translations?.pol?.common?.toLowerCase();
                const enName = c.name.common.toLowerCase();

                return plName?.includes(input) || enName?.includes(input);
            });

            if (!country) {
                throw new Error("Nie znaleziono kraju");
            }

            result.innerHTML = `
                <h2>${country.translations?.pol?.common || country.name.common}</h2>
                <img src="${country.flags.png}" width="150">
                <p><b>Stolica:</b> ${country.capital?.[0] || "brak danych"}</p>
                <p><b>Populacja:</b> ${country.population.toLocaleString()}</p>
                <p><b>Region:</b> ${regionTranslations[country.region] || country.region}</p>
            `;
        })
        .catch(err => {
            result.innerHTML = "";
            error.textContent = err.message;
        });
}


// PWA
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}