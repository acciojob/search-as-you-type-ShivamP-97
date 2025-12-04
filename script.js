const input = document.getElementById("search-input");
const resultsDiv = document.getElementById("search-results");

let debounceTimer = null;
let lastQueryId = 0;

async function searchUrbanDictionary(term, queryId) {
  const url = `https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${encodeURIComponent(term)}`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "c3a9a6b376msh528c0d78a1c317ap1759efjsn28df182c8b4f",
      "X-RapidAPI-Host": "mashape-community-urban-dictionary.p.rapidapi.com"
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (queryId !== lastQueryId) return;

    renderResults(data.list);
  } catch (err) {
    renderNoResults();
  }
}

function renderResults(list) {
  resultsDiv.innerHTML = "";

  if (!list || list.length === 0) {
    renderNoResults();
    return;
  }

  list.forEach(item => {
    const div = document.createElement("div");
    div.className = "result";

    const customPermalink = `http://${item.word.toLowerCase()}.urbanup.com/`;

    div.innerHTML = `
      <div class="result-title">${item.word}</div>
      <div class="result-snippet">${item.definition}</div>
      <a class="result-url" href="${customPermalink}" target="_blank">${customPermalink}</a>
    `;

    resultsDiv.appendChild(div);
  });
}

function renderNoResults() {
  resultsDiv.innerHTML = "";
  const div = document.createElement("div");
  div.textContent = "No results found.";
  resultsDiv.appendChild(div);
}

input.addEventListener("input", () => {
  const term = input.value.trim();

  if (term === "") {
    resultsDiv.innerHTML = "";
    return;
  }

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    lastQueryId++;
    searchUrbanDictionary(term, lastQueryId);
  }, 500);
});
