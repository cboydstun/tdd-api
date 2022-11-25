const express = require("express");
const app = express();

//health check route
app.get("/health", (req, res) => {
  res.json({ status: "✅" });
});

//create 404 route
app.use((req, res) => {
  res.status(404).json({ error: "404 unknown route" });
});



module.exports = app;