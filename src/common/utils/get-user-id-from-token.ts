import { JwtService } from '@nestjs/jwt';

export function getUserIdFromToken(token: string, jwtService: JwtService) {
  try {
    const decodedToken = jwtService.decode(token);
    return { userId: decodedToken.userId as string };
  } catch (e) {
    throw new Error('Invalid token');
  }
}
