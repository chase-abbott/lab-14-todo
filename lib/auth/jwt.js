import jsonwebtoken from 'jsonwebtoken';
const APP_SECRET = process.env.APP_SECRET || 'CHANGEMENOW';

const jwt = {
  sign(profile) {
    return jsonwebtoken.sign({ id: profile.id }, APP_SECRET);
  },
  verify(token) {
    return jsonwebtoken.verify(token, APP_SECRET);
  }
};

export default jwt;
