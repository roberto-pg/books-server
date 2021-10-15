const bcrypt = require('bcryptjs');
const connection = require('../database/connection');
const jwt = require('jsonwebtoken');

require('dotenv/config');

function generateToken(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: '7 days',
  });
}

module.exports = {

  async create(req, res) {
    const { email, password } = req.body;

    const user = await connection('users')
      .select('*')
      .where('email', email)
      .first();

    if (!user) {
      return res.status(400).json({ Error: 'Email não cadastrado' });
    }

    if (!await bcrypt.compare(password, user.password))
      return res.status(400).send({ Error: 'A senha está incorreta' })

    const serializedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken({ id: user.id }),
    };

    return res.send({user: serializedUser});

    // user.password = undefined;

    // return res.send({
    //     user,
    //     token: generateToken({ id: user.id }),
    // });
  }

};