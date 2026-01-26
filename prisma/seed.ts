import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to generate image path from product name and gender
function getImagePath(name: string, gender: 'mens' | 'womens'): string {
  const genderPrefix = gender.toUpperCase() === 'MENS' ? 'MENS' : 'WOMENS'
  const imageName = name.toLowerCase().replace(/\s+/g, '-')
  return `/images/products/${genderPrefix}-${imageName}`
}

// Helper function to create stockBySize object with default values
function createStockBySize(sizes: string[], defaultStock: number = 10): Record<string, number> {
  const stockBySize: Record<string, number> = {}
  sizes.forEach(size => {
    stockBySize[size] = defaultStock
  })
  return stockBySize
}

// Helper function to generate product descriptions
function getProductDescription(name: string, category: string, gender: string): string {
  const descriptions: Record<string, string> = {
    'Classic White Tee': 'A timeless essential perfect for everyday wear. Made from premium cotton blend, this classic white t-shirt offers exceptional comfort and versatility. The relaxed fit and soft fabric make it an ideal foundation piece for any wardrobe.',
    'Slim Fit Jeans': 'Modern slim-fit jeans that combine style with comfort. Crafted from premium denim with just the right amount of stretch, these jeans offer a tailored silhouette that flatters while allowing freedom of movement.',
    'Denim Jacket': 'A versatile denim jacket that never goes out of style. Featuring a classic cut and durable construction, this jacket is perfect for layering in any season. The medium wash offers a timeless look that pairs with everything.',
    'Cargo Pants': 'Functional and stylish cargo pants designed for comfort and durability. With multiple pockets and a relaxed fit, these pants are perfect for both casual and active wear. Made from a sturdy cotton blend that stands up to daily use.',
    'Polo Shirt': 'A refined polo shirt that elevates your casual style. Made from pique cotton, this classic piece offers a polished look that works for both relaxed and semi-formal occasions. The breathable fabric keeps you comfortable all day.',
    'Hooded Sweatshirt': 'A cozy hooded sweatshirt perfect for cooler weather. Made from soft, fleece-lined fabric, this sweatshirt provides warmth and comfort. The relaxed fit and adjustable drawstring hood make it an essential layering piece.',
    'Chino Pants': 'Versatile chino pants that bridge the gap between casual and smart casual. Made from lightweight cotton twill, these pants offer a clean, polished appearance while maintaining comfort. Perfect for both work and leisure.',
    'Button Down Shirt': 'A classic button-down shirt that combines traditional styling with modern comfort. Made from crisp cotton, this shirt features a tailored fit and can be dressed up or down. Essential for any professional or casual wardrobe.',
    'Floral Summer Dress': 'A beautiful floral summer dress that captures the essence of warm-weather style. Made from lightweight, breathable fabric with a flowing silhouette, this dress is perfect for sunny days and special occasions.',
    'High-Waist Jeans': 'Flattering high-waist jeans that accentuate your natural curves. Made from premium denim with stretch, these jeans offer both style and comfort. The high-rise waist and slim fit create a modern, polished look.',
    'Cropped Blazer': 'A chic cropped blazer that adds sophistication to any outfit. Perfect for layering over dresses or pairing with high-waist pants, this structured piece elevates your style while maintaining a contemporary edge.',
    'Wide Leg Pants': 'Elegant wide-leg pants that offer both comfort and style. Made from flowing fabric with a relaxed fit, these pants create a sophisticated silhouette. Perfect for those who appreciate both fashion and comfort.',
    'Silk Blouse': 'A luxurious silk blouse that exudes elegance and sophistication. The smooth, lightweight fabric drapes beautifully and feels luxurious against the skin. Perfect for special occasions or when you want to add a touch of refinement to your look.',
    'Trench Coat': 'A classic trench coat that combines timeless style with practical design. Made from weather-resistant fabric, this coat features a belted waist and classic silhouette. A wardrobe staple that never goes out of style.',
    'Midi Skirt': 'A versatile midi skirt that offers the perfect length for any occasion. Made from comfortable, flowing fabric, this skirt pairs beautifully with casual tops or dressier blouses. The A-line cut flatters all body types.',
    'Knit Sweater': 'A cozy knit sweater perfect for layering in cooler weather. Made from soft, breathable yarn, this sweater offers warmth without bulk. The relaxed fit and classic design make it a versatile addition to your wardrobe.',
    'Accessory Belt': 'A classic leather belt that combines functionality with timeless style. Made from genuine leather with a durable buckle, this belt adds the perfect finishing touch to any outfit while keeping your pants secure.',
    'Accessory Watch': 'A sophisticated timepiece that blends modern design with classic elegance. Featuring a sleek face and comfortable band, this watch is both a functional accessory and a stylish statement piece.',
    'Bomber Jacket': 'A stylish bomber jacket that brings a modern edge to your wardrobe. Made from lightweight yet durable fabric, this jacket features a classic silhouette with contemporary details. Perfect for transitional weather.',
    'Cardigan': 'A versatile cardigan that offers both comfort and style. Made from soft, breathable knit fabric, this cardigan is perfect for layering. The button-front design and relaxed fit make it an essential piece for any season.',
    'Crewneck Sweater': 'A classic crewneck sweater that never goes out of style. Made from premium knit fabric, this sweater offers warmth and comfort with a timeless design. Perfect for casual wear or layering under a jacket.',
    'Athletic Shorts': 'Performance-focused athletic shorts designed for comfort and movement. Made from moisture-wicking fabric, these shorts are perfect for workouts, running, or any active pursuit. The relaxed fit allows for unrestricted motion.',
    'Chino Shorts': 'Versatile chino shorts that bridge the gap between casual and smart casual. Made from lightweight cotton twill, these shorts offer a clean, polished appearance while maintaining comfort. Perfect for warm weather and casual occasions.',
    'Gold Jewelry Set': 'An elegant gold jewelry set that adds sophistication to any outfit. Featuring carefully crafted pieces with a timeless design, this set includes matching items that coordinate beautifully. Perfect for special occasions or everyday elegance.',
    'Leather Handbag': 'A luxurious leather handbag that combines style with functionality. Made from premium leather, this bag features thoughtful compartments and a classic design. The perfect accessory to elevate any outfit.',
    'Linen Jumpsuit': 'A breezy linen jumpsuit perfect for warm weather. Made from lightweight, breathable linen fabric, this one-piece wonder offers effortless style and comfort. The relaxed fit and flowing silhouette create a chic, modern look.',
    'Tailored Jumpsuit': 'A sophisticated tailored jumpsuit that offers a polished, put-together look. Made from structured fabric with a flattering fit, this jumpsuit can easily transition from day to night. Perfect for those who appreciate both style and comfort.',
    'Autumn Lingerie Set': 'A beautiful autumn-inspired lingerie set that combines comfort with elegance. Made from soft, breathable fabric, this set features delicate details and a flattering fit. Perfect for everyday wear or special occasions.',
    'Bralette': 'A comfortable bralette that offers support without compromise. Made from soft, stretchy fabric, this piece provides a natural fit and feel. The delicate design makes it perfect for layering or wearing on its own.',
    'Denim Skirt': 'A classic denim skirt that brings timeless style to your wardrobe. Made from premium denim, this skirt offers a flattering fit and versatile design. Perfect for pairing with casual tops or dressier blouses.',
    'Cotton Top': 'A comfortable cotton top that offers effortless style. Made from soft, breathable cotton fabric, this top features a relaxed fit and versatile design. Perfect for everyday wear and easy to layer.',
  }
  
  return descriptions[name] || `A stylish ${category} designed for ${gender}. This versatile piece offers both comfort and style, making it a perfect addition to your wardrobe.`
}

