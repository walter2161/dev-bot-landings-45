
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/Layout/Sidebar";
import PreviewFrame from "@/components/LandingPageBuilder/PreviewFrame";
import MobileLayout from "@/components/Layout/MobileLayout";
import { BusinessContent } from "@/services/contentGenerator";

interface IndexProps {
  onLogout: () => void;
}

const Index = ({ onLogout }: IndexProps) => {
  const [generatedHTML, setGeneratedHTML] = useState<string>();
  const [businessData, setBusinessData] = useState<BusinessContent>();
  const isMobile = useIsMobile();

  const handleLandingPageGenerated = (html: string, data: BusinessContent) => {
    setGeneratedHTML(html);
    setBusinessData(data);
  };

  // Render mobile layout for mobile devices
  if (isMobile) {
    return <MobileLayout onLogout={onLogout} />;
  }

  // Render desktop layout for desktop devices
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
