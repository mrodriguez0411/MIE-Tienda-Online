// initialdata.ts
// initialData.ts

interface ProductType {
	name: string;
	type: string;
  }
  
  interface Variant {
	type: string;
	stock: number;
  }
  
  interface AllProducts {
	img: string;
	name: string;
	price: number;
	descriptions: string;
	types: ProductType[];
	variants: Variant[];
  }
  
  export const AllProducts = [
	{
	  img: "https://via.placeholder.com/150",
	  name: "Producto A",
	  price: 29.99,
	  descriptions: "descripcion-del-producto-a",
	  types: [
		{ name: "Tamaño", type: "Pequeño" },
		{ name: "Tamaño", type: "Grande" },
	  ],
	  variants: [
		{ type: "Pequeño", stock: 10 },
		{ type: "Grande", stock: 5 },
	  ],
	},
	{
	  img: "https://via.placeholder.com/150",
	  name: "Producto B",
	  price: 49.99,
	  descriptions: "descripcion-del-producto-b",
	  types: [
		{ name: "Color", type: "Rojo" },
		{ name: "Color", type: "Azul" },
	  ],
	  variants: [
		{ type: "Rojo", stock: 10 },
		{ type: "Azul", stock: 15 },
	  ],
	},
	{
	  img: "https://via.placeholder.com/150",
	  name: "Producto C",
	  price: 19.99,
	  descriptions: "descripcion-del-producto-c",
	  types: [
		{ name: "Material", type: "Plástico" },
		{ name: "Material", type: "Metal" },
	  ],
	  variants: [
		{ type: "Plástico", stock: 20 },
		{ type: "Metal", stock: 8 },
	  ],
	},
	{
	  img: "https://via.placeholder.com/150",
	  name: "Producto Vacío",
	  price: 10,
	  descriptions: "producto-vacio",
	  types: [{ name: "Default", type: "Default" }], // Tipo predeterminado
	  variants: [{ type: "Default", stock: 0 }],
	},
  ];
  
  export const recentPoducts = [
	{
		img: "../../public/img/products/termo1.jpg",
		name: "Producto A",
		price: 29,
		descriptions: "descripcion-del-producto-a",
		types: [
		  { name: "Tamaño", type: "Pequeño" },
		  { name: "Tamaño", type: "Grande" },
		],
		variants: [
		  { type: "Pequeño", stock: 10 },
		  { type: "Grande", stock: 5 },
		],
	  },
	  {
		img: "https://via.placeholder.com/150",
		name: "Producto B",
		price: 49.99,
		descriptions: "descripcion-del-producto-b",
		types: [
		  { name: "Color", type: "Rojo" },
		  { name: "Color", type: "Azul" },
		],
		variants: [
		  { type: "Rojo", stock: 0 },
		  { type: "Azul", stock: 15 },
		],
	  },

  ]

  export const popularProducts = [
	{
		img: "https://via.placeholder.com/150",
		name: "Producto C",
		price: 19.99,
		descriptions: "descripcion-del-producto-c",
		types: [
		  { name: "Material", type: "Plástico" },
		  { name: "Material", type: "Metal" },
		],
		variants: [
		  { type: "Plástico", stock: 20 },
		  { type: "Metal", stock: 8 },
		],
	  },
	  {
		img: "https://via.placeholder.com/150",
		name: "Producto Vacío",
		price: 10.0,
		descriptions: "producto-vacio",
		types: [{ name: "Default", type: "Default" }], // Tipo predeterminado
		variants: [{ type: "Default", stock: 0 }],
	  },

  ]