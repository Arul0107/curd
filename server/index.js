const express = require('express');
const cors = require('cors');
let users = require('./sample.json'); // Use 'let' so we can modify the data in memory

const app = express();
const port = 8000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // Ensure this matches your frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"]
}));

// Get all users
app.get("/users", (req, res) => {
    res.json(users);
});

// Add a new user
app.post("/users", (req, res) => {
    const newUser = req.body;
    newUser.id = users.length ? users[users.length - 1].id + 1 : 1; // Assign a new ID
    users.push(newUser);
    res.status(201).json(newUser);
});

// Edit a user
app.patch("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...req.body };
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// Delete a user
app.delete("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10);
    users = users.filter(user => user.id !== userId);
    res.status(204).end();
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
