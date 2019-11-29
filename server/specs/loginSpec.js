import chai from 'chai';

import chaiHttp from 'chai-http';

import server from '../source/server';

import userModel from '../models/user';

const expect = chai.expect;
chai.use(chaiHttp);

describe('login', () => {
  it('should not login a user if credentials missing', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signin')
    .set({'Authorization': 'Bearer ' + process.env.adminToken}) 
    .send(userModel.user4)
    .end((err, res) => {
      expect(res.status).to.equal(409);
      done();
    })
  });
  it('should not login a user if invalid email', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signin')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .send(userModel.user5)
    .end((err, res) => {
      expect(res.status).to.equal(401);
      done();
    });
  });
  it('should return error if unable to verify password', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signin')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .send(userModel.user6)
    .end((err, res) => {
      expect(res.status).to.equal(401);
      done();
    });
  });
});