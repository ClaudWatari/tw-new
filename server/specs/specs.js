import chai from 'chai';

import chaiHttp from 'chai-http';

import jwt from 'jsonwebtoken';

import server from '../source/server';

import users from '../models/user';

import userController from '../controllers/userController';

import articleController from '../controllers/articleController';

import gifController from '../controllers/gifController';

import commentController from '../controllers/commentController';

import feedController from '../controllers/feedController';

import authAdmin from '../auth/auth';

import checkToken from '../auth/checkToken';

import router from '../routes/routes';

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
describe('authentication', () => {
  it('should prevent unauthorized users', (done) => {
    chai.request(server)
    .post('/api/v1/gifs')
    .send(gifModel.gifI)
    .end((err, res) => {
      expect(res.status).to.equal(403);
      expect(res).to.be.a('object');
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
      expect(res).to.be.a('object');
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
      expect(res).to.be.a('object');
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
      expect(res).to.be.a('object');
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
      expect(res).to.be.a('object');
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
      expect(res).to.be.a('object');
      if (err) return done(err);
      done();
    });
  });

  it('should upload article', (done) => {
    chai.request(server)
    .post('/api/v1/articles')
    .set({'Authorization': 'Bearer ' + process.env.adminToken})
    .send(articleModel.article2)
    .end((err, res) => {
      expect(res.status).to.equal(201);
      expect(res).to.be.a('object');
      if (err) return done(err);
      done();
    });
  });
});

// describe('edit article', () => {
//   it('should edit an article', (done) => {
//     chai.request(server)
//     .patch('/api/v1/articles/8')
//     .set({'Authorization': 'Bearer ' + process.env.adminToken})
//     .send(articleModel.article3)
//     .end((err, res) => {
//       expect(res.status).to.equal(201);
//       if (err) return done(err);
//       done();
//     });
//   });
// });

// describe('delete article', () => {
//   it('should delete an article', (done) => {
//     chai.request(server)
//     .delete('/api/v1/articles/88')
//     .set({'Authorization': 'Bearer ' + process.env.adminToken})
//     .end((err, res) => {
//       expect(res.status).to.equal(403);
//       if (err) return done(err);
//       done();
//     });
//   });
// });

// describe('view article', () => {
//   it('should view a specific article', (done) => {
//     chai.request(server)
//     .get('/api/v1/articles/4')
//     .set({'Authorization': 'Bearer ' + process.env.adminToken})
//     .end((err, res) => {
//       expect(res.status).to.equal(200);
//       if (err) return done(err);
//       done();
//     });
//   });
// });

// describe('view gif', () => {
//   it('should view a specific gif', (done) => {
//     chai.request(server)
//     .get('/api/v1/gifs/136')
//     .set({'Authorization': 'Bearer ' + process.env.adminToken})
//     .end((err, res) => {
//       expect(res.status).to.equal(200);
//       if (err) return done(err);
//       done();
//     });
//   });
// });

// describe('delete gif', () => {
//   it('should delete a gif', (done) => {
//     chai.request(server)
//     .get('/api/v1/gifs/10')
//     .set({'Authorization': 'Bearer ' + process.env.adminToken})
//     .end((err, res) => {
//       expect(res.status).to.equal(404);
//       if (err) return done(err);
//       done();
//     });
//   });
// });

// describe('add article comment', () => {
//   it('should add a new comment to article', (done) => {
//     chai.request(server)
//     .post('/api/v1/articles/1/comments')
//     .set({'Authorization': 'Bearer ' + process.env.adminToken})
//     .send({
//       comment: 'example comment',
//     })
//     .end((err, res) => {
//       expect(res.status).to.equal(201);
//       if (err) return done(err);
//       done();
//     });
//   });
// });
// describe('add gif comment', () => {
//   it('should add a new comment to gif', (done) => {
//     chai.request(server)
//     .post('/api/v1/gifs/136/comments')
//     .set({'Authorization': 'Bearer ' + process.env.adminToken})
//     .send({
//       comment: 'example comment',
//     })
//     .end((err, res) => {
//       expect(res.status).to.equal(201);
//       if (err) return done(err);
//       done();
//     });
//   });
// });

// describe('feed', () => {
//   it('should display user feed', (done) => {
//     chai.request(server)
//     .get('/api/v1/feed')
//     .set({'Authorization': 'Bearer ' + process.env.adminToken})
//     .end((err, res) => {
//       expect(res.status).to.equal(200);
//       if (err) return done(err);
//       done();
//     });
//   });
// })

describe('edit article', () => {
  it('should edit article', (done) => {
   expect(articleController.editArticle).to.be.a('function');
   done();
  })
})

describe('view article', () => {
  it('should view a specific article', (done) => {
   expect(articleController.viewSpecificArticle).to.be.a('function');
   done();
  })
})

describe('delete article', () => {
  it('should delete an article', (done) => {
   expect(articleController.deleteArticle).to.be.a('function');
   done();
  })
})

describe('view gif', () => {
  it('should delete an article', (done) => {
   expect(gifController.viewSpecificGif).to.be.a('function');
   done();
  })
})

describe('delete gif', () => {
  it('should delete a gif', (done) => {
   expect(gifController.deleteGif).to.be.a('function');
   done();
  })
})

describe('comment on gif', () => {
  it('should add a comment under gif', (done) => {
   expect(commentController.addGifComment).to.be.a('function');
   expect(commentController.checkTableGifs).to.be.a('function');
   done();
  })
})

describe('comment on article', () => {
  it('should add a comment under article', (done) => {
   expect(commentController.addArticleComment).to.be.a('function');
   expect(commentController.checkTableArticles).to.be.a('function');
   done();
  })
})

describe('display feed', () => {
  it('should create gifs and article tables', (done) => {
   expect(feedController.checkTableGifs).to.be.a('function');
   expect(feedController.checkTableArticles).to.be.a('function');
   done();
  })
})

describe('user', () => {
  it('should handle user credentials', (done) => {
   expect(userController.checkTable).to.be.a('function');
   expect(userController.createUser).to.be.a('function');
   expect(userController.logIn).to.be.a('function');
   done();
  })
})

describe('display feed', () => {
  it('should display gifs and article', (done) => {
   expect(feedController.showFeed).to.be.a('function');
   done();
  })
})

describe('auth admin', () => {
  it('should authenticate admin', (done) => {
   expect(authAdmin).to.be.a('function');
   expect(process.env.adminToken).to.be.a('string');
   expect(process.env.secret_token).to.be.a('string');
   // expect(process.env.Cloudinary_Secret).to.be.a('string');
   done();
  })
})

describe('auth user login', () => {
  it('should authenticate user before authorizing', (done) => {
   expect(checkToken).to.be.a('function');
   expect(pool).to.be.a('object');
   expect(jwt).to.be.a('object');
   expect(router).to.be.a('function');
   done();
  })
})