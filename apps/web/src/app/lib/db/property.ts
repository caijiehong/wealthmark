import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
  DataTypes,
  CreationAttributes,
} from "sequelize";
import { getDbInstance } from "./connect";
import { Currency, MarketType } from "../enums";

// order of InferAttributes & InferCreationAttributes is important.
class Property extends Model<
  InferAttributes<Property>,
  InferCreationAttributes<Property>
> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  /**
   * 所属用户
   */
  declare uid: string;
  /**
   * - 资产编号, 比如股票基金代码
   * - 如果是现金, 则为币种编号
   */
  declare symbol: string;

  /**
   * - 资产名称
   */
  declare name: string;

  /**
   * - 资产描述
   */
  declare desc: string;
  /**
   * - 所属市场
   * - cn: 中国市场
   * - us: 美国市场
   * - hk: 香港市场
   * - cash: 现金
   */
  declare market: string;
  /**
   * - 投资标的类型: 国内标的 or 国际标的
   * - china: 国内标的
   * - global: 国际标的
   * - cash: 现金
   */
  declare marketType: MarketType;
  /**
   * - 资产币种: cny, usd, hkd
   */
  declare currency: Currency;

  /**
   * - 资产星标
   * - 0: 未标记
   * - 1: 重要资产
   */
  declare flag: number;
}
export type PropertyAttributes = InferAttributes<
  Property,
  {
    omit: never;
  }
>;

async function defineModelProperty(sequelize: Sequelize) {
  const model = Property.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      uid: {
        type: DataTypes.CHAR(128),
      },
      symbol: {
        type: DataTypes.CHAR(128),
      },
      name: {
        type: DataTypes.STRING,
      },
      desc: {
        type: DataTypes.TEXT,
      },
      market: {
        type: DataTypes.CHAR(16),
      },
      marketType: {
        type: DataTypes.CHAR(16),
      },
      currency: {
        type: DataTypes.CHAR(16),
      },
      flag: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      indexes: [
        {
          unique: false,
          fields: ["uid"],
        },
      ],
      sequelize,
      tableName: "property",
    }
  );
  await model.sync({ alter: true });

  return model;
}

let initStatus: ReturnType<typeof defineModelProperty> | null = null;

function getModelProperty() {
  if (!initStatus) {
    const sequelize = getDbInstance();
    initStatus = defineModelProperty(sequelize);
  }
  return initStatus;
}

async function getOne(id: number) {
  const model = await getModelProperty();
  const res = await model.findOne({
    where: {
      id,
    },
  });

  return res ? res.toJSON() : null;
}

async function getList(uid: string): Promise<PropertyAttributes[]> {
  const model = await getModelProperty();
  const res = await model.findAll({
    where: {
      uid,
    },
  });
  return res.map((item) => item.toJSON());
}

async function insertOrUpdate(data: CreationAttributes<Property>) {
  const model = await getModelProperty();
  const item = await model.findOne({
    where: {
      uid: data.uid,
      symbol: data.symbol,
    },
  });
  if (item) {
    await item.update(data);
  } else {
    await model.create(data);
  }

  return data;
}

async function remove(id: number, uid: string, symbol: string) {
  const model = await getModelProperty();
  await model.destroy({
    where: {
      id,
      uid,
      symbol,
    },
  });
}

export default { getOne, getList, insertOrUpdate, remove };
