'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');


describe('Activity List Routes', function() {

  const server = require('../server/server');
  const User = require('../server/models/User');
  const ActivityList = require('../server/models/ActivityList');

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

  after((done) => {
    User.collection.drop(() => {
      ActivityList.collection.drop(() => {
        done();
      });
    });
  })

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

    let id;

    beforeEach((done) => {
      done();
    });

    it('should receive ok status on /v1/activitylist POST', (done) => {
      chai.request(server.app)
      .post('/v1/activitylist/')
      .set('authorization', token)
      .send({ name: 'New Test List' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success');
        res.body.success.should.be.true;
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('_id');
        res.body.data.should.have.property('name');
        res.body.data.should.have.property('_creator');
        res.body.data._id.should.be.a('string');
        res.body.data.name.should.be.a('string');
        res.body.data._creator.should.be.a('string');
        id = res.body.data._id;
        done();
      });
    });

    it('should receive ok status on /v1/activitylist GET', (done) => {
      chai.request(server.app)
        .get('/v1/activitylist')
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          res.body.data[0].should.be.an('object');
          res.body.data[0].should.have.property('_id');
          res.body.data[0].should.have.property('_creator');
          res.body.data[0].should.have.property('name');
          res.body.data[0].name.should.equal('New Test List');
          done();
        });
    });

    it('should receive ok status on /v1/activitylist/:id GET', (done) => {
      chai.request(server.app)
      .get('/v1/activitylist/' + id)
      .set('authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success');
        res.body.success.should.be.true;
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('_id');
        res.body.data.should.have.property('_creator');
        res.body.data.should.have.property('name');
        res.body.data._id.should.equal(id);
        res.body.data.name.should.equal('New Test List');
        done();
      });
    });

    it('should receive ok status on /v1/activitylist/:id PUT', (done) => {
      chai.request(server.app)
      .put('/v1/activitylist/' + id)
      .send({ name: 'New Name' })
      .set('authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success');
        res.body.success.should.be.true;
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('_id');
        res.body.data.should.have.property('_creator');
        res.body.data.should.have.property('name');
        res.body.data._id.should.equal(id);
        res.body.data.name.should.equal('New Name');
        done();
      });
    });

    it('should receive ok status on /v1/activitylist/:id DELETE', (done) => {
      chai.request(server.app)
      .delete('/v1/activitylist/' + id)
      .set('authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        chai.request(server.app)
          .get('/v1/activitylist')
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.data.length.should.equal(0);
            done();
          });
      });
    });

  });

});
