/* =========================================================
   SITE VIVE LA FRANCE - JavaScript Principal
   Projeto de TCC - Desenvolvimento de Sistemas
   ========================================================= */

// Espera o DOM carregar completamente antes de executar
document.addEventListener('DOMContentLoaded', () => {
    initMenuHamburguer();
    initScrollSuave();
    initAnimacaoScroll();
    initNavbarScroll();
    initEfeitoDigitacao();
    initCardsHover();
});

/* =========================================================
   1. MENU HAMBÚRGUER (para dispositivos móveis)
   ========================================================= */
function initMenuHamburguer() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Verifica se os elementos existem na página
    if (!hamburger || !navMenu) return;

    // Abre/fecha o menu ao clicar no hambúrguer
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fecha o menu ao clicar em qualquer link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/* =========================================================
   2. SCROLL SUAVE para links internos (#ancora)
   ========================================================= */
function initScrollSuave() {
    const linksInternos = document.querySelectorAll('a[href^="#"]');

    linksInternos.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Verifica se é um link de âncora válido
            if (href !== '#' && href.length > 1) {
                const alvo = document.querySelector(href);
                
                if (alvo) {
                    e.preventDefault();
                    // Calcula a posição considerando a navbar fixa
                    const alturaNavbar = document.querySelector('.navbar').offsetHeight;
                    const posicao = alvo.offsetTop - alturaNavbar;
                    
                    window.scrollTo({
                        top: posicao,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* =========================================================
   3. ANIMAÇÃO AO ROLAR A PÁGINA (Intersection Observer)
   Elementos aparecem suavemente quando entram na tela
   ========================================================= */
function initAnimacaoScroll() {
    const elementos = document.querySelectorAll(
        '.section, .cultura-card, .tradicao-card, .dado-card, .ponto-imagem, .ponto-conteudo'
    );

    if (elementos.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visivel');
                // Para elementos com dados de contagem, ativa a animação
                if (entry.target.hasAttribute('data-contar')) {
                    animarContagem(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1, // Quando 10% do elemento estiver visível
        rootMargin: '0px 0px -50px 0px'
    });

    // Aplica estado inicial e observa cada elemento
    elementos.forEach(el => {
        el.classList.add('animar');
        observer.observe(el);
    });
}

/* =========================================================
   4. EFEITO NA NAVBAR AO ROLAR (muda sombra/tamanho)
   ========================================================= */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scroll-ativo');
        } else {
            navbar.classList.remove('scroll-ativo');
        }
    });
}

/* =========================================================
   5. EFEITO DE DIGITAÇÃO no subtítulo do HERO
   ========================================================= */
function initEfeitoDigitacao() {
    const elemento = document.querySelector('.hero-eyebrow');
    if (!elemento) return;

    const textoOriginal = elemento.textContent;
    elemento.textContent = '';
    let indice = 0;

    function digitar() {
        if (indice < textoOriginal.length) {
            elemento.textContent += textoOriginal.charAt(indice);
            indice++;
            setTimeout(digitar, 80); // Velocidade da digitação
        }
    }

    // Inicia após um pequeno delay
    setTimeout(digitar, 500);
}

/* =========================================================
   6. EFEITO HOVER MELHORADO nos cards
   ========================================================= */
function initCardsHover() {
    const cards = document.querySelectorAll('.cultura-card, .tradicao-card, .dado-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const x = e.offsetX;
            const y = e.offsetY;
            const centroX = this.offsetWidth / 2;
            const centroY = this.offsetHeight / 2;
            
            const rotacionarX = (y - centroY) / 20;
            const rotacionarY = (centroX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotacionarX}deg) rotateY(${rotacionarY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/* =========================================================
   7. FUNÇÃO AUXILIAR: Animação de contagem
   ========================================================= */
function animarContagem(elemento) {
    const alvo = parseInt(elemento.getAttribute('data-contar'));
    const duracao = 2000; // 2 segundos
    const inicio = performance.now();
    
    function atualizar(tempoAtual) {
        const tempoDecorrido = tempoAtual - inicio;
        const progresso = Math.min(tempoDecorrido / duracao, 1);
        
        // Easing para suavizar
        const suave = 1 - Math.pow(1 - progresso, 3);
        const valorAtual = Math.floor(alvo * suave);
        
        elemento.textContent = valorAtual.toLocaleString('pt-BR');
        
        if (progresso < 1) {
            requestAnimationFrame(atualizar);
        } else {
            elemento.textContent = alvo.toLocaleString('pt-BR');
        }
    }
    
    requestAnimationFrame(atualizar);
}

/* =========================================================
   8. BOTÃO VOLTAR AO TOPO (aparece ao rolar para baixo)
   ========================================================= */
function criarBotaoVoltarTopo() {
    // Cria o botão
    const botao = document.createElement('button');
    botao.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="18 15 12 9 6 15"/>
        </svg>
    `;
    botao.className = 'btn-voltar-topo';
    botao.setAttribute('aria-label', 'Voltar ao topo');
    
    // Estilos do botão
    Object.assign(botao.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #002395, #EF4135)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        opacity: '0',
        visibility: 'hidden',
        transform: 'translateY(20px)',
        transition: 'all 0.3s ease',
        zIndex: '999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    });
    
    botao.querySelector('svg').style.width = '22px';
    botao.querySelector('svg').style.height = '22px';
    
    // Adiciona ao body
    document.body.appendChild(botao);
    
    // Mostra/esconde ao rolar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            botao.style.opacity = '1';
            botao.style.visibility = 'visible';
            botao.style.transform = 'translateY(0)';
        } else {
            botao.style.opacity = '0';
            botao.style.visibility = 'hidden';
            botao.style.transform = 'translateY(20px)';
        }
    });
    
    // Volta ao topo ao clicar
    botao.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Inicializa o botão de voltar ao topo
document.addEventListener('DOMContentLoaded', criarBotaoVoltarTopo);