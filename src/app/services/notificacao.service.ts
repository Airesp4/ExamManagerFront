import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  constructor(private toastr: ToastrService) {}

  sucesso(mensagem: string, titulo: string = 'Sucesso') {
    this.toastr.success(mensagem, titulo);
  }

  erro(mensagem: string, titulo: string = 'Erro') {
    this.toastr.error(mensagem, titulo);
  }

  aviso(mensagem: string, titulo: string = 'Aviso') {
    this.toastr.warning(mensagem, titulo);
  }
}
