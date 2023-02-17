export default {
  origin: 'http://localhost:3000',
  accessTokenExpiresIn: 15,
  refreshTokenExpiresIn: 60,
  redisCacheExpiresIn: 60,
  postgresConfig: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  }
};
