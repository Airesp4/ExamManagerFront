import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

export interface User {
  id: number | null;
  username: string;
  password: string;
  dataNascimento: string;
  role: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/auth';
  
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    const data = {
      login: username,
      password: password,
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data, { headers });
  }
  

  cadastrarUsuario(username: string, password: string, dataNascimento: string): Observable<any> {

    const dataFormatada = format(new Date(dataNascimento), 'yyyy-MM-dd');
  
    const data = {
      login: username,
      password: password,
      dateBirth: dataFormatada,
      role: 'USER',
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    return this.http.post(`${this.apiUrl}/register`, data, { headers });
  }  
}