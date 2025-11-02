import { Testimonial, GalleryItem, Product, TeamMember } from '../contentGenerator';

export class DataStructureAgent {
  generateTestimonials(businessName: string, businessType: string, count: number = 3): Testimonial[] {
    const testimonials: Testimonial[] = [];
    
    for (let i = 0; i < count; i++) {
      testimonials.push({
        id: `testimonial-${i + 1}`,
        name: this.generatePersonName(i),
        role: this.generatePersonRole(businessType, i),
        content: `Excelente experiência com ${businessName}! Superou todas as minhas expectativas. O atendimento foi impecável e os resultados foram além do que imaginei. Recomendo muito!`,
        rating: 5,
        image: `cliente satisfeito ${i + 1} de ${businessName}`
      });
    }
    
    return testimonials;
  }

  generateGalleryItems(businessName: string, businessType: string, count: number = 6): GalleryItem[] {
    const categories = this.getGalleryCategories(businessType);
    const items: GalleryItem[] = [];
    
    for (let i = 0; i < count; i++) {
      const category = categories[i % categories.length];
      items.push({
        id: `gallery-${i + 1}`,
        title: `${category.title} ${i + 1}`,
        description: category.description,
        imagePrompt: `${businessName} - ${category.imagePrompt}, foto profissional de alta qualidade`,
        category: category.name
      });
    }
    
    return items;
  }

  generateProducts(businessName: string, businessType: string, count: number = 6): Product[] {
    const productTypes = this.getProductTypes(businessType);
    const products: Product[] = [];
    
    for (let i = 0; i < count; i++) {
      const productType = productTypes[i % productTypes.length];
      products.push({
        id: `product-${i + 1}`,
        name: `${productType.name} ${i + 1}`,
        description: productType.description,
        price: this.generatePrice(productType.priceRange),
        imagePrompt: `${businessName} - ${productType.imagePrompt}, foto profissional de produto`,
        category: productType.category
      });
    }
    
    return products;
  }

  generateTeamMembers(businessName: string, businessType: string, count: number = 3): TeamMember[] {
    const roles = this.getTeamRoles(businessType);
    const members: TeamMember[] = [];
    
    for (let i = 0; i < count; i++) {
      const role = roles[i % roles.length];
      members.push({
        id: `team-${i + 1}`,
        name: this.generatePersonName(i + 10),
        role: role.title,
        description: `${role.description} com experiência comprovada em ${businessType}.`,
        imagePrompt: `${role.imagePrompt} profissional de ${businessName}`
      });
    }
    
    return members;
  }

  private generatePersonName(index: number): string {
    const names = [
      'Maria Silva', 'João Santos', 'Ana Costa', 'Carlos Oliveira', 'Paula Souza',
      'Ricardo Lima', 'Juliana Ferreira', 'Pedro Alves', 'Fernanda Rodrigues', 'Lucas Martins',
      'Camila Pereira', 'Rafael Cardoso', 'Mariana Gomes', 'Thiago Ribeiro', 'Beatriz Araújo'
    ];
    return names[index % names.length];
  }

  private generatePersonRole(businessType: string, index: number): string {
    const roles = [
      'Cliente satisfeito', 'Empresário', 'Profissional autônomo',
      'Gestor de empresa', 'Empreendedor', 'Cliente regular'
    ];
    return roles[index % roles.length];
  }

  private getGalleryCategories(businessType: string) {
    const categories: any = {
      'corretor': [
        { name: 'imoveis', title: 'Imóvel Premium', description: 'Propriedade de alto padrão', imagePrompt: 'imóvel luxuoso com acabamento premium' },
        { name: 'ambientes', title: 'Ambiente Interno', description: 'Espaço interno bem decorado', imagePrompt: 'ambiente interno moderno e bem decorado' },
        { name: 'externo', title: 'Área Externa', description: 'Vista externa da propriedade', imagePrompt: 'área externa com jardim e piscina' },
      ],
      'restaurante': [
        { name: 'pratos', title: 'Prato Especial', description: 'Culinária de qualidade', imagePrompt: 'prato gourmet bem apresentado' },
        { name: 'ambiente', title: 'Ambiente', description: 'Espaço aconchegante', imagePrompt: 'ambiente interno do restaurante elegante' },
        { name: 'chef', title: 'Cozinha', description: 'Preparo profissional', imagePrompt: 'chef preparando pratos na cozinha' },
      ],
      'default': [
        { name: 'trabalho', title: 'Nosso Trabalho', description: 'Resultado profissional', imagePrompt: 'trabalho sendo realizado com qualidade' },
        { name: 'ambiente', title: 'Nosso Espaço', description: 'Ambiente profissional', imagePrompt: 'ambiente de trabalho moderno' },
        { name: 'equipe', title: 'Nossa Equipe', description: 'Profissionais dedicados', imagePrompt: 'equipe trabalhando em conjunto' },
      ]
    };

    return categories[businessType] || categories['default'];
  }

  private getProductTypes(businessType: string) {
    return [
      { name: 'Produto Premium', description: 'Item de alta qualidade', priceRange: [100, 500], imagePrompt: 'produto premium', category: 'premium' },
      { name: 'Produto Padrão', description: 'Opção versátil', priceRange: [50, 200], imagePrompt: 'produto padrão', category: 'standard' },
      { name: 'Combo Especial', description: 'Melhor custo-benefício', priceRange: [150, 400], imagePrompt: 'combo de produtos', category: 'combo' },
    ];
  }

  private getTeamRoles(businessType: string) {
    return [
      { title: 'Especialista', description: 'Profissional especializado', imagePrompt: 'profissional especialista' },
      { title: 'Coordenador', description: 'Coordenador de equipe', imagePrompt: 'coordenador profissional' },
      { title: 'Consultor', description: 'Consultor experiente', imagePrompt: 'consultor profissional' },
    ];
  }

  private generatePrice(range: number[]): string {
    const price = Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
    return `R$ ${price},00`;
  }
}

export const dataStructureAgent = new DataStructureAgent();
