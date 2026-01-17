import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/database'
import { Component } from './Component'

interface BuildAttributes {
  id: number
  name: string
  description?: string
  userId: number
  components?: Component[]
  totalPrice: number
  isPublic: boolean
  isFeatured: boolean
  likes: number
  views: number
  compatibilityScore?: number
  performanceScore?: number
  createdAt?: Date
  updatedAt?: Date
}

interface BuildCreationAttributes extends Optional<BuildAttributes, 'id' | 'createdAt' | 'updatedAt' | 'totalPrice' | 'likes' | 'views'> {}

export class Build extends Model<BuildAttributes, BuildCreationAttributes> implements BuildAttributes {
  public id!: number
  public name!: string
  public description?: string
  public userId!: number
  public components?: Component[]
  public totalPrice!: number
  public isPublic!: boolean
  public isFeatured!: boolean
  public likes!: number
  public views!: number
  public compatibilityScore?: number
  public performanceScore?: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public declare setComponents: (components: Component[] | number[]) => Promise<void>
  public declare getComponents: () => Promise<Component[]>
}

Build.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    compatibilityScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    performanceScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    }
  },
  {
    sequelize,
    modelName: 'Build',
    tableName: 'builds',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['is_public']
      },
      {
        fields: ['is_featured']
      },
      {
        fields: ['likes']
      },
      {
        fields: ['views']
      },
      {
        fields: ['total_price']
      },
      {
        fields: ['compatibility_score']
      },
      {
        fields: ['performance_score']
      },
      {
        fields: ['created_at']
      }
    ]
  }
)

Build.belongsToMany(Component, {
  through: 'build_components',
  as: 'components',
  foreignKey: 'build_id',
  otherKey: 'component_id'
})

Component.belongsToMany(Build, {
  through: 'build_components',
  as: 'builds',
  foreignKey: 'component_id',
  otherKey: 'build_id'
})

export default Build
