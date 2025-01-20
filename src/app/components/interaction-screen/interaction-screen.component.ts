import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-interaction-screen',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './interaction-screen.component.html',
  styleUrl: './interaction-screen.component.css',
})
export class InteractionScreenComponent {
  nomeProva: string = '';
  descricaoProva: string = '';
  enunciadoQuestao: string = '';
  provaSelecionada: number | null = null;
  modalAberto: boolean = false;
  modalEstatisticasAberto: boolean = false;
  modalQuestoesAberto: boolean = false;
  estatisticas: { totalProvas: number; totalQuestoes: number } = {
    totalProvas: 0,
    totalQuestoes: 0,
  };

  listaProvas: { id: number; nome: string }[] = [];

  @Output() sectionChange = new EventEmitter<string>();

  constructor(private dataService: DataService) {}

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

  abrirModalQuestoes() {
    this.modalQuestoesAberto = true;
    this.carregarProvas();
  }

  fecharModalQuestoes() {
    this.modalQuestoesAberto = false;
    this.provaSelecionada = null;
    this.enunciadoQuestao = '';
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
        },
      });
    } else {
      alert('Por favor, insira o nome e a descrição da prova.');
    }
  }

  carregarEstatisticas(): void {
    this.dataService.getProvas().subscribe((provas) => {
      this.estatisticas.totalProvas = provas.length;
    });
    this.dataService.getQuestoes().subscribe((questoes) => {
      this.estatisticas.totalQuestoes = questoes.length;
    });
  }

  carregarProvas(): void {
    this.dataService.getProvas().subscribe((provas) => {
      this.listaProvas = provas.map((prova: any) => ({
        id: prova.id,
        nome: prova.nome,
      }));
    });
  }

  adicionarQuestao(): void {
    if (!this.provaSelecionada || !this.enunciadoQuestao.trim()) {
      alert('Por favor, selecione uma prova e insira o enunciado da questão.');
      return;
    }

    const prova_Id = this.provaSelecionada;
    const enunciado = this.enunciadoQuestao;

    this.dataService.cadastrarQuestao(enunciado, prova_Id).subscribe({
      next: (questao) => {
        console.log('Questão cadastrada com sucesso:', questao);
        this.fecharModalQuestoes();
      },
      error: (err) => {
        console.error('Erro ao cadastrar questão:', err);
        alert('Ocorreu um erro ao cadastrar a questão. Por favor, tente novamente.');
      },
    });
  }
}