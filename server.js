import 'dotenv/config';
import express from 'express';
import prisma from './config/db.js'; // adjust path if needed
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', async (req, res) => {
  const message = 'Hello from the birthday girl, yipee!';
  res.send(message);
});
app.use("/api/auth", authRoutes)
app.use("/api", protectedRoutes);


async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
  }
}

startServer();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('🔌 Database disconnected');
  process.exit(0);
});
