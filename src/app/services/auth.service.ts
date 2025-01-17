import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'authToken';

  constructor() {}

  setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      console.log('Token armazenado com sucesso!');
    } catch (error) {
      console.error('Erro ao armazenar o token:', error);
    }
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao recuperar o token:', error);
      return null;
    }
  }

  clearToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      console.log('Token removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover o token:', error);
    }
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}

