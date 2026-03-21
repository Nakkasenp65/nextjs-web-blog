import jwt, { SignOptions } from "jsonwebtoken";

export function signJwtToken(payload: string | Buffer | object, options: SignOptions = {}) {
  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign(payload, secret, options);
  return token;
}

export function verifyJwtToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
}
