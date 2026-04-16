import express from 'express';
import cors from 'cors';
import routes from './routes/taxRoute.js';

const app = express();

const allowedOrigins = [
  'http://localhost:4200',
  'https://income-tax-pj85d6jwc-samshashank1995-8237s-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ✅ routes
app.use('/api', routes);

export default app;