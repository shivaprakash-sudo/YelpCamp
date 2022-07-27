const fileInput = document.querySelector("#image");
const imageNamesContainer = document.querySelector("#image-names");

const files = fileInput.files;


fileInput.onchange = e => {
    // imageNamesContainer.classList.add("p-2 w-full");
    for (let i = 0; i < files.length; i++) {
        imageNamesContainer.innerText = `${imageNamesContainer.innerText}\n${files.item(i).name}`;
    }
}