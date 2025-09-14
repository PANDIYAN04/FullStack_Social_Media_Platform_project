// Simple Social Media Platform - Express server
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const POSTS_FILE = path.join(__dirname, 'posts.json');
const USERS_FILE = path.join(__dirname, 'users.json');

function safeRead(file, defaultValue) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { return defaultValue; }
}
function safeWrite(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/posts', (req, res) => {
  const posts = safeRead(POSTS_FILE, []);
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  const { author, content } = req.body;
  if (!author || !content) return res.status(400).json({ error: 'author and content required' });
  const posts = safeRead(POSTS_FILE, []);
  const post = { id: posts.length + 1, author, content, date: new Date().toISOString() };
  posts.unshift(post);
  safeWrite(POSTS_FILE, posts);
  res.json(post);
});

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  const users = safeRead(USERS_FILE, []);
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'user exists' });
  const user = { id: users.length + 1, name, email, password };
  users.push(user);
  safeWrite(USERS_FILE, users);
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = safeRead(USERS_FILE, []);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.listen(PORT, () => console.log(`Social Media server running on http://localhost:${PORT}`));
