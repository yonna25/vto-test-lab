import React, { useRef, useState } from 'react';
import { Camera, FlipHorizontal } from 'lucide-react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
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
        // Force la lecture pour les navigateurs mobiles
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => console.error("Erreur lecture auto:", e));
        };
        setStream(mediaStream);
      }
    } catch (err) {
      console.error("Erreur caméra:", err);
      alert("Accès refusé. Vérifiez les paramètres de Chrome.");
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Effet miroir pour la photo finale
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/webp');
    onCapture(dataUrl);
    
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
          className="bg-blue-600 hover:bg-blue-700 text-white p-8 rounded-full shadow-2xl transition-transform active:scale-95"
        >
          <Camera size={40} />
        </button>
      ) : (
        <div className="relative w-full rounded-3xl overflow-hidden bg-black aspect-[3/4] shadow-2xl border-4 border-white">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover scale-x-[-1]" 
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full flex justify-center px-6">
            <button 
              onClick={takePhoto} 
              className="bg-white p-1 rounded-full shadow-2xl active:scale-90 transition-all"
            >
              <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center">
                <div className="w-12 h-12 bg-red-500 rounded-full"></div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
