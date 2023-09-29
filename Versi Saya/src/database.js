import  pkg  from 'pg';

const pkg = new pkg({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

module.exports = pool;