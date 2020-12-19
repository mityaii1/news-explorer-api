const isURL = require('validator/lib/isURL');

const validateIsUrl = (value, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.message('Введён некорректный URL');
};

module.exports = { validateIsUrl };
