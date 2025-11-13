import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// DynamoDB setup
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Signup route
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await ddbDocClient.send(
      new PutCommand({
        TableName: "Users",
        Item: { email, password: hashedPassword },
        ConditionExpression: "attribute_not_exists(email)", // prevents duplicate emails
      })
    );
    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await ddbDocClient.send(
      new GetCommand({
        TableName: "Users",
        Key: { email },
      })
    );

    if (!data.Item) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, data.Item.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});
import path from "path";
import express from "express";

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
