import { Sequelize, DataTypes, Model } from "sequelize";

type PropertyHisAttributes = {
  /**
   * 所属用户
   */
  uid: string;
  /**
   * - 资产编号, 比如股票基金代码
   * - 如果是现金, 则为币种编号
   */
  symbol: string;
  /**
   * 资产数量
   */
  amount: number;
  /**
   * 更新日
   * @example 20210101
   */
  date: number;
};

class MPropertyHis extends Model<PropertyHisAttributes> {
  declare readonly id: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare uid: string;
  declare symbol: string;
  declare amount: number;
  declare date: number;
}

export function defineModelPropertyHis(sequelize: Sequelize) {
  const PropertyHis = sequelize.define<MPropertyHis>(
    "PropertyHis",
    {
      uid: {
        type: DataTypes.CHAR(128),
        allowNull: false,
      },
      symbol: {
        type: DataTypes.CHAR(128),
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      date: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: false,
          fields: ["uid", "symbol"],
        },
      ],
    }
  );

  return PropertyHis;
}
