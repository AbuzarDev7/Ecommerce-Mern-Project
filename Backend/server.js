require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});

// Keep the process alive
process.stdin.resume();
