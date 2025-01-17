import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

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
  modalEstatisticasAberto = false;
  estatisticas: { totalProvas: number; totalQuestoes: number } = {
    totalProvas: 0,
    totalQuestoes: 0,
  };

  @Output() sectionChange = new EventEmitter<string>();

  constructor(
      private dataService: DataService
    ) {}

  abrirModal(): void {
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  abrirModalEstatisticas() {
    this.modalEstatisticasAberto = true;

    this.carregarEstatisticas();
  }

  fecharModalEstatisticas() {
    this.modalEstatisticasAberto = false;
  }

  emitirSectionChange(section: string) {
    this.sectionChange.emit(section);
  }
  
  cadastrarProva(): void {
    if (this.nomeProva.trim() && this.descricaoProva.trim()) {
          this.dataService.cadastrarProva(this.nomeProva, this.descricaoProva).subscribe({
              next: (prova) => {
                  console.log('Prova cadastrada com sucesso:', prova);
                  this.nomeProva = '';
                  this.descricaoProva = '';
                  this.fecharModal();
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

  carregarEstatisticas(): void {
    // Obter o total de provas
    this.dataService.getProvas().subscribe((provas) => {
      
      this.estatisticas.totalProvas = provas.length;
    });
  }
}
