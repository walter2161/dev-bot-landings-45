import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Maximize2, 
  RotateCcw,
  Code,
  ExternalLink,
  Download
} from "lucide-react";
import { BusinessContent } from "@/services/contentGenerator";
import { sellerbotAgent } from "@/services/agents/sellerbotAgent";

interface PreviewFrameProps {
  generatedHTML?: string;
  businessData?: BusinessContent;
}

const PreviewFrame = ({ generatedHTML, businessData }: PreviewFrameProps) => {
  const [deviceMode, setDeviceMode] = useState("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listener para mensagens do chat sellerbot
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'SELLERBOT_CHAT') {
        try {
          setIsChatLoading(true);
          
          // Processar dados completos do negócio
          const fullBusinessData = {
            ...event.data.businessData,
            sections: businessData?.sections || [],
            images: businessData?.images || {},
          };
          
          console.log('🤖 Processando chat sellerbot:', {
            message: event.data.message,
            hasHistory: !!event.data.chatHistory,
            businessTitle: fullBusinessData.title
          });
          
          const response = await sellerbotAgent.generateChatResponse(
            event.data.message,
            fullBusinessData
          );
          
          // Enviar resposta de volta para a landing page
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'SELLERBOT_RESPONSE',
              response: response
            }, '*');
          }
          
          console.log('✅ Resposta enviada para LP');
          
        } catch (error) {
          console.error('❌ Erro no chat sellerbot:', error);
          
          // Enviar resposta de fallback mais inteligente
          const fallbackResponse = `😊 Olá! Sou o assistente da ${event.data.businessData?.title || 'nossa empresa'}.\n\nEstamos com uma pequena instabilidade técnica, mas posso ajudar você!\n\nEntre em contato conosco:\n📞 ${event.data.businessData?.contact?.phone || 'Telefone não informado'}\n📧 ${event.data.businessData?.contact?.email || 'Email não informado'}`;
          
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'SELLERBOT_RESPONSE',
              response: fallbackResponse
            }, '*');
          }
        } finally {
          setIsChatLoading(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [businessData]);

  const deviceModes = [
    { id: "desktop", icon: Monitor, label: "Desktop", width: "100%" },
    { id: "tablet", icon: Tablet, label: "Tablet", width: "768px" },
    { id: "mobile", icon: Smartphone, label: "Mobile", width: "375px" },
  ];

  const downloadHTML = async () => {
    if (!generatedHTML) return;
    
    try {
      // Converter todas as imagens para base64
      const processedHTML = await convertImagesToBase64(generatedHTML);
      
      const blob = new Blob([processedHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${businessData?.title || 'landing-page'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar HTML:', error);
      // Fallback para download normal se falhar
      const blob = new Blob([generatedHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${businessData?.title || 'landing-page'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const convertImagesToBase64 = async (html: string): Promise<string> => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = Array.from(doc.querySelectorAll('img')) as HTMLImageElement[];
    
    const imagePromises = images.map(async (img: HTMLImageElement) => {
      const src = img.getAttribute('src');
      if (src && src.startsWith('http')) {
        try {
          const response = await fetch(src);
          const blob = await response.blob();
          
          // Otimizar imagem se necessário
          const optimizedBlob = await optimizeImage(blob);
          
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(optimizedBlob);
          });
          
          img.setAttribute('src', base64);
        } catch (error) {
          console.warn('Não foi possível converter imagem:', src, error);
        }
      }
    });
    
    await Promise.all(imagePromises);
    return doc.documentElement.outerHTML;
  };

  const optimizeImage = async (blob: Blob): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Redimensionar se muito grande
        const maxWidth = 1200;
        const maxHeight = 800;
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (optimizedBlob) => {
            resolve(optimizedBlob || blob);
          },
          'image/jpeg',
          0.8 // Qualidade 80%
        );
      };
      
      img.onerror = () => resolve(blob);
      img.src = URL.createObjectURL(blob);
    });
  };

  const emptyPreview = `
    <div style="font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #f8fafc; height: 100vh; display: flex; align-items: center; justify-content: center;">
      <div style="text-align: center; color: #64748b;">
        <img src="/lovable-uploads/97010722-94c2-481f-89d5-a6c7f1b2afe2.png" alt="PageJet Mascot" style="width: 120px; height: auto; margin-bottom: 1rem;" />
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #334155;">Aguardando Landing Page</h2>
        <p style="font-size: 1rem;">Use o PageJet para gerar sua landing page personalizada</p>
      </div>
    </div>
  `;

  const currentHTML = generatedHTML || emptyPreview;

  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      {/* Preview Controls */}
      <div className="border-b border-border bg-background/95 backdrop-blur p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-foreground">Preview</h3>
            <Badge variant="secondary" className="text-xs">
              {generatedHTML ? "Gerado por IA" : "Aguardando Geração"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Mode Buttons */}
            <div className="flex bg-muted p-1 rounded-lg">
              {deviceModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setDeviceMode(mode.id)}
                    className={`p-2 rounded-md transition-all ${
                      deviceMode === mode.id
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={mode.label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            <div className="w-px h-6 bg-border" />

            {/* Action Buttons */}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                const iframe = document.querySelector('iframe[title="Landing Page Preview"]') as HTMLIFrameElement;
                if (iframe) {
                  iframe.contentWindow?.location.reload();
                }
              }}
              title="Recarregar Preview"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => {
                if (generatedHTML) {
                  // Show code in the same preview area
                  const codeHTML = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>Código Fonte - Landing Page</title>
                      <style>
                        body { 
                          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace; 
                          margin: 0; 
                          padding: 20px; 
                          background: #1e1e1e; 
                          color: #d4d4d4;
                          line-height: 1.5;
                        }
                        .header {
                          background: #2d2d30;
                          margin: -20px -20px 20px -20px;
                          padding: 15px 20px;
                          border-bottom: 1px solid #454545;
                        }
                        .title {
                          color: #ffffff;
                          font-size: 18px;
                          margin: 0;
                        }
                        .subtitle {
                          color: #cccccc;
                          font-size: 14px;
                          margin: 5px 0 0 0;
                        }
                        pre { 
                          background: #1e1e1e; 
                          margin: 0;
                          padding: 0;
                          overflow: auto; 
                          white-space: pre-wrap;
                          word-wrap: break-word;
                        }
                        code { 
                          color: #d4d4d4; 
                          font-size: 13px;
                        }
                        .copy-btn {
                          position: fixed;
                          top: 20px;
                          right: 20px;
                          background: #0e639c;
                          color: white;
                          border: none;
                          padding: 8px 16px;
                          border-radius: 4px;
                          cursor: pointer;
                          font-size: 12px;
                        }
                        .copy-btn:hover {
                          background: #1177bb;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <h1 class="title">Código Fonte - Landing Page</h1>
                        <p class="subtitle">HTML completo gerado pela IA</p>
                      </div>
                      <button class="copy-btn" onclick="copyToClipboard()">Copiar Código</button>
                      <pre><code id="sourceCode">${generatedHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                      
                      <script>
                        function copyToClipboard() {
                          const code = document.getElementById('sourceCode').textContent;
                          navigator.clipboard.writeText(code).then(() => {
                            const btn = document.querySelector('.copy-btn');
                            const originalText = btn.textContent;
                            btn.textContent = 'Copiado!';
                            btn.style.background = '#16a34a';
                            setTimeout(() => {
                              btn.textContent = originalText;
                              btn.style.background = '#0e639c';
                            }, 2000);
                          });
                        }
                      </script>
                    </body>
                    </html>
                  `;
                  
                  // Update the iframe with the source code view
                  const iframe = document.querySelector('iframe[title="Landing Page Preview"]') as HTMLIFrameElement;
                  if (iframe) {
                    iframe.srcdoc = codeHTML;
                  }
                }
              }}
              disabled={!generatedHTML}
              title="Ver código fonte"
            >
              <Code className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                const previewContainer = document.querySelector('.preview-content');
                if (previewContainer) {
                  if (!document.fullscreenElement) {
                    previewContainer.requestFullscreen().catch(err => {
                      console.log(`Erro ao entrar em fullscreen: ${err.message}`);
                    });
                  } else {
                    document.exitFullscreen();
                  }
                }
              }}
              title="Maximizar"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={downloadHTML} 
              disabled={!generatedHTML}
            >
              <Download className="w-4 h-4" />
              Baixar HTML
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                if (generatedHTML) {
                  const newWindow = window.open('', '_blank');
                  if (newWindow) {
                    newWindow.document.open();
                    newWindow.document.write(generatedHTML);
                    newWindow.document.close();
                  }
                }
              }}
              disabled={!generatedHTML}
              title="Abrir em nova aba"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4 preview-content">
        <Card className="h-full bg-background border border-border/50 shadow-glow">
          <div className="h-full flex items-center justify-center">
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
              style={{ 
                width: deviceModes.find(d => d.id === deviceMode)?.width,
                maxWidth: "100%",
                height: "80vh"
              }}
            >
              <iframe
                ref={iframeRef}
                srcDoc={currentHTML}
                className="w-full h-full border-0"
                title="Landing Page Preview"
                key={generatedHTML ? generatedHTML.slice(0, 100) : 'empty'}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Status Bar */}
      <div className="border-t border-border bg-background/95 backdrop-blur p-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Seções: {businessData?.sections?.length || 7}/7</span>
            <span>Imagens: {generatedHTML ? "Geradas por IA" : "Demo"}</span>
            <span>Sellerbot: {businessData?.sellerbot?.name || "Configurado"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Auto-save ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewFrame;