import React, { useState } from 'react';
import CameraCapture from './CameraCapture';
import StyleSelector from './StyleSelector';
import { generateTryOn } from './vtoService';

function App() {
  const [userImage, setUserImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunVTO = async () => {
    if (!userImage || !selectedStyle) return;
    setLoading(true);
    try {
      // Appel au service IA
      const data = await generateTryOn(userImage, selectedStyle.url);
      setResult(data.output); 
    } catch (err) {
      alert("Erreur lors de la génération. Vérifiez votre clé API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <header className="w-full max-w-md my-6 text-center">
        <h1 className="text-2xl font-black text-blue-600 uppercase tracking-tighter">
          VTO Lab <span className="text-gray-400 font-light">v1.0</span>
        </h1>
      </header>

      <main className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6">
        {!userImage ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
              Étape 1 : Prenez une photo de face bien éclairée.
            </div>
            <CameraCapture onCapture={(img) => setUserImage(img)} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-inner bg-gray-100">
              <img src={userImage} alt="User" className="w-full h-auto" />
              <button 
                onClick={() => {setUserImage(null); setResult(null);}}
                className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full"
              >
                Refaire
              </button>
            </div>

            <StyleSelector 
              selectedId={selectedStyle?.id} 
              onSelect={(style) => setSelectedStyle(style)} 
            />

            <button
              onClick={handleRunVTO}
              disabled={loading || !selectedStyle}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
              }`}
            >
              {loading ? "Génération en cours..." : "Lancer l'essai virtuel"}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-center font-bold mb-4">Résultat final</h3>
            <img src={result} alt="Résultat" className="rounded-2xl shadow-2xl border-4 border-blue-500" />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
