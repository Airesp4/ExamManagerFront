import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { DataService, Prova, Questao } from '../../services/data.service';
import { SearchService } from '../../services/search.service';
import { forkJoin } from 'rxjs';
import { PdfService } from '../../services/pdf.service';
import { NotificacaoService } from '../../services/notificacao.service';

@Component({
  selector: 'app-info-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [HttpClient],
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.css']
})
export class InfoScreenComponent implements OnInit {

  provas: Prova[] = [];
  provasFiltradas: Prova[] = [];
  provaSelecionada: Prova | null = null;
  questaoSelecionada: Questao | null = null;

  editando: boolean = false;
  confirmarExclusao: boolean = false;
  modalInserirQuestoesAberto: boolean = false;

  enunciado: string = '';
  alternativas: string[] = ['', '', '', '', ''];

  constructor(
    private dataService: DataService,
    private searchService: SearchService,
    private pdfService: PdfService,
    private notificaService: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.carregarProvas();

    this.searchService.pesquisa$.subscribe((texto) => {
      this.filtrarProvas(texto);
    });
  }

  carregarProvas(): void {
    this.dataService.getProvas().subscribe({
      next: (dados) => {
        this.provas = dados;
        this.provasFiltradas = dados;
  
        this.provas.forEach((prova) => {
          prova.numQuestao = prova.questoes ? prova.questoes.length : 0;

          if(prova.dataCriacao){
            const [ano, mes, dia] = prova.dataCriacao.split('-');
            prova.dataCriacao = `${dia}/${mes}/${ano}`;
          }
        });
      },
      error: (erro) => {
        this.notificaService.erro('Erro ao buscar provas:', erro);
      }
    });
  }

  filtrarProvas(texto: string): void {
    const filtro = texto.toLowerCase();
    this.provasFiltradas = this.provas.filter((prova) =>
      prova.nome.toLowerCase().includes(filtro)
    );
  }

  exibirDetalhes(prova: Prova): void {
    this.provaSelecionada = prova;
  }

  salvarAlteracoes(): void {
    if (this.provaSelecionada) {
      const id = this.provaSelecionada.id;
      this.dataService.atualizarProva(id, this.provaSelecionada).subscribe({
        next: (updatedProva) => {
          this.fechar('modal');
        },
        error: (err) => {
          this.notificaService.erro('Erro ao atualizar a prova.');
        }
      });
    } else {
      this.notificaService.aviso('Nenhuma prova selecionada para atualizar.');
    }
  }

  efetuarExclusao(): void {
    if (this.provaSelecionada?.id) {
      const id = this.provaSelecionada.id;

      this.dataService.excluirProva(id).subscribe({
        next: () => {
          this.notificaService.sucesso('Prova exluída com sucesso!');
          this.fechar('modal');
          this.carregarProvas();
        },
        error: (err) => {
          this.notificaService.erro('Erro ao excluir a prova.');
        }
      });
    } else {
      this.notificaService.erro('Nenhuma prova selecionada para exclusão.')
    }
  }

  abrirMenuQuestao(questao: Questao): void {
    this.questaoSelecionada = questao;
  }

  fecharMenuQuestao(): void {
    this.fechar('menuQuestao');
  }

  atualizarQuestao(): void {
    if (this.questaoSelecionada?.enunciado) {
      this.dataService
        .atualizarQuestao(this.questaoSelecionada.id, this.questaoSelecionada.enunciado)
        .subscribe(() => {

          const questaoAtualizada = this.provaSelecionada?.questoes?.find(
            (q) => q.id === this.questaoSelecionada?.id
          );
          if (questaoAtualizada) {
            questaoAtualizada.enunciado = this.questaoSelecionada!.enunciado;
          }

          this.fechar('menuQuestao');
          this.carregarProvas();
        });
    }
  }

  excluirQuestao(): void {
    if (this.questaoSelecionada) {
      this.dataService.excluirQuestao(this.questaoSelecionada.id).subscribe(() => {
        if (this.provaSelecionada?.questoes) {
          this.provaSelecionada.questoes = this.provaSelecionada.questoes.filter(
            (q) => q.id !== this.questaoSelecionada?.id
          );
          this.provaSelecionada!.numQuestao = this.provaSelecionada.questoes.length || 0;
        }

        this.fechar('menuQuestao');
        this.carregarProvas();
      });
    }
  }

  inserirNovaQuestao(): void {
    this.modalInserirQuestoesAberto = true;
  }

  salvarQuestao(): void {

    if (!this.provaSelecionada?.id || !this.enunciado) {
      this.notificaService.aviso('Enunciado da questão ou prova não selecionada.');
      return;
    }
  
    this.dataService.cadastrarQuestao(this.enunciado, this.provaSelecionada.id).subscribe({
      next: (novaQuestao) => {
  
        const alternativasValidas = this.alternativas.filter((alternativa) => alternativa.trim().length > 0);
  
        forkJoin(
          alternativasValidas.map((alternativa) =>
            this.dataService.cadastrarResposta(novaQuestao.id, alternativa)
          )
        ).subscribe({
          next: (respostas) => {
  
            novaQuestao.respostas = respostas;
  
            if (this.provaSelecionada) {
              this.provaSelecionada.questoes = this.provaSelecionada.questoes || [];
              this.provaSelecionada.questoes.push(novaQuestao);
              this.provaSelecionada.numQuestao = this.provaSelecionada.questoes.length;
            }
  
            this.fechar('modalInserirQuestao');
            this.enunciado = '';
            this.alternativas = ['', '', '', '', ''];
          },
          error: (err) => {
            this.notificaService.erro('Erro ao cadastrar respostas:', err);
          }
        });
      },
      error: (err) => {
        this.notificaService.erro('Erro ao adicionar a questão:', err);
      }
    });
  }

  fechar(elemento: 'modal' | 'menuQuestao' | 'modalInserirQuestao'): void {
    switch (elemento) {
      case 'modal':
        this.provaSelecionada = null;
        this.editando = false;
        this.confirmarExclusao = false;
        break;

      case 'menuQuestao':
        this.questaoSelecionada = null;
        break;

      case 'modalInserirQuestao':
        this.modalInserirQuestoesAberto = false;
        break;

      default:
        this.notificaService.aviso('Tipo de elemento não reconhecido');
        break;
    }
  }

  ativarEdicao(): void {
    this.editando = true;
  }

  desativarEdicao(): void {
    this.editando = false;
  }

  getLetraAlternativa(i: number): string {
    return String.fromCharCode(97 + i);
  }

  atualizarResposta(): void {
    if (this.questaoSelecionada) {
      const respostas = this.questaoSelecionada.respostas;
  
      respostas.forEach(resposta => {
        this.dataService.atualizarResposta(resposta.id, resposta.descricao).subscribe({
          next: (response) => {
            this.notificaService.sucesso('Resposta atualizada!');
          }
        });
      });
    }
  }

  salvarMudancas(): void {
    this.atualizarResposta();
    this.atualizarQuestao();
  }

  baixarArquivo() {
    if (this.provaSelecionada) {
      this.pdfService.baixarArquivo(this.provaSelecionada);
    }
  }
}