// Controle de exibição de seções
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('section.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover destaque de todos os botões da navbar
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Fechar menu mobile após seleção
    const navMenu = document.getElementById('nav-menu');
    if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
    }
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Destacar botão correspondente
        const navButtons = document.querySelectorAll('nav button');
        navButtons.forEach(btn => {
            if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(sectionId)) {
                btn.classList.add('active');
            }
        });
        
        // Atualizar URL sem reload
        window.history.pushState(null, '', `#${sectionId}`);
        
        // Scroll para o topo
        window.scrollTo(0, 0);
    }
    
    // Atualizar visibilidade do índice alfabético
    toggleAlphabetIndex();
}

// Toggle do menu mobile
function toggleNav() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('open');
    }
}

// Botão voltar ao topo
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mostrar/esconder botão voltar ao topo baseado no scroll
window.addEventListener('scroll', () => {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

// Navegação via hash na URL
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});

// Verificar hash inicial ao carregar
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    } else {
        // Se não houver hash, abrir a seção Glossário por padrão
        showSection('conceitos');
    }
});

// Interceptar cliques em links internos
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        const href = link.getAttribute('href');
        if (href && href.length > 1) {
            e.preventDefault();
            const targetId = href.substring(1);
            
            // Verificar se é um link para uma seção principal
            const mainSections = ['siglas', 'conceitos', 'comissoes', 'partidos', 'semelhancas', 'alfabetico', 'hierarquico'];
            const isMainSection = mainSections.includes(targetId);
            
            if (isMainSection) {
                showSection(targetId);
            } else {
                // É um link interno dentro de uma seção
                // Descobrir qual seção contém o elemento target
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Encontrar a seção pai
                    const parentSection = targetElement.closest('section.content-section');
                    if (parentSection) {
                        const parentId = parentSection.id;
                        showSection(parentId);
                        
                        // Aguardar animação e então fazer scroll para o elemento
                        setTimeout(() => {
                            const header = document.querySelector('.main-header');
                            const headerHeight = header ? header.offsetHeight : 0;
                            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                            
                            window.scrollTo({ 
                                top: targetPosition, 
                                behavior: 'smooth' 
                            });
                            
                            // Destacar temporariamente o elemento
                            targetElement.style.transition = 'background 0.5s';
                            targetElement.style.background = '#fef3c7';
                            setTimeout(() => {
                                targetElement.style.background = '';
                            }, 2000);
                        }, 300);
                    }
                }
            }
            
            // Atualizar URL sem recarregar
            history.pushState(null, '', href);
        }
    }
});

// Prevenir comportamento padrão de scroll ao clicar nos botões da nav
document.querySelectorAll('nav button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

// Índice alfabético dinâmico
function initAlphabetIndex() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const indexContainer = document.getElementById('alphabet-index');
    
    if (!indexContainer) return;
    
    // Seções que usam índice alfabético
    const sectionsWithIndex = ['conceitos', 'siglas', 'comissoes', 'partidos', 'alfabetico', 'hierarquico'];
    
    // Criar links do índice
    alphabet.forEach(letter => {
        const link = document.createElement('a');
        link.textContent = letter;
        link.href = '#letra-' + letter;
        link.title = 'Ir para ' + letter;
        link.dataset.letter = letter;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToLetter(letter);
        });
        
        indexContainer.appendChild(link);
    });
    
    // Adicionar IDs nas entradas de todas as seções
    sectionsWithIndex.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Mapear letras para primeiro elemento de cada letra
        const letterMap = new Map();
        
        // Diferentes seletores para diferentes tipos de conteúdo
        let entries;
        if (sectionId === 'conceitos') {
            // Glossário: pegar o <b> dentro de .entrada
            entries = section.querySelectorAll('.entrada b');
        } else if (sectionId === 'siglas') {
            // Lista de Siglas: primeira coluna da tabela (td)
            entries = section.querySelectorAll('table tr td:first-child');
        } else if (sectionId === 'comissoes' || sectionId === 'partidos') {
            // Comissões e Partidos: pegar o <b> dentro de <p> (.entrada ou .entradaver)
            entries = section.querySelectorAll('p.entrada b, p.entradaver b');
        } else if (sectionId === 'alfabetico') {
            // Índice A-Z: links dentro de <p> (não dentro de árvore)
            entries = section.querySelectorAll('p > a');
        } else if (sectionId === 'hierarquico') {
            // Hierárquico: apenas links de primeiro nível (não dentro de ul com classes de hierarquia)
            // Seleciona li.block que são filhos diretos de ul sem classe (apenas nível raiz)
            const allBlocks = section.querySelectorAll('li.block > a');
            entries = [];
            allBlocks.forEach(link => {
                const parentLi = link.parentElement;
                const parentUl = parentLi.parentElement;
                // Aceitar apenas se o ul pai não tem NENHUMA classe (é um ul vazio/raiz)
                if (parentUl.className === '' || parentUl.className === 'tree') {
                    entries.push(link);
                }
            });
        }
        
        entries.forEach(entry => {
            const text = entry.textContent.trim();
            if (!text) return;
            
            const firstLetter = text[0].toUpperCase();
            if (alphabet.includes(firstLetter) && !letterMap.has(firstLetter)) {
                // Primeira ocorrência desta letra
                const parent = entry.closest('.entrada, p, tr, li.block');
                if (parent) {
                    parent.dataset.letter = firstLetter;
                    parent.dataset.section = sectionId;
                    letterMap.set(firstLetter, parent);
                }
            }
        });
    });
}

