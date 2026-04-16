import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes/taxRoute.js';

const app = express();

// ✅ CORS config
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ✅ Preflight fix
app.options('*', cors());

// ✅ Middlewares
app.use(bodyParser.json());
app.use(express.json());

// ✅ Routes (IMPORTANT)
app.use('/api', routes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('API Running...');
});

export default app;