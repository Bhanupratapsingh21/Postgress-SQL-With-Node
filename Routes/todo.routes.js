const express = require('express');
const router = express.Router();
const db = require('../db/index');

// 🟢 1. Create a new todo (POST /todos)
router.post('/', async (req, res) => {
    const { user_id, title, description } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
            [user_id, title, description]
        );
        res.status(201).json({ success: true, todo: result.rows[0] });
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ success: false, message: 'Error creating todo' });
    }
});

// 🟢 2. Get all todos for a user (GET /todos)
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM todos ORDER BY created_at DESC');
        res.status(200).json({ success: true, todos: result.rows });
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ success: false, message: 'Error fetching todos' });
    }
});

// 🟢 3. Get a single todo by ID (GET /todos/:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM todos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }
        res.status(200).json({ success: true, todo: result.rows[0] });
    } catch (error) {
        console.error('Error fetching todo:', error);
        res.status(500).json({ success: false, message: 'Error fetching todo' });
    }
});

// 🟢 4. Update a todo (PUT /todos/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const result = await db.query(
            'UPDATE todos SET title = $1, description = $2, status = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
            [title, description, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }
        res.status(200).json({ success: true, todo: result.rows[0] });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ success: false, message: 'Error updating todo' });
    }
});

// 🟢 5. Delete a todo (DELETE /todos/:id)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        }
        res.status(200).json({ success: true, message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ success: false, message: 'Error deleting todo' });
    }
});

module.exports = router;
