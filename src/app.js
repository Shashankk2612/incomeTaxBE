import express from 'express';
import bodyParser from 'body-parser';
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

export default app;