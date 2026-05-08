import React, { useRef, useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      console.error("Erreur caméra:", err);
    }
  };

  const takePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/webp');
    onCapture(dataUrl);
    
    // Arrêter la caméra après capture
    stream.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!stream ? (
        <button onClick={startCamera} className="bg-blue-600 text-white p-4 rounded-full shadow-lg">
          <Camera size={24} />
        </button>
      ) : (
        <div className="relative w-full rounded-lg overflow-hidden bg-black">
          <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
          <button onClick={takePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-xl">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
