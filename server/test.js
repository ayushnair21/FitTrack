const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to Supabase...");

  const newUser = await prisma.user.create({
    data: {
      email: "test_user1@example.com",
      password_hash: "secure_fake_hash_123",
      profile: {
        create: {
          age: 25,
          height: 175.5,
          weight: 72.0,
          goal: "muscle_gain",
        },
      },
    },
    // This tells Prisma to return the profile data alongside the user data
    include: {
      profile: true,
    },
  });

  console.log("Success! User physically saved in database:");
  console.log(newUser);
}

main()
  .catch((e) => {
    console.error("Error saving user:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
