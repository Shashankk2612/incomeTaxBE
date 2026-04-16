import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

const allowedOrigins = [
  'http://localhost:4200',
  'https://your-frontend-domain.com' // add later when deployed
];

app.use(cors());

// ✅ IMPORTANT: handle preflight
app.options('*', cors());

app.use(bodyParser.json());

export default app;