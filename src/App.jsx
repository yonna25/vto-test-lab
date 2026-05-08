import React, { useState } from 'react';
import CameraCapture from './CameraCapture';

function App() {
  const [image, setImage] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        Labo Virtual Try-On
      </h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
        {!image ? (
          <>
            <p className="text-gray-600 mb-6">
              Prenez une photo pour commencer l'essai virtuel.
            </p>
            <CameraCapture onCapture={(img) => setImage(img)} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-green-600 font-medium">Photo capturée !</p>
            <img 
              src={image} 
              alt="Capture" 
              className="rounded-lg shadow-md border-2 border-blue-100" 
            />
            <button 
              onClick={() => setImage(null)}
              className="text-sm text-gray-500 underline"
            >
              Prendre une nouvelle photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
