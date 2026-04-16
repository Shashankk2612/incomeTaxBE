import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

const allowedOrigins = [
  'http://localhost:4200',
  'https://your-frontend-domain.com' // add later when deployed
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ✅ IMPORTANT: handle preflight
app.options('*', cors());

app.use(bodyParser.json());

export default app;