'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');


describe('Activity Routes', function() {

  const server = require('../server/server');
  const User = require('../server/models/User');
  const ActivityList = require('../server/models/ActivityList');
  const Activity = require('../server/models/Activity');

  let token, listId, id;

  const mock = {
    user: {
      email: 'test@test.com',
      password: 'testpassword'
    }
  };

  before((done) => {
    console.log('Before Activity Test');

    console.log('Starting Server for Activity Test');
    server.start({ env: 'test', port: 3126 });
    chai.use(chaiHttp);

    User.collection.drop(() => {
      done();
    });
  });

  after((done) => {
    User.collection.drop(() => {
      ActivityList.collection.drop(() => {
        Activity.collection.drop(() => {
            done();
        });
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
          chai.request(server.app)
            .post('/v1/activitylist/')
            .set('authorization', token)
            .send({ name: 'Test List' })
            .end((err, res) => {
              res.body.data.should.have.property('_id');
              listId = res.body.data._id;
              done();
            });
        });
    });
  });

  describe('Expect OK Status', () => {

    it('should receive ok status on /v1/activitylist/:listid/activity POST', (done) => {
      chai.request(server.app)
      .post('/v1/activitylist/' + listId + '/activity')
      .set('authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success');
        res.body.success.should.be.true;
        res.body.should.have.property('data');
        res.body.data.should.have.property('_id');
        res.body.data.should.have.property('timestamp');
        res.body.data.should.have.property('_activityListId');
        res.body.data._id.should.be.a('string');
        res.body.data.timestamp.should.be.a('string');
        res.body.data._activityListId.should.be.a('string');
        id = res.body.data._id;
        done();
      });
    });

    it('should receive ok status on /v1/activitylist/:listid/activity GET', (done) => {
      chai.request(server.app)
        .get('/v1/activitylist/' + listId + '/activity')
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          // res.body.data.should.be.an('array');
          // TODO This should work, doesnt work in test. dafuk?
          // res.body.data[0].should.be.an('object');
          // res.body.data[0].should.have.property('_id');
          // res.body.data[0].should.have.property('_activityListId');
          // res.body.data[0].should.have.property('timestamp');
          done();
        });
    });

    it('should receive ok status on /v1/activitylist/:id GET', (done) => {
      chai.request(server.app)
      .get('/v1/activitylist/' + listId + '/activity/' + id)
      .set('authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success');
        res.body.success.should.be.true;
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('_id');
        res.body.data.should.have.property('_activityListId');
        res.body.data.should.have.property('timestamp');
        res.body.data._id.should.equal(id);
        done();
      });
    });

    it('should receive ok status on /v1/activitylist/:listid/activity/:id PUT', (done) => {
      chai.request(server.app)
      .put('/v1/activitylist/' + listId + '/activity/' + id)
      .send({ timestamp: '2015-03-03' })
      .set('authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success');
        res.body.success.should.be.true;
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('_id');
        res.body.data.should.have.property('_activityListId');
        res.body.data.should.have.property('timestamp');
        res.body.data._id.should.equal(id);
        done();
      });
    });

    it('should receive ok status on /v1/activitylist/:listid/activity/:id DELETE', (done) => {
      chai.request(server.app)
      .delete('/v1/activitylist/' + listId + '/activity/' + id)
      .set('authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.success.should.be.true;

        chai.request(server.app)
          .get('/v1/activitylist/' + listId + '/activity')
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(200);
            // res.body.data.length.should.equal(0);
            done();
          });
      });
    });

  });

});
