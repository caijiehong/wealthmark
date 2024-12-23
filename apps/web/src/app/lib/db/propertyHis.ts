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

// order of InferAttributes & InferCreationAttributes is important.
class PropertyHis extends Model<
  InferAttributes<PropertyHis>,
  InferCreationAttributes<PropertyHis>
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
   * - 记录日期
   * @example 20210101
   */
  declare markDate: number;

  /**
   * - 资产数额
   */
  declare amount: number;
}

async function defineModelProperty(sequelize: Sequelize) {
  const model = PropertyHis.init(
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
      markDate: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
      },
    },
    {
      sequelize,
      indexes: [
        {
          unique: false,
          fields: ["uid", "symbol"],
        },
      ],
      tableName: "propertyHis",
    }
  );
  await model.sync({ alter: true });

  return model;
}

let initStatus: ReturnType<typeof defineModelProperty> | null = null;

function getModelPropertyHis() {
  if (!initStatus) {
    const sequelize = getDbInstance();
    initStatus = defineModelProperty(sequelize);
  }
  return initStatus;
}

async function getOne(id: number) {
  const model = await getModelPropertyHis();
  const res = await model.findOne({
    where: {
      id,
    },
  });

  return res;
}

async function getList(uid: string) {
  const model = await getModelPropertyHis();
  return model.findAll({
    where: {
      uid,
    },
  });
}

async function insertOrUpdate(data: CreationAttributes<PropertyHis>) {
  const model = await getModelPropertyHis();
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

export type { PropertyHis };

export default { getOne, getList, insertOrUpdate };
