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
    content = extract_body_content(filepath)
    
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
    <!-- <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary-color: #1e3a5f;
            --secondary-color: #2c5282;
            --accent-color: #d4af37;
            --text-dark: #2d3748;
            --text-light: #718096;
            --bg-light: #f7fafc;
            --bg-white: #ffffff;
            --border-color: #e2e8f0;
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
            --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
            --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        body {
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.7;
            color: var(--text-dark);
            background: linear-gradient(to bottom, #f7fafc 0%, #edf2f7 100%);
            min-height: 100vh;
        }
        
        /* Cabeçalho Elegante */
        header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            padding: 2.5rem 2rem;
            box-shadow: var(--shadow-lg);
            position: relative;
            overflow: hidden;
        }
        
        header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%);
        }
        
        header .container {
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        
        header h1 {
            font-family: 'Merriweather', Georgia, serif;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            letter-spacing: -0.5px;
        }
        
        header .subtitle {
            text-align: center;
            opacity: 0.95;
            font-size: 1.1rem;
            font-weight: 300;
            letter-spacing: 0.5px;
        }
        
        header .badge {
            display: inline-block;
            background: var(--accent-color);
            color: var(--primary-color);
            padding: 0.4rem 1rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            margin-top: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        /* Navegação Moderna */
        nav {
            background: var(--bg-white);
            padding: 0;
            box-shadow: var(--shadow-md);
            position: sticky;
            top: 0;
            z-index: 999;
            border-bottom: 3px solid var(--accent-color);
        }
        
        nav .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        nav ul {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            margin: 0;
            padding: 0;
        }
        
        nav li {
            margin: 0;
        }
        
        nav button {
            display: block;
            padding: 1.2rem 1.5rem;
            background: transparent;
            color: var(--text-dark);
            border: none;
            cursor: pointer;
            transition: var(--transition);
            font-family: 'Roboto', sans-serif;
            font-size: 0.95rem;
            font-weight: 500;
            position: relative;
            border-bottom: 3px solid transparent;
        }
        
        nav button::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--accent-color);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
        
        nav button:hover {
            background: rgba(212, 175, 55, 0.1);
            color: var(--primary-color);
        }
        
        nav button:hover::after {
            transform: scaleX(1);
        }
        
        nav button.active {
            background: rgba(30, 58, 95, 0.05);
            color: var(--primary-color);
            font-weight: 600;
        }
        
        nav button.active::after {
            transform: scaleX(1);
        }
        
        /* Container principal */
        main {
            max-width: 1400px;
            margin: 3rem auto;
            padding: 0 2rem;
        }
        
        /* Seções - Inicialmente ocultas */
        section {
            display: none;
            background: var(--bg-white);
            padding: 3rem;
            margin-bottom: 2rem;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            animation: fadeIn 0.5s ease;
            border: 1px solid var(--border-color);
        }
        
        section.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        section h2 {
            font-family: 'Merriweather', Georgia, serif;
            color: var(--primary-color);
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid var(--border-color);
            position: relative;
        }
        
        section h2::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 80px;
            height: 2px;
            background: var(--accent-color);
        }
        
        /* Entradas do glossário */
        .entrada, .entradaver {
            text-align: justify;
            margin-bottom: 1.5rem;
            line-height: 1.8;
            padding: 1.25rem 1.5rem;
            background: var(--bg-light);
            border-radius: 6px;
            border-left: 3px solid var(--accent-color);
            transition: var(--transition);
        }
        
        .entrada:hover, .entradaver:hover {
            background: #fff;
            box-shadow: var(--shadow-sm);
            border-left-width: 4px;
        }
        
        .entrada b, .entradaver b {
            color: var(--primary-color);
            font-size: 1.2rem;
            font-weight: 600;
            display: block;
            margin-bottom: 0.5rem;
        }
        
        /* Links */
        a[href] {
            color: var(--secondary-color);
            text-decoration: none;
            transition: var(--transition);
            border-bottom: 1px solid transparent;
            font-weight: 500;
        }
        
        a[href]:hover {
            color: var(--accent-color);
            border-bottom-color: var(--accent-color);
        }
        
        /* Listas */
        ul.fonteN, ul.fonteB, ul[role="fonteB"] {
            margin: 1rem 0 1rem 2rem;
            list-style: none;
        }
        
        ul.fonteN li {
            color: var(--text-light);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            padding-left: 1.2rem;
            position: relative;
        }
        
        ul.fonteN li::before {
            content: '•';
            position: absolute;
            left: 0;
            font-size: 0.9rem;
            color: var(--text-light);
        }
        
        ul.fonteB li, ul[role="fonteB"] li {
            margin-bottom: 0.5rem;
            padding-left: 1.2rem;
            position: relative;
        }
        
        ul.fonteB li::before, ul[role="fonteB"] li::before {
            content: '›';
            position: absolute;
            left: 0;
            color: var(--accent-color);
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        ul.fonteB li i, ul[role="fonteB"] li i {
            color: var(--text-light);
            font-style: italic;
            font-weight: 400;
        }
        
        /* Tabelas */
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 1.5rem 0;
            box-shadow: var(--shadow-sm);
            border-radius: 8px;
            overflow: hidden;
        }
        
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        
        th {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
        }
        
        tbody tr {
            transition: var(--transition);
        }
        
        tbody tr:hover {
            background: var(--bg-light);
        }
        
        tbody tr:last-child td {
            border-bottom: none;
        }
        
        /* Árvore hierárquica */
        ul.tree, ul.tree ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        ul.tree ul {
            margin-left: 25px;
        }
        
        ul.tree li {
            position: relative;
            padding-left: 25px;
            padding-top: 5px;
            padding-bottom: 5px;
            border-left: 2px solid var(--border-color);
            color: var(--primary-color);
            font-weight: 500;
            transition: var(--transition);
        }
        
        ul.tree li:hover {
            border-left-color: var(--accent-color);
            padding-left: 30px;
        }
        
        ul.tree li::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            border-bottom: 2px solid var(--border-color);
            width: 20px;
            height: 0;
        }
        
        ul.tree li:last-child {
            border-left-color: transparent;
        }
        
        ul.tree li:last-child::before {
            border-left: 2px solid var(--border-color);
            height: 50%;
            top: 0;
        }
        
        ul.parte li {
            border-left-color: #48bb78;
        }
        
        ul.parte li::before {
            border-bottom-width: 3px;
            border-bottom-color: #48bb78;
        }
        
        ul.especie {
            font-style: italic;
            opacity: 0.9;
        }
        
        .tree {
            font-size: 0.95rem;
        }
        
        /* Classes especiais */
        .block {
            page-break-inside: avoid;
        }
        
        .center {
            text-align: center;
        }
        
        /* Rodapé Elegante */
        footer {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            text-align: center;
            padding: 3rem 2rem;
            margin-top: 4rem;
            box-shadow: 0 -4px 6px rgba(0,0,0,0.1);
        }
        
        footer p {
            margin: 0.5rem 0;
            font-size: 0.95rem;
            opacity: 0.9;
        }
        
        footer strong {
            font-weight: 600;
            font-size: 1.1rem;
            display: block;
            margin-bottom: 0.5rem;
        }
        
        /* Botão voltar ao topo */
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 48px;
            height: 48px;
            background: var(--bg-white);
            color: var(--primary-color);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            cursor: pointer;
            box-shadow: var(--shadow-md);
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            font-weight: 600;
            transition: var(--transition);
            z-index: 998;
        }
        
        .back-to-top.visible {
            display: flex;
        }
        
        .back-to-top:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
            transform: translateY(-3px);
            box-shadow: var(--shadow-lg);
        }
        
        /* Responsividade */
        @media (max-width: 768px) {
            header h1 {
                font-size: 1.8rem;
            }
            
            header .subtitle {
                font-size: 0.95rem;
            }
            
            nav ul {
                flex-direction: column;
            }
            
            nav button {
                width: 100%;
                text-align: center;
                padding: 1rem;
            }
            
            main {
                padding: 0 1rem;
            }
            
            section {
                padding: 2rem 1.5rem;
            }
            
            section h2 {
                font-size: 1.8rem;
            }
            
            ul.tree ul {
                margin-left: 15px;
            }
            
            .back-to-top {
                bottom: 1rem;
                right: 1rem;
                width: 45px;
                height: 45px;
            }
        }
        
        @media (max-width: 480px) {
            header h1 {
                font-size: 1.5rem;
            }
            
            header .subtitle {
                font-size: 0.85rem;
            }
            
            section {
                padding: 1.5rem 1rem;
                border-radius: 8px;
            }
            
            section h2 {
                font-size: 1.5rem;
            }
            
            nav button {
                padding: 0.9rem;
                font-size: 0.9rem;
            }
            
            .entrada, .entradaver {
                padding: 1rem;
            }
        }
        
        /* Scroll suave */
        html {
            scroll-behavior: smooth;
        }
        
        /* Loading state */
        .loading {
            text-align: center;
            padding: 3rem;
            color: var(--text-light);
        }
        
        .loading::after {
            content: '...';
            animation: dots 1.5s steps(4, end) infinite;
        }
        
        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
        }
    </style> -->