const products = [
  // Mens products
  { name: 'Classic White Tee', sku: 'M-001', price: 29.99, originalPrice: null, category: 'shirts', gender: 'mens', image: getImagePath('Classic White Tee', 'mens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 1) },
  { name: 'Slim Fit Jeans', sku: 'M-002', price: 79.99, originalPrice: 99.99, category: 'pants', gender: 'mens', image: getImagePath('Slim Fit Jeans', 'mens'), tags: ['Sale'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 6) },
  { name: 'Denim Jacket', sku: 'M-003', price: 89.99, originalPrice: null, category: 'outerwear', gender: 'mens', image: getImagePath('Denim Jacket', 'mens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 5) },
  { name: 'Cargo Pants', sku: 'M-004', price: 69.99, originalPrice: null, category: 'pants', gender: 'mens', image: getImagePath('Cargo Pants', 'mens'), tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 8) },
  { name: 'Polo Shirt', sku: 'M-005', price: 49.99, originalPrice: null, category: 'shirts', gender: 'mens', image: getImagePath('Polo Shirt', 'mens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 9) },
  { name: 'Hooded Sweatshirt', sku: 'M-006', price: 59.99, originalPrice: 79.99, category: 'outerwear', gender: 'mens', image: getImagePath('Hooded Sweatshirt', 'mens'), tags: ['Sale'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 7) },
  { name: 'Chino Pants', sku: 'M-007', price: 64.99, originalPrice: null, category: 'pants', gender: 'mens', image: getImagePath('Chino Pants', 'mens'), tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 8) },
  { name: 'Button Down Shirt', sku: 'M-008', price: 54.99, originalPrice: null, category: 'shirts', gender: 'mens', image: getImagePath('Button Down Shirt', 'mens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 9) },
  { name: 'Accessory Belt', sku: 'M-009', price: 39.99, originalPrice: null, category: 'accessories', gender: 'mens', image: '/images/products/MENS-accessory-belt', tags: [], sizes: ['S', 'M', 'L', 'XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL'], 12) },
  { name: 'Accessory Watch', sku: 'M-010', price: 149.99, originalPrice: null, category: 'accessories', gender: 'mens', image: '/images/products/MENS-accessory-watch', tags: ['New'], sizes: ['One Size'], stockBySize: createStockBySize(['One Size'], 8) },
  { name: 'Bomber Jacket', sku: 'M-011', price: 99.99, originalPrice: null, category: 'outerwear', gender: 'mens', image: '/images/products/MENS-jacket-bomber', tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 6) },
  { name: 'Cardigan', sku: 'M-012', price: 74.99, originalPrice: null, category: 'outerwear', gender: 'mens', image: '/images/products/MENS-knitwear-cardigan', tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 7) },
  { name: 'Crewneck Sweater', sku: 'M-013', price: 69.99, originalPrice: null, category: 'outerwear', gender: 'mens', image: '/images/products/MENS-knitwear-crewneck', tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 8) },
  { name: 'Athletic Shorts', sku: 'M-014', price: 34.99, originalPrice: null, category: 'pants', gender: 'mens', image: '/images/products/MENS-shorts-athletic', tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 10) },
  { name: 'Chino Shorts', sku: 'M-015', price: 44.99, originalPrice: null, category: 'pants', gender: 'mens', image: '/images/products/MENS-shorts-chino', tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 9) },
  
  // Womens products
  { name: 'Floral Summer Dress', sku: 'W-001', price: 89.99, originalPrice: null, category: 'shirts', gender: 'womens', image: getImagePath('Floral Summer Dress', 'womens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 6) },
  { name: 'High-Waist Jeans', sku: 'W-002', price: 79.99, originalPrice: 99.99, category: 'pants', gender: 'womens', image: getImagePath('High-Waist Jeans', 'womens'), tags: ['Sale'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 7) },
  { name: 'Cropped Blazer', sku: 'W-003', price: 119.99, originalPrice: null, category: 'outerwear', gender: 'womens', image: getImagePath('Cropped Blazer', 'womens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 4) },
  { name: 'Wide Leg Pants', sku: 'W-004', price: 69.99, originalPrice: null, category: 'pants', gender: 'womens', image: getImagePath('Wide Leg Pants', 'womens'), tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 8) },
  { name: 'Silk Blouse', sku: 'W-005', price: 94.99, originalPrice: null, category: 'shirts', gender: 'womens', image: getImagePath('Silk Blouse', 'womens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 5) },
  { name: 'Trench Coat', sku: 'W-006', price: 149.99, originalPrice: 199.99, category: 'outerwear', gender: 'womens', image: getImagePath('Trench Coat', 'womens'), tags: ['Sale'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 3) },
  { name: 'Midi Skirt', sku: 'W-007', price: 59.99, originalPrice: null, category: 'pants', gender: 'womens', image: getImagePath('Midi Skirt', 'womens'), tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 8) },
  { name: 'Knit Sweater', sku: 'W-008', price: 79.99, originalPrice: null, category: 'outerwear', gender: 'womens', image: getImagePath('Knit Sweater', 'womens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 6) },
  { name: 'Gold Jewelry Set', sku: 'W-009', price: 129.99, originalPrice: null, category: 'accessories', gender: 'womens', image: '/images/products/WOMENS-accessory-gold-jewelry-set', tags: ['New'], sizes: ['One Size'], stockBySize: createStockBySize(['One Size'], 5) },
  { name: 'Leather Handbag', sku: 'W-010', price: 179.99, originalPrice: 229.99, category: 'accessories', gender: 'womens', image: '/images/products/WOMENS-accessory-leather-handbag', tags: ['Sale'], sizes: ['One Size'], stockBySize: createStockBySize(['One Size'], 4) },
  { name: 'Linen Jumpsuit', sku: 'W-011', price: 94.99, originalPrice: null, category: 'shirts', gender: 'womens', image: '/images/products/WOMENS-jumpsuit-linen', tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 5) },
  { name: 'Tailored Jumpsuit', sku: 'W-012', price: 119.99, originalPrice: null, category: 'shirts', gender: 'womens', image: '/images/products/WOMENS-jumpsuit-tailored', tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 4) },
  { name: 'Autumn Lingerie Set', sku: 'W-013', price: 49.99, originalPrice: null, category: 'shirts', gender: 'womens', image: '/images/products/WOMENS-lingerie-autumn-set', tags: [], sizes: ['S', 'M', 'L', 'XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL'], 8) },
  { name: 'Bralette', sku: 'W-014', price: 29.99, originalPrice: null, category: 'shirts', gender: 'womens', image: '/images/products/WOMENS-lingerie-bralette', tags: [], sizes: ['S', 'M', 'L', 'XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL'], 10) },
  { name: 'Denim Skirt', sku: 'W-015', price: 64.99, originalPrice: null, category: 'pants', gender: 'womens', image: '/images/products/WOMENS-skirt-denim', tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 7) },
  { name: 'Cotton Top', sku: 'W-016', price: 39.99, originalPrice: null, category: 'shirts', gender: 'womens', image: '/images/products/WOMENS-top-cotton', tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 9) },
]

