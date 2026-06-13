const countryForm = document.getElementById("countryForm");
const result = document.getElementById("result");
const error = document.getElementById("error");
const successMessage = document.getElementById("successMessage");

const userName = document.querySelector("#name");
const email = document.querySelector("#email");
const pass1 = document.querySelector("#password1");
const pass2 = document.querySelector("#password2");
const resetBtn = document.querySelector("#reset");
const submitBtn = document.querySelector("#submit");

let allCountries = [];

async function fetchCountries() {
  try {
    const res = await fetch(
      "https://api.restcountries.com/countries/v5?q=stan&limit=200",
      {
        headers: {
          Authorization: "Bearer rc_live_a9de5ffa2eab4e35b476f87a411cc37f"
        }
      }
    );

    const json = await res.json();

    const list = json.data;

allCountries = list.map(c => ({
  name: c.names.common,
  flag: c.flag.png
}));
    renderCountries(allCountries);
  } catch (err) {
    console.error(err);
    if (error) error.textContent = "Nie udało się pobrać krajów.";
  }
}

function renderCountries(countries) {
  const container = document.getElementById("countries");
  if (!container) return;

  container.innerHTML = "";

  countries.forEach(country => {
    const card = document.createElement("div");
    card.className = "country-card";

    card.innerHTML = `
      <div style="font-size:2rem">${country.flag}</div>
      <h3>${country.name}</h3>
    `;

    container.appendChild(card);
  });
}

function setupSearch() {
  const input = document.getElementById("search");
  if (!input) return;

  input.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();

    const filtered = allCountries.filter(c =>
      c.name.toLowerCase().includes(value)
    );

    renderCountries(filtered);
  });
}

if (countryForm) {
  countryForm.addEventListener("submit", e => {
    e.preventDefault();

    if (pass1 && pass2 && pass1.value !== pass2.value) {
      if (error) error.textContent = "Hasła nie są takie same!";
      return;
    }

    if (successMessage) successMessage.textContent = "Formularz wysłany poprawnie!";
    if (error) error.textContent = "";

    countryForm.reset();
  });
}

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    countryForm.reset();
    if (error) error.textContent = "";
    if (successMessage) successMessage.textContent = "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchCountries();
  setupSearch();
});