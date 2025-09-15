const express = require("express");
const cors = require("cors");

const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const borrowRoutes = require("./routes/borrowRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/borrow", borrowRoutes);

// Health check (server ishlayotganini tekshirish)
app.get("/", (req, res) => {
  res.send("📚 Kutubxona tizimi API ishlayapti...");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Xato:", err.stack);
  res.status(500).json({ error: "Serverda kutilmagan xato yuz berdi" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-portda ishlamoqda`);
});
