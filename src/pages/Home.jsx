import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="pt-16">
      <header className="py-20 bg-gradient-to-r from-orange-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeInDown">
            Manual de Instalacao Machine Pay
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light animate-fadeInUp">
            Seu guia simples, rapido e visual para configurar sua maquina.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/manual"
              className="inline-flex items-center justify-center rounded-full border border-transparent bg-white px-8 py-3 text-lg font-medium text-indigo-600 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-50 active:scale-95"
            >
              Comecar Agora
            </Link>

            <Link
              to="/manual#machinefriend"
              className="machinefriend-cta relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-white/70 bg-gray-950 px-8 py-3 text-lg font-bold text-white shadow-2xl shadow-orange-900/30 transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-900 active:scale-95"
            >
              <span className="relative z-10">Falar com Atendente</span>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Home;
