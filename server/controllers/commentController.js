import dotenv from 'dotenv';

import jwt from 'jsonwebtoken';

import { pool } from '../config';

dotenv.config();

const checkTableGifs = (req, res, next) => {
  const query = `CREATE TABLE gifComments (commentId SERIAL PRIMARY KEY,
    comment VARCHAR(255), madeBy VARCHAR(50), Ogif INT,
    commentedOn DATE DEFAULT CURRENT_DATE)`;

  pool.query(query, (err, res) => {
    if(err) throw err;
    else next();
  });
};

const checkTableArticles = (req, res, next) => {
  const query = `CREATE TABLE articleComments (commentId SERIAL PRIMARY KEY,
    comment VARCHAR(255), madeBy VARCHAR(50), Oarticle INT,
    commentedOn DATE DEFAULT CURRENT_DATE)`;

  pool.query(query, (err, res) => {
    if(err) throw err;
    else next();
  });
};

let loggedUser;

const checkUser = (req, res, next) => {
  let token = req.header('authorization');
  if (token) {
    token = token.split(' ')[1];
    jwt.verify(token, process.env.secret_token, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({
          success: false,
          message: 'Invalid token'
        });
      } else {
        req.decoded = decoded;
        console.log(req.decoded);
        loggedUser = req.decoded.email;
        console.log(loggedUser);
        next();
        return loggedUser;
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'No token'
    });
  }
}

const loggedUserName = (req, res, next) => {
  pool.query('SELECT name FROM users WHERE email = ($1)', [loggedUser], (errored, ok) => {
    if(errored) throw errored;
    return loggedUser = ok.rows[0].name; next();
  });
}

const addGifComment = (req, res) => {
  const OgifId = req.params.gifId;
  const comment = req.body;
  if(!comment) {
    res.status(409).json({
      'message': 'comment required',
    });
  }

  pool.query('SELECT * FROM gifs WHERE gifId = $1', [OgifId], (err, result) => {
    if(err) throw err;
    if(result.rows.length < 1) {
      res.status(403).json({
        'error': 'unable to comment',
      })
    }
    pool.query('INSERT INTO gifComments (comment, madeBy, Ogif) VALUES ($1, $2, $3)', [comment, loggedUser, OgifId], (e, r) => {
      if(e) throw e;
      res.status(201).json({
        'success': true,
        'data': {
          'message': 'comment added successfully',
        }
      })
    })
  })
}

const addArticleComment = (req, res) => {
  const OarticleId = req.params.articleId;
  const comment = req.body.comment;
  const OarticleId_ = req.body.articleid;
  const loggedUser_ = req.body.loggedUser;
  if(!comment) {
    res.status(409).json({
      'message': 'comment required',
    });
  }

  // pool.query('SELECT * FROM articleComments WHERE Oarticle = $1', [OarticleId], (err, result) => {
  //   if(err) throw err;
  //   if(result.rows.length < 1) {
  //     return res.status(403).json({
  //       'error': 'unable to comment',
  //     })
  //   }
    pool.query('INSERT INTO articleComments (comment, madeBy, Oarticle) VALUES ($1, $2, $3)', [comment, loggedUser_, OarticleId_], (e, r) => {
      if(e) throw e;
      res.status(201).json({
        'success': true,
        'data': {
          'message': 'comment added successfully',
          'comment': comment,
          'madeBy': loggedUser,
        }
      })
    })
};

export default {
	addGifComment, addArticleComment, checkTableArticles, checkTableGifs
}