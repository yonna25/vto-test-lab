import React from 'react';
import { UploadCloud } from 'lucide-react';

const CameraCapture = ({ onCapture }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Envoie l'image en Base64 à App.jsx
        onCapture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-4">
      {/* C'est un gros bouton qui agit comme une zone d'upload */}
      <label className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-gray-300 rounded-3xl bg-gray-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="bg-gray-200 group-hover:bg-blue-100 p-5 rounded-full shadow-inner mb-4 text-gray-500 group-hover:text-blue-600 transition-colors">
            <UploadCloud size={40} />
          </div>
          <p className="mb-2 text-lg text-gray-700 group-hover:text-blue-800 font-bold">
            Uploader ma photo
          </p>
          <p className="text-sm text-gray-500 group-hover:text-blue-600">
            Cliquez pour choisir une photo de face (JPG, PNG)
          </p>
        </div>
        
        {/* Le vrai champ d'entrée, caché mais activé par le label */}
        <input 
          type="file" 
          accept="image/jpeg, image/png, image/webp" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default CameraCapture;
