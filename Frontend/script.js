const baseURL = "http://localhost:3000";

// Elementos del DOM
const libroForm = document.getElementById("libroForm");
const libroIdForm = document.getElementById("libroId");
const libroTitleInput = document.getElementById("libroTitle");
const libroAutorInput = document.getElementById("libroAutor");
const librosTableBody = document.getElementById("librosTableBody");
const saveBtn = document.getElementById("saveBtn");
const updateBtn = document.getElementById("updateBtn");
const libroIdInput = document.getElementById("libroId");

let librosData = [];

async function fetchLibros() {
  const response = await fetch(`${baseURL}/libros`);
  //console.log(response.json());
  librosData = await response.json();
  librosTableBody.innerHTML = "";
  librosData.forEach((libro) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>
            <button onclick="editLibro('${libro._id}')">Editar</button>
            <button onclick="deleteLibro('${libro._id}')">Eliminar</button>
        </td>
    `;
    librosTableBody.appendChild(row);
  });
}

async function createLibro() {
  const titulo = libroTitleInput.value;
  const autor = libroAutorInput.value;
  const libro = { titulo, autor };

  await fetch(`${baseURL}/libros`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(libro),
  });

  libroForm.reset();
  fetchLibros();
}

async function updateLibro() {
  const id = libroIdInput.value;
  const titulo = libroTitleInput.value;
  const autor = libroAutorInput.value;
  const libro = { titulo, autor };

  await fetch(`${baseURL}/libros/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(libro),
  });

  libroForm.reset();
  libroIdInput.value = "";
  saveBtn.style.display = "inline-block";
  updateBtn.style.display = "none";
  fetchLibros();
}

function editLibro(id) {
  const libro = librosData.find((libro) => libro._id === id);
  libroIdInput.value = libro._id;
  libroTitleInput.value = libro.titulo;
  libroAutorInput.value = libro.autor;

  saveBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
}

async function deleteLibro(id) {
  if (confirm("Deseas eliminar el libro?")) {
    await fetch(`${baseURL}/libros/${id}`, {
      method: "DELETE",
    });
    fetchLibros();
  }
}

saveBtn.addEventListener("click", createLibro);
updateBtn.addEventListener("click", updateLibro);

fetchLibros();
