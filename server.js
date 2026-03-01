/** @format */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        credentials: true,
    }),
);
app.use(express.json());

// Routes
app.use("/api/members", require("./routes/members"));
app.use("/api/months", require("./routes/months"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/contributions", require("./routes/contributions"));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
