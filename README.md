# NC-news

This repo is the backend API for a news app that allows users to read and post articlesand comments, and to vote on them.

## Built With

The API uses a PSQL database, is built with KNEX.js and Express, and is hosted on Heroku.

View the API live here: https://nick-nc-news.herokuapp.com/api

## Installation

```bash
$ npm install knex, pg, express
```

In the root directory create a file named knexfile.js and paste in the following code:

```js
const { DB_URL } = process.env;

const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};

const customConfigs = {
  development: {
    connection: {
      database: 'nc_news',
      //username: '',
      //password: '',
    },
  },
  test: {
    connection: {
      database: 'nc_news_test',
      //username: '',
      //password: '',
    },
  },
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };

```

Linux users should un-comment and complete their username and password in customConfigs.

## Testing

```
$ npm install mocha, chai, supertest -D
$ npm test
```

## Usage

```
$ npm run setup-dbs
$ npm run seed
```
