import React, { useState, useEffect } from 'react';
import '../QuizApp.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Pregunta {
  Codigo: string;
  Pregunta: string;
  Respuesta: string;
  Justificacion: string;
}

export default function QuizApp() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [slideFiltrado, setSlideFiltrado] = useState(0);

  const preguntasFiltradas = busqueda.trim() === ''
    ? preguntas
    : preguntas.filter(p =>
        p.Pregunta.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.Justificacion.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.Codigo.toLowerCase().includes(busqueda.toLowerCase())
      );

  useEffect(() => {
    setSlideFiltrado(0);
  }, [busqueda]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        const response = await fetch('/assets/preguntas.json');
        if (!response.ok) {
          throw new Error('No se pudo cargar el archivo preguntas.json');
        }
        const data = await response.json();
        setPreguntas(Array.isArray(data) ? data : [data]);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando preguntas:', error);
        setError('Error al cargar las preguntas. Verifica que el archivo preguntas.json esté en la carpeta public/assets/');
        setLoading(false);
      }
    };

    cargarPreguntas();
  }, []);

  const cambiarSlide = React.useCallback((direccion: number) => {
    setSlideFiltrado((prev) => {
      const nuevoIndice = prev + direccion;
      if (nuevoIndice >= 0 && nuevoIndice < preguntasFiltradas.length) {
        return nuevoIndice;
      }
      return prev;
    });
  }, [preguntasFiltradas.length]);

  // Navegación con teclado
  useEffect(() => {
    const manejarTeclado = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        cambiarSlide(-1);
      } else if (e.key === 'ArrowRight') {
        cambiarSlide(1);
      }
    };

    document.addEventListener('keydown', manejarTeclado);
    return () => document.removeEventListener('keydown', manejarTeclado);
  }, [preguntas.length, cambiarSlide]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
        <div className="text-white text-xl font-semibold">Cargando preguntas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">Error</div>
          <div className="text-gray-700">{error}</div>
          <div className="mt-4 text-sm text-gray-600">
            Coloca tu archivo preguntas.json en la carpeta public/assets/
          </div>
        </div>
      </div>
    );
  }

  if (preguntasFiltradas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
        <div className="text-white text-xl">No hay preguntas que coincidan con la búsqueda</div>
      </div>
    );
  }

  const preguntaActual = preguntasFiltradas[slideFiltrado];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 flex flex-col items-center justify-center p-5">
      {/* Título principal */}
      <h1 style={{color: '#fff', fontWeight: 'bold', fontSize: '2.2rem', marginBottom: '2rem', textAlign: 'center', textShadow: '0 2px 12px #222'}}>
        Preguntas y respuestas del dominio 1, Libro CISA
      </h1>

      {/* Buscador */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-10">
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por pregunta, justificación o código..."
          className="buscador-input"
        />
      </div>

      {/* Card principal */}
      <div className="card-pregunta">
        {/* Header del card */}
        <div className="card-header">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow mb-2">
            Diapositiva {slideFiltrado + 1} de {preguntasFiltradas.length}
          </span>
          <span className="card-codigo">
            {preguntaActual.Codigo}
          </span>
        </div>

        {/* Pregunta */}
        <div className="card-section pregunta">
          <div className="card-label">Pregunta</div>
          <div>
            {preguntaActual.Pregunta}
          </div>
        </div>

        {/* Respuesta */}
        <div className="card-section respuesta">
          <div className="card-label">Respuesta</div>
          <div>
            {preguntaActual.Respuesta}
          </div>
        </div>

        {/* Justificación */}
        <div className="card-section justificacion">
          <div className="card-label">Justificación</div>
          <div>
            {preguntaActual.Justificacion}
          </div>
        </div>
      </div>

      {/* Navegación fija */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
        <button
          onClick={() => cambiarSlide(-1)}
          disabled={slideFiltrado === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <ChevronLeft size={20} />
          Anterior
        </button>
        
        <div className="bg-gray-800 text-white px-4 py-2 rounded-full font-bold text-sm">
          {slideFiltrado + 1} / {preguntasFiltradas.length}
        </div>
        
        <button
          onClick={() => cambiarSlide(1)}
          disabled={slideFiltrado === preguntasFiltradas.length - 1}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Siguiente
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Indicador de navegación por teclado */}
      <div className="fixed top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
        Usa ← → para navegar
      </div>
    </div>
  );
}