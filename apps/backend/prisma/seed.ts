import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@test.com";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "admin",
    },
    create: {
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user created/updated successfully:");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);

  // Initial Products
  const products = [
    { name: "Ração Premium Cães", description: "Ração de alta qualidade para cães", price: 89.9, category: "FOOD", stock: 50 },
    { name: "Coleira de Couro", description: "Coleira resistente e elegante", price: 45.0, category: "ACCESSORY", stock: 12 },
    { name: "Brinquedo de Corda", description: "Diversão garantida para seu pet", price: 25.5, category: "ACCESSORY", stock: 3 }, // Crítico
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: `prod-${product.name.replace(/\s+/g, '-').toLowerCase()}` },
      update: product,
      create: {
        id: `prod-${product.name.replace(/\s+/g, '-').toLowerCase()}`,
        ...product,
      },
    });
  }

  // Initial Pet for Admin
  const adminUser = await prisma.user.findUnique({ where: { email } });
  if (adminUser) {
    const pet = await prisma.pet.upsert({
      where: { id: "pet-rex" },
      update: {},
      create: {
        id: "pet-rex",
        name: "Rex",
        breed: "Golden Retriever",
        age: 3,
        userId: adminUser.id,
      },
    });

    // Initial Appointment
    await prisma.appointment.upsert({
      where: { id: "app-1" },
      update: {},
      create: {
        id: "app-1",
        date: new Date(),
        type: "BATH",
        status: "PENDING",
        userId: adminUser.id,
        petId: pet.id,
      },
    });
  }

  console.log("Mock data created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
