# Glossário de Termos Legislativos - 2ª Edição

## Descrição

Página HTML única e responsiva que consolida todo o conteúdo do **Glossário de Termos Legislativos - 2ª Edição** da Câmara dos Deputados e Senado Federal.

## Características

✅ **Interface Responsiva** - Adaptada para desktop, tablet e celular  
✅ **Navegação Intuitiva** - Menu fixo com acesso rápido às 7 seções  
✅ **Links Preservados** - Todos os 800+ links internos funcionando perfeitamente  
✅ **Árvore Hierárquica** - Visualização com bordas coloridas e estrutura indentada  
✅ **Design Legislativo** - Cores formais (azul marinho #003366) e tipografia adequada  
✅ **Scroll Suave** - Animações fluidas na navegação  
✅ **Acessibilidade** - HTML semântico e meta tags adequadas  

## Conteúdo

O glossário inclui as seguintes seções:

1. **Lista de Siglas** (216 abreviaturas legislativas)
2. **Glossário de Termos** (~800 termos legislativos com definições completas)
3. **Comissões Permanentes** (53 comissões do Congresso Nacional)
4. **Partidos Políticos** (35 partidos registrados)
5. **Diferenças e Semelhanças** (Terminologia comparada: CN, CD, SF)
6. **Índice Alfabético** (~500 entradas de A-Z)
7. **Índice Hierárquico** (Taxonomia completa em estrutura de árvore)

## Como Usar

### Visualizar no Navegador

Basta abrir o arquivo `index.html` em qualquer navegador moderno:

```bash
# No Linux
xdg-open index.html

# No Windows
start index.html

# No macOS
open index.html
```

Ou simplesmente arraste o arquivo para uma janela do navegador.

### Navegação

- **Menu Superior**: Clique em qualquer seção para navegar instantaneamente
- **Links Internos**: Todos os links do EPUB original foram preservados
  - Links entre seções (ex: de Siglas → Glossário)
  - Links dentro da mesma seção (ex: "Ver também")
  - Links para comissões e partidos
- **Scroll Suave**: A página rola suavemente até a seção desejada
- **Destaque Visual**: Seções ficam destacadas ao serem visitadas

### Busca

Use a função de busca do navegador para encontrar termos:
- **Chrome/Edge**: Ctrl+F (Windows/Linux) ou Cmd+F (Mac)
- **Firefox**: Ctrl+F (Windows/Linux) ou Cmd+F (Mac)

## Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos responsivos com flexbox e grid
- **JavaScript** - Navegação suave e interatividade
- **Python 3** - Script de geração e processamento

## Estrutura de Arquivos

```
glossario/
├── index.html              # Página HTML consolidada (650KB)
├── generate_html.py        # Script de geração
├── README.md              # Esta documentação
└── epub_extracted/        # Arquivos EPUB originais extraídos
    └── EPUB/
        ├── lista-siglas.xhtml
        ├── chapter1.xhtml
        ├── lista-comissoes.xhtml
        ├── lista-partidos.xhtml
        ├── lista-semelhancas.xhtml
        ├── index.xhtml
        ├── index-hierarquico.xhtml
        └── stylesheet.css
```

## Como Foi Criado

O HTML foi gerado a partir do EPUB original através do script `generate_html.py`:

1. **Extração**: Conteúdo extraído do arquivo EPUB (formato ZIP)
2. **Processamento de IDs**: Todos os IDs receberam prefixos de seção
   - `27428807` → `conceitos-27428807`
   - `27429037` → `partidos-27429037`
3. **Reescrita de Links**: Links convertidos para navegação interna
   - `chapter1.xhtml#27428807` → `#conceitos-27428807`
   - `lista-partidos.xhtml#27429037` → `#partidos-27429037`
4. **CSS Adaptado**: Estilos do EPUB + design responsivo customizado
5. **JavaScript**: Navegação suave e highlight de seções

## Requisitos

- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript habilitado (para navegação suave)

## Compatibilidade

✅ Chrome/Chromium  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ Opera  
✅ Navegadores móveis (iOS Safari, Chrome Android)

## Licença

Este glossário é uma obra oficial da **Câmara dos Deputados** e **Senado Federal** do Brasil.

## Créditos

- **Fonte Original**: Glossário de Termos Legislativos - 2ª Edição (EPUB)
- **Câmara dos Deputados**: [www.camara.leg.br](https://www.camara.leg.br)
- **Senado Federal**: [www.senado.leg.br](https://www.senado.leg.br)
- **Processamento**: Gerado a partir do EPUB original

## Problemas ou Sugestões?

Se encontrar algum link quebrado ou problema na visualização, você pode:
- Verificar se o navegador está atualizado
- Limpar o cache do navegador
- Tentar outro navegador
- Regenerar o HTML executando: `python3 generate_html.py`

---

**Última atualização**: 19 de novembro de 2025  
**Versão**: 1.0  
**Tamanho**: 650 KB (HTML único, sem dependências externas)
