let notas = [];
let carpetas = [];
let EditingNotaId = null;

function OPEN_NOTE_DIALOG(notaId = null) {
    const dialog = document.getElementById('NOTAS_DIALOG');
    const tituloInput = document.getElementById('notaTitulo');
    const contenidoInput = document.getElementById('ContenidoNota');
    const selectCarpeta = document.getElementById('notaCarpeta');

    selectCarpeta.innerHTML = '<option value="">----</option>';
    carpetas.forEach(carpeta => {
        const option = document.createElement('option');
        option.value = carpeta.id;
        option.textContent = carpeta.nombre;
        selectCarpeta.appendChild(option);
    });

    if (notaId) {
        const nota = notas.find(n => n.id === notaId);
        if (!nota) return;
        EditingNotaId = notaId;
        document.getElementById('TituloDialog').textContent = 'Editar nota';
        tituloInput.value = nota.titulo;
        contenidoInput.value = nota.contenido;
        selectCarpeta.value = nota.carpetaId || "";
    } else {
        EditingNotaId = null;
        document.getElementById('TituloDialog').textContent = '+ Nota';
        tituloInput.value = '';
        contenidoInput.value = '';
        selectCarpeta.value = '';
    }

    tituloInput.removeAttribute("readonly");
    contenidoInput.removeAttribute("readonly");
    document.querySelector(".GuardarBTN").style.display = "";
    document.querySelector(".CancelarBTN").textContent = "Cancelar";

    dialog.showModal();
    tituloInput.focus();
}


function GENERAR_ID() {
    return Date.now().toString();
}

function CREATE_FOLDER_PROMPT() {
    const nombre = prompt("Escribe el nombre de la carpeta <3");
    if (nombre && nombre.trim() !== "") {
        carpetas.push({ id: GENERAR_ID(), nombre: nombre.trim() });
        SAVE_DATA();
        RENDER_NOTAS();
    }
}

function SAVE_NOTAS(event) {
    event.preventDefault();

    const titulo = document.getElementById('notaTitulo').value.trim();
    const contenido = document.getElementById('ContenidoNota').value.trim();
    const carpetaId = document.getElementById('notaCarpeta').value || null;

    if (EditingNotaId) {
        const index = notas.findIndex(n => n.id === EditingNotaId);
        if (index !== -1) {
            notas[index] = { ...notas[index], titulo, contenido, carpetaId };
        }
    } else {
        notas.unshift({ id: GENERAR_ID(), titulo, contenido, carpetaId });
    }

    SAVE_DATA();
    RENDER_NOTAS();
    document.getElementById('NOTA_FORM').reset();
    CLOSE_NOTE_DIALOG();
}

function SAVE_DATA() {
    localStorage.setItem('TechNotes', JSON.stringify(notas));
    localStorage.setItem('TechFolders', JSON.stringify(carpetas));
}

function LOAD_DATA() {
    const savedNotas = localStorage.getItem('TechNotes');
    const savedCarpetas = localStorage.getItem('TechFolders');
    notas = savedNotas ? JSON.parse(savedNotas) : [];
    carpetas = savedCarpetas ? JSON.parse(savedCarpetas) : [];
}

function DELETE_NOTE(notaId) {
    notas = notas.filter(nota => nota.id !== notaId);
    SAVE_DATA();
    RENDER_NOTAS();
}

function VIEW_NOTE(notaId) {
    const nota = notas.find(n => n.id === notaId);
    if (!nota) return;

    const dialog = document.getElementById('NOTAS_DIALOG');
    document.getElementById('TituloDialog').textContent = 'Visualizando Nota';
    const tituloInput = document.getElementById('notaTitulo');
    const contenidoInput = document.getElementById('ContenidoNota');

    tituloInput.value = nota.titulo;
    contenidoInput.value = nota.contenido;

    tituloInput.setAttribute("readonly", true);
    contenidoInput.setAttribute("readonly", true);
    document.querySelector(".GuardarBTN").style.display = "none";
    document.querySelector(".CancelarBTN").textContent = "Cerrar";

    dialog.showModal();
}

function CLOSE_NOTE_DIALOG() {
    document.getElementById('NOTAS_DIALOG').close();
}