</head>
<body>
    <header>
        <div class="container">
            <h1>Glossário de Termos Legislativos</h1>
            <p class="subtitle">2ª Edição - Câmara dos Deputados e Senado Federal</p>
            <div class="center">
                <span class="badge">Documentação Oficial</span>
            </div>
        </div>
    </header>
    
    <nav>
        <div class="nav-container">
            <ul>
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
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary-color: #1e3a5f;
            --secondary-color: #2c5282;
            --accent-color: #d4af37;
            --text-dark: #2d3748;
            --text-light: #718096;
            --bg-light: #f7fafc;
            --bg-white: #ffffff;
            --border-color: #e2e8f0;
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
            --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
            --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        body {
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.7;
            color: var(--text-dark);
            background: linear-gradient(to bottom, #f7fafc 0%, #edf2f7 100%);
            min-height: 100vh;
        }
        
        /* Cabeçalho Elegante */
        header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            padding: 2.5rem 2rem;
            box-shadow: var(--shadow-lg);
            position: relative;
            overflow: hidden;
        }
        
        header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%);
        }
        
        header .container {
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        
        header h1 {
            font-family: 'Merriweather', Georgia, serif;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            letter-spacing: -0.5px;
        }
        
        header .subtitle {
            text-align: center;
            opacity: 0.95;
            font-size: 1.1rem;
            font-weight: 300;
            letter-spacing: 0.5px;
        }
        
        header .badge {
            display: inline-block;
            background: var(--accent-color);
            color: var(--primary-color);
            padding: 0.4rem 1rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            margin-top: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        /* Navegação Moderna */
        nav {
            background: var(--bg-white);
            padding: 0;
            box-shadow: var(--shadow-md);
            position: sticky;
            top: 0;
            z-index: 999;
            border-bottom: 3px solid var(--accent-color);
        }
        
        nav .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        nav ul {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            margin: 0;
            padding: 0;
        }
        
        nav li {
            margin: 0;
        }
        
        nav button {
            display: block;
            padding: 1.2rem 1.5rem;
            background: transparent;
            color: var(--text-dark);
            border: none;
            cursor: pointer;
            transition: var(--transition);
            font-family: 'Roboto', sans-serif;
            font-size: 0.95rem;
            font-weight: 500;
            position: relative;
            border-bottom: 3px solid transparent;
        }
        
        nav button::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--accent-color);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
        
        nav button:hover {
            background: rgba(212, 175, 55, 0.1);
            color: var(--primary-color);
        }
        
        nav button:hover::after {
            transform: scaleX(1);
        }
        
        nav button.active {
            background: rgba(30, 58, 95, 0.05);
            color: var(--primary-color);
            font-weight: 600;
        }
        
        nav button.active::after {
            transform: scaleX(1);
        }
        
        /* Container principal */
        main {
            max-width: 1400px;
            margin: 3rem auto;
            padding: 0 2rem;
        }
        
        /* Seções - Inicialmente ocultas */
        section {
            display: none;
            background: var(--bg-white);
            padding: 3rem;
            margin-bottom: 2rem;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            animation: fadeIn 0.5s ease;
            border: 1px solid var(--border-color);
        }
        
        section.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        section h2 {
            font-family: 'Merriweather', Georgia, serif;
            color: var(--primary-color);
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid var(--border-color);
            position: relative;
        }
        
        section h2::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 80px;
            height: 2px;
            background: var(--accent-color);
        }
        
        /* Entradas do glossário */
        .entrada, .entradaver {
            text-align: justify;
            margin-bottom: 1.5rem;
            line-height: 1.8;
            padding: 1.25rem 1.5rem;
            background: var(--bg-light);
            border-radius: 6px;
            border-left: 3px solid var(--accent-color);
            transition: var(--transition);
        }
        
        .entrada:hover, .entradaver:hover {
            background: #fff;
            box-shadow: var(--shadow-sm);
            border-left-width: 4px;
        }
        
        .entrada b, .entradaver b {
            color: var(--primary-color);
            font-size: 1.2rem;
            font-weight: 600;
            display: block;
            margin-bottom: 0.5rem;
        }
        
        /* Links */
        a[href] {
            color: var(--secondary-color);
            text-decoration: none;
            transition: var(--transition);
            border-bottom: 1px solid transparent;
            font-weight: 500;
        }
        
        a[href]:hover {
            color: var(--accent-color);
            border-bottom-color: var(--accent-color);
        }
        
        /* Listas */
        ul.fonteN, ul.fonteB, ul[role="fonteB"] {
            margin: 1rem 0 1rem 2rem;
            list-style: none;
        }
        
        ul.fonteN li {
            color: var(--text-light);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            padding-left: 1.2rem;
            position: relative;
        }
        
        ul.fonteN li::before {
            content: '•';
            position: absolute;
            left: 0;
            font-size: 0.9rem;
            color: var(--text-light);
        }
        
        ul.fonteB li, ul[role="fonteB"] li {
            margin-bottom: 0.5rem;
            padding-left: 1.2rem;
            position: relative;
        }
        
        ul.fonteB li::before, ul[role="fonteB"] li::before {
            content: '›';
            position: absolute;
            left: 0;
            color: var(--accent-color);
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        ul.fonteB li i, ul[role="fonteB"] li i {
            color: var(--text-light);
            font-style: italic;
            font-weight: 400;
        }
        
        /* Tabelas */
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 1.5rem 0;
            box-shadow: var(--shadow-sm);
            border-radius: 8px;
            overflow: hidden;
        }
        
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        
        th {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
        }
        
        tbody tr {
            transition: var(--transition);
        }
        
        tbody tr:hover {
            background: var(--bg-light);
        }
        
        tbody tr:last-child td {
            border-bottom: none;
        }
        
        /* Árvore hierárquica */
        ul.tree, ul.tree ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        ul.tree ul {
            margin-left: 25px;
        }
        
        ul.tree li {
            position: relative;
            padding-left: 25px;
            padding-top: 5px;
            padding-bottom: 5px;
            border-left: 2px solid var(--border-color);
            color: var(--primary-color);
            font-weight: 500;
            transition: var(--transition);
        }
        
        ul.tree li:hover {
            border-left-color: var(--accent-color);
            padding-left: 30px;
        }
        
        ul.tree li::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            border-bottom: 2px solid var(--border-color);
            width: 20px;
            height: 0;
        }
        
        ul.tree li:last-child {
            border-left-color: transparent;
        }
        
        ul.tree li:last-child::before {
            border-left: 2px solid var(--border-color);
            height: 50%;
            top: 0;
        }
        
        ul.parte li {
            border-left-color: #48bb78;
        }
        
        ul.parte li::before {
            border-bottom-width: 3px;
            border-bottom-color: #48bb78;
        }
        
        ul.especie {
            font-style: italic;
            opacity: 0.9;
        }
        
        .tree {
            font-size: 0.95rem;
        }
        
        /* Classes especiais */
        .block {
            page-break-inside: avoid;
        }
        
        .center {
            text-align: center;
        }
        
        /* Rodapé Elegante */
        footer {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            text-align: center;
            padding: 3rem 2rem;
            margin-top: 4rem;
            box-shadow: 0 -4px 6px rgba(0,0,0,0.1);
        }
        
        footer p {
            margin: 0.5rem 0;
            font-size: 0.95rem;
            opacity: 0.9;
        }
        
        footer strong {
            font-weight: 600;
            font-size: 1.1rem;
            display: block;
            margin-bottom: 0.5rem;
        }
        
        /* Botão voltar ao topo */
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 48px;
            height: 48px;
            background: var(--bg-white);
            color: var(--primary-color);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            cursor: pointer;
            box-shadow: var(--shadow-md);
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            font-weight: 600;
            transition: var(--transition);
            z-index: 998;
        }
        
        .back-to-top.visible {
            display: flex;
        }
        
        .back-to-top:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
            transform: translateY(-3px);
            box-shadow: var(--shadow-lg);
        }
        
        /* Responsividade */
        @media (max-width: 768px) {
            header h1 {
                font-size: 1.8rem;
            }
            
            header .subtitle {
                font-size: 0.95rem;
            }
            
            nav ul {
                flex-direction: column;
            }
            
            nav button {
                width: 100%;
                text-align: center;
                padding: 1rem;
            }
            
            main {
                padding: 0 1rem;
            }
            
            section {
                padding: 2rem 1.5rem;
            }
            
            section h2 {
                font-size: 1.8rem;
            }
            
            ul.tree ul {
                margin-left: 15px;
            }
            
            .back-to-top {
                bottom: 1rem;
                right: 1rem;
                width: 45px;
                height: 45px;
            }
        }
        
        @media (max-width: 480px) {
            header h1 {
                font-size: 1.5rem;
            }
            
            header .subtitle {
                font-size: 0.85rem;
            }
            
            section {
                padding: 1.5rem 1rem;
                border-radius: 8px;
            }
            
            section h2 {
                font-size: 1.5rem;
            }
            
            nav button {
                padding: 0.9rem;
                font-size: 0.9rem;
            }
            
            .entrada, .entradaver {
                padding: 1rem;
            }
        }
        
        /* Scroll suave */
        html {
            scroll-behavior: smooth;
        }
        
        /* Loading state */
        .loading {
            text-align: center;
            padding: 3rem;
            color: var(--text-light);
        }
        
        .loading::after {
            content: '...';
            animation: dots 1.5s steps(4, end) infinite;
        }
        
        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
        }
    </style> -->
