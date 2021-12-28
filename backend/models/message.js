//Just testing


const { Model } = require('sequelize')

const moment = require('moment')

const { deleteFile } = require('../services/file-removal')
const comment = require('./comment')

module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    
    static associate (model) {
      message.belongsTo(model.User, { foreignKey: 'userId' })
      message.hasMany(model.Comment)
      message.hasMany(model.Likes)
    }

    readableCreatedAt () {
      return moment(this.createdAt)
        .locale('fr')
        .format('LL')
    }
  }
  message.init(
    {
      userId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
      likesCount: DataTypes.INTEGER
    },
    {
      sequelize,
      validate: {
        eitherContentOrImageUrl () {
          if (!this.content && !this.imageUrl) {
            throw new Error('Vous ne pouvez pas créer de publication vide !')
          }
        }
      },
      modelName: 'Message'
    }
  )

  message.afterDestroy(async comment => {
    if (comment.imageUrl) {
      await deleteFile(comment.imageUrl)
    }
  })

  message.afterUpdate(async message => {
    if (message.dataValues.imageUrl !== message._previousDataValues.imageUrl) {
      await deleteFile(message._previousDataValues.imageUrl)
    }
  })

  return message
}