
import { useState } from "react";

import Sidebar from "@/components/Layout/Sidebar";
import PreviewFrame from "@/components/LandingPageBuilder/PreviewFrame";
import ImageDebugger from "@/components/Debug/ImageDebugger";
import { BusinessContent } from "@/services/contentGenerator";

const Index = () => {
  const [generatedHTML, setGeneratedHTML] = useState<string>();
  const [businessData, setBusinessData] = useState<BusinessContent>();
  const [isDebuggerVisible, setIsDebuggerVisible] = useState(false);

  const handleLandingPageGenerated = (html: string, data: BusinessContent) => {
    setGeneratedHTML(html);
    setBusinessData(data);
  };

  return (
    <div className="bg-background">
      <div className="flex" style={{ height: 'calc(100vh - 60px)' }}>
        <Sidebar onLandingPageGenerated={handleLandingPageGenerated} businessData={businessData} />
        <PreviewFrame 
          generatedHTML={generatedHTML} 
          businessData={businessData} 
        />
      </div>
      
      <ImageDebugger
        businessData={businessData}
        isVisible={isDebuggerVisible}
        onToggle={() => setIsDebuggerVisible(!isDebuggerVisible)}
      />
    </div>
  );
};

export default Index;
