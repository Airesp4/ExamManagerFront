import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginFailed: boolean = false;

  newUsername: string = '';
  newPassword: string = '';
  newDateBirth: string = '';
  modalCadastroAberto: boolean = false;

  onSubmit() {
    // Lógica de login
    console.log('Tentativa de login:', this.username, this.password);
    // Simule falha de login para exibir a mensagem de erro
    this.loginFailed = true; // Atualize conforme a lógica real
  }

  abrirModalCadastro() {
    this.modalCadastroAberto = true;
  }

  fecharModalCadastro() {
    this.modalCadastroAberto = false;
  }

  onCadastrar() {
    // Lógica para salvar o novo usuário
    console.log('Cadastro de usuário:', {
      username: this.newUsername,
      password: this.newPassword,
      dateBirth: this.newDateBirth,
    });

    // Fechar modal após cadastro
    this.fecharModalCadastro();
  }
}
