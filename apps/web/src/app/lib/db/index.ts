import { Sequelize } from "sequelize";
import { defineModelProperty } from "./property";
import { defineModelPropertyHis } from "./propertyHis";
import mysql2 from "mysql2";

let Property: ReturnType<typeof defineModelProperty> | null = null;
let PropertyHis: ReturnType<typeof defineModelPropertyHis> | null = null;

/**
 * 初始化数据库
 */
async function initDatabase(): Promise<void> {
  console.log("init db");
  // 从环境变量中读取数据库配置
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS } = process.env;

  const [host, port] = MYSQL_ADDRESS!.split(":");
  try {
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

    Property = defineModelProperty(sequelize);
    PropertyHis = defineModelPropertyHis(sequelize);

    const p1 = Property.sync({ alter: true });
    const p2 = PropertyHis.sync({ alter: true });
    await Promise.all([p1, p2]);
  } catch (error) {
    console.warn("init db error", error);
  }
}
let initStatus: Promise<void> | null = null;

export async function getModelProperty() {
  if (Property) {
    return Property;
  }
  if (!initStatus) {
    initStatus = initDatabase();
  }
  await initStatus;
  return Property!;
}
export async function getModelPropertyHis() {
  if (PropertyHis) {
    return PropertyHis;
  }
  if (!initStatus) {
    initStatus = initDatabase();
  }
  await initStatus;
  return PropertyHis!;
}
