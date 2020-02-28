const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      validate: {
        validator: function(email) {
           var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
           return emailRegex.test(email)
        },
        message: props => `${props.value} is not a valid email`
      },
    },
    password: { type: String, required: true },
    type: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: ['chargeur', 'transporteur']
    }
  }
)

module.exports = mongoose.model('user', UserSchema)
