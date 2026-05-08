import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      // On demande le strict minimum pour éviter les refus de Chrome
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // On attend un micro-délai pour laisser le hardware se stabiliser
        setTimeout(() => {
          videoRef.current.play();
        }, 150);
        setStream(mediaStream);
      }
    } catch (err) {
      alert("Erreur hardware : " + err.message);
    }
  };

  const takePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    onCapture(canvas.toDataURL('image/webp'));
    stream.getTracks().forEach(t => t.stop());
    setStream(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {!stream ? (
        <button onClick={startCamera} className="bg-blue-600 text-white p-8 rounded-full shadow-xl">
          <Camera size={40} />
        </button>
      ) : (
        <div className="relative w-full bg-black rounded-3xl overflow-hidden">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-auto min-h-[300px]"
          />
          <button 
            onClick={takePhoto} 
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white p-5 rounded-full shadow-2xl border-4 border-gray-200"
          >
            <div className="w-6 h-6 bg-red-600 rounded-full"></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
