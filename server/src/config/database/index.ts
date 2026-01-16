import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_NAME = 'pc_builder_3d',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_DIALECT = 'mysql',
  NODE_ENV = 'development'
} = process.env

export const sequelize = new Sequelize({
  host: DB_HOST,
  port: parseInt(DB_PORT),
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  dialect: DB_DIALECT as any,
  logging: NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
})

export const configDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')
    
    if (NODE_ENV === 'development') {
      await sequelize.sync({ alter: true })
      console.log('Database synchronized successfully.')
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    throw error
  }
}

export const closeDatabase = async (): Promise<void> => {
  try {
    await sequelize.close()
    console.log('Database connection closed.')
  } catch (error) {
    console.error('Error closing database connection:', error)
    throw error
  }
}
