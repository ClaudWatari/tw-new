import chai from 'chai';

import chaiHttp from 'chai-http';

import server from '../source/server';

import users from '../models/user';

import { pool } from '../config';

const expect = chai.expect;

chai.use(chaiHttp);

const gifModel = {
  gif1: {
    title: '',
    image: ''
  },
  gif2: {
    title: 'title',
    image: 'https://www.socialandtech.net/wp-content/uploads/2019/05/Screenshot-2019-05-19-at-14.52.05.png'
  },
  gif3: {
    title: 'title',
    image: 'C:/Users/Guest/Documents/teamwork/server/screenshots/headbanging.gif'
  },
};

const articleModel = {
  article1: {
    title: '',
    article: '',
  },
  article2: {
    title: 'title',
    article: 'an article',
  },
  article3: {
    title: '',
    article: 'edited content',
  }
}

before('all tests', (done) => {
  const userQuery = `INSERT INTO users (firstName, 
                         lastName, 
                         email, 
                         password, 
                         gender, 
                         jobRole, 
                         department, 
                         address,
                         admin) 
                         VALUES 
                         ('claud', 'watari',
                         'admin@teamwork.com',
                         'randompassword', 'male',
                         'developer', 'software',
                         'Nairobi', 'true')`;
  pool.query(userQuery);

  pool.query(`INSERT INTO gifs (title, imageurl) VALUES ('myGif', 'gifimage.gif')`);
  done();
});

after('all tests', (done) => {
  pool.query(`DELETE FROM users WHERE password = 'randompassword' AND admin = 'true'`);
  pool.query(`DELETE FROM gifs WHERE imageurl = 'gifimage.gif' AND title = 'myGif'`);
  done();
})

describe('authentication', () => {
  it('should prevent unauthorized users', (done) => {
    chai.request(server)
    .post('/api/v1/gifs')
    .send(gifModel.gifI)
    .end((err, res) => {
      expect(res.status).to.equal(403);
      done();
    })
  })
})
describe('authentication', () => {
  it('should prevent non admin', (done) => {
    chai.request(server)
    .post('/api/v1/auth/create-user')
    .send(gifModel.gifI)
    .end((err, res) => {
      expect(res.status).to.equal(403);
      done();
    })
  })
})

describe('login', () => {
  it('should not login a user if credentials missing', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signin')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .send(users.user4)
    .end((err, res) => {
      expect(res.status).to.equal(409);
      done();
    })
  });
  it('should return error if unable to verify password', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signin')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .send(users.user6)
    .end((err, res) => {
      expect(res.status).to.equal(401);
      done();
    });
  });
});
describe('add gif', () => {
  it('should check image and title are available', (done) => {
    chai.request(server)
    .post('/api/v1/gifs')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .send(gifModel.gif1)
    .end((err, res) => {
      expect(res.status).to.equal(409);
      if (err) return done(err);
      done();
    });
  });
});

describe('add article', () => {
  it('should check article and title are available', (done) => {
    chai.request(server)
    .post('/api/v1/articles')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .send(articleModel.article1)
    .end((err, res) => {
      expect(res.status).to.equal(409);
      if (err) return done(err);
      done();
    });
  });
  // travis key => OHwQhctSnfmGbE8T8wmR6A
  it('should upload article', (done) => {
    chai.request(server)
    .post('/api/v1/articles')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .send(articleModel.article2)
    .end((err, res) => {
      expect(res.status).to.equal(201);
      if (err) return done(err);
      done();
    });
  });
});

describe('edit article', () => {
  it('should edit an article', (done) => {
    chai.request(server)
    .patch('/api/v1/articles/8')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .send(articleModel.article3)
    .end((err, res) => {
      expect(res.status).to.equal(201);
      if (err) return done(err);
      done();
    });
  });
});

describe('delete article', () => {
  it('should delete an article', (done) => {
    chai.request(server)
    .delete('/api/v1/articles/88')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .end((err, res) => {
      expect(res.status).to.equal(403);
      if (err) return done(err);
      done();
    });
  });
});

describe('view article', () => {
  it('should view a specific article', (done) => {
    chai.request(server)
    .get('/api/v1/articles/4')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .end((err, res) => {
      expect(res.status).to.equal(200);
      if (err) return done(err);
      done();
    });
  });
});

describe('view gif', () => {
  it('should view a specific gif', (done) => {
    chai.request(server)
    .get('/api/v1/gifs/136')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .end((err, res) => {
      expect(res.status).to.equal(200);
      if (err) return done(err);
      done();
    });
  });
});

describe('delete gif', () => {
  it('should delete a gif', (done) => {
    chai.request(server)
    .get('/api/v1/gifs/10')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .end((err, res) => {
      expect(res.status).to.equal(404);
      if (err) return done(err);
      done();
    });
  });
});

describe('add article comment', () => {
  it('should add a new comment to article', (done) => {
    chai.request(server)
    .post('/api/v1/articles/1/comments')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .send({
      comment: 'example comment',
    })
    .end((err, res) => {
      expect(res.status).to.equal(201);
      if (err) return done(err);
      done();
    });
  });
});
describe('add gif comment', () => {
  it('should add a new comment to gif', (done) => {
    chai.request(server)
    .post('/api/v1/gifs/136/comments')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .send({
      comment: 'example comment',
    })
    .end((err, res) => {
      expect(res.status).to.equal(201);
      if (err) return done(err);
      done();
    });
  });
});

describe('feed', () => {
  it('should display user feed', (done) => {
    chai.request(server)
    .get('/api/v1/feed')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .end((err, res) => {
      expect(res.status).to.equal(200);
      if (err) return done(err);
      done();
    });
  });
})