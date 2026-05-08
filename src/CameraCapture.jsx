import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    // Nettoyage au cas où un flux existe déjà
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error("Erreur caméra:", err);
      alert("Impossible d'accéder à la caméra. Vérifiez les autorisations de votre navigateur.");
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Effet miroir pour que la photo soit naturelle
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/webp');
    
    onCapture(dataUrl);
    
    // Arrêter proprement
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {!stream ? (
        <button 
          onClick={startCamera} 
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-full shadow-2xl transition-transform active:scale-90"
        >
          <Camera size={32} />
        </button>
      ) : (
        <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover scale-x-[-1]" 
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
            <button 
              onClick={takePhoto} 
              className="bg-white p-5 rounded-full shadow-2xl active:scale-95 transition-all border-4 border-gray-200"
            >
              <div className="w-6 h-6 bg-red-600 rounded-full animate-pulse"></div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
