"""Gera relatório preliminar; matrícula ausente nunca é inventada."""
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/pdf/relatorio-preliminar.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)
for name, filename in [("Arial", "arial.ttf"), ("ArialBold", "arialbd.ttf"), ("Code", "consola.ttf")]:
    pdfmetrics.registerFont(TTFont(name, str(Path("C:/Windows/Fonts") / filename)))

def data(name):
    return json.loads((ROOT / "docs/evidencias/final" / name).read_text(encoding="utf-8"))

quality = data("auditoria-qualidade.json")
behavior = data("auditoria-comportamento.json")
tests = [data(name + ".json") for name in ["testes-originais", "testes-refatorados", "testes-completos"]]
old = (ROOT / "src/ReportGenerator.js").read_text(encoding="utf-8").splitlines()
new = (ROOT / "src/ReportGenerator.refactored.js").read_text(encoding="utf-8").splitlines()
WIDTH, HEIGHT = A4
LEFT, RIGHT = 48, WIDTH - 48
TEXT_WIDTH = RIGHT - LEFT
INK = colors.HexColor("#203449")
MUTED = colors.HexColor("#506274")
ACCENT = colors.HexColor("#1a6470")
BODY = ParagraphStyle("body", fontName="Arial", fontSize=10, leading=14, textColor=INK)
SMALL = ParagraphStyle("small", parent=BODY, fontSize=8.2, leading=11)
CELL = ParagraphStyle("cell", parent=BODY, fontSize=9.1, leading=12)
pdf = canvas.Canvas(str(OUT), pagesize=A4)
pdf.setTitle("Detecção de Bad Smells e Refatoração Segura - preliminar")
pdf.setAuthor("Luidi Cadete Silva")
pdf.setSubject("Testes de Software - PUC Minas; matrícula pendente")
y = 0

def page(number, title=None):
    global y
    pdf.setFillColor(ACCENT)
    pdf.rect(LEFT, HEIGHT - 45, TEXT_WIDTH, 3, fill=1, stroke=0)
    pdf.setFillColor(MUTED)
    pdf.setFont("Arial", 8)
    pdf.drawString(LEFT, HEIGHT - 32, "PUC MINAS  |  ENGENHARIA DE SOFTWARE  |  TESTES DE SOFTWARE")
    pdf.setFont("Arial", 8)
    pdf.drawString(LEFT, 29, "PRELIMINAR - MATRÍCULA PENDENTE - 02/11/2026")
    pdf.drawRightString(RIGHT, 29, f"{number} / 4")
    y = HEIGHT - 75
    if title:
        pdf.setFont("ArialBold", 17)
        pdf.setFillColor(INK)
        pdf.drawString(LEFT, y, title)
        y -= 27

def para(text, style=BODY, gap=9):
    global y
    p = Paragraph(text, style)
    _, height = p.wrap(TEXT_WIDTH, 1000)
    if y - height < 48:
        raise RuntimeError(f"Conteúdo ultrapassou a página: {text[:60]}")
    p.drawOn(pdf, LEFT, y - height)
    y -= height + gap

def heading(text):
    global y
    pdf.setFillColor(ACCENT)
    pdf.setFont("ArialBold", 11)
    pdf.drawString(LEFT, y - 2, text)
    y -= 20

def table(rows, widths):
    global y
    formatted = [[Paragraph(escape(str(cell)), CELL) for cell in row] for row in rows]
    t = Table(formatted, colWidths=widths, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e5eef0")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LINEBELOW", (0, 0), (-1, 0), 0.5, ACCENT),
        ("LINEBELOW", (0, 1), (-1, -1), 0.3, colors.HexColor("#d4dce1")),
    ]))
    _, h = t.wrap(TEXT_WIDTH, 1000)
    if y - h < 48:
        raise RuntimeError("Tabela ultrapassou a página")
    t.drawOn(pdf, LEFT, y - h)
    y -= h + 12

def code(lines, first_line):
    global y
    size, leading = 7.8, 11
    h = len(lines) * leading + 18
    if y - h < 48:
        raise RuntimeError("Código ultrapassou a página")
    pdf.setFillColor(colors.HexColor("#f2f5f7"))
    pdf.rect(LEFT, y - h, TEXT_WIDTH, h, fill=1, stroke=0)
    pdf.setFont("Code", size)
    for i, line in enumerate(lines):
        text = f"{first_line+i:>2}  {line}"
        while pdfmetrics.stringWidth(text, "Code", size) > TEXT_WIDTH - 16:
            size -= 0.1
        pdf.setFont("Code", size)
        pdf.setFillColor(INK)
        pdf.drawString(LEFT + 8, y - 14 - i * leading, text)
    y -= h + 12

