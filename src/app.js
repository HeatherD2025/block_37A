const express = require("express");
const app = express();
const path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("morgan")("dev"));
const cors = require("cors");
app.use(cors());
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`I am listening on port number ${PORT}`);
  });

const authRoutes = require("./routes/auth");
// Backend routes
app.use("/auth", authRoutes);
// app.use('/api', require('./api'));

// Serves the HTML file that Vite builds
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client/dist/index.html"));
});


module.exports = app;