import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { BusinessContent } from "@/services/contentGenerator";
import { Image, Upload, Wand2, RotateCcw, Download, Grid3X3 } from "lucide-react";
import { toast } from "sonner";

interface ImagesTabProps {
  businessData?: BusinessContent;
  onLandingPageGenerated: (html: string, data: BusinessContent) => void;
}

const ImagesTab = ({ businessData, onLandingPageGenerated }: ImagesTabProps) => {
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingGalleryImage, setEditingGalleryImage] = useState<number | null>(null);
  const [galleryPrompt, setGalleryPrompt] = useState('');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apenas as imagens principais das seções
  const mainImages = businessData?.images ? [
    { key: 'hero', label: 'Imagem Hero', description: businessData.images.hero },
  ] : [];

  // Imagens da galeria (6 imagens)
  const galleryImages = businessData?.galleryImages || [];

  const handleGenerateGalleryImage = async (imageIndex: number) => {
    if (!galleryPrompt.trim()) {
      toast.error('Digite uma descrição para a nova imagem');
      return;
    }

    setIsGenerating(true);
    try {
      if (businessData) {
        const updatedGalleryImages = [...galleryImages];
        updatedGalleryImages[imageIndex] = galleryPrompt;
        
        const updatedBusinessData = {
          ...businessData,
          galleryImages: updatedGalleryImages
        };
        
        const { landingPageBuilder } = await import("@/services/landingPageBuilder");
        const updatedHTML = await landingPageBuilder.generateHTML(updatedBusinessData);
        onLandingPageGenerated(updatedHTML, updatedBusinessData);
      }
      
      toast.success('Imagem da galeria atualizada!');
      setEditingGalleryImage(null);
      setGalleryPrompt('');
    } catch (error) {
      toast.error('Erro ao gerar imagem da galeria');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImageUrl = (prompt: string) => {
    const baseUrl = 'https://image.pollinations.ai/prompt/';
    const imageParams = '?width=720&height=480&enhance=true&nologo=true';
    return `${baseUrl}${encodeURIComponent(prompt)}${imageParams}`;
  };

  const handleGenerateNewImage = async (imageKey: string) => {
    if (!newPrompt.trim()) {
      toast.error('Digite uma descrição para a nova imagem');
      return;
    }

    setIsGenerating(true);
    try {
      if (businessData) {
        const updatedBusinessData = {
          ...businessData,
          images: {
            ...businessData.images,
            [imageKey]: newPrompt
          }
        };
        
        const { landingPageBuilder } = await import("@/services/landingPageBuilder");
        const updatedHTML = await landingPageBuilder.generateHTML(updatedBusinessData);
        onLandingPageGenerated(updatedHTML, updatedBusinessData);
      }
      
      toast.success('Nova imagem gerada com sucesso!');
      setEditingImage(null);
      setNewPrompt('');
    } catch (error) {
      toast.error('Erro ao gerar nova imagem');
    } finally {
      setIsGenerating(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUploadImage = async (imageKey: string, file: File) => {
    try {
      const base64 = await convertFileToBase64(file);
      
      if (businessData) {
        const updatedBusinessData = {
          ...businessData,
          images: {
            ...businessData.images,
            [imageKey]: `Imagem carregada pelo usuário - ${file.name}`
          },
          customImages: {
            ...businessData.customImages,
            [imageKey]: base64
          }
        };
        
        const { landingPageBuilder } = await import("@/services/landingPageBuilder");
        const updatedHTML = await landingPageBuilder.generateHTML(updatedBusinessData);
        onLandingPageGenerated(updatedHTML, updatedBusinessData);
      }
      
      toast.success('Imagem carregada com sucesso!');
      setEditingImage(null);
    } catch (error) {
      toast.error('Erro ao carregar imagem');
    }
  };

  const handleFileSelect = (imageKey: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          if (file.type.startsWith('image/')) {
            handleUploadImage(imageKey, file);
          } else {
            toast.error('Por favor, selecione apenas arquivos de imagem');
          }
        }
      };
      fileInputRef.current.click();
    }
  };

  if (!businessData) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Gerenciador de Imagens</h3>
        <Card className="p-4 bg-gradient-card text-center">
          <Image className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Gere uma landing page primeiro para gerenciar as imagens
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Gerenciador de Imagens</h3>
        <Badge variant="secondary" className="text-xs">
          {mainImages.length + 1} seções
        </Badge>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
      />

      {/* Imagem Hero */}
      {mainImages.map((img, index) => (
        <Card key={img.key} className="p-4 bg-gradient-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {index + 1}
              </Badge>
              <h4 className="font-medium text-sm text-foreground">{img.label}</h4>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditingImage(img.key);
                  setNewPrompt(img.description);
                }}
                className="h-6 w-6 p-0"
                title="Editar com IA"
              >
                <Wand2 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleFileSelect(img.key)}
                className="h-6 w-6 p-0"
                title="Carregar do PC"
              >
                <Upload className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {editingImage === img.key ? (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Nova descrição da imagem</Label>
                <Input
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Descreva como você quer a nova imagem..."
                  className="text-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleGenerateNewImage(img.key)}
                  disabled={isGenerating || !newPrompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <RotateCcw className="w-3 h-3 mr-1 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3 mr-1" />
                      Gerar IA
                    </>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setEditingImage(null);
                    setNewPrompt('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                <img
                  src={businessData?.customImages?.[img.key] || generateImageUrl(img.description)}
                  alt={img.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement?.appendChild(
                      Object.assign(document.createElement('div'), {
                        className: 'flex items-center justify-center w-full h-full',
                        innerHTML: `<Image class="w-8 h-8 text-muted-foreground" />`
                      })
                    );
                  }}
                />
              </div>
              <div>
                <Label className="text-xs font-medium">Descrição atual:</Label>
                <p className="text-xs text-muted-foreground line-clamp-2">{img.description}</p>
              </div>
            </div>
          )}
        </Card>
      ))}

      {/* Seção Galeria */}
      <Card className="p-4 bg-gradient-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              G
            </Badge>
            <h4 className="font-medium text-sm text-foreground">Galeria de Fotos</h4>
            <Badge variant="secondary" className="text-xs">
              {galleryImages.length} imagens
            </Badge>
          </div>
          <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                title="Editar Galeria"
              >
                <Grid3X3 className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Galeria de Fotos (3x2)</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {galleryImages[index] ? (
                        <img
                          src={generateImageUrl(galleryImages[index])}
                          alt={`Galeria ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Image className="w-8 h-8 mb-2" />
                          <span className="text-xs">Imagem {index + 1}</span>
                        </div>
                      )}
                    </div>
                    {editingGalleryImage === index ? (
                      <div className="space-y-2">
                        <Input
                          value={galleryPrompt}
                          onChange={(e) => setGalleryPrompt(e.target.value)}
                          placeholder="Descrição da imagem..."
                          className="text-xs"
                        />
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            onClick={() => handleGenerateGalleryImage(index)}
                            disabled={isGenerating || !galleryPrompt.trim()}
                            className="flex-1"
                          >
                            {isGenerating ? (
                              <RotateCcw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Wand2 className="w-3 h-3" />
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingGalleryImage(null);
                              setGalleryPrompt('');
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingGalleryImage(index);
                          setGalleryPrompt(galleryImages[index] || '');
                        }}
                        className="w-full text-xs"
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
              {galleryImages[index] ? (
                <img
                  src={generateImageUrl(galleryImages[index])}
                  alt={`Galeria ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Image className="w-4 h-4 mb-1" />
                  <span className="text-xs">{index + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={async () => {
            if (businessData) {
              // Baixar todas as imagens
              const images = mainImages;
              for (const img of images) {
                const imageUrl = generateImageUrl(img.description);
                const a = document.createElement('a');
                a.href = imageUrl;
                a.download = `${img.label}.jpg`;
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
              // Baixar imagens da galeria
              galleryImages.forEach((desc, index) => {
                if (desc) {
                  const imageUrl = generateImageUrl(desc);
                  const a = document.createElement('a');
                  a.href = imageUrl;
                  a.download = `Galeria-${index + 1}.jpg`;
                  a.target = '_blank';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }
              });
              toast.success('Download de todas as imagens iniciado!');
            }
          }}
          disabled={!businessData}
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar Todas
        </Button>
        <Button 
          variant="hero" 
          className="flex-1"
          onClick={async () => {
            if (businessData) {
              try {
                setIsGenerating(true);
                
                // Regenerar todas as imagens com novos parâmetros para forçar cache refresh
                const timestamp = Date.now();
                const updatedImages = { ...businessData.images };
                
                // Adicionar timestamp para forçar regeneração
                Object.keys(updatedImages).forEach(key => {
                  updatedImages[key] = `${updatedImages[key]} - refresh ${timestamp}`;
                });
                
                const updatedBusinessData = {
                  ...businessData,
                  images: updatedImages,
                  galleryImages: galleryImages.map(img => img ? `${img} - refresh ${timestamp}` : img)
                };
                
                const { landingPageBuilder } = await import("@/services/landingPageBuilder");
                const updatedHTML = await landingPageBuilder.generateHTML(updatedBusinessData);
                onLandingPageGenerated(updatedHTML, updatedBusinessData);
                
                toast.success('Todas as imagens foram regeneradas!');
              } catch (error) {
                toast.error('Erro ao regenerar imagens');
              } finally {
                setIsGenerating(false);
              }
            }
          }}
          disabled={!businessData || isGenerating}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          {isGenerating ? 'Regenerando...' : 'Regenerar Todas'}
        </Button>
      </div>
    </div>
  );
};

export default ImagesTab;