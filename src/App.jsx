import React, { useState } from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Labo Virtual Try-On
      </h1>
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
        <p className="text-gray-600 mb-6">
          Environnement de test prêt pour l'implémentation du système VTO.
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10">
          <span className="text-sm text-gray-400">Aperçu caméra à venir</span>
        </div>
      </div>
    </div>
  );
}

export default App;
