import jwt from 'jsonwebtoken';

import config from '../config';

const checkToken = (req, res, next) => {
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
        req.decoded = decoded;  //{ this.state.article.map((article, key) => (<article className = 'article-article' key = { article.id }>{ article.article }</article>)) } https://res.cloudinary.com/dzdqe8iow/image/upload/v1573523580/
                // this.state.feed.map((item, key) => <article key = {item.id}>{item.imageUrl}</article>)
        next();
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'No token'
    });
  }
};

export default checkToken;
