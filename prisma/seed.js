import bcrypt from 'bcrypt';
import prisma from '../src/config/db.js';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword =
  process.env.ADMIN_PASSWORD || (isDev ? 'Admin123!' : undefined);

try {
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD must be set when seeding outside development');
  }

  if (isDev) {
    await prisma.$executeRaw`TRUNCATE "Watchlist", "Bid", "Listing", "Category", "User" RESTART IDENTITY CASCADE;`;
    console.log('Development: all tables truncated.');
  }

  const count = await prisma.user.count();

  if (count === 0) {
    const hash = (password) => bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: await hash(adminPassword),
        name: 'Admin',
        role: 'ADMIN',
      },
    });

    await prisma.category.createMany({
      data: [{ name: 'Electronics' }, { name: 'Clothing' }, { name: 'Books' }],
    });

    if (isDev) {
      const alice = await prisma.user.create({
        data: {
          email: 'alice@example.com',
          password: await hash('Password123!'),
          name: 'Alice Johnson',
        },
      });
      await prisma.user.create({
        data: {
          email: 'bob@example.com',
          password: await hash('Password123!'),
          name: 'Bob Smith',
        },
      });
      await prisma.listing.create({
        data: {
          title: 'Vintage Camera',
          startingPrice: 50,
          sellerId: alice.id,
          categoryId: 1,
        },
      });
    }

    console.log('Database seeded successfully!');
  } else {
    console.log('Database already contains data. Skipping seed.');
  }
} catch (error) {
  console.error('Seed failed:', error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}