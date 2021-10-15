require('dotenv/config');

const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');
const { access } = require('fs');

const app = express();

app.use(cors({
  origin: '*',
  exposedHeaders: 'X-Total-Count'
}));
app.use(express.json());
app.use(routes);
app.use(errors());

app.listen(process.env.PORT || 3333,
  console.log(`Server started on Port ${process.env.PORT}`)
);
