import React, { useState, useEffect } from 'react';
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
  const [slideActual, setSlideActual] = useState(0);
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
    setSlideActual((prev) => {
      const nuevoIndice = prev + direccion;
      if (nuevoIndice >= 0 && nuevoIndice < preguntas.length) {
        return nuevoIndice;
      }
      return prev;
    });
  }, [preguntas.length]);

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
  }, [slideActual, preguntas.length, cambiarSlide]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 flex items-center justify-center p-5">
      {/* Buscador */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-10">
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por pregunta, justificación o código..."
          className="w-full px-6 py-4 rounded-full border-2 border-purple-400 focus:outline-none focus:border-blue-600 text-lg shadow-lg"
        />
      </div>

      {/* Contenedor principal */}
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Slide */}
        <div className="p-12 min-h-[600px] relative">
          {/* Header del slide */}
          <div className="text-center mb-10">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full text-lg font-bold mb-5">
              Diapositiva {slideFiltrado + 1} de {preguntasFiltradas.length}
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-8">
              {preguntaActual.Codigo}
            </div>
          </div>

          {/* Pregunta */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-blue-500">
            <div className="text-lg font-bold text-blue-600 mb-3">Pregunta:</div>
            <div className="text-base leading-relaxed text-gray-800">
              {preguntaActual.Pregunta}
            </div>
          </div>

          {/* Respuesta */}
          <div className="mb-6 p-6 bg-gray-50 rounded-xl border-l-4 border-blue-500">
            <div className="text-lg font-bold text-blue-600 mb-3">Respuesta:</div>
            <div className="text-base text-gray-800 font-semibold text-2xl">
              {preguntaActual.Respuesta}
            </div>
          </div>

          {/* Justificación */}
          <div className="p-6 bg-green-50 rounded-xl border-l-4 border-green-500">
            <div className="text-lg font-bold text-green-600 mb-3">Justificación:</div>
            <div className="text-base leading-relaxed text-gray-800">
              {preguntaActual.Justificacion}
            </div>
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