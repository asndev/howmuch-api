'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../server/server');
const User = require('../server/models/User');

server.start({ env: 'test', port: 3123 });

chai.use(chaiHttp);

describe('Routes', function() {

  User.collection.drop();

  const mock = {
    user: {
      email: 'test@test.com',
      password: 'testpassword'
    }
  };

  beforeEach((done) => {
    const user = new User(mock.user);

    user.save((err, newUser) => {
      done();
    });
  });

  afterEach((done) => {
    User.collection.drop();
    done();
  });

  it('should correctly get unauthorized on / GET', (done) => {
    chai.request(server.app)
      .get('/')
      .end((err, res) => {
        // 401 - unauthorized
        res.should.have.status(401);
        done();
      });
  });

  it('should correctly get a 404 on /foobar GET', (done) => {
    chai.request(server.app)
      .get('/foobar')
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.have.property('success');
        res.body.success.should.be.false;
        res.body.should.have.property('message');
        done();
      });
  });

  describe('Signup Process', () => {
    let token;
    let newUser = { email: 'new@user.com', password: 'newpassword' };
    
    it('should correctly signup on /signup POST', (done) => {
      chai.request(server.app)
        .post('/signup')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an('object');
          res.body.should.have.property('token');
          res.body.token.should.be.a('string');
          token = res.body.token;
          done();
        });
    });

    it('should correctly signin with the generated token on / GET', (done) => {
      chai.request(server.app)
        .get('/')
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('success');
          res.body.success.should.be.true;
          done();
        });
    });
    
    it('should correctly signin on /signin POST', (done) => {
      chai.request(server.app)
        .post('/signin')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an('object');
          res.body.should.have.property('token');
          res.body.token.should.be.a('string');
          done();
        });
    });

  });

});
