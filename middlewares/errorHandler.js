// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Prisma connection error example (just one)
  if (err.message && err.message.includes("P1001")) {
    return res.status(503).json({ message: "Database connection error" });
  }

  // Default fallback
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
};
