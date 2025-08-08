// db.ts
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_LOCATION,
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;
