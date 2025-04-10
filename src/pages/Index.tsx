
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import ImageCapture from "@/components/ImageCapture";
import PrescriptionResult, { PrescriptionInfo } from "@/components/PrescriptionResult";
import PrescriptionHistory from "@/components/PrescriptionHistory";
import { analyzePrescription } from "@/services/openaiService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  timestamp: Date;
  image: string;
  prescriptionInfo: PrescriptionInfo;
}

const Index = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPrescription, setCurrentPrescription] = useState<PrescriptionInfo | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("scan");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>("english");
  
  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Load history from localStorage
    const savedHistory = localStorage.getItem("prescription_history");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      } catch (error) {
        console.error("Failed to parse history from localStorage:", error);
      }
    }
    
    // Load language preference
    const savedLanguage = localStorage.getItem("preferred_language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("openai_api_key", apiKey);
    }
  }, [apiKey]);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("prescription_history", JSON.stringify(history));
  }, [history]);
  
  // Save language preference
  useEffect(() => {
    localStorage.setItem("preferred_language", language);
  }, [language]);

  const handleImageCaptured = async (imageFile: File) => {
    setSelectedImage(imageFile);

    if (!apiKey) {
      toast.error("Please enter your OpenAI API key in settings");
      setActiveTab("settings");
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzePrescription(imageFile, apiKey, language);
      setCurrentPrescription(result);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        image: URL.createObjectURL(imageFile),
        prescriptionInfo: result,
      };
      
      setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setCurrentPrescription(item.prescriptionInfo);
    setActiveTab("scan");
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("prescription_history");
    toast.success("History cleared");
  };

  const handleApiKeyUpdate = () => {
    toast.success("API key saved");
  };
  
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    
    // If there's a selected image, re-analyze with the new language
    if (selectedImage && apiKey) {
      setIsLoading(true);
      analyzePrescription(selectedImage, apiKey, newLanguage)
        .then(result => {
          setCurrentPrescription(result);
          
          // Update history with new analysis
          if (history.length > 0) {
            const updatedHistory = [...history];
            updatedHistory[0].prescriptionInfo = result;
            setHistory(updatedHistory);
          }
        })
        .catch(error => {
          console.error("Error processing image with new language:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="scan">
              {language === "hindi" ? "प्रिस्क्रिप्शन स्कैन करें" : "Scan Prescription"}
            </TabsTrigger>
            <TabsTrigger value="settings">
              {language === "hindi" ? "सेटिंग्स" : "Settings"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-4">
            <ImageCapture onImageCaptured={handleImageCaptured} isLoading={isLoading} />
            <PrescriptionResult 
              prescriptionInfo={currentPrescription} 
              isLoading={isLoading} 
              language={language}
              onLanguageChange={handleLanguageChange}
            />
            <PrescriptionHistory 
              history={history}
              onSelectHistoryItem={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
            />
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {language === "hindi" ? "API सेटिंग्स" : "API Settings"}
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">
                    {language === "hindi" ? "OpenAI API कुंजी" : "OpenAI API Key"}
                  </Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    {language === "hindi" 
                      ? "आपकी API कुंजी स्थानीय रूप से संग्रहीत है और कभी भी हमारे सर्वर पर नहीं भेजी जाती है।" 
                      : "Your API key is stored locally and never sent to our servers."}
                  </p>
                </div>
                
                <Button 
                  onClick={handleApiKeyUpdate} 
                  className="w-full bg-medical-500 hover:bg-medical-600"
                >
                  {language === "hindi" ? "सेटिंग्स सहेजें" : "Save Settings"}
                </Button>
                
                <div className="p-4 bg-gray-50 rounded-lg mt-6">
                  <h3 className="font-medium text-gray-700 mb-2">
                    {language === "hindi" ? "OpenAI API कुंजी के बारे में" : "About OpenAI API Keys"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {language === "hindi" 
                      ? "इस ऐप का उपयोग करने के लिए, आपको GPT-4 Vision मॉडल तक पहुंच के साथ एक OpenAI API कुंजी की आवश्यकता होगी।" 
                      : "To use this app, you need an OpenAI API key with access to the GPT-4 Vision model."}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === "hindi" ? "आप" : "You can get an API key from the"}{" "}
                    <a 
                      href="https://platform.openai.com/api-keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-medical-600 hover:underline"
                    >
                      OpenAI platform
                    </a>
                    {language === "hindi" ? " से API कुंजी प्राप्त कर सकते हैं।" : "."}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-auto py-4 text-center text-sm text-gray-500 bg-white border-t">
        <p>
          ScriptScan © {new Date().getFullYear()} | 
          {language === "hindi" 
            ? " अपने प्रिस्क्रिप्शन को सुरक्षित रूप से विश्लेषण करें" 
            : " Analyze your prescriptions securely"}
        </p>
      </footer>
    </div>
  );
};

export default Index;