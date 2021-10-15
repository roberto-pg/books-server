require('dotenv/config');

const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const authMiddleware = require('./middlewares/auth');
const multer = require('multer');
const multerConfig = require('./middlewares/multer');

const UserController = require('./controllers/UserController.js');
const BookController = require('./controllers/BookController.js');
const LoginController = require('./controllers/LoginController.js');
const ImageController = require('./controllers/ImageController.js');

const routes = express.Router();

routes.post('/authenticate', celebrate({
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().valid(null, ''),
    name: Joi.string().valid(null, ''),
    email: Joi.string().required(),
    password: Joi.string().required().min(6),
    token: Joi.string().valid(null, ''),
  })
}), LoginController.create);

routes.get('/users', authMiddleware, UserController.index);

routes.post('/users', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6)
  })
}), UserController.create);

routes.delete('/users/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  })
}), authMiddleware, UserController.delete);

routes.get('/books', authMiddleware, BookController.index);

routes.post('/books',
  multer(multerConfig).single('imageurl'),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
      author: Joi.string().required(),
      nationality: Joi.string().required(),
      imageurl: Joi.string(),
      year: Joi.number().required(),
      read: Joi.boolean().required()
    })

  }), authMiddleware, BookController.create);

routes.delete('/books/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  })
}), authMiddleware, BookController.delete);

routes.get('/books/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  })
}), authMiddleware, BookController.bookById);

routes.get('/books/read/:read', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    read: Joi.string().required(),
  })
}), authMiddleware, BookController.indexByRead);

routes.patch('/books/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  }),
  [Segments.BODY]: Joi.object().keys({
    read: Joi.boolean().required()
  })
}), authMiddleware, BookController.updateById);

routes.put('/books/image/:id',
  multer(multerConfig).single('imageurl'),
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      imageurl: Joi.string()
    })
  }), authMiddleware, ImageController.updateImage);

module.exports = routes;