// Scroll para letra específica
function scrollToLetter(letter) {
    const sectionsWithIndex = ['conceitos', 'siglas', 'comissoes', 'partidos', 'alfabetico', 'hierarquico'];
    
    // Encontrar seção ativa
    let activeSection = null;
    for (const sectionId of sectionsWithIndex) {
        const section = document.getElementById(sectionId);
        if (section && section.classList.contains('active')) {
            activeSection = section;
            break;
        }
    }
    
    if (!activeSection) return;
    
    // Procurar primeiro elemento com a letra usando data-letter
    const target = activeSection.querySelector(`[data-letter="${letter}"]`);
    
    if (target) {
        // Calcular posição considerando altura da navbar
        const header = document.querySelector('.main-header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({ 
            top: targetPosition, 
            behavior: 'smooth' 
        });
        
        // Destacar temporariamente
        target.style.transition = 'background 0.5s';
        target.style.background = '#fef3c7';
        setTimeout(() => {
            target.style.background = '';
        }, 2000);
    }
}

// Atualizar disponibilidade das letras no índice
function updateAlphabetAvailability() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const indexContainer = document.getElementById('alphabet-index');
    const sectionsWithIndex = ['conceitos', 'siglas', 'comissoes', 'partidos', 'alfabetico', 'hierarquico'];
    
    if (!indexContainer) return;
    
    // Encontrar seção ativa
    let activeSection = null;
    for (const sectionId of sectionsWithIndex) {
        const section = document.getElementById(sectionId);
        if (section && section.classList.contains('active')) {
            activeSection = section;
            break;
        }
    }
    
    if (!activeSection) return;
    
    // Encontrar letras disponíveis na seção ativa usando data-letter
    const availableLetters = new Set();
    const elements = activeSection.querySelectorAll('[data-letter]');
    
    elements.forEach(el => {
        const letter = el.dataset.letter;
        if (letter && alphabet.includes(letter)) {
            availableLetters.add(letter);
        }
    });
    
    // Atualizar links do índice
    const links = indexContainer.querySelectorAll('a');
    links.forEach(link => {
        const letter = link.dataset.letter;
        if (availableLetters.has(letter)) {
            link.classList.remove('disabled');
        } else {
            link.classList.add('disabled');
        }
    });
}

// Mostrar/esconder índice baseado na seção ativa
function toggleAlphabetIndex() {
    const indexContainer = document.getElementById('alphabet-index');
    const sectionsWithIndex = ['conceitos', 'siglas', 'comissoes', 'partidos', 'alfabetico', 'hierarquico'];
    
    if (!indexContainer) return;
    
    // Verificar se alguma seção com índice está ativa
    let showIndex = false;
    for (const sectionId of sectionsWithIndex) {
        const section = document.getElementById(sectionId);
        if (section && section.classList.contains('active')) {
            showIndex = true;
            break;
        }
    }
    
    if (showIndex) {
        indexContainer.classList.add('visible');
        updateAlphabetAvailability();
    } else {
        indexContainer.classList.remove('visible');
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAlphabetIndex();
        setTimeout(toggleAlphabetIndex, 100);
        wrapTables();
    });
} else {
    initAlphabetIndex();
    setTimeout(toggleAlphabetIndex, 100);
    wrapTables();
}

// Envolver tabelas em wrapper para scroll horizontal
function wrapTables() {
    document.querySelectorAll('table').forEach(table => {
        if (!table.parentElement.classList.contains('table-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
}

// toggleAlphabetIndex já é chamado dentro de showSection
