import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { RPGBot } from "./bot";
import { commandRegistry, useCommand } from "./sdk";
import fs from "fs";
import path from "path";

// Example SDK usage
useCommand("атака", (ctx) => {
  console.log(`[SDK] ${ctx.sender} атакує ${ctx.target} — ${ctx.damage} шкоди!`);
});

useCommand("зцілення", (ctx) => {
  console.log(`[SDK] ${ctx.sender} зцілив ${ctx.target} на ${ctx.damage} HP!`);
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Initialize Telegram Bot
  const botToken = process.env.BOT_TOKEN;
  if (botToken) {
    const bot = new RPGBot(botToken, commandRegistry);
    console.log("⚔️ BattleSoul RPG Bot connected to Telegram.");
  } else {
    console.log("⚠️ BOT_TOKEN not found. Bot will not start.");
  }

  // WebSocket connection
  io.on("connection", (socket) => {
    console.log("Client connected to WebSocket");

    socket.on("disconnect", () => {
      console.log("Client disconnected from WebSocket");
    });
  });

  // API Routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/battles", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const battles = await storage.getRecentBattles(limit);
      res.json(battles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch battles" });
    }
  });

  app.get("/api/commands", async (req, res) => {
    try {
      const commandsPath = path.join(process.cwd(), "commands.json");
      const commands = JSON.parse(fs.readFileSync(commandsPath, "utf-8"));
      res.json(commands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch commands" });
    }
  });

  app.post("/api/commands", async (req, res) => {
    try {
      const commandsPath = path.join(process.cwd(), "commands.json");
      const commands = JSON.parse(fs.readFileSync(commandsPath, "utf-8"));
      commands.push(req.body);
      fs.writeFileSync(commandsPath, JSON.stringify(commands, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to add command" });
    }
  });

  // Broadcast updates to all connected clients
  setInterval(async () => {
    const users = await storage.getAllUsers();
    const battles = await storage.getRecentBattles(10);
    io.emit("update", { users, battles });
  }, 2000);

  console.log("⚔️ BattleSoul RPG Bot connected to PostgreSQL. SDK UI (React) is running.");

  return httpServer;
}
