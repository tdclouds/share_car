import jsCookie from 'js-cookie';

export function getToken(): string {
  return jsCookie.get('crypt_token') || '';
}

export function setToken(token: string, expires: string): void {
  jsCookie.set('crypt_token', token, {
    expires: new Date(expires),
  });
}

export function removeToken(): void {
  jsCookie.remove('crypt_token');
}
