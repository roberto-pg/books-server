const bcrypt = require('bcryptjs');
const connection = require('../database/connection');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { validate: uuidValidate } = require('uuid');

function generateToken(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: '7 days',
  });
}

module.exports = {

  async index(req, res) {
    const users = await connection('users').select('id', 'name', 'email');

    return res.json(users);
  },

  async create(req, res) {
    const { name, email } = req.body;
    var { password } = req.body;
    password = await bcrypt.hash(password, 10);
    try {
      await connection('users').insert({
        id: uuidv4(),
        name,
        email,
        password,
      })
    } catch (error) {
      return res.status(400).json({ Error: error.detail });
    }

    const user = await connection('users').
      select('*')
      .where('email', email)
      .first();

    user.password = undefined;

    return res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  },

  async delete(req, res) {
    const { id } = req.params;

    if (uuidValidate(id) == false) {
      return res.status(400).json({ Error: 'Invalid user id' });
    }

    const user = await connection('users')
      .where('id', id)
      .first();

    if (!user) {
      return res.status(400).json({ Error: 'User not found in the database' });
    }

    await connection('users').where('id', id).delete();

    return res.json({ success: true, message: 'ok' });
  }

};