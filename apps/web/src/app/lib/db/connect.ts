import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

/**
 * 初始化数据库
 */
async function initDatabase() {
  console.log("initDatabase");

  // 从环境变量中读取数据库配置
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS } = process.env;

  const [host, port] = MYSQL_ADDRESS!.split(":");

  const sequelize = new Sequelize(
    "wealthmark",
    MYSQL_USERNAME!,
    MYSQL_PASSWORD,
    {
      host,
      port: +port!,
      dialect: "mysql",
      dialectModule: mysql2,
    }
  );

  await sequelize.sync();

  return sequelize;
}

let waitInit: Promise<Sequelize> | null = null;
let dbInstance: Sequelize | null = null;

export async function getDbInstance() {
  if (dbInstance) {
    return dbInstance;
  }
  if (waitInit) {
    return waitInit;
  }

  waitInit = initDatabase();

  waitInit.then(
    (instance) => {
      dbInstance = instance;
      return instance;
    },
    (e) => {
      waitInit = null;
      throw e;
    }
  );

  return waitInit;
}
