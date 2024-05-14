
let ids_from_the_files = [];

function displayPDF(input) {
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const petitionView = document.getElementById('petition-view-procuracao');
            // Criar um novo elemento embed para cada arquivo selecionado
            let embedElement = document.createElement('embed');
            embedElement.setAttribute('src', e.target.result);
            embedElement.setAttribute('style', 'width: 100%; height: 100%;');
            // Limpar o conteúdo existente e adicionar o novo elemento
            petitionView.innerHTML = '';
            petitionView.appendChild(embedElement);
        }

        reader.readAsDataURL(file);
    }
}

function selectDocument(select) {
    const inputId = select.value;
    const input = document.getElementById(inputId);
    displayPDF(input);
}

function generateUniqueId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    const idLength = 6;
    let id = '';

    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
    }

    return id;
}

function isIdUnique(id) {
    return !ids_from_the_files.includes(id);
}

function more_files(){
    let adicionais = document.querySelector('#adicionais');
    let select = document.getElementById("document_selected");
    let html_anterior = adicionais.innerHTML;

    let randomId;

    do {
        randomId = generateUniqueId();
    } while (!isIdUnique(randomId));

    ids_from_the_files.push(randomId);
    
    let new_html = `
    <div class="adicional-div-${randomId} div-geral-style">
        <label for="adicional-${randomId}">Adicional:</label>
        <input type="file" id="adicional-${randomId}" accept=".pdf" onchange="displayPDF(this)">
    </div>
    `
    adicionais.innerHTML += new_html;

    // Adicionando nova opção ao select
    let new_option = document.createElement("option");
    new_option.value = `adicional-${randomId}`;
    new_option.text = `Adicional ${randomId}`;
    select.appendChild(new_option);
}