</head>
<body>
    <header>
        <div class="container">
            <h1>Glossário de Termos Legislativos</h1>
            <p class="subtitle">2ª Edição — Câmara dos Deputados e Senado Federal</p>
            <div class="center">
                <span class="badge">Documentação Oficial</span>
            </div>
        </div>
    </header>
    
    <nav>
        <div class="nav-container">
            <ul>
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
    
    <main>
'''
    
    # Processar cada arquivo
    for filename, (section_id, section_title) in FILE_TO_SECTION.items():
        print(f"Processando {filename}...")
        
        filepath = os.path.join(base_path, filename)
        if not os.path.exists(filepath):
            print(f"  AVISO: Arquivo não encontrado: {filepath}")
            continue
        
        # Extrair conteúdo do body
        body_content = extract_body_content(filepath)
        
        if not body_content:
            print(f"  AVISO: Conteúdo vazio para {filename}")
            continue
        
        # Adicionar prefixo aos IDs
        body_content = add_id_prefix(body_content, section_id)
        
        # Reescrever links
        body_content = rewrite_links(body_content, section_id)
        
        # Adicionar seção ao HTML
        is_first = (filename == 'chapter1.xhtml')  # Glossário começa visível
        active_class = ' active' if is_first else ''
        
        html_content += f'''
        <section id="{section_id}" class="content-section{active_class}">
            <h2>{section_title}</h2>
            {body_content}
        </section>
'''
    
    # Rodapé
    html_content += '''
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
    
    # Salvar arquivo
    output_path = '/home/ricardohenrique/Documentos/glossario/index.html'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"\n✅ HTML gerado com sucesso: {output_path}")
    print(f"📄 Tamanho do arquivo: {len(html_content) / 1024:.1f} KB")

if __name__ == '__main__':
    generate_html()
