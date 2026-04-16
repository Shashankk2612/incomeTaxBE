const cors = require("cors");
const express = require("express");
const app = express();
const db = require("./db/db.js");
const routes = require("./routes/taxRoute.js");
require("dotenv").config();

app.use(express.json());
app.use(cors());


app.use("/", routes);


(async () => {
    try {
        const [rows] = await db.query("SELECT 1 + 1 AS result");
        console.log("DB Connected:", rows);

        app.listen(4000, () => {
            console.log("Server running at http://localhost:4000");
        });

    } catch (err) {
        console.error("DB Connection Failed:", err.message);
        process.exit(1);
    }
})();
