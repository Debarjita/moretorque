const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const { config } = require("dotenv");
const vehicleRoutes = require('../src/routes/vehicle');

const orgRoutes = require('../src/routes/org');

config(); // Load environment variables

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
});

app.use("/vehicle/decode", limiter);
app.use("/vehicle", limiter);
app.use("/org", limiter);

// Routes
app.use("/vehicle", vehicleRoutes);
app.use("/org", orgRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const rateLimiter = require('../src/middlewares/rateLimiter');
app.use(rateLimiter);
