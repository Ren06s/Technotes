let notas = []

let EDITAR_NOTAS_ID = null


function LOAD_NOTAS() {
	const savedNotas = localStorage.getItem('TechNotes')
	return savedNotas ? JSON.parse(savedNotas) : []
	
	}


function GUARDAR_NOTAS() {
	localStorage.setItem('TechNotes', JSON.stringify(notas))
	
	}


function SAVE_NOTAS(event) {
	event.preventDefault()
	
	const titulo = document.getElementById('notaTitulo').value.trim();
	const contenido = document.getElementById('ContenidoNota').value.trim();
	
	if(EditingNotaId) {
		// actualizar nota ya existente
		
		const notaIndex = notas.findIndex (nota => nota.id === EditingNotaId)
		notas[notaIndex] = {
			...notas[notaIndex],
			titulo: titulo,
			contenido: contenido
			}
		} else  {
			// agregar nueva nota
				notas.unshift({
		id: GENERAR_ID(),
		titulo: titulo,
		contenido: contenido
	
		})
	
	}
	

	GUARDAR_NOTAS()
	RENDER_NOTAS()
	document.getElementById('NOTA_FORM').reset();
	}

function GENERAR_ID() {
	return Date.now().toString()
	 
	}
	
function DELETE_NOTE(notaId) {
	notas = notas.filter(nota => nota.id != notaId)
	GUARDAR_NOTAS()
	RENDER_NOTAS()
	
	
	}	
	
	


function RENDER_NOTAS() {
	    const container = document.getElementById('NOTAS_CONTAINER');
	if (notas.length === 0) {
		NOTAS_CONTAINER.innerHTML = `
		
		<div class="ESTADO_VACIO">
		
		<h2>No hay notas.</h2>
		<p>Que vacio...</p>
		<button class="ADD_NOTA_BTN" onclick="OPEN_NOTE_DIALOG()">+ Nota!!</button>
		
		</div> 
		`;
		return;
		}
		
		const MAX_LENGTH = 100;
		
		NOTAS_CONTAINER.innerHTML = notas.map(nota => {
			let PREVIEW = nota.contenido;
			let LARGO = false;

			if (PREVIEW.length > MAX_LENGTH) {
				PREVIEW = PREVIEW.substring(0, MAX_LENGTH) + "...";
				LARGO = true;
        }

        return `
            <div class="notaCard" onclick="VIEW_NOTE('${nota.id}')">
                <h3 class="notaTitulo">${nota.titulo}</h3>
                <p class="ContenidoNota">${PREVIEW}</p>
                <div>
                    <button class="edit_btn" onclick="event.stopPropagation(); OPEN_NOTE_DIALOG('${nota.id}')" title="Editar nota">✏️</button>
                    <button class="edit_btn" onclick="event.stopPropagation(); DELETE_NOTE('${nota.id}')" title="Eliminar nota">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
		

	
	}





function OPEN_NOTE_DIALOG(notaId = null) {
	const dialog = document.getElementById('NOTAS_DIALOG');
	const ContenidoInput = document.getElementById('ContenidoNota');
	const TituloInput = document.getElementById('notaTitulo');

	TituloInput.removeAttribute("readonly");
	ContenidoInput.removeAttribute("readonly");
    document.querySelector(".GuardarBTN").style.display = "";
    document.querySelector(".CancelarBTN").textContent = "Cancelar";




	if(notaId) {
		// editar nota
		const notaToEdit = notas.find(nota => nota.id === notaId)
		EditingNotaId = notaId
		document.getElementById('TituloDialog').textContent = 'Editar nota'
		TituloInput.value = notaToEdit.titulo
		ContenidoInput.value = notaToEdit.contenido
		
		} else {
			// agregar nota
			EditingNotaId = null
			document.getElementById('TituloDialog').textContent = '+ Nota'
			TituloInput.value = '' 
			ContenidoInput.value = ''
			}


	dialog.showModal()
	TituloInput.focus()

	}
	
function CLOSE_NOTE_DIALOG() {
	document.getElementById('NOTAS_DIALOG').close();
	
	}
	
document.addEventListener('DOMContentLoaded', function() {
	
	notas= LOAD_NOTAS()
	RENDER_NOTAS()
	
	function HerrTema() {
		document.body.classList.toggle('tema_oscuro')
		
		}
	
	document.getElementById('NOTA_FORM').addEventListener('submit', SAVE_NOTAS)
	document.getElementById('TEMA_BTN').addEventListener('click', HerrTema )
	
	
	document.getElementById('NOTAS_DIALOG').addEventListener('click', function(event) {
		if(event.target === this)
			CLOSE_NOTE_DIALOG()
		})
	
	})

function VIEW_NOTE(notaId) {
	
	const dialog = document.getElementById('NOTAS_DIALOG');
	const ContenidoInput = document.getElementById('ContenidoNota');
	const TituloInput = document.getElementById('notaTitulo');
	
	const nota = notas.find(n => n.id === notaId);
	if (!nota) return;
	
	// modo lectura
	
	TituloInput.value = nota.titulo;
	ContenidoInput.value = nota.contenido;
	
    TituloInput.setAttribute("readonly", true);
    ContenidoInput.setAttribute("readonly", true);
    document.querySelector(".GuardarBTN").style.display = "none";
    document.querySelector(".CancelarBTN").textContent = "Cerrar";

    dialog.showModal();
	
	
	}
