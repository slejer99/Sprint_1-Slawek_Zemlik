const currentUrl = "https://rickandmortyapi.com/api/character/";
const aliveUrl = "https://rickandmortyapi.com/api/character/?status=alive";
const deadUrl = "https://rickandmortyapi.com/api/character/?status=dead";
const unknownUrl = "https://rickandmortyapi.com/api/character/?status=unknown";
let nextUrl = null;
let prevUrl = null;
let previousState = null;

const cardsContainer = document.getElementById("cards-container");
const nextPage = document.getElementById("next-page");
const prevPage = document.getElementById("prev-page");
const unknown = document.getElementById("radio-unknown");
const dead = document.getElementById("radio-dead");
const alive = document.getElementById("radio-alive");
const searchInput = document.getElementById("search-input");
let currentFilter = "";

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    showAlert();
  }
}

function createElement(nameOfElement, attrs) {
  const newElement = document.createElement(nameOfElement);
  if (attrs) {
    for (const key in attrs) {
      const value = attrs[key];
      if (Array.isArray(value)) {
        value.forEach((item) => newElement.classList.add(item));
      } else newElement.setAttribute(key, attrs[key]);
    }
    return newElement;
  } else return newElement;
}

function showAlert() {
  const alert = createElement("p", { id: "alert" });
  alert.textContent =
    "Nie znaleziono postaci spełniających kryteria wyszukiwania";
  cardsContainer.innerHTML = "";
  cardsContainer.appendChild(alert);
}

function cardCreator(character) {
  const card = createElement("div", { class: "card" });

  const image = createElement("img", {
    class: "card-img",
    src: `${character.image}`,
    alt: `${character.name} image`,
  });

  const name = createElement("p", { class: "card-name" });
  name.textContent = `${character.name}`;

  const status = createElement("p");
  status.textContent = `Status: ${character.status}`;

  const genre = createElement("p");
  genre.textContent = `Gatunek: ${character.species}`;

  card.append(image, name, status, genre);
  return card;
}

function displayCards(items) {
  cardsContainer.innerHTML = "";

  if (items) {
    items.forEach((character) => {
      const card = cardCreator(character);
      cardsContainer.appendChild(card);
    });
  } else {
    showAlert();
  }
}

async function updatePage(url) {
  const data = await fetchData(url);

  if (data) {
    previousState = { results: [...(data.results || [])], nextUrl, prevUrl };

    displayCards(data.results);
    nextUrl = data.info.next;
    prevUrl = data.info.prev;
  }
}

function handleInput(query) {
  if (currentFilter || query.trim() === "") {
    updatePage(`${currentUrl}?status=${currentFilter}`);
  }

  if (query) {
    updatePage(`${currentUrl}?status=${currentFilter}&name=${query}`);
  }
}

nextPage.addEventListener("click", () => {
  updatePage(nextUrl);
});
prevPage.addEventListener("click", () => {
  if (previousState) {
    displayCards(previousState.results);
    nextUrl = previousState.nextUrl;
    prevUrl = previousState.prevUrl;
  } else updatePage(prevUrl);
});

alive.addEventListener("change", () => {
  currentFilter = "alive";

  if (searchInput.value != "") {
    handleInput(searchInput.value);
  } else updatePage(aliveUrl);
});

dead.addEventListener("change", () => {
  currentFilter = "dead";

  if (searchInput.value != "") {
    handleInput(searchInput.value);
  } else updatePage(deadUrl);
});

unknown.addEventListener("change", () => {
  currentFilter = "unknown";

  if (searchInput.value != "") {
    handleInput(searchInput.value);
  } else updatePage(unknownUrl);
});

searchInput.addEventListener("input", (event) => {
  const query = event.target.value;
  handleInput(query);
});

updatePage(aliveUrl);
