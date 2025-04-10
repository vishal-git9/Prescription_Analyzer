
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface PrescriptionInfo {
  medications?: string[];
  dosage?: string;
  frequency?: string;
  duration?: string;
  specialInstructions?: string;
  doctorName?: string;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  patientDisease?: string;
  diagnosisExplanation?: string;
  medicationInstructions?: string;
  date?: string;
  rawText: string;
}

interface PrescriptionResultProps {
  prescriptionInfo: PrescriptionInfo | null;
  isLoading: boolean;
  language: string;
  onLanguageChange: (language: string) => void;
}

const PrescriptionResult: React.FC<PrescriptionResultProps> = ({ 
  prescriptionInfo, 
  isLoading,
  language,
  onLanguageChange
}) => {
  if (isLoading) {
    return (
      <Card className="mt-6 w-full animate-fadeIn">
        <CardHeader>
          <CardTitle className="text-medical-800">Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prescriptionInfo) {
    return null;
  }

  return (
    <Card className="mt-6 w-full animate-fadeIn">
      <CardHeader className="bg-medical-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-medical-800">Prescription Analysis</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="language-toggle" className="text-sm font-medium">
              {language === "hindi" ? "हिंदी" : "English"}
            </Label>
            <Switch
              id="language-toggle"
              checked={language === "hindi"}
              onCheckedChange={(checked) => onLanguageChange(checked ? "hindi" : "english")}
            />
            <Label htmlFor="language-toggle" className="text-sm font-medium">
              {language === "hindi" ? "English" : "हिंदी"}
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Patient Information Section */}
        {(prescriptionInfo.patientName || prescriptionInfo.patientAge || prescriptionInfo.patientGender || prescriptionInfo.patientDisease) && (
          <div className="mb-4 bg-blue-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              {language === "hindi" ? "रोगी की जानकारी" : "Patient Information"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {prescriptionInfo.patientName && (
                <div>
                  <span className="font-medium text-gray-600">
                    {language === "hindi" ? "नाम:" : "Name:"}
                  </span> {prescriptionInfo.patientName}
                </div>
              )}
              
              {prescriptionInfo.patientAge && (
                <div>
                  <span className="font-medium text-gray-600">
                    {language === "hindi" ? "उम्र:" : "Age:"}
                  </span> {prescriptionInfo.patientAge}
                </div>
              )}
              
              {prescriptionInfo.patientGender && (
                <div>
                  <span className="font-medium text-gray-600">
                    {language === "hindi" ? "लिंग:" : "Gender:"}
                  </span> {prescriptionInfo.patientGender}
                </div>
              )}
              
              {prescriptionInfo.patientDisease && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-600">
                    {language === "hindi" ? "निदान:" : "Diagnosis:"}
                  </span> {prescriptionInfo.patientDisease}
                </div>
              )}

              {prescriptionInfo.diagnosisExplanation && (
                <div className="col-span-2 mt-2 p-3 bg-blue-100 rounded">
                  <span className="font-medium text-gray-700">
                    {language === "hindi" ? "इस निदान के बारे में:" : "About this diagnosis:"}
                  </span><br />
                  <p className="text-gray-700 mt-1">{prescriptionInfo.diagnosisExplanation}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {prescriptionInfo.medications && prescriptionInfo.medications.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium text-medical-700 mb-2">
              {language === "hindi" ? "दवाइयाँ" : "Medications"}
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {prescriptionInfo.medications.map((med, index) => (
                <li key={index} className="text-gray-700">{med}</li>
              ))}
            </ul>
          </div>
        )}

        {prescriptionInfo.dosage && (
          <div className="mb-4">
            <h3 className="text-lg font-medium text-medical-700 mb-2">
              {language === "hindi" ? "खुराक" : "Dosage"}
            </h3>
            <p className="text-gray-700">{prescriptionInfo.dosage}</p>
          </div>
        )}

        {prescriptionInfo.frequency && (
          <div className="mb-4">
            <h3 className="text-lg font-medium text-medical-700 mb-2">
              {language === "hindi" ? "आवृत्ति" : "Frequency"}
            </h3>
            <p className="text-gray-700">{prescriptionInfo.frequency}</p>
          </div>
        )}

        {prescriptionInfo.duration && (
          <div className="mb-4">
            <h3 className="text-lg font-medium text-medical-700 mb-2">
              {language === "hindi" ? "अवधि" : "Duration"}
            </h3>
            <p className="text-gray-700">{prescriptionInfo.duration}</p>
          </div>
        )}

        {prescriptionInfo.medicationInstructions && (
          <div className="mb-4 bg-green-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-green-800 mb-2">
              {language === "hindi" ? "दवा कैसे लें" : "How to Take Your Medicine"}
            </h3>
            <p className="text-gray-700">{prescriptionInfo.medicationInstructions}</p>
          </div>
        )}

        {prescriptionInfo.specialInstructions && (
          <div className="mb-4">
            <h3 className="text-lg font-medium text-medical-700 mb-2">
              {language === "hindi" ? "विशेष निर्देश" : "Special Instructions"}
            </h3>
            <p className="text-gray-700">{prescriptionInfo.specialInstructions}</p>
          </div>
        )}

        {(prescriptionInfo.doctorName || prescriptionInfo.patientName || prescriptionInfo.date) && (
          <>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prescriptionInfo.doctorName && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {language === "hindi" ? "डॉक्टर" : "Doctor"}
                  </h3>
                  <p className="text-gray-700">{prescriptionInfo.doctorName}</p>
                </div>
              )}
              
              {prescriptionInfo.patientName && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {language === "hindi" ? "रोगी" : "Patient"}
                  </h3>
                  <p className="text-gray-700">{prescriptionInfo.patientName}</p>
                </div>
              )}
              
              {prescriptionInfo.date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {language === "hindi" ? "तारीख" : "Date"}
                  </h3>
                  <p className="text-gray-700">{prescriptionInfo.date}</p>
                </div>
              )}
            </div>
          </>
        )}

        <Separator className="my-4" />
        
        <div className="mt-4">
          <details className="text-sm">
            <summary className="cursor-pointer text-medical-600 hover:text-medical-700">
              {language === "hindi" ? "मूल टेक्स्ट देखें" : "View Raw Text"}
            </summary>
            <div className="mt-2 p-3 bg-gray-50 rounded-md text-gray-600 whitespace-pre-wrap">
              {prescriptionInfo.rawText}
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrescriptionResult;