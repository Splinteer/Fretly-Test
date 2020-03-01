'user strict'

const path = require('path')
const User = require(path.resolve( __dirname, './UserModel'))

module.exports = {
  register: function(req, res) {
    let newUser = new User(req.body)

    newUser.save((err, user) => {
      if(err) {
        let errorTxt = err.toString()
        let statusCode = 500
        let message = 'Unknow error'

        if (errorTxt.includes('duplicate key')) {
          statusCode = 409
          message = 'This email is already used'
        } else if (errorTxt.includes('is not a valid email')) {
          statusCode = 401
          message = 'Field should be an email'
        } else if (errorTxt.includes('enum')) {
          statusCode = 401
          message = 'Wrong type'
        } else if (errorTxt.includes('is required')) {
          statusCode = 422
          message = 'Missing fields'
        }

        res.status(statusCode).json({
          code: statusCode,
          message
        })
      } else {
        req.session.authenticated = true
        req.session.userId = user.id

        res.status(200).json({
          code: 200,
          userId: user.id
        })
      }
    })
  },

  login: function(req, res) {
    User.findOne({ email: req.body.email, password: req.body.password }, 'id', function (err, user) {
      if (err) {
        res.status(500).send('Unknow error')
      } else if (user) {
        req.session.authenticated = true
        req.session.userId = user.id

        res.status(200).json({
          code: 200,
          userId: user.id
        })
      } else {
        res.status(401).send('Wrong combination')
      }
    });
  },

  getNbUser: function(req, res) {
    if (!req.session.authenticated) {
      res.sendStatus(401)
    } else {
      User.findById(req.session.userId, 'type', function (err, user) {
        User.countDocuments({ type: user.type }, function (err, count) {
          let message
          if (count > 1) {
            message = 'Il y a actuellement ' + count + ' ' + user.type + 's inscrits'
          } else {
            message = 'Il y a actuellement ' + count + ' ' + user.type + ' inscrit'
          }
          res.status(200).json({
            code: 200,
            message
          })
        })
      })
    }
  }

}
