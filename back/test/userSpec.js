const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const sinon = require('sinon')
const request = require('supertest')
const session = require('supertest-session');
const UserController = require('../lib/user/userController')
const server = require('../server');

const User = require('../lib/user/UserModel')

describe('UserController', function() {
  let testSession
  let authSession // used to keep session between tests

  beforeEach(function () {
    testSession = session(server) // Remove every session before each test
  })

  const userCredentials = {
    email: 'test@fletly.com',
    password: 'monSuperMDP',
    type: 'chargeur'
  }

  // Remove test user
  after(function() {
    User.deleteOne(userCredentials, function(err) {
      expect(err, 'Impossible to remove test user').to.equal(null)
    })
  })

  describe('POST /register', function() {

    it('should register a new user', function(done) {
      testSession
        .post('/register')
        .type('form')
        .send(userCredentials)
        .end((err, res) => {
          expect(res, 'Impossible to register').to.have.status(200)
          expect(res.body, 'Response is not array').to.be.a('object')
          done()
        })
    })

    it('should reject registration (email already used)', function(done) {
      testSession
        .post('/register')
        .type('form')
        .send(userCredentials)
        .end((err, res) => {
          expect(res, 'User registered').to.have.status(409)
          expect(res.body.message, 'User registered').to.includes('email is already used')
          done()
        })
    })

    it('should reject registration (missing fields)', function(done) {
      testSession
        .post('/register')
        .type('form')
        .send({
          email: 'test@test.com',
          type: 'chargeur'
        })
        .end((err, res) => {
          expect(res, 'User registered').to.have.status(422)
          done()
        })
    })

    it('should reject registration (wrong type)', function(done) {
      testSession
        .post('/register')
        .type('form')
        .send({
          email: 'test@test.com',
          password: 'monMDP',
          type: 'avion'
        })
        .end((err, res) => {
          expect(res, 'User registered').to.have.status(401)
          expect(res.body.message.toLowerCase(), 'User registered').to.includes('wrong type')
          done()
        })
    })

    it('should reject registration (not an email)', function(done) {
      testSession
        .post('/register')
        .type('form')
        .send({
          email: 'testtest.com',
          password: 'monMDP',
          type: 'chargeur'
        })
        .end((err, res) => {
          expect(res, 'User registered').to.have.status(401)
          expect(res.body.message.toLowerCase(), 'User registered').to.includes('field should be an email')
          done()
        })
    })

  })

  describe('POST /login', function() {

    it('should login user', function(done) {
      testSession
        .post('/login')
        .type('form')
        .send(userCredentials)
        .end((err, res) => {
          expect(res, 'Impossible to login').to.have.status(200)
          authSession = testSession
          done()
        })
    })

    it('should reject login', function(done) {
      testSession
        .post('/login')
        .type('form')
        .send({
          email: 'test@fletly.com',
          password: 'mauvaisMDP'
        })
        .end((err, res) => {
          expect(res, 'Should reject login').to.have.status(401)
          done()
        })
    })
  })

  describe('GET /getNbUser', function() {
    let aTempUser = []

    // Create test users
    before(function(done) {
      let ts = Date.now()
      for (let i = 1; i <= 2; i++) {
        let newUser = new User({
          email: ts + '' + i + '@test.fr',
          password: 'password',
          type: 'transporteur'
        })
        newUser.save((err, user) => {
          expect(err, 'Impossible to create test user').to.equal(null)
          aTempUser.push(user)
          if (i == 2) {
            done()
          }
        })
      }
    })

    // Remove test users
    after(function() {
      aTempUser.forEach(function(user) {
        User.deleteOne({ _id: user.id }, function (err) {
          expect(err, 'Impossible to remove test user').to.equal(null)
        })
      })
    })

    it('should get incrit', function(done) {
      authSession
        .get('/getNbUser')
        .end((err, res) => {
          expect(res, 'Impossible get count').to.have.status(200)
          expect(res.body.message.toLowerCase(), 'Shoud not have a s').to.not.includes('incrits')
          done()
        })
    })

    it('should get incrits', function(done) {
      testSession
        .post('/login')
        .type('form')
        .send({
          email: aTempUser[0].email,
          password: aTempUser[0].password
        })
        .end((err, res) => {
          expect(res, 'Impossible to login').to.have.status(200)

          testSession
            .get('/getNbUser')
            .auth(aTempUser[0].email, aTempUser[0].password)
            .end((err, res) => {
              expect(res, 'Impossible get count').to.have.status(200)
              expect(res.body.message.toLowerCase(), 'Shoud have a s').to.includes('inscrits')
              done()
            })
        })
    })
  })
})
