import jwt from './jwt.js';

export default function checkAuth(req, res, next) {
  const token = req.get('Authorization');

  if(!token) {
    res.status(401).json({ error: 'no authorization found' });
    return;
  }

  let payload = null;
  try {
    payload = jwt.verify(token);
  }
  catch(err) {
    console.log('v******erify error', err);
    // this code runs when verify fails
    res.status(401).json({ error: 'invalid token' });
    return;
  }

  req.userId = payload.id;
  next();
}
