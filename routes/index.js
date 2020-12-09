const router = require('express').Router();
const userRoutes = require('./users');
const articlesRoutes = require('./articles');

router.use('/', userRoutes);
router.use('/', articlesRoutes);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
