import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  DataTypes,
} from "sequelize";
import { getDbInstance } from "./connect";

// order of InferAttributes & InferCreationAttributes is important.
class StockUs extends Model<
  InferAttributes<StockUs>,
  InferCreationAttributes<StockUs>
> {
  /**
   * - 股票代码
   */
  declare symbol: string;

  /**
   * - 股票名称
   */
  declare name: string;

  /**
   * 用于在 akShare 中查找股票
   */
  declare akShareId: string;
}

export type StockUsAttributes = InferAttributes<
  StockUs,
  {
    omit: never;
  }
>;

async function defineModelStockUs(sequelize: Sequelize) {
  const model = StockUs.init(
    {
      symbol: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      akShareId: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "stock_us",
    }
  );
  await model.sync({ alter: true });

  return model;
}

let initStatus: ReturnType<typeof defineModelStockUs> | null = null;

function getModelStockUs() {
  if (!initStatus) {
    const sequelize = getDbInstance();
    initStatus = defineModelStockUs(sequelize);
  }
  return initStatus;
}

async function getOne(symbol: string) {
  const model = await getModelStockUs();
  const res = await model.findOne({
    where: {
      symbol,
    },
  });

  return res ? res.toJSON() : null;
}

async function updateAll(data: StockUsAttributes[]) {
  const model = await getModelStockUs();
  await model.bulkCreate(data, {
    updateOnDuplicate: ["name"],
  });
}

export default {
  getOne,
  updateAll,
};