function RENDER_NOTAS() {
    const container = document.getElementById('NOTAS_CONTAINER');
    container.innerHTML = '';

    if (notas.length === 0 && carpetas.length === 0) {
        container.innerHTML = `
            <div class="ESTADO_VACIO">
                <h2>No hay notas.</h2>
                <p>Que vacio...</p>
                <button class="ADD_NOTA_BTN" onclick="OPEN_NOTE_DIALOG()">+ Nota</button>
                <button class="ADD_CARPETA_BTN" onclick="CREATE_FOLDER_PROMPT()">+ Carpeta</button>
            </div>
        `;
        return;
    }

    carpetas.forEach(carpeta => {
        const notasCarpeta = notas.filter(n => n.carpetaId === carpeta.id);

        const carpetaDiv = document.createElement('div');
        carpetaDiv.className = 'CARPETA_CONTAINER';

        const header = document.createElement('div');
        header.className = 'CARPETA_HEADER';
        header.innerHTML = `
            <h3>${carpeta.nombre}</h3>
            <button class="TOGGLE_BTN">📂</button>
            <button class="DELETE_FOLDER_BTN">🗑️</button>
        `;
        carpetaDiv.appendChild(header);

        const notasDiv = document.createElement('div');
        notasDiv.className = 'CARPETA_NOTAS';
        notasDiv.style.display = 'none';

        notasCarpeta.forEach(nota => {
            const notaCard = document.createElement('div');
            notaCard.className = 'notaCard';
            notaCard.innerHTML = `
                <h4 class="notaTitulo">${nota.titulo}</h4>
                <p class="ContenidoNota">${nota.contenido.length > 100 ? nota.contenido.substring(0, 100)+'...' : nota.contenido}</p>
                <div>
                    <button class="edit_btn" onclick="event.stopPropagation(); OPEN_NOTE_DIALOG('${nota.id}')">✏️</button>
                    <button class="edit_btn" onclick="event.stopPropagation(); DELETE_NOTE('${nota.id}')">🗑️</button>
                </div>
            `;
            notaCard.onclick = () => VIEW_NOTE(nota.id);
            notasDiv.appendChild(notaCard);
        });

        carpetaDiv.appendChild(notasDiv);

       
        header.querySelector('.TOGGLE_BTN').addEventListener('click', () => {
            notasDiv.style.display = notasDiv.style.display === 'none' ? 'block' : 'none';
        });

        container.appendChild(carpetaDiv);
        header.querySelector('.DELETE_FOLDER_BTN').addEventListener('click', (event) => {
    event.stopPropagation();
    if (confirm(`¿Deseas eliminar la carpeta "${carpeta.nombre}"? Esto también eliminará sus notas.`)) {
        notas = notas.filter(nota => nota.carpetaId !== carpeta.id);
        carpetas = carpetas.filter(c => c.id !== carpeta.id);
        SAVE_DATA();
        RENDER_NOTAS();
    }
});


    });

   
    const NSinCarpetas = notas.filter(n => !n.carpetaId);
    NSinCarpetas.forEach(nota => {
        const notaCard = document.createElement('div');
        notaCard.className = 'notaCard';
        notaCard.innerHTML = `
            <h4 class="notaTitulo">${nota.titulo}</h4>
            <p class="ContenidoNota">${nota.contenido.length > 100 ? nota.contenido.substring(0, 100)+'...' : nota.contenido}</p>
            <div>
                <button class="edit_btn" onclick="event.stopPropagation(); OPEN_NOTE_DIALOG('${nota.id}')">✏️</button>
                <button class="edit_btn" onclick="event.stopPropagation(); DELETE_NOTE('${nota.id}')">🗑️</button>
            </div>
        `;
        notaCard.onclick = () => VIEW_NOTE(nota.id);
        container.appendChild(notaCard);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    LOAD_DATA();
    RENDER_NOTAS();

    document.getElementById('TEMA_BTN').addEventListener('click', () => {
        document.body.classList.toggle('tema_oscuro');
    });

    document.getElementById('NOTA_FORM').addEventListener('submit', SAVE_NOTAS);

    document.getElementById('NOTAS_DIALOG').addEventListener('click', function(event) {
        if(event.target === this) CLOSE_NOTE_DIALOG();
    });
});
