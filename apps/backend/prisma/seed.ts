import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@petshop.com";
  const adminPassword = "admin123";
  const clientEmail = "cliente@petshop.com";
  const clientPassword = "cliente123";
  const adminPetId = "8dcf359c-3c88-4af7-b6df-8b4e3c4ac001";
  const adminAppointmentId = "7ef6db95-a48d-4a75-a6bd-fb4d07fa1001";
  const clientPetId = "f0ce2da1-3f49-4f01-a3bb-2af7e2c2b002";
  const clientAppointmentId = "2f9fdcc1-2a6a-4a54-9a6b-0f54f289c003";

  const [adminHashedPassword, clientHashedPassword] = await Promise.all([
    bcrypt.hash(adminPassword, 12),
    bcrypt.hash(clientPassword, 12),
  ]);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminHashedPassword,
      role: "admin",
    },
    create: {
      name: "Admin Geral",
      email: adminEmail,
      password: adminHashedPassword,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: clientEmail },
    update: {
      password: clientHashedPassword,
      role: "client",
    },
    create: {
      name: "Cliente Demo",
      email: clientEmail,
      password: clientHashedPassword,
      role: "client",
    },
  });

  console.log("Test users created/updated successfully:");
  console.log(`Admin Email: ${adminEmail}`);
  console.log(`Admin Password: ${adminPassword}`);
  console.log(`Client Email: ${clientEmail}`);
  console.log(`Client Password: ${clientPassword}`);

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
  const [adminUser, clientUser] = await Promise.all([
    prisma.user.findUnique({ where: { email: adminEmail } }),
    prisma.user.findUnique({ where: { email: clientEmail } }),
  ]);

  if (adminUser || clientUser) {
    await prisma.appointment.deleteMany({
      where: {
        OR: [
          { id: "app-1" },
          { id: adminAppointmentId },
          { id: clientAppointmentId },
        ],
      },
    });

    await prisma.pet.deleteMany({
      where: {
        OR: [
          { id: "pet-rex" },
          { id: adminPetId },
          { id: clientPetId },
        ],
      },
    });
  }

  if (adminUser) {
    const pet = await prisma.pet.upsert({
      where: { id: adminPetId },
      update: {},
      create: {
        id: adminPetId,
        name: "Rex",
        breed: "Golden Retriever",
        age: 3,
        userId: adminUser.id,
      },
    });

    // Initial Appointment
    await prisma.appointment.upsert({
      where: { id: adminAppointmentId },
      update: {},
      create: {
        id: adminAppointmentId,
        date: new Date(),
        type: "BATH",
        status: "PENDING",
        userId: adminUser.id,
        petId: pet.id,
      },
    });
  }

  if (clientUser) {
    const pet = await prisma.pet.upsert({
      where: { id: clientPetId },
      update: {},
      create: {
        id: clientPetId,
        name: "Nina",
        breed: "Maltês",
        age: 3,
        userId: clientUser.id,
      },
    });

    await prisma.appointment.upsert({
      where: { id: clientAppointmentId },
      update: {},
      create: {
        id: clientAppointmentId,
        date: new Date(),
        type: "GROOM",
        status: "PENDING",
        userId: clientUser.id,
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
