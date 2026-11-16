import type { Core } from '@strapi/strapi';
import path from 'path';
import { parse } from 'pg-connection-string';

export default ({ env }: Core.Config.Shared.ConfigParams) => {
  // 本番環境 (Railwayなど) の場合
  if (env('NODE_ENV') === 'production') {
    const config = parse(env('DATABASE_URL', ''));
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: { rejectUnauthorized: false },
        },
        debug: false,
      },
    };
  }

  // 開発環境 (ローカル) の場合はデフォルトのSQLiteを使用
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};