page(1)
pdf.setFillColor(INK)
pdf.setFont("ArialBold", 13)
pdf.drawCentredString(WIDTH / 2, HEIGHT - 135, "PONTIFÍCIA UNIVERSIDADE CATÓLICA DE MINAS GERAIS")
pdf.setFont("Arial", 12)
pdf.drawCentredString(WIDTH / 2, HEIGHT - 159, "Curso de Engenharia de Software")
pdf.drawCentredString(WIDTH / 2, HEIGHT - 183, "Disciplina: Testes de Software")
pdf.setFont("ArialBold", 23)
pdf.drawCentredString(WIDTH / 2, 498, "Detecção de Bad Smells")
pdf.drawCentredString(WIDTH / 2, 465, "e Refatoração Segura")
pdf.setFont("Arial", 13)
pdf.drawCentredString(WIDTH / 2, 399, "Luidi Cadete Silva")
pdf.setFont("ArialBold", 11)
pdf.setFillColor(colors.HexColor("#9b4c18"))
pdf.drawCentredString(WIDTH / 2, 373, "Matrícula: não fornecida")
y = 307
para("<b>Relatório preliminar para revisão.</b> A implementação e as evidências foram "
     "preparadas, mas a entrega permanece pendente da matrícula e da aprovação do aluno.")
para("O projeto original e seus testes foram preservados. A suíte original possui uma "
     "falha comprovada; a versão refatorada atende aos cinco testes copiados, com uma "
     "correção de formatação explicitamente autorizada.")
pdf.setFont("Arial", 11)
pdf.setFillColor(INK)
pdf.drawCentredString(WIDTH / 2, 109, "Novembro de 2026")
pdf.showPage()

page(2, "1. Diagnóstico e análise estática inicial")
para("Objetivo: melhorar a legibilidade e a manutenção de um gerador de relatórios "
     "JavaScript, usando testes e análise estática como evidências. Base: commit "
     "<b>39d39f9</b> do repositório do professor; implementação em arquivo separado.")
heading("Bad Smells identificados manualmente")
table([
    ["Tipo e localização", "Impacto na manutenção e nos testes"],
    ["Método longo\ngenerateReport, linhas 11-69", "Reúne seleção, prioridade e apresentação. Dificulta localizar defeitos e compreender os cenários de teste."],
    ["Condicionais complexas\nLaço, linhas 27-56", "Perfis, valores e formatos se cruzam em vários níveis. Aumenta a dificuldade de conferir caminhos e limites."],
    ["Duplicação de lógica\nCSV/soma, linhas 35-37 e 46-48", "A mesma mudança precisa ser repetida em ramos diferentes, criando risco de divergência e regressão."],
], [175, TEXT_WIDTH - 175])
para("Achado adicional: os números 500 e 1000 foram substituídos por constantes com "
     "nomes de negócio. Esses limites merecem verificações específicas.", SMALL)
heading("Execução anterior à criação do arquivo refatorado")
image = ImageReader(str(ROOT / "docs/evidencias/baseline/eslint-antes-legivel.png"))
iw, ih = image.getSize()
image_h = TEXT_WIDTH * ih / iw
pdf.drawImage(image, LEFT, y - image_h, width=TEXT_WIDTH, height=image_h)
y -= image_h + 8
para("Figura 1. Captura autêntica da página local que executou <b>npx eslint src/</b> "
     "e exibiu stdout/stderr reais. Logs e metadados estão em docs/evidencias/baseline.", SMALL)
para("O SonarJS mediu complexidade cognitiva <b>27</b> (limite <b>15</b>) e indicou um "
     "if simplificável: <b>2 erros, 0 avisos</b>. A ferramenta tornou objetiva a dificuldade "
     "percebida manualmente, mas não apontou todos os smells: duplicação de trechos e "
     "números mágicos permanecem achados manuais.", SMALL)
pdf.showPage()

page(3, "2. Refatoração e diferença autorizada")
para("O smell mais crítico foi a combinação de método longo e condicionais aninhadas "
     "em generateReport. O recorte original abaixo mistura autorização, escolha do "
     "formato, renderização e soma. Os trechos são extraídos dos arquivos reais.")
