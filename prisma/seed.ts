import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@sanctifiedstudio.com";
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const name = process.env.ADMIN_NAME ?? "Studio Admin";

  const hash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { name, password: hash },
    create: { email, name, password: hash },
  });
  console.log(`✓ Admin ready: ${admin.email}`);

  // A few demo employees (idempotent by displayId).
  const demoEmployees = [
    {
      displayId: "EMP-0001",
      name: "Aarav Sharma",
      phone: "+91 90000 00001",
      email: "aarav@sanctifiedstudio.com",
      role: "Lead Photographer",
    },
    {
      displayId: "EMP-0002",
      name: "Meera Iyer",
      phone: "+91 90000 00002",
      email: "meera@sanctifiedstudio.com",
      role: "Photographer",
    },
    {
      displayId: "EMP-0003",
      name: "Rohan Das",
      phone: "+91 90000 00003",
      email: "rohan@sanctifiedstudio.com",
      role: "Editor",
    },
    {
      displayId: "EMP-0004",
      name: "Sana Kapoor",
      phone: "+91 90000 00004",
      email: "sana@sanctifiedstudio.com",
      role: "Assistant",
    },
  ];

  for (const emp of demoEmployees) {
    await prisma.employee.upsert({
      where: { displayId: emp.displayId },
      update: {},
      create: emp,
    });
  }
  console.log(`✓ Seeded ${demoEmployees.length} demo employees`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
