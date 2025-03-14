import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService, Prova } from '../../services/data.service';
import { forkJoin } from 'rxjs';
import { NotificacaoService } from '../../services/notificacao.service';

@Component({
  selector: 'app-interaction-screen',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './interaction-screen.component.html',
  styleUrls: ['./interaction-screen.component.css'],
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

  constructor(private dataService: DataService,
    private notificaService: NotificacaoService
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
          this.notificaService.sucesso('Prova cadastrada!')
          this.nomeProva = '';
          this.descricaoProva = '';
          this.fecharModal();
        },
        error: () => {
          this.notificaService.erro('Ocorreu um erro ao cadastrar a prova. Nome de Prova já cadastrado.');
        },
      });
    } else {
      this.notificaService.aviso('Por favor, insira o nome e a descrição da prova.');
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

  salvarQuestao(): void {
    if (!this.idProvaSelecionada) {
      this.notificaService.aviso('Selecione uma prova.');
      return;
    }
  
    if (!this.enunciadoQuestao.trim()) {
      this.notificaService.aviso('O enunciado da questão não pode estar vazio.');
      return;
    }
  
    const alternativasValidas = this.alternativas.filter((alt) => alt.trim().length > 0);
    if (alternativasValidas.length < 5) {
      this.notificaService.aviso('Por favor, preencha todas as 5 alternativas.');
      return;
    }
  
    this.dataService.buscarProvaPorId(this.idProvaSelecionada).subscribe({
      next: (prova) => {
        if (!prova) {
          this.notificaService.erro('Prova não encontrada.');
          return;
        }
  
        this.dataService.cadastrarQuestao(this.enunciadoQuestao, prova.id).subscribe({
          next: (novaQuestao) => {
            forkJoin(
              alternativasValidas.map((alternativa) =>
                this.dataService.cadastrarResposta(novaQuestao.id, alternativa)
              )
            ).subscribe({
              next: () => {
                this.notificaService.sucesso('Questão cadastrada com sucesso!');
                this.fecharModalQuestoes();
                this.enunciadoQuestao = '';
                this.alternativas = ['', '', '', '', ''];
              },
              error: () => {
                this.notificaService.erro('Erro ao cadastrar as alternativas.');
              },
            });
          },
          error: () => {
            this.notificaService.erro('Erro ao cadastrar a questão.');
          },
        });
      },
      error: () => {
        this.notificaService.erro('Erro ao buscar a prova selecionada.');
      },
    });
  }
}