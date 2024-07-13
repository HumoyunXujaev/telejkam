import jwt from 'jsonwebtoken';

export const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    // make the token expire in 7 days
    expiresIn: '7d',
  });
};

export const createResetToken = (payload) => {
  return jwt.sign(payload, process.env.RESET_TOKEN_SECRET, {
    // make the token expire in 7 days
    expiresIn: '7d',
  });
};
