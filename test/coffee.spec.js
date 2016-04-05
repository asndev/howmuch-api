'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');


describe('Coffee Routes', function() {

  const server = require('../server/server');
  const User = require('../server/models/User');

  const mock = {
    user: {
      email: 'test@test.com',
      password: 'testpassword'
    }
  };

  before((done) => {
    console.log('Before Coffee Test');

    console.log('Starting Server for Coffee Test');
    server.start({ env: 'test', port: 3123 });
    chai.use(chaiHttp);

    User.collection.drop(() => {
      done();
    });
  });

  beforeEach((done) => {
    new User(mock.user).save((err, newUser) => {
      done();
    });
  });

  // We only drop the users collection after all tests!
  after((done) => {
    console.log('After Coffee Test');
    User.collection.drop(() => {
      mongoose.connection.close();
      done();
    });
  });

  describe('Expect OK Status', () => {
    let token;

    it('should correctly signin on /signin POST', (done) => {
      chai.request(server.app)
        .post('/signin')
        .send(mock.user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');
          token = res.body.token;
          done();
        });
    });

    it('should receive ok status on /v1/coffee GET', (done) => {
      chai.request(server.app)
      .get('/v1/coffee')
      .set('authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });

});
