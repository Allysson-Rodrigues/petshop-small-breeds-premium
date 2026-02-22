export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  details?: string[];
}

export const categories = [
  "Todos",
  "Acessórios",
  "Alimentação",
  "Bem-estar",
  "Higiene",
];

export const products: Product[] = [
  {
    id: 1,
    name: "Coleira de Couro Heritage",
    category: "Acessórios",
    price: 120.0,
    image: "/products/collar.png",
    description: "Uma peça atemporal em couro italiano legítimo com acabamento em latão escovado.",
    details: ["Couro de flor integral", "Hardware em bronze sólido", "Ajuste milimétrico", "Disponível em 3 tamanhos"]
  },
  {
    id: 2,
    name: "Cama Nuvem Velvet",
    category: "Bem-estar",
    price: 299.0,
    image: "/products/bed.png",
    description: "O ápice do conforto sênior. Preenchimento ortopédico com revestimento em veludo ultra suave.",
    details: ["Veludo de alta gramatura", "Base antiderrapante", "Capa lavável em máquina", "Espuma de memória"]
  },
  {
    id: 3,
    name: "Ração Premium Orgânica 2kg",
    category: "Alimentação",
    price: 189.9,
    image: "/products/food.png",
    description: "Nutrição holística com ingredientes controlados na origem. Livre de grãos e subprodutos.",
    details: ["100% Ingredientes de grau humano", "Rica em Ômega 3 e 6", "Zero transgênicos", "Processamento a frio"]
  },
  {
    id: 4,
    name: "Shampoo Botânico Suave",
    category: "Higiene",
    price: 68.0,
    image: "/products/shampoo.png",
    description: "Fórmula sândalo e bergamota para uma limpeza profunda sem agredir a pele sensível.",
    details: ["pH balanceado", "Livre de sulfatos e parabenos", "Fragrância hipoalergênica"]
  },
  {
    id: 5,
    name: "Bolsa de Transporte Aspen",
    category: "Acessórios",
    price: 450.0,
    image: "/products/carrier.png",
    description: "Segurança e estilo para viagens. Design arquitetônico com ventilação otimizada.",
    details: ["Lona militar reforçada", "Acabamento em couro", "Tela de ventilação resistente", "Cinto de segurança interno"]
  },
  {
    id: 6,
    name: "Tigela de Cerâmica Fosca",
    category: "Alimentação",
    price: 85.0,
    image: "/products/bowl.png",
    description: "Cerâmica artesanal com design ergonômico. Menos estresse nos bigodes durante as refeições.",
    details: ["Acabamento fosco premium", "Livre de chumbo e cádmio", "Pode ir à lava-louças"]
  },
  {
    id: 7,
    name: "Escova de Cerdas Naturais",
    category: "Higiene",
    price: 45.0,
    image: "/products/brush.png",
    description: "Cerdas suaves para estimular a circulação natural e brilho da pelagem curta e média.",
    details: ["Cerdas de bambu sustentável", "Cabo ergonômico"]
  },
  {
    id: 8,
    name: "Perfume Cítrico Pet",
    category: "Higiene",
    price: 110.0,
    image: "/products/perfume.png",
    description: "Colônia suave com notas de verbena e limão siciliano. Elegância discreta no pós-banho.",
    details: ["Sem álcool", "Fixação de até 12 horas", "Extratos naturais"]
  },
];
