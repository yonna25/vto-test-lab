import React, { useRef, useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // On tente de jouer
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsVideoPlaying(true))
            .catch(() => setIsVideoPlaying(false));
        }
        setStream(mediaStream);
      }
    } catch (err) {
      alert("Erreur critique : " + err.message);
    }
  };

  const forcePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const takePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0);
    
    onCapture(canvas.toDataURL('image/webp'));
    stream.getTracks().forEach(t => t.stop());
    setStream(null);
    setIsVideoPlaying(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {!stream ? (
        <button onClick={startCamera} className="bg-blue-600 text-white p-8 rounded-full shadow-xl">
          <Camera size={40} />
        </button>
      ) : (
        <div className="relative w-full aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover scale-x-[-1] ${!isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
          />
          
          {!isVideoPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="text-blue-400 mb-4" size={48} />
              <p className="text-white text-sm mb-4">La caméra est prête mais attend votre signal.</p>
              <button 
                onClick={forcePlay}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold animate-bounce"
              >
                CLIQUEZ ICI POUR AFFICHER
              </button>
            </div>
          )}

          {isVideoPlaying && (
            <button 
              onClick={takePhoto} 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white p-1 rounded-full shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center">
                <div className="w-12 h-12 bg-red-500 rounded-full"></div>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
