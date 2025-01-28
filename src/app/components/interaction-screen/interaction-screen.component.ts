import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService, Prova } from '../../services/data.service';
import { forkJoin } from 'rxjs';

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
  idProvaSelecionada: number | null = null;
  provaSelecionada: Prova | null = null;
  modalAberto: boolean = false;
  modalEstatisticasAberto: boolean = false;
  modalQuestoesAberto: boolean = false;
  estatisticas: { totalProvas: number; totalQuestoes: number; totalUsuarios: number;} = {
    totalProvas: 0,
    totalQuestoes: 0,
    totalUsuarios: 0,
  };

  listaProvas: { id: number; nome: string }[] = [];
  alternativas: string[] = ['', '', '', '', ''];

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
      this.estatisticas.totalQuestoes = questoes.length | 0;
    });
    this.dataService.buscarUsuarios().subscribe({
      next: (quantidade) => {
        this.estatisticas.totalUsuarios = quantidade;
      }
    })
  }

  carregarProvas(): void {
    this.dataService.getProvas().subscribe((provas) => {
      this.listaProvas = provas.map((prova: any) => ({
        id: prova.id,
        nome: prova.nome,
      }));
    });
  }

  salvarQuestao(): void {
    if (!this.idProvaSelecionada) {
      alert('Selecione uma prova.');
      return;
    }
  
    if (!this.enunciadoQuestao.trim()) {
      alert('O enunciado da questão não pode estar vazio.');
      return;
    }
  
    const alternativasValidas = this.alternativas.filter((alt) => alt.trim().length > 0);
    if (alternativasValidas.length < 5) {
      alert('Por favor, preencha todas as 5 alternativas.');
      return;
    }
  
    this.dataService.buscarProvaPorId(this.idProvaSelecionada).subscribe({
      next: (prova) => {
        if (!prova) {
          alert('Prova não encontrada.');
          return;
        }
  
        this.dataService.cadastrarQuestao(this.enunciadoQuestao, prova.id).subscribe({
          next: (novaQuestao) => {
            console.log('Questão cadastrada com sucesso:', novaQuestao);
  
            forkJoin(
              alternativasValidas.map((alternativa) =>
                this.dataService.cadastrarResposta(novaQuestao.id, alternativa)
              )
            ).subscribe({
              next: (respostas) => {
                console.log('Alternativas cadastradas com sucesso:', respostas);
                alert('Questão e alternativas cadastradas com sucesso!');
                this.fecharModalQuestoes();
                this.enunciadoQuestao = '';
                this.alternativas = ['', '', '', '', ''];
              },
              error: (err) => {
                console.error('Erro ao cadastrar alternativas:', err);
                alert('Erro ao cadastrar as alternativas.');
              },
            });
          },
          error: (err) => {
            console.error('Erro ao cadastrar a questão:', err);
            alert('Erro ao cadastrar a questão.');
          },
        });
      },
      error: (err) => {
        console.error('Erro ao buscar prova:', err);
        alert('Erro ao buscar a prova selecionada.');
      },
    });
  }
}