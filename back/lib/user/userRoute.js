'use strict'

const path = require('path')
const UserController = require(path.resolve( __dirname, './UserController'))

module.exports = function (app) {

  app.route('/register')
    .post(UserController.register)

  app.route('/login')
    .post(UserController.login)

  app.route('/getNbUser')
    .get(UserController.getNbUser)
}
