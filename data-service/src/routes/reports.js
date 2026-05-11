const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. Топ-10 постов по количеству комментариев
router.get('/top-posts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.content, p.author, COUNT(c.id)::int AS comment_count
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      GROUP BY p.id
      ORDER BY comment_count DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Report failed' });
  }
});

// 2. Количество постов и комментариев по дням
router.get('/daily-stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT day, SUM(post_count)::int AS posts, SUM(comment_count)::int AS comments
      FROM (
        SELECT DATE(created_at) AS day, 1 AS post_count, 0 AS comment_count FROM posts
        UNION ALL
        SELECT DATE(created_at) AS day, 0 AS post_count, 1 AS comment_count FROM comments
      ) sub
      GROUP BY day
      ORDER BY day
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Report failed' });
  }
});

// 3. Топ-5 авторов по суммарному числу комментариев к их постам
router.get('/top-authors', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.author, COUNT(c.id)::int AS total_comments
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      GROUP BY p.author
      ORDER BY total_comments DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Report failed' });
  }
});

module.exports = router;