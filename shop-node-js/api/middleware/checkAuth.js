const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(req.headers.authorization);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Auth Failed',
    });
  }
};
