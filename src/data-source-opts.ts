import dotenv from "dotenv";

import { DataSourceOptions } from "typeorm";
import { User } from "./model/user";
import { Trade } from "./model/trade";
import { Passphrase } from "./model/passphrase";
dotenv.config();

const opts: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [Passphrase, Trade, User],
  subscribers: [],
  migrations: ["./dist/migrations/*.js"],
};

export default opts;
