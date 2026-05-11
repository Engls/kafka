const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query parameter q' });
  try {
    const posts = await pool.query(
      `SELECT id, content, author, created_at FROM posts WHERE content ILIKE $1 ORDER BY created_at DESC LIMIT 50`,
      [`%${q}%`]
    );
    const comments = await pool.query(
      `SELECT id, post_id, text, author, created_at FROM comments WHERE text ILIKE $1 ORDER BY created_at DESC LIMIT 50`,
      [`%${q}%`]
    );
    res.json({ posts: posts.rows, comments: comments.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;