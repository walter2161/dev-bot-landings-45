import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Layout, Check } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  nichos: string[];
  colors: { header: string; accent: string; whatsapp: string };
  preview: string;
}

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
  selectedTemplate?: string;
}

const templates: Template[] = [
  {
    id: "moderno-visual",
    name: "Moderno & Visual",
    description: "Cabeçalho escuro, seção 5W2H em cards, galeria grid 3x3",
    nichos: ["Restaurantes", "Cafeterias", "Hotéis", "Pousadas", "Imobiliárias", "Construtoras", "Arquitetura", "Decoração", "Eventos", "Turismo"],
    colors: { header: "#2c3e50", accent: "#3498db", whatsapp: "#25D366" },
    preview: "🎨 Design moderno com cards elegantes e galeria visual impactante"
  },
  {
    id: "minimalista-clean",
    name: "Minimalista & Clean",
    description: "Fundo branco, acordeão vertical, carrossel horizontal",
    nichos: ["Consultórios médicos", "Clínicas", "Advogados", "Contabilidade", "Escritórios", "Serviços profissionais", "Educação", "Cursos", "Terapias", "Coaching"],
    colors: { header: "#ffffff", accent: "#e74c3c", whatsapp: "#25D366" },
    preview: "✨ Design limpo e profissional com foco na informação"
  },
  {
    id: "interativo-dinamico",
    name: "Interativo & Dinâmico",
    description: "Logo centralizado, timeline horizontal, grid assimétrico",
    nichos: ["Moda", "Beleza", "Estética", "Academia", "Petshop", "Design", "Fotografia", "Arte", "Artesanato", "Produtos criativos"],
    colors: { header: "gradiente", accent: "#2980b9", whatsapp: "#25D366" },
    preview: "🚀 Design dinâmico com elementos interativos e criativos"
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedTemplate 
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-card border-primary/20 shadow-primary">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <Layout className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">Escolha seu Template</h2>
              <p className="text-sm text-muted-foreground">Selecione o design que melhor representa seu negócio</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Templates Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedTemplate === template.id 
                    ? 'border-primary bg-primary/5 shadow-primary' 
                    : 'border-border/30 hover:border-primary/50'
                }`}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                onClick={() => onSelect(template.id)}
              >
                {/* Template Preview */}
                <div className="relative mb-4">
                  <div 
                    className="w-full h-32 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{
                      background: template.colors.header === 'gradiente' 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : template.colors.header === '#ffffff'
                        ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                        : template.colors.header
                    }}
                  >
                    {template.name}
                  </div>
                  
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      {template.name}
                      {hoveredTemplate === template.id && (
                        <Badge variant="secondary" className="text-xs">
                          Clique para selecionar
                        </Badge>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {template.preview}
                  </div>

                  {/* Nichos */}
                  <div>
                    <p className="text-xs font-medium text-foreground mb-2">Ideal para:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.nichos.slice(0, 4).map((nicho) => (
                        <Badge key={nicho} variant="outline" className="text-xs">
                          {nicho}
                        </Badge>
                      ))}
                      {template.nichos.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.nichos.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div>
                    <p className="text-xs font-medium text-foreground mb-2">Esquema de cores:</p>
                    <div className="flex gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-border/30"
                        style={{ background: template.colors.accent }}
                        title="Cor de destaque"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-border/30"
                        style={{ background: template.colors.whatsapp }}
                        title="WhatsApp"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-border/30"
                        style={{ 
                          background: template.colors.header === 'gradiente' 
                            ? 'linear-gradient(45deg, #667eea, #764ba2)'
                            : template.colors.header === '#ffffff'
                            ? '#f8f9fa'
                            : template.colors.header
                        }}
                        title="Cabeçalho"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-primary/20">
          <p className="text-xs text-muted-foreground">
            O template será aplicado automaticamente baseado no seu tipo de negócio
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            {selectedTemplate && (
              <Button 
                onClick={() => {
                  onSelect(selectedTemplate);
                  onClose();
                }}
                className="bg-gradient-primary"
              >
                Confirmar Template
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TemplateSelector;