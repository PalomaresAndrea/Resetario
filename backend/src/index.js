import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: DATABASE_URL });

// crea tabla si no existe
await pool.query(`
  CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);

// endpoints básicos
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend OK" });
});

app.get("/api/recipes", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM recipes ORDER BY id DESC");
  res.json(rows);
});

app.post("/api/recipes", async (req, res) => {
  const { title, description, image_url } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO recipes(title, description, image_url) VALUES ($1,$2,$3) RETURNING *",
    [title, description, image_url || null]
  );
  res.status(201).json(rows[0]);
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
