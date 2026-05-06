const dataContainer = document.getElementById("data")
const crearBtn = document.getElementById("crear");
const modal = document.getElementById("modal");
const cerrarBtn = document.getElementById("cerrar");
const formulario = document.getElementById("formulario");
const btnBuscar = document.getElementById("btn-buscar")
const textBuscar = document.getElementById("buscar-nombre")
document.addEventListener("DOMContentLoaded", async () => {
  const data = await getData();
  data.forEach(element => {
    const card = document.createElement("div");
    const { id, name, lastname, photo, birthDate, description, color } = element
    card.innerHTML = `
        <div class="bg-${color ? color : "cyan"}-200 rounded-lg p-3 flex flex-col items-center">
          <h3 class="font-bold text-xl mb-2 uppercase nombre">${name} ${lastname}</h3>
          <figure class="flex items-center">
            <img
              class="rounded-lg h-80"
              src="${photo}"
              alt="${name} ${lastname}"
            />
          </figure>
          <span class="text-gray-500 text-lg">Age: ${birthDate}</span>

          <article>
            <p class="text-justify">
             ${description}
            </p>
          </article>
          <div
            class="flex w-full flex-col md:flex-row gap-2 justify-between mt-3"
          >
            <button
              class="bg-orange-300 rounded-lg py-2 px-4 hover:bg-orange-600 hover:text-stone-100 cursor-pointer w-full md:w-42 btn-editar"
            >
              Editar
            </button>
            <button
              class="bg-red-300 rounded-lg py-2 px-4 hover:bg-red-600 hover:text-stone-100 cursor-pointer w-full md:w-42 btn-eliminar"
            >
              Eliminar
            </button>
          </div>
        </div>
        `
    card.querySelector(".btn-editar").addEventListener("click", () => {
      formulario.elements["id"].value = id;
      formulario.elements["name"].value = name;
      formulario.elements["lastname"].value = lastname;
      formulario.elements["birthDate"].value = birthDate;
      formulario.elements["photo"].value = photo;
      formulario.elements["description"].value = description;
      formulario.elements["color"].value = color;

      modal.classList.remove("hidden");
      modal.querySelector(".guardar").classList.add("hidden")
      modal.querySelector(".actualizar").classList.remove("hidden")
      const update = async () => {
        const formData = new FormData(formulario)
        await fetch(`http://localhost:3000/malecon/${id}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            id: formData.get("id"),
            name: formData.get("name"),
            lastname: formData.get("lastname"),
            birthDate: formData.get("birthDate"),
            photo: formData.get("photo"),
            description: formData.get("description"),
            color: formData.get("color"),
          })
        })
      }
      modal.querySelector(".actualizar").addEventListener("click", update)

    })
    card.querySelector(".btn-eliminar").addEventListener("click", () => {
      deleteData(id)
    })
    dataContainer.appendChild(card)
  });
})
btnBuscar.addEventListener("click", () => {
  const nombre = textBuscar.value.toLowerCase();
  Array.from(dataContainer.children).forEach(card => {
    const nombreCard = card
      .querySelector(".nombre")
      .innerText.toLowerCase();
    if (nombreCard.startsWith(nombre)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});
async function deleteData(id) {
  await fetch(`http://localhost:3000/malecon/${id}`, {
    method: "DELETE",
    headers: { "content-type": "application/json" }
  })
}
async function getData() {
  try {
    const response = await fetch("http://localhost:3000/malecon")
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error);
  }
}
async function postData(nuevoRegistro) {
  await fetch("http://localhost:3000/malecon", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(nuevoRegistro)
  })
}



crearBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modal.querySelector(".guardar").classList.remove("hidden")
  modal.querySelector(".actualizar").classList.add("hidden")
});


cerrarBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});


formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(formulario);
  const nuevoRegistro = {
    id: formData.get("id"),
    name: formData.get("name"),
    lastname: formData.get("lastname"),
    birthDate: formData.get("birthDate"),
    photo: formData.get("photo"),
    description: formData.get("description"),
    color: formData.get("color"),
  };
  postData(nuevoRegistro)
  modal.classList.add("hidden");
  formulario.reset();
});