async function main() {
  console.log('Starting seed...')

  // Clear existing products (optional - comment out if you want to keep existing data)
  console.log('Clearing existing products...')
  await prisma.product.deleteMany({})

  // Create products
  console.log('Creating products...')
  for (const product of products) {
    await prisma.product.create({
      data: {
        sku: product.sku,
        name: product.name,
        basePrice: product.originalPrice || product.price,
        salePrice: product.originalPrice ? product.price : null,
        category: product.category,
        gender: product.gender,
        image: product.image,
        description: getProductDescription(product.name, product.category, product.gender),
        tags: product.tags,
        sizes: product.sizes,
        stockBySize: product.stockBySize,
        status: 'active',
        isVisible: true,
        lowStockThreshold: 10,
      },
    })
  }
  console.log(`Created ${products.length} products`)

  // Create or update the dummy user
  console.log('Creating/updating dummy user...')
  const dummyUser = await prisma.user.upsert({
    where: { email: 'user@fakeshop.com' },
    update: {
      name: 'Fake User',
      email: 'user@fakeshop.com',
      phone: '+61 234 567 890',
      addressStreet: '123 Main St',
      addressCity: 'Sydney',
      addressZipCode: '2000',
    },
    create: {
      id: '1',
      name: 'Fake User',
      email: 'user@fakeshop.com',
      emailVerified: new Date(),
      isAdmin: false,
      phone: '+61 234 567 890',
      addressStreet: '123 Main St',
      addressCity: 'Sydney',
      addressZipCode: '2000',
    },
  })
  console.log('Dummy user created/updated:', dummyUser.email)

  // Create or update the admin user
  console.log('Creating/updating admin user...')
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@fakeshop.com' },
    update: {
      name: 'Admin',
      email: 'admin@fakeshop.com',
      isAdmin: true,
    },
    create: {
      name: 'Admin',
      email: 'admin@fakeshop.com',
      emailVerified: new Date(),
      isAdmin: true,
    },
  })
  console.log('Admin user created/updated:', adminUser.email)

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

