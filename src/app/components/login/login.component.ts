import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginFailed: boolean = false;

  newUsername: string = '';
  newPassword: string = '';
  newDateBirth: string = '';
  modalCadastroAberto: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.username && this.password) {

      this.userService.login(this.username, this.password).subscribe({
        next: (response) => {
          const token = response.token;

          if (token) {
            this.authService.setToken(token);
            this.router.navigate(['/home']);
          } else {
            console.error('Token não encontrado na resposta.');
            this.loginFailed = true;
          }
        },
        error: (err) => {
          console.error('Erro ao logar usuário:', err);
          this.loginFailed = true;
        }
      });
    } else {
      console.error('Preencha todos os campos para o login');
      this.loginFailed = true;
    }
  }

  abrirModalCadastro() {
    this.modalCadastroAberto = true;
  }

  fecharModalCadastro() {
    this.modalCadastroAberto = false;
  }

  onCadastrar() {
    if (this.newUsername && this.newPassword && this.newDateBirth) {
      this.userService.cadastrarUsuario(this.newUsername, this.newPassword, this.newDateBirth).subscribe({
        next: () => {
          console.log('Usuário cadastrado com sucesso!');
          this.fecharModalCadastro();
        },
        error: (err) => {
          console.error('Erro ao cadastrar usuário:', err);
        }
      });
    } else {
      console.log('Preencha todos os campos para o cadastro');
    }
  }
}