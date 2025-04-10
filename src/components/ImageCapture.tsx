
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";

interface ImageCaptureProps {
  onImageCaptured: (imageFile: File) => void;
  isLoading: boolean;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageCaptured, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageCaptured(file);
    
    // Reset camera if active
    if (cameraActive) {
      stopCamera();
    }
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !cameraActive) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const file = new File([blob], "prescription-capture.jpg", { type: "image/jpeg" });
      setPreview(URL.createObjectURL(blob));
      onImageCaptured(file);
      stopCamera();
    }, "image/jpeg", 0.8);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Capture Prescription
          </h2>
          
          <div className="w-full max-w-md relative">
            {preview && (
              <div className="rounded-lg overflow-hidden mb-4 border-2 border-medical-300 animate-fadeIn">
                <img 
                  src={preview} 
                  alt="Prescription preview" 
                  className="w-full object-contain max-h-64"
                />
              </div>
            )}
            
            {cameraActive && !preview && (
              <div className="rounded-lg overflow-hidden mb-4 border-2 border-medical-300">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full object-cover max-h-64"
                />
                <Button 
                  onClick={captureImage}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-medical-600 hover:bg-medical-700"
                >
                  Capture Photo
                </Button>
              </div>
            )}
            
            <div className="flex flex-row justify-center space-x-4 mt-4">
              <Button
                onClick={triggerFileInput}
                className="bg-medical-500 hover:bg-medical-600"
                disabled={isLoading || cameraActive}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              
              <Button
                onClick={toggleCamera}
                className={`${cameraActive ? "bg-red-500 hover:bg-red-600" : "bg-medical-500 hover:bg-medical-600"}`}
                disabled={isLoading}
              >
                <Camera className="mr-2 h-4 w-4" />
                {cameraActive ? "Stop Camera" : "Use Camera"}
              </Button>
              
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            
            <p className="text-sm text-gray-500 text-center mt-4">
              Upload a clear image of your prescription or take a photo
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCapture;
