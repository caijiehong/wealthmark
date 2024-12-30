import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  DataTypes,
  CreationAttributes,
} from "sequelize";
import { getDbInstance } from "./connect";

// order of InferAttributes & InferCreationAttributes is important.
class FundNameEm extends Model<
  InferAttributes<FundNameEm>,
  InferCreationAttributes<FundNameEm>
> {
  /**
   * - 基金代码
   */
  declare symbol: string;

  /**
   * - 基金名称
   */
  declare name: string;

  /**
   * 拼音缩写
   */
  declare shortName: string;

  /**
   * 拼音全称
   */
  declare pinyin: string;

  /**
   * 基金类型
   * @example 指数型-股票
   */
  declare type: string;
}

export type FundNameEmAttributes = InferAttributes<
  FundNameEm,
  {
    omit: never;
  }
>;

async function defineModel_fund_name_em(sequelize: Sequelize) {
  const model = FundNameEm.init(
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
      shortName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      pinyin: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "fund_name_em",
    }
  );
  await model.sync({ alter: true });

  return model;
}

let initStatus: ReturnType<typeof defineModel_fund_name_em> | null = null;

async function getModelFundNameEm() {
  if (!initStatus) {
    const sequelize = await getDbInstance();
    initStatus = defineModel_fund_name_em(sequelize);
  }
  return initStatus;
}

async function getOne(symbol: string) {
  const model = await getModelFundNameEm();
  const res = await model.findOne({
    where: {
      symbol,
    },
  });

  return res ? res.toJSON() : null;
}

async function updateAll(data: CreationAttributes<FundNameEm>[]) {
  const model = await getModelFundNameEm();
  await model.bulkCreate(data, {
    updateOnDuplicate: ["name"],
  });
}

export default {
  getOne,
  updateAll,
};
