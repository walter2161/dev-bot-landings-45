
import { useState } from "react";

import Sidebar from "@/components/Layout/Sidebar";
import PreviewFrame from "@/components/LandingPageBuilder/PreviewFrame";
import { BusinessContent } from "@/services/contentGenerator";

interface IndexProps {
  onLogout: () => void;
}

const Index = ({ onLogout }: IndexProps) => {
  const [generatedHTML, setGeneratedHTML] = useState<string>();
  const [businessData, setBusinessData] = useState<BusinessContent>();

  const handleLandingPageGenerated = (html: string, data: BusinessContent) => {
    setGeneratedHTML(html);
    setBusinessData(data);
  };

  return (
    <div className="bg-background">
      <div className="flex h-screen">
        <Sidebar onLandingPageGenerated={handleLandingPageGenerated} businessData={businessData} onLogout={onLogout} />
        <PreviewFrame 
          generatedHTML={generatedHTML} 
          businessData={businessData} 
        />
      </div>
    </div>
  );
};

export default Index;
