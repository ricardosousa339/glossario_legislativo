#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import os

# Mapeamento de arquivos para prefixos de seção
FILE_TO_SECTION = {
    'lista-siglas.xhtml': ('siglas', 'Lista de Siglas'),
    'chapter1.xhtml': ('conceitos', 'Glossário de Termos Legislativos'),
    'lista-comissoes.xhtml': ('comissoes', 'Comissões Permanentes'),
    'lista-partidos.xhtml': ('partidos', 'Partidos Políticos'),
    'lista-semelhancas.xhtml': ('semelhancas', 'Diferenças e Semelhanças Terminológicas'),
    'index.xhtml': ('alfabetico', 'Índice Alfabético'),
    'index-hierarquico.xhtml': ('hierarquico', 'Índice Hierárquico')
}

def rewrite_links(content, current_section):
    """Reescreve todos os links para o formato #section-id"""
    
    # Reescrever links para outros arquivos (file.xhtml#id -> #section-id)
    def replace_cross_file_link(match):
        full_href = match.group(1)
        link_text = match.group(2)
        
        for filename, (section, _) in FILE_TO_SECTION.items():
            if filename in full_href and '#' in full_href:
                id_part = full_href.split('#')[1]
                return f'<a href="#{section}-{id_part}">{link_text}</a>'
        
        return match.group(0)  # Retorna original se não encontrar
    
    # Reescrever links internos (#id -> #section-id)
    def replace_internal_link(match):
        id_part = match.group(1)
        link_text = match.group(2)
        return f'<a href="#{current_section}-{id_part}">{link_text}</a>'
    
    # Primeiro, links cross-file
    content = re.sub(r'<a href="([^"]*\.xhtml#[^"]+)">([^<]+)</a>', replace_cross_file_link, content)
    
    # Depois, links internos
    content = re.sub(r'<a href="#(\d+)">([^<]+)</a>', replace_internal_link, content)
    
    return content

def add_id_prefix(content, section):
    """Adiciona prefixo de seção a todos os IDs"""
    content = re.sub(r'id="(\d+)"', f'id="{section}-\\1"', content)
    return content

def extract_body_content(filepath):
    """Extrai apenas o conteúdo do body"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extrai conteúdo entre <body> e </body>
    match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return ''

def generate_section_html(filename, section_id, section_name, base_path):
    """Gera o HTML de uma seção específica"""
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"  AVISO: Arquivo não encontrado: {filepath}")
        return ''
    
    content = extract_body_content(filepath)
    
    if not content:
        print(f"  AVISO: Conteúdo vazio para {filename}")
        return ''
    
    # Reescrever links
    content = rewrite_links(content, section_id)
    
    # Adicionar prefixo aos IDs
    content = add_id_prefix(content, section_id)
    
    # Determinar classe active
    active_class = ' active' if filename == 'chapter1.xhtml' else ''
    
    return f'''
        <section id="{section_id}" class="content-section{active_class}">
            <h2>{section_name}</h2>
            {content}
        </section>
'''

def generate_header():
    """Gera o cabeçalho HTML"""
    return '''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Glossário de Termos Legislativos - 2ª Edição - Câmara dos Deputados e Senado Federal">
    <title>Glossário de Termos Legislativos - 2ª Ed.</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>Glossário de Termos Legislativos</h1>
        </div>
    </header>
    
    <nav>
        <div class="nav-container">
            <button class="nav-toggle" onclick="toggleNav()" aria-label="Menu">
                <span>☰</span> Menu
            </button>
            <ul id="nav-menu">
                <li><button onclick="showSection('siglas')" id="btn-siglas">Lista de Siglas</button></li>
                <li><button onclick="showSection('conceitos')" id="btn-conceitos" class="active">Glossário</button></li>
                <li><button onclick="showSection('comissoes')" id="btn-comissoes">Comissões</button></li>
                <li><button onclick="showSection('partidos')" id="btn-partidos">Partidos</button></li>
                <li><button onclick="showSection('semelhancas')" id="btn-semelhancas">Diferenças</button></li>
                <li><button onclick="showSection('alfabetico')" id="btn-alfabetico">Índice A-Z</button></li>
                <li><button onclick="showSection('hierarquico')" id="btn-hierarquico">Hierárquico</button></li>
            </ul>
        </div>
    </nav>
    
    <button class="back-to-top" onclick="scrollToTop()" aria-label="Voltar ao topo">
        ↑
    </button>
    
    <div class="alphabet-index" id="alphabet-index">
        <!-- Índice será preenchido dinamicamente -->
    </div>
    
    <main>
'''

def generate_footer():
    """Gera o rodapé HTML"""
    return '''
    </main>
    
    <footer>
        <p><strong>Glossário de Termos Legislativos - 2ª Edição</strong></p>
        <p>Câmara dos Deputados e Senado Federal</p>
        <p>Brasília, Brasil</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>
'''

def generate_html():
    base_path = '/home/ricardohenrique/Documentos/glossario/epub_extracted/EPUB'
    
    print("Iniciando geração do HTML...")
    
    # Gerar cabeçalho
    html_content = generate_header()
    
    # Processar cada seção
    for filename, (section_id, section_name) in FILE_TO_SECTION.items():
        print(f"Processando {filename}...")
        html_content += generate_section_html(filename, section_id, section_name, base_path)
    
    # Adicionar rodapé
    html_content += generate_footer()
    
    # Salvar arquivo
    output_path = '/home/ricardohenrique/Documentos/glossario/index.html'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"\n✅ HTML gerado com sucesso: {output_path}")
    
    # Calcular tamanho do arquivo
    file_size = os.path.getsize(output_path) / 1024  # KB
    print(f"📄 Tamanho do arquivo: {file_size:.1f} KB")

if __name__ == '__main__':
    generate_html()
