import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const creatToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);

  return token;
};

export const jwtUtils = { creatToken };
