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

const products = [
  // Mens products
  { name: 'Classic White Tee', price: 29.99, originalPrice: null, category: 'shirts', gender: 'mens', image: getImagePath('Classic White Tee', 'mens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 10) },
  { name: 'Slim Fit Jeans', price: 79.99, originalPrice: 99.99, category: 'pants', gender: 'mens', image: getImagePath('Slim Fit Jeans', 'mens'), tags: ['Sale'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 6) },
  { name: 'Denim Jacket', price: 89.99, originalPrice: null, category: 'outerwear', gender: 'mens', image: getImagePath('Denim Jacket', 'mens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 5) },
  { name: 'Cargo Pants', price: 69.99, originalPrice: null, category: 'pants', gender: 'mens', image: getImagePath('Cargo Pants', 'mens'), tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 8) },
  { name: 'Polo Shirt', price: 49.99, originalPrice: null, category: 'shirts', gender: 'mens', image: getImagePath('Polo Shirt', 'mens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 9) },
  { name: 'Hooded Sweatshirt', price: 59.99, originalPrice: 79.99, category: 'outerwear', gender: 'mens', image: getImagePath('Hooded Sweatshirt', 'mens'), tags: ['Sale'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 7) },
  { name: 'Chino Pants', price: 64.99, originalPrice: null, category: 'pants', gender: 'mens', image: getImagePath('Chino Pants', 'mens'), tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 8) },
  { name: 'Button Down Shirt', price: 54.99, originalPrice: null, category: 'shirts', gender: 'mens', image: getImagePath('Button Down Shirt', 'mens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 9) },
  
  // Womens products
  { name: 'Floral Summer Dress', price: 89.99, originalPrice: null, category: 'shirts', gender: 'womens', image: getImagePath('Floral Summer Dress', 'womens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 6) },
  { name: 'High-Waist Jeans', price: 79.99, originalPrice: 99.99, category: 'pants', gender: 'womens', image: getImagePath('High-Waist Jeans', 'womens'), tags: ['Sale'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 7) },
  { name: 'Cropped Blazer', price: 119.99, originalPrice: null, category: 'outerwear', gender: 'womens', image: getImagePath('Cropped Blazer', 'womens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 4) },
  { name: 'Wide Leg Pants', price: 69.99, originalPrice: null, category: 'pants', gender: 'womens', image: getImagePath('Wide Leg Pants', 'womens'), tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 8) },
  { name: 'Silk Blouse', price: 94.99, originalPrice: null, category: 'shirts', gender: 'womens', image: getImagePath('Silk Blouse', 'womens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 5) },
  { name: 'Trench Coat', price: 149.99, originalPrice: 199.99, category: 'outerwear', gender: 'womens', image: getImagePath('Trench Coat', 'womens'), tags: ['Sale'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 3) },
  { name: 'Midi Skirt', price: 59.99, originalPrice: null, category: 'pants', gender: 'womens', image: getImagePath('Midi Skirt', 'womens'), tags: [], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 8) },
  { name: 'Knit Sweater', price: 79.99, originalPrice: null, category: 'outerwear', gender: 'womens', image: getImagePath('Knit Sweater', 'womens'), tags: ['New'], sizes: ['S', 'M', 'L', 'XL', '2XL'], stockBySize: createStockBySize(['S', 'M', 'L', 'XL', '2XL'], 6) },
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
        ...product,
        status: 'active',
        isVisible: true,
        lowStockThreshold: 10,
        salePrice: product.originalPrice && product.price < product.originalPrice ? product.price : null,
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
    },
    create: {
      id: '1',
      name: 'Fake User',
      email: 'user@fakeshop.com',
      emailVerified: new Date(),
      isAdmin: false,
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

