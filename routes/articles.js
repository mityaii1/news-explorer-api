const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateIsUrl } = require('../utils/validation');
const { getArticle, createArticle, deleteArticle } = require('../controllers/articles');
const auth = require('../middlewares/auth');

router.get('/articles', auth, getArticle);
router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    source: Joi.string().required(),
    image: Joi.string().required().custom(validateIsUrl),
    link: Joi.string().required().custom(validateIsUrl),
    date: Joi.date(),
  }),
}), auth, createArticle);
router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().required().length(24),
  }).unknown(true),
}), auth, deleteArticle);

module.exports = router;
