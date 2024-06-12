import { JwtService } from '@nestjs/jwt';

export function getUserIdFromToken(token: string, jwtService: JwtService) {
  try {
    const decodedToken = jwtService.decode(token);
    console.log('@decoded token', decodedToken);
    return { userId: decodedToken.userId as string };
  } catch (e) {
    console.log('catch error: ', e);
    throw new Error('Invalid token');
  }
}
