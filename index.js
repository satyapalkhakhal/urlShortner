const express = require('express');
const urlRoutes = require('./routes/url');
const connectDB = require('./connect');
connectDB("mongodb://127.0.0.1:27017/shortUrl")
const app = express();
app.use("/url",urlRoutes);
const PORT = 8001;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
