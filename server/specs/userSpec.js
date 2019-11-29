import chai from 'chai';

import chaiHttp from 'chai-http';

import server from '../source/server';

import users from '../models/user';

const expect = chai.expect;

console.log(users.user1);

describe('create user', () => {
  it('should check all fields are available', (done) => {
    chai.request(server)
    .post('/api/v1/auth/create-user')
    .set({'Authorization': 'Bearer ' + process.env.adminToken}) 
    .send(users.user1)
    .end((err, res) => {
      if(err) return done(err);
      expect(res.status).to.equal(409);
      done();
    });
  });

  it('should return error if unable to sign user up', (done) => {
    chai.request(server)
    .post('/api/v1/auth/create-user')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .send(users.user2)
    .end((err, res) => {
      if(err) return done(err);
      expect(res.status).to.equal(500);
      done();
    });
  });
});