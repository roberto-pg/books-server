// Dentro do container docker postgres habilite a extensão:
// create extension if not exists "uuid-ossp";

exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.uuid('id').primary().unique().notNullable();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
  }).then(result => { });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};