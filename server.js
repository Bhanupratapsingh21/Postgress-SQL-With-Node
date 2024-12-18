const express = require('express');
const db = require('./db/index');
const authRoutes = require("./Routes/auth.routes")
const app = express();
const PORT = process.env.PORT || 3000;
const todoRoutes = require("./Routes/todo.routes")

app.use(express.json());

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Mount todo routes
app.use('/todos', todoRoutes);
// Use Routes
app.use('/auth', authRoutes);

(async () => {
    try {
        const result = await db.query('SELECT NOW()');
        console.log('Database connected successfully at:', result.rows[0].now);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
})();
