from flask import Flask, request, send_file
from flask_cors import CORS
from io import BytesIO
from fpdf import FPDF

app = Flask(__name__)
CORS(app, resources={r"/gerar-arquivo": {"origins": "http://localhost:4200"}})

class ProvaPDF(FPDF):
    def __init__(self, titulo_prova):
        super().__init__()
        self.titulo_prova = titulo_prova
        self.primeira_pagina = True

    def header(self):
        if self.primeira_pagina:

            self.rect(10, 10, 190, 40)  

            self.set_xy(10, 15)
            self.set_font("Arial", "B", 14)
            self.cell(190, 10, "SGPO - Sistema de Gerenciamento de Provas Online", ln=True, align="C")

            self.set_xy(10, 25)
            self.set_font("Arial", "B", 12)
            self.cell(190, 10, self.titulo_prova, ln=True, align="C")

            self.set_xy(10, 35)
            self.set_font("Arial", "", 12)
            self.cell(40, 10, "Nome do Aluno: ", ln=False)
            self.cell(150, 10, "", border="B", ln=True)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 10)
        self.cell(0, 10, f"Página {self.page_no()}", align="C")

    def add_page(self, orientation=""):
        super().add_page(orientation)
        if not self.primeira_pagina:
            self.set_y(15)
        self.primeira_pagina = False

@app.route('/gerar-arquivo', methods=['POST'])
def gerar_arquivo():
    prova = request.json  

    pdf = ProvaPDF(prova['nome'])
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", "", 12)

    pdf.ln(15)

    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(0, 8, prova['descricao'])
    pdf.ln(10)

    for i, questao in enumerate(prova['questoes'], start=1):
        if pdf.get_y() > 250:
            pdf.add_page()
            
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 8, f"Questão {i}:", ln=True, border="T")
        pdf.set_font("Arial", "", 12)
        pdf.multi_cell(0, 8, questao['enunciado'])
        pdf.ln(3)

        for j, resposta in enumerate(questao['respostas']):
            pdf.cell(0, 6, f"{chr(65+j)}) {resposta['descricao']}", ln=True)

        pdf.ln(5)

    pdf.set_font("Arial", "I", 12)
    pdf.ln(10)
    pdf.multi_cell(0, 8, "Boa sorte! Que você tenha sucesso na prova. Lembre-se de revisar suas respostas antes de entregá-la.")
    
    output = BytesIO()
    output.write(pdf.output(dest='S').encode('latin1'))
    output.seek(0)

    return send_file(output, as_attachment=True, download_name="prova_gerada.pdf", mimetype='application/pdf')

if __name__ == '__main__':
    app.run(debug=True)


