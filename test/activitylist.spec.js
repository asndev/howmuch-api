'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');


describe('Activity List Routes', function() {

  const server = require('../server/server');
  const User = require('../server/models/User');

  let token;

  const mock = {
    user: {
      email: 'test@test.com',
      password: 'testpassword'
    }
  };

  before((done) => {
    console.log('Before Activitylist Test');

    console.log('Starting Server for ActivityList Test');
    server.start({ env: 'test', port: 3123 });
    chai.use(chaiHttp);

    User.collection.drop(() => {
      done();
    });
  });

  beforeEach((done) => {
    new User(mock.user).save((err, newUser) => {
      // also sign in with the created user and save the token for the upcoming
      // tests
      chai.request(server.app).post('/signin').send(mock.user)
        .end((err, res) => {
          res.body.should.have.property('token');
          token = res.body.token;
          done();
        });
    });
  });

  // We only drop the users collection after all tests!
  after((done) => {
    console.log('After Activity List Test');
    User.collection.drop(() => {
      mongoose.connection.close();
      done();
    });
  });

  describe('Expect OK Status', () => {

    it('should receive ok status on /v1/activitylist GET', (done) => {
      chai.request(server.app)
      .get('/v1/activitylist')
      .set('authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });

  });

});
