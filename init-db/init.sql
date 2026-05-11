CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id),
    text TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO posts (content, author, created_at) VALUES
('Первый пост о Kafka', 'alice', '2026-01-10 10:00:00'),
('Обсуждение Docker Compose', 'bob', '2026-01-11 12:00:00'),
('Рецепт пиццы', 'alice', '2026-01-12 14:00:00');


INSERT INTO comments (post_id, text, author, created_at) VALUES
(1, 'Отлично!', 'bob', '2026-01-10 11:00:00'),
(1, 'Согласен', 'charlie', '2026-01-10 12:00:00'),
(2, 'Полезно', 'alice', '2026-01-11 13:00:00'),
(2, 'Спасибо', 'charlie', '2026-01-11 14:00:00'),
(3, 'Вкусно', 'bob', '2026-01-12 15:00:00');