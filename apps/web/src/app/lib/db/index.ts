import { Sequelize } from "sequelize";
import { defineModelProperty } from "./property";
import { defineModelPropertyHis } from "./propertyHis";
import mysql2 from "mysql2";

function createDB({
  userName,
  password,
  host,
  port,
}: {
  userName: string;
  password: string;
  host: string;
  port: string;
}) {
  let Property: ReturnType<typeof defineModelProperty> | null = null;
  let PropertyHis: ReturnType<typeof defineModelPropertyHis> | null = null;

  /**
   * 初始化数据库
   */
  async function init(): Promise<void> {
    console.log("init db");
    try {
      const sequelize = new Sequelize("wealthmark", userName, password, {
        host,
        port: +port,
        dialect: "mysql",
        dialectModule: mysql2,
      });

      Property = defineModelProperty(sequelize);
      PropertyHis = defineModelPropertyHis(sequelize);

      const p1 = Property.sync({ alter: true });
      const p2 = PropertyHis.sync({ alter: true });
      await Promise.all([p1, p2]);
    } catch (error) {
      console.warn("init db error", error);
    }
  }
  let initStatus = init();

  async function getModelProperty() {
    await initStatus;
    return Property!;
  }
  async function getModelPropertyHis() {
    await initStatus;
    return PropertyHis!;
  }

  return {
    getModelProperty,
    getModelPropertyHis,
  };
}

// 从环境变量中读取数据库配置
// eslint-disable-next-line turbo/no-undeclared-env-vars
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS } = process.env;

const [host, port] = MYSQL_ADDRESS!.split(":");

console.log("createDB", host, port);

export const db = createDB({
  userName: MYSQL_USERNAME!,
  password: MYSQL_PASSWORD!,
  host: host!,
  port: port!,
});
