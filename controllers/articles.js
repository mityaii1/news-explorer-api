const Article = require('../models/article');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getArticle = (req, res, next) => {
  Article.find({}).sort({ createdAt: -1 })
    .then((data) => res.send(data))
    .catch(next);
};
const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.status(200).send(article))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};
const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      } else {
        Article.findByIdAndRemove(req.params.articleId)
          .then(() => res.status(200).send(article));
      }
    })
    .catch(next);
};

module.exports = {
  getArticle,
  createArticle,
  deleteArticle,
};
