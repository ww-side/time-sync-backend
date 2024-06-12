export type JwtPayloadType = {
  userId: string;
  username: string;
};

export type RefreshJwtPayloadType = JwtPayloadType & { refreshToken: string };

export type TokenType = {
  accessToken: string;
  refreshToken: string;
};
