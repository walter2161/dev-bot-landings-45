import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { BusinessContent, Testimonial, GalleryItem, Product } from "@/services/contentGenerator";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ConfigTabProps {
  businessData?: BusinessContent;
  onContentUpdate?: (content: BusinessContent) => void;
  onLandingPageGenerated: (html: string, data: BusinessContent) => void;
}

const ConfigTab = ({ businessData, onContentUpdate, onLandingPageGenerated }: ConfigTabProps) => {
  const [editedData, setEditedData] = useState<BusinessContent | null>(null);

  const handleSave = async () => {
    if (editedData) {
      onContentUpdate?.(editedData);
      
      try {
        const { landingPageBuilder } = await import("@/services/landingPageBuilder");
        const updatedHTML = await landingPageBuilder.generateHTML(editedData);
        onLandingPageGenerated(updatedHTML, editedData);
        toast.success('Configurações salvas com sucesso!');
      } catch (error) {
        console.error('Erro ao regenerar landing page:', error);
        toast.error('Erro ao salvar configurações');
      }
    }
  };

  const updateContact = (field: string, value: string) => {
    if (!editedData) return;
    setEditedData({
      ...editedData,
      contact: {
        ...editedData.contact,
        [field]: value
      }
    });
  };

  const updateSocialMedia = (platform: string, value: string) => {
    if (!editedData) return;
    setEditedData({
      ...editedData,
      contact: {
        ...editedData.contact,
        socialMedia: {
          ...editedData.contact.socialMedia,
          [platform]: value
        }
      }
    });
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: any) => {
    if (!editedData || !editedData.testimonials) return;
    const updated = [...editedData.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setEditedData({ ...editedData, testimonials: updated });
  };

  const addTestimonial = () => {
    if (!editedData) return;
    const newTestimonial: Testimonial = {
      id: `testimonial-${Date.now()}`,
      name: 'Novo Cliente',
      role: 'Cliente',
      content: 'Depoimento aqui...',
      rating: 5
    };
    setEditedData({
      ...editedData,
      testimonials: [...(editedData.testimonials || []), newTestimonial]
    });
  };

  const removeTestimonial = (index: number) => {
    if (!editedData || !editedData.testimonials) return;
    const updated = editedData.testimonials.filter((_, i) => i !== index);
    setEditedData({ ...editedData, testimonials: updated });
  };

  const updateGalleryItem = (index: number, field: keyof GalleryItem, value: any) => {
    if (!editedData || !editedData.galleryImages) return;
    const updated = [...editedData.galleryImages];
    updated[index] = { ...updated[index], [field]: value };
    setEditedData({ ...editedData, galleryImages: updated });
  };

  const addGalleryItem = () => {
    if (!editedData) return;
    const newItem: GalleryItem = {
      id: `gallery-${Date.now()}`,
      title: 'Nova Imagem',
      description: 'Descrição da imagem',
      imagePrompt: 'prompt para geração da imagem'
    };
    setEditedData({
      ...editedData,
      galleryImages: [...(editedData.galleryImages || []), newItem]
    });
  };

  const removeGalleryItem = (index: number) => {
    if (!editedData || !editedData.galleryImages) return;
    const updated = editedData.galleryImages.filter((_, i) => i !== index);
    setEditedData({ ...editedData, galleryImages: updated });
  };

  const updateProduct = (index: number, field: keyof Product, value: any) => {
    if (!editedData || !editedData.products) return;
    const updated = [...editedData.products];
    updated[index] = { ...updated[index], [field]: value };
    setEditedData({ ...editedData, products: updated });
  };

  const addProduct = () => {
    if (!editedData) return;
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: 'Novo Produto',
      description: 'Descrição do produto',
      price: 'R$ 0,00',
      imagePrompt: 'prompt para imagem do produto'
    };
    setEditedData({
      ...editedData,
      products: [...(editedData.products || []), newProduct]
    });
  };

  const removeProduct = (index: number) => {
    if (!editedData || !editedData.products) return;
    const updated = editedData.products.filter((_, i) => i !== index);
    setEditedData({ ...editedData, products: updated });
  };

  if (!businessData) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Configurações</h3>
        <Card className="p-4 bg-gradient-card text-center">
          <p className="text-muted-foreground text-sm">
            Gere uma landing page primeiro para acessar as configurações
          </p>
        </Card>
      </div>
    );
  }

  if (!editedData) {
    setEditedData(businessData);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Configurações</h3>
        <Badge variant="outline" className="text-xs">
          {businessData.templateId || 'Template Padrão'}
        </Badge>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {/* Informações de Contato */}
        <AccordionItem value="contact" className="border rounded-lg px-4 bg-gradient-card">
          <AccordionTrigger className="text-sm font-medium">
            Informações de Contato
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-3">
            <div>
              <Label className="text-xs">WhatsApp</Label>
              <Input
                value={editedData?.contact.socialMedia.whatsapp || ''}
                onChange={(e) => updateSocialMedia('whatsapp', e.target.value)}
                placeholder="(11) 99999-9999"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input
                value={editedData?.contact.email || ''}
                onChange={(e) => updateContact('email', e.target.value)}
                placeholder="contato@empresa.com"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Telefone</Label>
              <Input
                value={editedData?.contact.phone || ''}
                onChange={(e) => updateContact('phone', e.target.value)}
                placeholder="(11) 3333-3333"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Endereço</Label>
              <Input
                value={editedData?.contact.address || ''}
                onChange={(e) => updateContact('address', e.target.value)}
                placeholder="São Paulo, SP"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Instagram</Label>
              <Input
                value={editedData?.contact.socialMedia.instagram || ''}
                onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                placeholder="@empresa"
                className="text-xs"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Depoimentos */}
        {businessData.testimonials && businessData.testimonials.length > 0 && (
          <AccordionItem value="testimonials" className="border rounded-lg px-4 bg-gradient-card">
            <AccordionTrigger className="text-sm font-medium">
              Depoimentos ({editedData?.testimonials?.length || 0})
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-3">
              {editedData?.testimonials?.map((testimonial, index) => (
                <Card key={testimonial.id} className="p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">Depoimento {index + 1}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTestimonial(index)}
                      className="h-6 w-6 p-0 text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs">Nome</Label>
                    <Input
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Cargo/Função</Label>
                    <Input
                      value={testimonial.role}
                      onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Depoimento</Label>
                    <Input
                      value={testimonial.content}
                      onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Avaliação (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                      className="text-xs"
                    />
                  </div>
                </Card>
              ))}
              <Button size="sm" variant="outline" onClick={addTestimonial} className="w-full">
                <Plus className="w-3 h-3 mr-1" />
                Adicionar Depoimento
              </Button>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Galeria */}
        {businessData.galleryImages && businessData.galleryImages.length > 0 && (
          <AccordionItem value="gallery" className="border rounded-lg px-4 bg-gradient-card">
            <AccordionTrigger className="text-sm font-medium">
              Galeria ({editedData?.galleryImages?.length || 0})
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-3">
              {editedData?.galleryImages?.map((item, index) => (
                <Card key={item.id} className="p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">Imagem {index + 1}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeGalleryItem(index)}
                      className="h-6 w-6 p-0 text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs">Título</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateGalleryItem(index, 'title', e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Descrição</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateGalleryItem(index, 'description', e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </Card>
              ))}
              <Button size="sm" variant="outline" onClick={addGalleryItem} className="w-full">
                <Plus className="w-3 h-3 mr-1" />
                Adicionar Imagem
              </Button>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Produtos/Catálogo */}
        {businessData.products && businessData.products.length > 0 && (
          <AccordionItem value="products" className="border rounded-lg px-4 bg-gradient-card">
            <AccordionTrigger className="text-sm font-medium">
              Produtos ({editedData?.products?.length || 0})
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-3">
              {editedData?.products?.map((product, index) => (
                <Card key={product.id} className="p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">Produto {index + 1}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeProduct(index)}
                      className="h-6 w-6 p-0 text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs">Nome</Label>
                    <Input
                      value={product.name}
                      onChange={(e) => updateProduct(index, 'name', e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Descrição</Label>
                    <Input
                      value={product.description}
                      onChange={(e) => updateProduct(index, 'description', e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Preço</Label>
                    <Input
                      value={product.price}
                      onChange={(e) => updateProduct(index, 'price', e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </Card>
              ))}
              <Button size="sm" variant="outline" onClick={addProduct} className="w-full">
                <Plus className="w-3 h-3 mr-1" />
                Adicionar Produto
              </Button>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <Button onClick={handleSave} className="w-full">
        <Save className="w-4 h-4 mr-2" />
        Salvar Configurações
      </Button>
    </div>
  );
};

export default ConfigTab;
