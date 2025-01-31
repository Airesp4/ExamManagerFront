import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Prova } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private http: HttpClient) { }

  baixarArquivo(prova: Prova) {

    const url = 'http://localhost:5000/gerar-arquivo';

    this.http.post(url, prova, { responseType: 'blob' }).subscribe(
      (response: Blob) => {

        const link = document.createElement('a');
        link.href = URL.createObjectURL(response);
        link.download = `${prova.nome}.pdf`;
        link.click();
      },
      (error) => {
        console.error('Erro ao gerar o arquivo:', error);
      }
    );
  }
}
