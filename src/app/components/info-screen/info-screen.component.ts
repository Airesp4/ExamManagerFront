import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { DataService, Prova, Questao } from '../../services/data.service';
import { SearchService } from '../../services/search.service';
import { forkJoin } from 'rxjs';

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
    private searchService: SearchService
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
          prova.numQuestao = prova.questoes.length || 0;
        });
      },
      error: (erro) => {
        console.error('Erro ao buscar provas:', erro);
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
          console.log('Prova atualizada com sucesso:', updatedProva);
          this.fecharModal();
        },
        error: (err) => {
          console.error('Erro ao atualizar a prova:', err);
        }
      });
    } else {
      console.error('Nenhuma prova selecionada para atualizar');
    }
  }

  efetuarExclusao(): void {
    if (this.provaSelecionada?.id) {
      const id = this.provaSelecionada.id;

      this.dataService.excluirProva(id).subscribe({
        next: () => {
          console.log('Prova excluída com sucesso:');
          this.fecharModal();
          this.carregarProvas();
        },
        error: (err) => {
          console.error('Erro ao excluir a prova:', err);
        }
      });
    } else {
      console.error('Nenhuma prova selecionada para exclusão.');
    }
  }

  abrirMenuQuestao(questao: Questao): void {
    this.questaoSelecionada = questao;
  }

  fecharMenuQuestao(): void {
    this.questaoSelecionada = null;
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

          this.fecharMenuQuestao();
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
        
        this.fecharMenuQuestao();
        this.carregarProvas();
      });
    }
  }

  inserirNovaQuestao(): void {
    this.modalInserirQuestoesAberto = true;
  }

  salvarQuestao(): void {
    if (this.provaSelecionada?.id && this.enunciado) {

      this.dataService.cadastrarQuestao(this.enunciado, this.provaSelecionada!.id).subscribe({
        next: (novaQuestao) => {
          console.log('Questão cadastrada com sucesso:', novaQuestao);
  
          this.alternativas
            .filter((alternativa) => alternativa.trim().length > 0)
            .forEach((alternativa, index) => {

              this.dataService.cadastrarResposta(novaQuestao.id, alternativa).subscribe({
                next: (resposta) => {
                  console.log('Resposta cadastrada com sucesso:', resposta);
  
                  if (index === 4 || index === this.alternativas.length - 1) {
                    this.modalInserirQuestoesAberto = false;
  
                    if (this.provaSelecionada?.questoes) {
                      this.provaSelecionada.questoes.push(novaQuestao);
                    } else {
                      this.provaSelecionada!.questoes = [novaQuestao];
                    }
  
                    this.provaSelecionada!.numQuestao = this.provaSelecionada?.questoes.length || 0;
                  }
                },
                error: (err) => {
                  console.error('Erro ao salvar a resposta:', err);
                }
              });
            });
        },
        error: (err) => {
          console.error('Erro ao adicionar a questão:', err);
        }
      });
    } else {
      console.error('Enunciado da questão ou prova não selecionada.');
    }
  }
    
  fecharModalInserirQuestao(): void {
    this.modalInserirQuestoesAberto = false;
  }

  ativarEdicao(): void {
    this.editando = true;
  }

  desativarEdicao(): void {
    this.editando = false;
  }

  fecharModal(): void {
    this.provaSelecionada = null;
    this.editando = false;
    this.confirmarExclusao = false;
  }

  getLetraAlternativa(i: number): string {
    return String.fromCharCode(97 + i);
  }

  atualizarRespostas(): void {
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

          this.fecharMenuQuestao();
          this.carregarProvas();
        });
    }
  }
}