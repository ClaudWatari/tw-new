import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
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
        if(req.decoded.admin === 'true') return next();
        else {
          return res.status(403).json({
            message: 'Unauthorized access',
          })
        }
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'No token'
    });
  }
};

export default authAdmin;
