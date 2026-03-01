export interface BreedCareInfo {
	icon: string;
	title: string;
	subtitle: string;
	desc: string;
}

export interface BreedStat {
	label: string;
	value: string;
}

export interface BreedProfile {
	name: string;
	label: string;
	desc: string;
	image: string;
	stats: BreedStat[];
	care: BreedCareInfo[];
}

export const breedsData: Record<string, BreedProfile> = {
	"poodle-toy": {
		name: "Poodle Toy",
		label: "PERFIL COMPANHIA",
		desc: "Elegância compacta e inteligência vibrante. O Poodle Toy é a definição de luxo em miniatura, exigindo cuidados técnicos de alto padrão para manter sua pelagem impecável.",
		image: "/breeds/poodle.png",
		stats: [
			{ label: "Tosa", value: "Mensal" },
			{ label: "Banho", value: "Quinzenal" },
			{ label: "Atividade", value: "Moderada" },
			{ label: "Pelagem", value: "Ondulada" },
		],
		care: [
			{ icon: "cut", title: "Tosa Artesanal", subtitle: "Standard de Exibição", desc: "Cortes precisos modelados para o padrão de raça Poodle. Realizamos os estilos Continental, Cubo e Puppy Clip com tesoura artesanal para acabamento geométrico e simétrico." },
			{ icon: "bathtub", title: "Banho Premium", subtitle: "Hidratação Profunda", desc: "Shampoos hipoalergênicos de alta hidratação com fragrância persistente. Secagem em temperatura controlada preservando os cachos naturais e o volume da pelagem." },
			{ icon: "medical_services", title: "Saúde Veterinária", subtitle: "Medicina Preventiva", desc: "Check-up específico: análise auditiva detalhada, profilaxia dental e monitoramento ocular. Vacinação e vermifugação rigorosamente programadas." },
		],
	},
	"chihuahua": {
		name: "Chihuahua",
		label: "PERFIL VALENTE",
		desc: "O menor cão do mundo carrega a maior personalidade. Requer atenção especial à temperatura corporal e produtos delicados e hipoalergênicos adaptados à sua pele sensível.",
		image: "/breeds/chihuahua.png",
		stats: [
			{ label: "Tosa", value: "Bimestral" },
			{ label: "Banho", value: "Mensal" },
			{ label: "Atividade", value: "Alta" },
			{ label: "Pelagem", value: "Curta/Lisa" },
		],
		care: [
			{ icon: "cut", title: "Tosa Higiênica", subtitle: "Cuidado Delicado", desc: "Tosa de higiene nas áreas sensíveis com lâminas de precisão. Tratamento especial para os pelos das patas e ouvidos, prevenindo acúmulo de sujidades." },
			{ icon: "bathtub", title: "Banho Termorregulatório", subtitle: "Conforto Térmico", desc: "Protocolo especial com água morna e secagem imediata evitando quedas de temperatura. Produtos ultra-suaves e hipoalergênicos para a pele sensível desta raça delicada." },
			{ icon: "medical_services", title: "Saúde Preventiva", subtitle: "Atenção Especializada", desc: "Monitoramento cardíaco e dental intensivo — raças toy são mais propensas a doenças periodontais. Avaliação regular do peso e articulações com nossa equipe veterinária." },
		],
	},
	"maltes": {
		name: "Maltês",
		label: "PERFIL LUXO",
		desc: "Elegante, dócil e com pelagem de seda brilhante. Nossa hidratação botânica e tosa na tesoura extraem o máximo da beleza desta raça ancestral de origem mediterrânea.",
		image: "/breeds/maltes.png",
		stats: [
			{ label: "Tosa", value: "Mensal" },
			{ label: "Banho", value: "Semanal" },
			{ label: "Atividade", value: "Baixa" },
			{ label: "Pelagem", value: "Longa/Sedosa" },
		],
		care: [
			{ icon: "cut", title: "Tosa na Tesoura", subtitle: "Corte Artesanal", desc: "A pelagem longa e sedosa do Maltês exige cortes exclusivos na tesoura. Realizamos o corte de manutenção e o corte de show, com escovação que elimina todos os nós." },
			{ icon: "bathtub", title: "Hidratação Botânica", subtitle: "Ritual de Seda", desc: "Protocolo de hidratação com óleos de argan e seda vegetal que potencializa o brilho e a maciez da pelagem branca. Branqueamento natural sem agentes agressivos." },
			{ icon: "medical_services", title: "Cuidado Ocular", subtitle: "Higiene Premium", desc: "Limpeza especializada ao redor dos olhos para prevenir manchas de lacrimal. Avaliação dermatológica regular para a sensível pele do Maltês sob a densa pelagem." },
		],
	},
	"yorkshire-terrier": {
		name: "Yorkshire Terrier",
		label: "PERFIL ATIVO",
		desc: "Pequeno caçador com coração gigante e espírito aventureiro. Seus pelos finos demandam escovação profissional e produtos de nutrição intensa para manter o brilho.",
		image: "/breeds/yorkshire.png",
		stats: [
			{ label: "Tosa", value: "Mensal" },
			{ label: "Banho", value: "Quinzenal" },
			{ label: "Atividade", value: "Alta" },
			{ label: "Pelagem", value: "Fina/Sedosa" },
		],
		care: [
			{ icon: "cut", title: "Tosa Estilosa", subtitle: "Corte de Personalidade", desc: "O Yorkshire tem um coat que cresce constantemente como cabelo humano. Oferecemos o corte de manutenção curto, o corte longo de exibição e a tradicional topete com laço." },
			{ icon: "bathtub", title: "Nutrição Intensiva", subtitle: "Fios com Vitalidade", desc: "Shampoos proteicos e condicionadores de queratina que fortalecem os fios finos e evitam quebra. Hidratação profunda que mantém o brilho sedoso característico da raça." },
			{ icon: "medical_services", title: "Saúde Articular", subtitle: "Cuidado Preventivo", desc: "Yorkshire são propensos a problemas de patela. Nossa equipe realiza avaliação locomotora e dental a cada visita, acompanhando o histórico clínico completo do seu pet." },
		],
	},
	"shih-tzu": {
		name: "Shih Tzu",
		label: "PERFIL DÓCIL",
		desc: "O 'cão leão' chinês é o companheiro de colo perfeito. Banhos frequentes com a tosa bebê garantem o frescor e reduzem a formação de nós na sua pelagem densa.",
		image: "/breeds/shihtzu.png",
		stats: [
			{ label: "Tosa", value: "Mensal" },
			{ label: "Banho", value: "Quinzenal" },
			{ label: "Atividade", value: "Baixa" },
			{ label: "Pelagem", value: "Densa/Dupla" },
		],
		care: [
			{ icon: "cut", title: "Tosa Bebê", subtitle: "Conforto Total", desc: "A tosa bebê no Shih Tzu traz praticidade sem perder o charme. Também realizamos a tosa longa de show e o estilo coreano, mantendo a pelagem organizada e livre de nós." },
			{ icon: "bathtub", title: "Desamarrante Profissional", subtitle: "Pelagem Liberta", desc: "Protocolo de desembaraçamento antes do banho com produtos específicos. Shampoo de dupla camada que limpa tanto a subcamada quanto o manto superior, seguido de secagem com escova." },
			{ icon: "medical_services", title: "Cuidado Respiratório", subtitle: "Saúde Braquicéfala", desc: "Como raça braquicéfala, o Shih Tzu requer monitoramento respiratório e limpeza de prega nasal. Nossa veterinária acompanha a saúde ocular e auditiva a cada consulta." },
		],
	},
	"pug": {
		name: "Pug",
		label: "PERFIL SOCIAL",
		desc: "Muito charme e personalidade em um corpo compacto. Nossa equipe veterinária atenta dedica tempo extra à higienização cuidadosa das suas famosas dobras faciais.",
		image: "/breeds/pug.png",
		stats: [
			{ label: "Tosa", value: "Bimestral" },
			{ label: "Banho", value: "Quinzenal" },
			{ label: "Atividade", value: "Moderada" },
			{ label: "Pelagem", value: "Curta/Densa" },
		],
		care: [
			{ icon: "cut", title: "Tosa Higiênica", subtitle: "Limpeza Facial", desc: "Tosa de higiene entre as dobras faciais e nas áreas sensíveis. Usamos lâminas de tamanho micro para a limpeza das rugas sem irritar a pele delicada desta raça única." },
			{ icon: "bathtub", title: "Higiene das Dobras", subtitle: "Ritual Anti-inflamatório", desc: "Protocolo especial de limpeza e secagem das dobras com produtos dermatologicamente testados. Prevenção ativa de dermatites e infecções cutâneas nestas regiões sensíveis." },
			{ icon: "medical_services", title: "Monitoramento Respiratório", subtitle: "Braquicéfalos VIP", desc: "Avaliação da qualidade respiratória, palatina e nasal a cada visita. Nossa equipe monitora peso, oxigenação e saúde ocular — áreas críticas para a qualidade de vida do Pug." },
		],
	},
};
