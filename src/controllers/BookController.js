const connection = require('../database/connection');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { validate: uuidValidate } = require('uuid');

module.exports = {

  async create(req, res) {
    const { title, author, nationality, year, read } = req.body;
    const imageurl = process.env.DIR_IMAGE + req.file.filename;
    try {
      await connection('books').insert({
        id: uuidv4(),
        title,
        author,
        nationality,
        imageurl,
        year,
        read,
      });
    } catch (error) {
      return res.status(400).json({ Error: error });
    }
    return res.json({ success: true, title: title });
  },

  async index(req, res) {
    const books = await connection('books').select('*').orderBy('author', 'asc');

    const [count] = await connection('books').count();

    res.header('X-Total-Count', count['count']);

    return res.json(books);
  },

  async bookById(req, res) {
    const { id } = req.params;

    if (uuidValidate(id) == false) {
      return res.status(400).json({ Error: 'Invalid book id' });
    }

    const book = await connection('books')
      .select('*')
      .where('id', id)
      .first();

    if (!book) {
      return res.status(400).json({ Error: 'Book not found in the database' });
    }

    return res.json(book);
  },

  async indexByRead(req, res) {
    var { read } = req.params;

    if (read == 'all') {
      const book = await connection('books')
        .select('*')
        .orderBy('author', 'asc');

      const [count] = await connection('books').count();
      res.header('X-Total-Count', count['count']);

      return res.json(book);
    } else {
      const book = await connection('books')
        .select('*')
        .where('read', read)
        .orderBy('author', 'asc');

      const [count] = await connection('books')
        .where('read', read).count();
      res.header('X-Total-Count', count['count']);

      return res.json(book);
    }
  },

  async updateById(req, res) {
    const { read } = req.body;
    const { id } = req.params;

    if (uuidValidate(id) == false) {
      return res.status(400).json({ Error: 'Invalid book id' });
    }

    const book = await connection('books').
      select('*')
      .where('id', id)
      .first();

    if (!book) {
      return res.status(400).json({ Error: 'Book not found in the database' });
    }

    await connection('books')
      .where('id', id)
      .update({ read: read });

    return res.json({ success: true, message: 'ok' });
  },

  async delete(req, res) {
    const { id } = req.params;

    if (uuidValidate(id) == false) {
      return res.status(400).json({ Error: 'Invalid book id' });
    }

    const book = await connection('books')
      .where('id', id)
      .first();

    if (!book) {
      return res.status(400).json({ Error: 'Book not found in the database' });
    }

    const img = await connection('books')
      .select('imageurl')
      .where('id', id)
      .first();

    var imageName = (img.imageurl).split("\/")[3];

    fs.unlink(process.env.IMAGE_STORAGE + "/" + imageName, function (err) {
      if (err) {
        console.log("failed to delete local image:" + err);
      } else {
        console.log('successfully deleted local image');
      }
    });

    await connection('books').where('id', id).delete();

    return res.json({ success: true, message: 'ok' });
  }
};