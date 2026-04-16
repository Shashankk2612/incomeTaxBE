import app from './app.js';
import db from './db/db.js';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("DB Connected:", rows);

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("DB Connection Failed:", err.message);
    process.exit(1);
  }
})();