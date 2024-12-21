import { Sequelize, DataTypes, Model } from "sequelize";

type PropertyAttributes = {
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
   * - 资产名称
   */
  name: string;

  /**
   * - 资产描述
   */
  desc: string;
  /**
   * - 所属市场
   * - cn: 中国市场
   * - us: 美国市场
   * - hk: 香港市场
   * - cash: 现金
   */
  market: string;
  /**
   * - 投资标的类型: 国内标的 or 国际标的
   * - cn: 国内标的
   * - us: 国际标的
   */
  marketType: string;
  /**
   * - 资产币种: cny, usd, hkd
   */
  currency: string;
};

class MProperty extends Model<PropertyAttributes> {
  declare readonly id: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare uid: string;
  declare symbol: string;
  declare market: string;
  declare marketType: string;
  declare currency: string;
  declare name: string;
  declare desc: string;
}

export function defineModelProperty(sequelize: Sequelize) {
  const Property = sequelize.define<MProperty>(
    "Property",
    {
      uid: {
        type: DataTypes.CHAR(128),
        allowNull: false,
      },
      symbol: {
        type: DataTypes.CHAR(128),
        allowNull: false,
      },
      market: {
        type: DataTypes.CHAR(32),
        allowNull: false,
      },
      marketType: {
        type: DataTypes.CHAR(32),
        allowNull: false,
      },
      currency: {
        type: DataTypes.CHAR(32),
        allowNull: false,
      },
      name: {
        type: DataTypes.CHAR(128),
        allowNull: false,
      },
      desc: {
        type: DataTypes.CHAR(128),
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["uid", "symbol"],
        },
      ],
    }
  );

  return Property;
}