heading("Antes - src/ReportGenerator.js, linhas 43-54")
code(old[42:54], 43)
heading("Depois - decisões e responsabilidades separadas")
code(new[0:2], 1)
code(new[13:17], 14)
code(new[51:60], 52)
para("<b>Extract Method:</b> cabeçalho, linha, rodapé, visibilidade e prioridade ficaram "
     "em funções pequenas. <b>Decompose Conditional:</b> canViewItem expressa a regra de "
     "acesso e o laço usa continuações simples. A construção de linhas e a acumulação "
     "do total deixaram de ser duplicadas entre perfis.")
heading("Correção de formatação, além da refatoração")
para("O original gera <font face='Code'>&lt;tr &gt;</font> em linhas de ADMIN sem estilo; "
     "o teste exige <font face='Code'>&lt;tr&gt;</font>. No refatorado, o espaço passou a "
     "integrar apenas o atributo de estilo. Essa diferença foi autorizada e documentada; "
     "não é apresentada como equivalência textual absoluta.")
para("Preservaram-se a classe exportada, o construtor, db, generateReport e as mutações "
     "de item.priority, inclusive em formato desconhecido. Os arquivos originais estão "
     "intactos; a cópia da suíte altera exclusivamente o import.")
pdf.showPage()

page(4, "3. Validação, conclusão e pendências")
rows = [["Execução real", "Aprovados", "Falhas", "Total"]]
for label, result in zip(["Jest original", "Jest refatorado", "Jest completo"], tests):
    rows.append([label, result["numPassedTests"], result["numFailedTests"], result["numTotalTests"]])
table(rows, [TEXT_WIDTH - 195, 70, 60, 65])
para("A falha original no HTML de ADMIN ocorreu antes e depois da refatoração. "
     "<b>Não houve aprovação total:</b> npm test retorna código 1. Não se alteraram "
     "expectativas, não se excluíram testes e não se introduziram mocks para esconder a falha.")
table([
    ["Métrica com critérios iguais", "Original", "Refatorado"],
    ["Erros de ESLint / avisos", "2 / 0", "0 / 0"],
    ["Complexidade cognitiva de generateReport", "27", "5"],
], [TEXT_WIDTH - 160, 80, 80])
para("Redução de <b>100% dos erros</b> e de <b>81,5% da complexidade do método</b>. "
     "O maior valor de uma função refatorada é 5. A medição suplementar usa a API com "
     "limite zero para revelar valores; o lint oficial manteve limite 15 e as mesmas regras.")
para(f"A auditoria complementar aprovou <b>{behavior['exactComparisons']} comparações exatas</b> "
     "de saídas e mutações, além dos limites 500/501 e 1000/1001, prioridade preexistente, "
     "itens vazios e entradas de perfil/formato desconhecidos. A diferença HTML foi "
     "validada separadamente com saídas completas, sem normalização. Hashes e blobs Git "
     "confirmaram a preservação dos originais.")
heading("Conclusão")
para("Os testes revelaram uma inconsistência já existente na base e orientaram a correção "
     "autorizada. A redução dos smells facilita leitura e mudanças futuras; o lint mede "
     "parte dessa melhoria, enquanto os testes verificam comportamentos. Suítes aprovadas "
     "aumentam a confiança, mas não provam ausência de defeitos em todas as entradas.")
para("<b>Pendências:</b> matrícula, revisão/aprovação do aluno e alinhamento com o professor "
     "sobre a falha original preservada. Branch publicada apenas para auditoria, sem merge "
     "na principal. Assistência de IA (Codex) declarada; política institucional a confirmar.")
heading("Reprodução e referências")
para("Ambiente: Node 24.14.1, npm 11.11.0, Jest 29.7.0, ESLint 8.57.1 e SonarJS 0.21.0. "
     "Jest requer a flag ESM; ESLint 8 foi mantido por compatibilidade com .eslintrc.json. "
     "Manifestos, JSON e saídas completas: docs/evidencias. Implementação validada: 2383b83.", SMALL)
para("Fork: github.com/LuidiC/bad-smells-js-refactoring<br/>"
     "Branch: trabalho/refatoracao-segura<br/>"
     "Base: github.com/CleitonSilvaT/bad-smells-js-refactoring<br/>"
     "Jest 29.7: jestjs.io/docs/29.7/ecmascript-modules<br/>"
     "SonarJS: github.com/SonarSource/eslint-plugin-sonarjs/tree/0.21.0<br/>"
     "FOWLER, Martin. Refatoração: Aperfeiçoando o Design de Códigos Existentes. "
     "2. ed. Novatec, 2019. Catálogo: refactoring.com/catalog/.", SMALL)
pdf.save()
print(OUT)
