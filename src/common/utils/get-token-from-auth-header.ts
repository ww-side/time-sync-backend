export function getTokenFromAuthHeader(authHeader: string) {
  return authHeader.split(' ')[1];
}
