const form = document.getElementById("polish-form");
const collectionList = document.getElementById("collection");
const artList = document.getElementById("art-list");
const styleFilter = document.getElementById("style-filter");
const difficultyFilter = document.getElementById("difficulty-filter");

const collection = [];
const artIdeas = [
  { name: "Micro French Tips", style: "minimal", difficulty: "easy" },
  { name: "Checkerboard Pop", style: "bold", difficulty: "medium" },
  { name: "Snowflake Accent", style: "seasonal", difficulty: "medium" },
  { name: "Chrome Flame", style: "bold", difficulty: "hard" },
  { name: "Negative Space Lines", style: "minimal", difficulty: "easy" }
];

function renderCollection() {
  collectionList.innerHTML = "";
  collection.forEach((polish) => {
    const li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `
      <div>
        <strong>${polish.name}</strong>
        <div class="meta">${polish.brand} • ${polish.finish}</div>
      </div>
      <span class="swatch" style="background:${polish.hex}"></span>
    `;
    collectionList.appendChild(li);
  });
}

function renderArtIdeas() {
  const style = styleFilter.value;
  const difficulty = difficultyFilter.value;

  const filtered = artIdeas.filter((idea) => {
    const styleMatch = style === "all" || idea.style === style;
    const difficultyMatch = difficulty === "all" || idea.difficulty === difficulty;
    return styleMatch && difficultyMatch;
  });

  artList.innerHTML = "";
  filtered.forEach((idea) => {
    const li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `<div><strong>${idea.name}</strong><div class="meta">${idea.style} • ${idea.difficulty}</div></div>`;
    artList.appendChild(li);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const brand = document.getElementById("brand").value.trim();
  const finish = document.getElementById("finish").value;
  const hex = document.getElementById("hex").value;

  if (!name || !brand || !finish || !/^#([A-Fa-f0-9]{6})$/.test(hex)) {
    return;
  }

  collection.unshift({ name, brand, finish, hex });
  form.reset();
  document.getElementById("hex").value = "#ff4d6d";
  renderCollection();
});

styleFilter.addEventListener("change", renderArtIdeas);
difficultyFilter.addEventListener("change", renderArtIdeas);

renderArtIdeas();
