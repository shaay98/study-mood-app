import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*", 
}));


let users = []; 
let moods = [];     
let journals = []; 

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).json({ error: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ email, passwordHash });
  res.json({ message: "User created successfully" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

app.get("/api/moods", authMiddleware, (req, res) => {
  res.json(moods);
});

app.post("/api/moods", authMiddleware, (req, res) => {
  const { emoji, note, subject } = req.body;
  if (!emoji || !subject) return res.status(400).json({ error: "Missing fields" });

  const newMood = { _id: Date.now().toString(), emoji, note, subject, createdAt: new Date() };
  moods.push(newMood);
  res.json(newMood);
});

app.delete("/api/moods/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  moods = moods.filter(m => m._id !== id);
  res.json({ message: "Deleted successfully" });
});


app.get("/api/journals", authMiddleware, (req, res) => {
  res.json(journals);
});

app.post("/api/journals", authMiddleware, (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  const newEntry = { _id: Date.now().toString(), title, content, createdAt: new Date() };
  journals.push(newEntry);
  res.json(newEntry);
});

app.delete("/api/journals/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  journals = journals.filter(j => j._id !== id);
  res.json({ message: "Deleted successfully" });
});


app.get("/", (req, res) => res.send("✅ Backend is running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));