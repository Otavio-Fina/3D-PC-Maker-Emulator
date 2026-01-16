import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/database'

interface ComponentAttributes {
  id: number
  name: string
  category: 'cpu' | 'gpu' | 'ram' | 'storage' | 'motherboard' | 'psu' | 'cooling' | 'case'
  brand: string
  price: number
  description?: string
  imageUrl?: string
  specifications?: any
  rating?: number
  stock?: number
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface ComponentCreationAttributes extends Optional<ComponentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Component extends Model<ComponentAttributes, ComponentCreationAttributes> implements ComponentAttributes {
  public id!: number
  public name!: string
  public category!: 'cpu' | 'gpu' | 'ram' | 'storage' | 'motherboard' | 'psu' | 'cooling' | 'case'
  public brand!: string
  public price!: number
  public description?: string
  public imageUrl?: string
  public specifications?: any
  public rating?: number
  public stock?: number
  public isActive!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Component.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    category: {
      type: DataTypes.ENUM('cpu', 'gpu', 'ram', 'storage', 'motherboard', 'psu', 'cooling', 'case'),
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    specifications: {
      type: DataTypes.JSON,
      allowNull: true
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'Component',
    tableName: 'components',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['category']
      },
      {
        fields: ['brand']
      },
      {
        fields: ['price']
      },
      {
        fields: ['rating']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['name']
      }
    ]
  }
)

export default Component
