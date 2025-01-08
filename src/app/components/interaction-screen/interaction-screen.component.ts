import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-interaction-screen',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './interaction-screen.component.html',
  styleUrl: './interaction-screen.component.css'
})
export class InteractionScreenComponent {
  nomeProva: string = '';
  descricaoProva: string = '';
  modalAberto: boolean = false;

  constructor(
      private dataService: DataService
    ) {}

  abrirModal(): void {
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  cadastrarProva(): void {
    if (this.nomeProva.trim() && this.descricaoProva.trim()) {
        this.dataService.cadastrarProva(this.nomeProva, this.descricaoProva).subscribe({
            next: (prova) => {
                console.log('Prova cadastrada com sucesso:', prova);
                this.nomeProva = ''; // Limpa o campo de entrada
                this.descricaoProva = ''; // Limpa o campo de descrição
                this.fecharModal(); // Fecha o modal
            },
            error: (err) => {
                console.error('Erro ao cadastrar prova:', err);
                alert('Ocorreu um erro ao cadastrar a prova. Por favor, tente novamente.');
            }
        });
    } else {
        alert('Por favor, insira o nome e a descrição da prova.');
    }
}
  
}
