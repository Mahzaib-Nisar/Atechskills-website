import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import submissionsRouter from './routes/submissions.js';
import smsAuthRouter from './routes/sms/auth.js';
import smsAdminRouter from './routes/sms/admin.js';
import smsEnrollmentRouter from './routes/sms/enrollment.js';
import process from 'node:process';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/submissions', submissionsRouter);
app.use('/api/sms/auth', smsAuthRouter);
app.use('/api/sms/admin', smsAdminRouter);
app.use('/api/sms/enrollment', smsEnrollmentRouter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

const start = async () => {
  app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
  });
  try {
    let uri = MONGODB_URI;
    if (uri) {
      await mongoose.connect(uri);
    } else {
      const mem = await MongoMemoryServer.create();
      uri = mem.getUri();
      await mongoose.connect(uri);
      console.log('Using in-memory MongoDB');
    }
  } catch (err) {
    try {
      const mem = await MongoMemoryServer.create();
      const uri = mem.getUri();
      await mongoose.connect(uri);
      console.log('Using in-memory MongoDB');
    } catch (e) {
      console.error('Startup error:', e.message);
      console.error('Continuing without database connection');
    }
  }
};

start();
