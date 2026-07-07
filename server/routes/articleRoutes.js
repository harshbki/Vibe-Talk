const express = require('express');
const Article = require('../models/Article');
const { requireMongo } = require('../middleware');

const router = express.Router();

router.use(requireMongo);

const slugify = (text) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

const requireAdmin = (req, res, next) => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || req.headers['x-admin-secret'] !== secret) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .sort({ createdAt: -1 })
      .select('title slug excerpt createdAt');
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      published: true,
    });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, body, published = true } = req.body;
    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({ message: 'Title and body are required' });
    }
    let slug = slugify(title);
    const exists = await Article.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;

    const article = await Article.create({
      title: title.trim(),
      slug,
      excerpt: (excerpt || '').trim(),
      body: body.trim(),
      published: published !== false,
    });
    res.status(201).json(article);
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
