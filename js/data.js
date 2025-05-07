/**
 * Product data for the jewelry e-commerce store
 */
const products = [
  {
    id: 1,
    name: "Pihu Bracelet",
    price: 200,
    description: "Delicate bracelet with traditional elegance and modern charm. Perfect for brides, bridesmaids, and daily elegance. Can be stacked for boldness or worn alone for subtlety.",
    rating: 4.8,
    ratingCount: 24,
    category: "bracelets",
    tags: ["padmika", "bridal", "traditional"],
    images: [
      "pics/pihu_bracelet.png"
    ]
  },
  {
    id: 2,
    name: "Piya Haathfool",
    price: 300,
    description: "Bridal hand accessory with intricate detailing. Perfect for brides, bridesmaids, and festive looks. Pair with matching sets for a royal touch.",
    rating: 4.9,
    ratingCount: 18,
    category: "bridal-sets",
    tags: ["padmika", "bridal"],
    images: [
      "images/products/piya_haathfool.jpg"
    ]
  },
  {
    id: 3,
    name: "Purnima Necklace",
    price: 500,
    description: "Lotus bloom inspired necklace with big and small motifs. Perfect for Haldi/Mehndi and bridal looks. Wear as a statement floral piece.",
    rating: 4.7,
    ratingCount: 32,
    category: "necklaces",
    tags: ["padmika", "bridal", "featured"],
    images: [
      "pics/purnima_necklace.png"
    ]
  },
  {
    id: 4,
    name: "Padmika Set",
    price: 1000,
    description: "Complete bridal ensemble including Prashanti Choker, Praksha Studs, Pranatik Ring, and Pallavika Mangtika. Perfect for creating a coordinated bridal look. Can be mixed and matched or worn as a complete set.",
    rating: 5.0,
    ratingCount: 15,
    category: "bridal-sets",
    tags: ["padmika", "bridal", "featured", "bestseller"],
    images: [
      "pics/padmika_set.png"
    ]
  },
  {
    id: 5,
    name: "Soorajkund Set",
    price: 1100,
    description: "Elegant bridal set including necklace, earrings, and mangtika. Perfect for bridal and festive occasions. Features intricate traditional designs with a modern twist.",
    rating: 4.9,
    ratingCount: 22,
    category: "bridal-sets",
    tags: ["surya", "bridal", "featured"],
    images: [
      "pics/soorajkund_set.png"
    ]
  },
  {
    id: 6,
    name: "Neelambari Set",
    price: 750,
    description: "Stunning set featuring a floral choker and earrings in sea blue and red kundan with pearls. Perfect for brides and royal events.",
    rating: 4.8,
    ratingCount: 28,
    category: "bridal-sets",
    tags: ["neelambari", "bridal", "featured"],
    images: [
      "pics/neelambari_set.png"
    ]
  },
  {
    id: 7,
    name: "Purvi Stud Jhumka",
    price: 200,
    description: "Minimal lotus jhumka perfect for everyday wear. Ideal for bridesmaids and those seeking daily elegance.",
    rating: 4.6,
    ratingCount: 45,
    category: "earrings",
    tags: ["padmika", "bestseller"],
    images: [
      "images/products/purvi_stud_jhumka.jpg"
    ]
  },
  {
    id: 8,
    name: "Neelambari Chandbaaliyan",
    price: 450,
    description: "Sea blue and red floral kundan earrings with pearl drops. Perfect for weddings and traditional occasions.",
    rating: 4.7,
    ratingCount: 34,
    category: "earrings",
    tags: ["neelambari", "bestseller"],
    images: [
      "images/products/neelambari_chandbaaliyan.jpg"
    ]
  }
];

/**
 * Categories for the jewelry store
 */
const categories = [
  {
    id: "padmika",
    name: "Padmika Collection",
    image: "images/collections/padmika_collection.jpg"
  },
  {
    id: "surya",
    name: "Surya Collection",
    image: "images/collections/surya_collection.jpg"
  },
  {
    id: "neelambari",
    name: "Neelambari Collection",
    image: "images/collections/neelambari_collection.jpg"
  },
  {
    id: "bridal-sets",
    name: "Bridal Sets",
    image: "images/collections/bridal_sets.jpg"
  }
];