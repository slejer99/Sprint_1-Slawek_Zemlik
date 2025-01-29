async function getCharacters() {
  try {
    const charactersNumbers = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ];
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${charactersNumbers}`
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error:", error);
  }
}

async function postToDb() {
  try {
    const data = await getCharacters();

    if (Array.isArray(data)) {
      for (const character of data) {
        const response = await fetch(currentUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(character),
        });
        const result = await response.json();
        console.log("Dane zostaly zapisane: ", result);
      }
    } else {
      console.error("Dane nie są tablicą: ", data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

postToDb();
