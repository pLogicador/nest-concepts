export default () => ({
  database: {
    type: process.env.DB_TYPE as 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: Boolean(process.env.DB_AUTOLOADENTITIES),
    synchronize: Boolean(process.env.DB_SYNCHRONIZE),
  },
  environment: process.env.NODE_ENV || 'development',
});
