let currentPage = 1;
const itemsPerPage = 5;
let currentUrl = `http://localhost:3000/results/`;
const aliveUrl = `&status=Alive`;
const deadUrl = `&status=Dead`;
const unknownUrl = `&status=unknown`;
let currentFilter = "Alive";
let totalItems = 0;

const cardsContainer = document.getElementById("cards-container");
const nextPage = document.getElementById("next-page");
const prevPage = document.getElementById("prev-page");
const unknown = document.getElementById("radio-unknown");
const dead = document.getElementById("radio-dead");
const alive = document.getElementById("radio-alive");
const searchInput = document.getElementById("search-input");
const addItemBtn = document.getElementById("addBtn");

async function fetchData(filter) {
  try {
    if (filter) {
      const response = await fetch(
        `${currentUrl}?_page=${currentPage}&_limit=${itemsPerPage}${filter}`
      );

      const totalCount = response.headers.get("X-Total-Count");
      totalItems = totalCount ? parseInt(totalCount, 10) : totalItems;

      const result = await response.json();
      return result;
    } else {
      const response = await fetch(
        `${currentUrl}?_page=${currentPage}&_limit=${itemsPerPage}`
      );

      const totalCount = response.headers.get("X-Total-Count");
      totalItems = totalCount ? parseInt(totalCount, 10) : totalItems;

      const result = await response.json();
      console.log(result);
      return result;
    }
  } catch (error) {
    console.log(error);
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
  console.log("show alert");
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

  const deleteButton = createElement("button", { class: "deleteButton" });
  deleteButton.textContent = "Usuń postać";
  deleteButton.addEventListener("click", () => {
    deleteCharacter(character.id);
  });

  card.append(image, name, status, genre, deleteButton);
  return card;
}

function displayCards(items) {
  cardsContainer.innerHTML = "";

  if (items.length > 0) {
    items.forEach((character) => {
      const card = cardCreator(character);
      cardsContainer.appendChild(card);
    });
  } else {
    showAlert();
  }
}

async function updatePage(filter) {
  const data = await fetchData(filter);

  if (data) {
    displayCards(data);

    const maxPage = Math.ceil(totalItems / itemsPerPage);
    nextPage.disabled = currentPage >= maxPage;
    prevPage.disabled = currentPage <= 1;
  }
}

function handleInput(query) {
  if (currentFilter || query.trim() === "") {
    updatePage(`&status=${currentFilter}`);
  }

  if (query) {
    updatePage(`&status=${currentFilter}&name_like=${query}`);
    console.log("dziala");
  }
}

async function deleteCharacter(id) {
  try {
    fetch(`${currentUrl}${id}`, { method: "DELETE" });
  } catch (e) {
    console.log("Error: ", e);
  }
}

function newCharacterForm() {
  const main = document.getElementById("main");
  const addItem = createElement("form", { id: "add-item" });
  const title = createElement("h1");

  title.textContent = "Stwórz postać";

  const alert = createElement("span");
  alert.textContent = "Uzupełnij formularz";
  alert.style.color = "red";
  alert.style.display = "none";

  const name = createElement("input", {
    id: "new-name",
    type: "text",
    name: "input",
    placeholder: "Nazwa postaci",
  });

  const status = createElement("select", {
    name: "status",
    id: "select",
  });
  const aliveStatus = createElement("option", { value: "Alive" });
  aliveStatus.textContent = "Alive";
  const deadStatus = createElement("option", { value: "Dead" });
  deadStatus.textContent = "Dead";
  const unknownStatus = createElement("option", { value: "unknown" });
  unknownStatus.textContent = "unknown";
  status.append(aliveStatus, deadStatus, unknownStatus);

  const genre = createElement("input", {
    id: "new-genre",
    type: "text",
    name: "input",
    placeholder: "Rasa",
  });
  const addBtn = createElement("button", { id: "addBtn", class: "btn" });
  addBtn.textContent = "Stwórz";

  addItem.append(title, name, status, genre, alert, addBtn);
  main.appendChild(addItem);

  addBtn.addEventListener("click", (event) => {
    event.preventDefault();

    if (name.value.trim() === "" || genre.value.trim() === "") {
      alert.style.display = "block";
    } else {
      alert.style.display = "none";
      appendNewCharacter();
    }
  });
}

async function appendNewCharacter() {
  const nameInput = document.getElementById("new-name");
  const statusSelect = document.getElementById("select");
  const genreInput = document.getElementById("new-genre");
  const image = "https://rickandmortyapi.com/api/character/avatar/3.jpeg";

  try {
    const postData = {
      name: `${nameInput.value}`,
      status: `${statusSelect.value}`,
      species: `${genreInput.value}`,
      image: `${image}`,
    };

    const response = await fetch(currentUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}

nextPage.addEventListener("click", () => {
  currentPage++;
  updatePage(`&status=${currentFilter}`);
});
prevPage.addEventListener("click", () => {
  currentPage--;
  updatePage(`&status=${currentFilter}`);
});

alive.addEventListener("change", () => {
  currentFilter = "Alive";

  if (searchInput.value != "") {
    handleInput(searchInput.value);
  } else updatePage(aliveUrl);
});

dead.addEventListener("change", () => {
  currentFilter = "Dead";

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
newCharacterForm();
