import jwt from "jsonwebtoken";

export function validTokenForgotPassword(token: string) {
  try {
    jwt.verify(token, String(process.env.SECRET_FORGOT_PASSWORD));

    return true;
  } catch (err) {
    return false;
  }
}
