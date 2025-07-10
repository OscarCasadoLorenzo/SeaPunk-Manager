import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Create sample users
    const users = [
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: await bcrypt.hash('password123', 10),
      },
      {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        password: await bcrypt.hash('password123', 10),
      },
      {
        email: 'admin@example.com',
        name: 'Admin User',
        password: await bcrypt.hash('admin123', 10),
      },
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData,
      });
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.email}`);
    }

    // Create sample tasks
    const tasks = [
      {
        title: 'Setup development environment',
        description: 'Install Node.js, PostgreSQL, and other required tools',
        priority: 'HIGH',
        completed: true,
        userId: createdUsers[0].id,
      },
      {
        title: 'Design database schema',
        description: 'Create Prisma schema for users and tasks',
        priority: 'MEDIUM',
        completed: true,
        userId: createdUsers[0].id,
      },
      {
        title: 'Implement user authentication',
        description: 'Add login and registration functionality',
        priority: 'HIGH',
        completed: false,
        userId: createdUsers[0].id,
      },
      {
        title: 'Build task management UI',
        description: 'Create React components for task CRUD operations',
        priority: 'MEDIUM',
        completed: false,
        userId: createdUsers[1].id,
      },
      {
        title: 'Add task filtering and sorting',
        description: 'Implement filters by priority, status, and date',
        priority: 'LOW',
        completed: false,
        userId: createdUsers[1].id,
      },
      {
        title: 'Deploy to production',
        description: 'Setup CI/CD pipeline and deploy application',
        priority: 'URGENT',
        completed: false,
        dueDate: new Date('2025-08-01'),
        userId: createdUsers[2].id,
      },
    ];

    for (const taskData of tasks) {
      const task = await prisma.task.create({
        data: {
          ...taskData,
          priority: taskData.priority as any,
        },
      });
      console.log(`✅ Created task: ${task.title}`);
    }

    console.log('🎉 Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
