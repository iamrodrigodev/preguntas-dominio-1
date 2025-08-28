async function cargarPreguntas() {
    const response = await fetch('preguntas/preguntas.json');
    const preguntas = await response.json();
    return preguntas;
}

function crearSlide(pregunta, index, total) {
    return `
    <div class="slide${index === 0 ? ' active' : ''}">
        <div class="slide-header">
            <div class="slide-number">Diapositiva ${index + 1} de ${total}</div>
            <div class="question-number">${pregunta.Codigo || ''}</div>
        </div>
        <div class="answer-section">
            <div class="answer-label">Respuesta:</div>
            <div class="answer-text">${pregunta.Respuesta || ''}</div>
        </div>
        <div class="justification-section">
            <div class="justification-label">Justificación:</div>
            <div class="justification-text">${pregunta.Justificacion || ''}</div>
        </div>
    </div>
    `;
}

async function inicializarPresentacion() {
    const preguntas = await cargarPreguntas();
    const container = document.getElementById('presentation-container');
    container.innerHTML = preguntas.map((p, i) => crearSlide(p, i, preguntas.length)).join('');

    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    document.getElementById('totalSlides').textContent = totalSlides;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        document.getElementById('currentSlide').textContent = index + 1;
        document.getElementById('prevBtn').disabled = index === 0;
        document.getElementById('nextBtn').disabled = index === totalSlides - 1;
    }

    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            showSlide(currentSlideIndex);
        }
    });
    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            showSlide(currentSlideIndex);
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                showSlide(currentSlideIndex);
            }
        } else if (e.key === 'ArrowRight') {
            if (currentSlideIndex < totalSlides - 1) {
                currentSlideIndex++;
                showSlide(currentSlideIndex);
            }
        }
    });
    showSlide(currentSlideIndex);
}

inicializarPresentacion();
