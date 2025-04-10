
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PrescriptionInfo } from "./PrescriptionResult";

interface HistoryItem {
  id: string;
  timestamp: Date;
  image: string;
  prescriptionInfo: PrescriptionInfo;
}

interface PrescriptionHistoryProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const PrescriptionHistory: React.FC<PrescriptionHistoryProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6 w-full">
      <CardHeader className="flex flex-row items-center justify-between bg-gray-50">
        <CardTitle className="text-gray-800">Recent Scans</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearHistory}
          className="text-gray-600 hover:text-red-600"
        >
          Clear History
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[250px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <div 
                key={item.id}
                className="border rounded-lg overflow-hidden cursor-pointer hover:border-medical-500 transition-colors"
                onClick={() => onSelectHistoryItem(item)}
              >
                <div className="aspect-video relative">
                  <img 
                    src={item.image} 
                    alt="Prescription" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">
                    {item.prescriptionInfo.medications?.[0] || "Prescription"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()} at {" "}
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PrescriptionHistory;
