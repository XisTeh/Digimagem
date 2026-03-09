document.addEventListener("DOMContentLoaded", () => {

    // 1. Configurar Lenis (Smooth Scroll)
    // Lighthouse Optimization: Disable Lenis smooth scrolling completely on mobile and when reduced-motion is requested to save CPU/Main Thread.
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Apenas inicializar Lenis em Desktop poderoso
    let lenis = null;
    if (!isMobile && !prefersReducedMotion) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true
        });
    }

    function raf(time) {
        if (lenis) lenis.raf(time);
        requestAnimationFrame(raf);
    }
    if (lenis) {
        requestAnimationFrame(raf);
    }

    // 2. Animação de Entrada Otimizada (LCP first)
    // Não escondemos o container visual para não atrasar o LCP da hero image

    // Apenas animar texto da hero (muito leve)
    if (!prefersReducedMotion) {
        gsap.set('.gs-title', { y: 20, autoAlpha: 0 });
        gsap.to('.gs-title', {
            y: 0, autoAlpha: 1,
            stagger: 0.1, duration: 0.6, ease: "power2.out", delay: 0.1
        });

        gsap.set('.gs-reveal', { y: 10, autoAlpha: 0 });
        gsap.to('.gs-reveal', {
            y: 0, autoAlpha: 1,
            stagger: 0.05, duration: 0.5, ease: "power2.out", delay: 0.3
        });

        // Cards flutuantes animam depois que o Hero renderizar
        gsap.set('.gs-float-card, .gs-float-card-alt', { autoAlpha: 0, y: 15 });
        gsap.to('.gs-float-card, .gs-float-card-alt', {
            autoAlpha: 1, y: 0,
            stagger: 0.1, duration: 0.6, ease: "power2.out", delay: 0.6
        });
    }

    // 3. Parallax sutil com Scroll (Otimizado)
    gsap.registerPlugin(ScrollTrigger);

    if (!isMobile && !prefersReducedMotion) {
        gsap.to('.gs-parallax-img', {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    if (!prefersReducedMotion) {
        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#about",
                start: "top 80%",
                toggleActions: "play none none none" /* Executa só uma vez */
            }
        });

        gsap.set('.gs-about-reveal', { autoAlpha: 0, y: 20 });
        gsap.set('.gs-about-list > div', { autoAlpha: 0, x: 20 });

        aboutTl.to('.gs-about-reveal', { autoAlpha: 1, y: 0, duration: 0.6 })
            .to('.gs-about-list > div', { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.05 }, "-=0.3");
    }

    // =============================================
    // 4.5 EXAMES SECTION (Reveal & Delay stagger)
    // =============================================

    if (!prefersReducedMotion) {
        const examsTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#exams",
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        gsap.set('.gs-exams-header', { autoAlpha: 0 });
        gsap.set('.gs-exam-card', { autoAlpha: 0, y: 20 });

        examsTl.to('.gs-exams-header', { autoAlpha: 1, duration: 0.5 })
            .to('.gs-exam-card', {
                autoAlpha: 1, y: 0,
                duration: 0.5,
                stagger: 0.05
            }, "-=0.2");
    }

    // =============================================
    // 4.6 CONTATO SECTION (Reveal animations)
    // =============================================

    const contactTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#contact",
            start: "top 75%",
            end: "bottom bottom",
            toggleActions: "play none none reverse"
        }
    });

    gsap.set('.gs-contact-badge', { autoAlpha: 0, x: -20 });
    gsap.set('.gs-contact-title', { autoAlpha: 0, y: 40 });
    gsap.set('.gs-contact-subtitle', { autoAlpha: 0, y: 25 });
    gsap.set('.gs-contact-info > *', { autoAlpha: 0, y: 30, scale: 0.95 });
    gsap.set('.gs-contact-form-area', { autoAlpha: 0, y: 40 });
    gsap.set('.gs-contact-footer', { autoAlpha: 0, y: 20 });

    contactTl
        .to('.gs-contact-badge', { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out' })
        .to('.gs-contact-title', { autoAlpha: 1, y: 0, duration: 1, ease: 'power4.out' }, "-=0.4")
        .to('.gs-contact-subtitle', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.5")
        .to('.gs-contact-info > *', {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 0.7, stagger: 0.1,
            ease: 'back.out(1.2)'
        }, "-=0.5")
        .to('.gs-contact-form-area', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, "-=0.4")
        .to('.gs-contact-footer', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, "-=0.3");

    // =============================================
    // 5. CORPO CLÍNICO — Animações + Carrossel
    // =============================================

    // Animação de entrada com stagger individual
    gsap.set('.gs-team-badge', { autoAlpha: 0, x: -20 });
    gsap.set('.gs-team-title', { autoAlpha: 0, y: 40 });
    gsap.set('.gs-team-subtitle', { autoAlpha: 0, y: 30 });
    gsap.set('.team-card', { autoAlpha: 0, y: 60, rotationY: 8, scale: 0.88 });
    gsap.set('.gs-team-dots', { autoAlpha: 0, y: 15 });

    const teamTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#team",
            start: "top 78%",
            end: "bottom bottom",
            toggleActions: "play none none reverse"
        }
    });

    teamTl
        .to('.gs-team-badge', { autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out' })
        .to('.gs-team-title', { autoAlpha: 1, y: 0, duration: 1, ease: 'power4.out' }, "-=0.5")
        .to('.gs-team-subtitle', { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, "-=0.6")
        .to('.team-card', {
            autoAlpha: 1, y: 0, rotationY: 0, scale: 1,
            duration: 0.9, stagger: 0.1,
            ease: 'power3.out'
        }, "-=0.6")
        .to('.gs-team-dots', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, "-=0.3");

    // Carrossel Logic infinito aprimorado
    const track = document.getElementById('team-track');
    let originalCards = Array.from(document.querySelectorAll('.team-card'));
    const totalOriginalCards = originalCards.length;

    // Precisamos de clones suficientes para encher a tela inteira visível + transbordo
    // 4 clones p/ direita e 4 clones p/ esquerda garante segurança em qualquer viewport
    for (let i = 0; i < 4; i++) {
        // Clone para o final (indo pra direita)
        let cloneEnd = originalCards[i].cloneNode(true);
        cloneEnd.classList.remove('is-selected');
        cloneEnd.dataset.index = totalOriginalCards + i;
        track.appendChild(cloneEnd);
    }

    const cards = document.querySelectorAll('.team-card');
    const prevBtn = document.getElementById('team-prev');
    const nextBtn = document.getElementById('team-next');
    const dots = document.querySelectorAll('.team-dot');

    // Inicia no 0 (primeiro real)
    let currentSlide = 0;

    function getCardGap() {
        return window.innerWidth >= 1024 ? 24 : 20;
    }

    function getVisibleCards() {
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768) return 3;
        if (window.innerWidth >= 540) return 2;
        return 1;
    }

    function updateDotsState() {
        let nIndex = Math.abs(currentSlide) % totalOriginalCards;
        const maxSlideVirtual = totalOriginalCards - 1;
        const zone = maxSlideVirtual > 0 ? Math.floor(nIndex / (maxSlideVirtual / dots.length + 0.001)) : 0;

        dots.forEach((dot, i) => {
            const isActive = i === Math.min(zone, dots.length - 1);
            dot.classList.toggle('bg-primary', isActive);
            dot.classList.toggle('bg-stone-300', !isActive);
            dot.style.width = isActive ? '2rem' : '1rem';
        });
    }

    function updateCarousel(animated = true, forceInstant = false) {
        const gap = getCardGap();
        // A largura de passo agora é baseada no cartão em si, não na tela.
        // No mobile, o CSS já deixa os cartões menores que 100vw, então rolar X cartões revela a borda do próximo.
        const cardWidth = cards[0].offsetWidth + gap;

        // Centralizador Inteligente para Mobile (quando só 1 card é "ativo" mas os do lado aparecem)
        let getCalculatedOffset = (slideIndex) => {
            let baseOffset = -slideIndex * cardWidth;
            if (window.innerWidth < 540) {
                const paddingOffset = (window.innerWidth - cards[0].offsetWidth) / 2;
                return baseOffset + paddingOffset - (getCardGap() * 1.5); // compesação visual para a esquerda
            }
            return baseOffset;
        };

        let offset = getCalculatedOffset(currentSlide);

        // Proteção de limites p/ criar o efeito infinito sem salto visível
        if (currentSlide >= totalOriginalCards) {
            // Se passou do último real e já está vendo o clone inteiro, teleporta pro início invisivelmente
            if (!animated || forceInstant) {
                currentSlide = currentSlide % totalOriginalCards;
                offset = getCalculatedOffset(currentSlide);
            } else {
                // Anima até o clone e no final reseta por trás das cortinas
                gsap.to(track, {
                    x: getCalculatedOffset(currentSlide),
                    duration: 0.7,
                    ease: 'power3.out',
                    onComplete: () => {
                        currentSlide = currentSlide % totalOriginalCards;
                        gsap.set(track, { x: getCalculatedOffset(currentSlide) });
                    }
                });
                updateDotsState();
                return;
            }
        } else if (currentSlide < 0) {
            if (!animated || forceInstant) {
                currentSlide = totalOriginalCards - 1;
                offset = getCalculatedOffset(currentSlide);
            }
        }

        if (animated && !forceInstant) {
            gsap.to(track, {
                x: offset,
                duration: 0.7,
                ease: 'power3.out'
            });
        } else {
            gsap.set(track, { x: offset });
        }

        updateDotsState();

        // Em um loop verdadeiro as setas nunca somem
        gsap.to(prevBtn, { opacity: 1, duration: 0.3 });
        gsap.to(nextBtn, { opacity: 1, duration: 0.3 });
    }

    // Seleção por Clique
    function selectCard(card) {
        let cardIndex = parseInt(card.dataset.index);

        // Desselecionar todos
        cards.forEach(c => {
            if (c !== card && c.classList.contains('is-selected')) {
                c.classList.remove('is-selected');
                gsap.set(c.querySelector('.team-card__inner'), { clearProps: "all" });
            }
        });

        if (!card.classList.contains('is-selected')) {
            card.classList.add('is-selected');
            const inner = card.querySelector('.team-card__inner');
            gsap.set(inner, { clearProps: "all" });
        }

        const visible = getVisibleCards();

        if (cardIndex < currentSlide) {
            currentSlide = cardIndex;
            updateCarousel();
        } else if (cardIndex >= currentSlide + visible - 1) {
            currentSlide = cardIndex - visible + 1;
            updateCarousel();
        }
    }

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            selectCard(card);
        });
    });

    nextBtn.addEventListener('click', () => {
        currentSlide++;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        } else {
            // Se está no primeiro, salta invisível pro último clone real e anima
            currentSlide = totalOriginalCards;
            updateCarousel(false, true); // pulo ninja
            requestAnimationFrame(() => {
                currentSlide--;
                updateCarousel(true);
            });
        }
    });

    // Touch events (mobile only)
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 50) {
            if (diff < 0) {
                currentSlide++;
                updateCarousel();
            }
            if (diff > 0) {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateCarousel();
                } else {
                    currentSlide = totalOriginalCards;
                    updateCarousel(false, true);
                    requestAnimationFrame(() => {
                        currentSlide--;
                        updateCarousel(true);
                    });
                }
            }
        }
    });

    window.addEventListener('resize', () => {
        updateCarousel(false);
    });

    // Initial state
    updateCarousel(false);

    // =============================================
    // 6. MODAL DE EXAMES LOGIC
    // =============================================
    const examsData = {
        'RM': {
            title: 'Ressonância Magnética',
            formLink: 'https://www.dimagem.com.br/files/frm.pdf',
            content: `
                        <p class="font-bold text-stone-900 text-lg uppercase mb-4 text-primary">Trazer exames anteriores!</p>
                        
                        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm mb-6">
                            <h4 class="font-heading font-bold text-stone-800 mb-2">ABDÔMEN / APARELHO URINÁRIO / URORESSONÂNCIA / VIAS BILIARES / COLANGIORESSONÂNCIA</h4>
                            <p>6 horas de jejum.</p>
                        </div>

                        <h4 class="font-heading font-bold text-stone-900 mb-3 text-lg">Não podem realizar exames, pacientes com:</h4>
                        <ul class="list-disc pl-5 space-y-2 mb-6">
                            <li>Marca-passo;</li>
                            <li>Implantes de estribo no ouvido;</li>
                            <li>Reconstrução de CAI com metal (CÓCLEA);</li>
                            <li>Clipes cerebrais para aneurisma (e quando ferrometálicos);</li>
                            <li>Febre;</li>
                            <li>Válvulas Liquóricas antigas;</li>
                            <li>Válvula mitral metálica;</li>
                            <li>Gravidez de até 4 meses;</li>
                            <li>Peso superior a 130kg ou com Circunferência abdominal acima de 1,40m;</li>
                            <li>Profissão que envolva manipulação de limalha de ferro.</li>
                        </ul>

                        <div class="p-4 bg-orange-50/50 border border-orange-200 rounded-xl mb-6">
                            <p class="text-orange-800 text-sm italic">P.S.: Pacientes com implantes metálicos devem ser analisados para ver a viabilidade do exame.</p>
                        </div>

                        <div class="pt-6 border-t border-stone-200">
                            <h4 class="font-heading font-bold text-stone-800 mb-2">DEMAIS EXAMES</h4>
                            <p>Sem preparo prévio.</p>
                        </div>
                    `
        },
        'TC': {
            title: 'Tomografia Computadorizada',
            formLink: 'https://www.dimagem.com.br/files/fct.pdf',
            content: `
                        <div class="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-stone-200 text-stone-700 text-xs font-bold rounded-full">MULTISLICE - 16 CANAIS</div>
                        <p class="font-bold text-stone-900 text-lg uppercase mb-4 text-primary">Trazer exames anteriores!</p>

                        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm mb-6">
                            <h4 class="font-heading font-bold text-stone-800 mb-2">Sem contraste</h4>
                            <p>Sem preparo prévio.</p>
                        </div>

                        <h4 class="font-heading font-bold text-stone-900 mb-4 text-lg border-b border-stone-200 pb-2">Exames em geral com contraste</h4>
                        <ul class="list-disc pl-5 space-y-3 mb-6">
                            <li><strong class="text-stone-800">4 horas de jejum;</strong></li>
                            <li>Se o paciente for <strong>DIABÉTICO</strong> e utilizar os seguintes medicamentos, deve suspendê-los por 48 horas (antes do exame) sob orientação de seu médico: (Metformin, Metformina, Cloridrato de Metformina, Glucophage, Glucoformin, Glifage, Fortamet, Riomet, Alti-Metformin, Apo-Metfotmin, Gen-Metformin, Glycon, Novo-Metformin, Nu-Metformin, PMS-Metformin, Rhoxal-Metformin FC, Rho-Metformin, Dabex e Dimefor);</li>
                            <li><strong>PACIENTE ALÉRGICO:</strong> Passar preparo para o paciente.</li>
                        </ul>

                        <h4 class="font-heading font-bold text-stone-900 mb-4 text-lg border-b border-stone-200 pb-2">Abdômen com contraste</h4>
                        <ul class="list-disc pl-5 space-y-3 mb-6">
                            <li><strong class="text-stone-800">CRIANÇAS (Até 12 anos):</strong> Jejum completo de 4 horas;</li>
                            <li><strong class="text-stone-800">ADULTOS:</strong> Jejum completo de 6 horas.</li>
                            <li>A mesma orientação para <strong>DIABÉTICOS</strong> (suspender medicamentos 48h antes sob orientação médica).</li>
                            <li><strong>PACIENTE ALÉRGICO:</strong> Passar preparo para o paciente.</li>
                        </ul>
                    `
        },
        'DO': {
            title: 'Densitometria Óssea',
            content: `
                        <p class="font-bold text-stone-900 text-lg uppercase mb-6 text-primary">Trazer exames anteriores!</p>

                        <h4 class="font-heading font-bold text-rose-600 mb-3 text-lg flex items-center gap-2">
                            <iconify-icon icon="solar:danger-triangle-bold"></iconify-icon> O PACIENTE NÃO PODE:
                        </h4>
                        <ul class="list-disc pl-5 space-y-3 mb-6">
                            <li>Ter recebido injeção de radio-isótopos (Exame de Medicina Nuclear) 72 horas antes do exame;</li>
                            <li>Ter ingerido comprimidos com cálcio 48 horas antes do exame;</li>
                            <li>Ter realizado exames com contraste via oral com sulfato de bário nos 7 (sete) dias que antecedem a data prevista para a realização do exame (exames como: Trânsito Intestinal, Enema Opaco, Esôfago e Raio X de Tórax);</li>
                            <li>Ter realizado exames de Tomografia Computadorizada com o uso de contraste à base de Iodo ou Bário.</li>
                        </ul>
                    `
        },
        'RX': {
            title: 'Raio-X Digital',
            content: `
                        <p class="font-bold text-stone-900 text-lg uppercase mb-6 text-primary">Trazer exames anteriores!</p>

                        <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-6">
                            <h4 class="font-heading font-bold text-stone-900 mb-2 text-lg">Coluna Lombo-Sacra ou Coluna Total</h4>
                            <div class="p-3 bg-stone-50 border border-stone-100 rounded-lg mb-4 text-sm text-stone-600">
                                <p class="mb-1"><strong>Nota:</strong> Fratura de coluna ou acidentados não necessitam do preparo.</p>
                                <p>Até 14 anos não precisa de preparo.</p>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div class="p-4 bg-stone-100/50 rounded-xl">
                                    <strong class="block text-stone-800 mb-1">DULCOLAX</strong>
                                    <ul class="list-disc pl-4 text-sm space-y-1">
                                        <li>Até 80 kg: tomar 2 comprimidos.</li>
                                        <li>Acima de 80 kg: tomar 4 comprimidos.</li>
                                    </ul>
                                </div>
                                <div class="p-4 bg-stone-100/50 rounded-xl">
                                    <strong class="block text-stone-800 mb-1">LUFTAL ou FLAGASS</strong>
                                    <ul class="list-disc pl-4 text-sm space-y-1">
                                        <li>Até 80 kg: tomar 30 gotas.</li>
                                        <li>Acima de 80 kg: tomar 40 gotas.</li>
                                    </ul>
                                </div>
                            </div>

                            <h5 class="font-bold text-stone-800 mb-3 uppercase tracking-wider text-sm">Cronograma de Preparo</h5>
                            
                            <div class="space-y-4">
                                <div class="border-l-2 border-primary pl-4">
                                    <strong class="text-stone-900 block mb-1">Na véspera:</strong>
                                    <p class="text-sm">Às 17 horas tomar [qtd] comprimidos de DULCOLAX (Laxante) e [qtd] gotas de LUFTAL;<br>4 horas após, tomar [qtd] gotas de LUFTAL.</p>
                                    <p class="text-sm mt-2"><strong>No jantar:</strong> Caldo, sopa, bolacha água e sal, pão torrado e chá.</p>
                                </div>

                                <div class="border-l-2 border-primary pl-4">
                                    <strong class="text-stone-900 block mb-1">No dia do exame:</strong>
                                    <p class="text-sm"><strong>PELA MANHÃ:</strong> Bolacha água e sal, pão torrado e chá.<br>Se o exame for realizado à tarde, tomar um caldo ou sopa no almoço.</p>
                                </div>
                            </div>

                            <div class="mt-4 p-4 bg-orange-50/50 border border-orange-200 rounded-xl">
                                <p class="text-orange-800 text-sm font-medium">OBS: Beber água à vontade. Não comer frutas, verduras, pão, arroz ou bolacha integral. Não tomar leite.</p>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-stone-200">
                            <h4 class="font-heading font-bold text-stone-800 mb-2">Demais exames</h4>
                            <p>Sem preparo.</p>
                        </div>
                    `
        },
        'ECO': {
            title: 'Ecografia',
            content: `
                        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm mb-4">
                            <h4 class="font-heading font-bold text-stone-800 mb-2">Abdômen Superior</h4>
                            <p class="mb-3 text-stone-600">Pode tomar água à vontade.</p>
                            <ul class="space-y-2">
                                <li><strong class="text-stone-800">ADULTOS:</strong> Jejum de 8 horas;</li>
                                <li><strong class="text-stone-800">CRIANÇAS:</strong> Jejum de 4 horas.</li>
                            </ul>
                        </div>

                        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm mb-4">
                            <h4 class="font-heading font-bold text-stone-800 mb-3 text-sm md:text-base leading-snug">Abdômen Total / Aparelho urinário / Obstétrica / Pélvica / Próstata</h4>
                            <ul class="space-y-3">
                                <li><strong class="text-stone-800">ADULTOS:</strong> Jejum de 8 horas. Tomar 4 copos de água 1 hora antes e permanecer com a bexiga cheia.</li>
                                <li><strong class="text-stone-800">CRIANÇAS:</strong> Jejum de 4 horas. Tomar 2 copos de água 1 hora antes e permanecer com a bexiga cheia.</li>
                            </ul>
                        </div>

                        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm mb-6">
                            <h4 class="font-heading font-bold text-stone-800 mb-2">EcoDoppler Aorta e Artérias Renais</h4>
                            <p>Jejum de 6 horas.</p>
                        </div>

                        <div class="pt-4 border-t border-stone-200">
                            <h4 class="font-heading font-bold text-stone-800 mb-2">Demais exames</h4>
                            <p>Sem preparo.</p>
                        </div>
                    `
        },
        'MAMOGRAFIA': {
            title: 'Mamografia',
            content: `
                        <p class="font-bold text-stone-900 text-lg uppercase mb-4 text-primary">Trazer exames anteriores!</p>
                        <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                            <p class="text-stone-600 mb-4">A mamografia é um exame rápido e seguro. Para garantir o melhor resultado, siga estas orientações:</p>
                            <ul class="list-disc pl-5 space-y-3">
                                <li>Recomenda-se agendar preferencialmente na segunda ou terceira semana do ciclo menstrual (após a menstruação), quando as mamas estão menos sensíveis.</li>
                                <li>No dia do exame, <strong>não use desodorante, talco, loção ou perfume</strong> nas axilas ou nas mamas, pois esses produtos podem interferir nas imagens.</li>
                                <li>Use roupas de duas peças (blusa e calça/saia), pois será necessário despir-se da cintura para cima.</li>
                            </ul>
                        </div>
                    `
        },
        'BIOPSIA': {
            title: 'Punções e Biópsias',
            content: `
                        <p class="font-bold text-stone-900 text-lg uppercase mb-4 text-primary">Trazer exames anteriores!</p>
                        <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                            <h4 class="font-heading font-bold text-stone-900 mb-3 text-lg">Recomendações Gerais</h4>
                            <ul class="list-disc pl-5 space-y-3">
                                <li>Consultar o médico solicitante sobre a suspensão de medicamentos anticoagulantes, como Aspirina (AAS), Marevan, Xarelto (devem ser suspensos sob orientação médica).</li>
                                <li>O teste de coagulação (Coagulograma) recente pode ser exigido dependendo do tipo de punção.</li>
                                <li>Trazer resultados de ultrassonografias, mamografias ou outros exames recentes.</li>
                                <li>Recomenda-se vir com acompanhante.</li>
                            </ul>
                            <div class="mt-4 p-4 bg-orange-50/50 border border-orange-200 rounded-xl">
                                <p class="text-orange-800 text-sm italic">Como as instruções exatas podem variar de acordo com o órgão, nossa equipe entrará em contato para confirmar o preparo individual.</p>
                            </div>
                        </div>
                    `
        },
        'ODONTOLOGICA': {
            title: 'Radiologia Odontológica',
            content: `
                        <p class="font-bold text-stone-900 text-lg uppercase mb-4 text-primary">Trazer exames anteriores!</p>
                        <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                            <h4 class="font-heading font-bold text-stone-800 mb-2">Sem preparo prévio necessário</h4>
                            <p class="text-stone-600 mb-4">Apenas atente-se para:</p>
                            <ul class="list-disc pl-5 space-y-2">
                                <li>Remover óculos, brincos, colares, piercings faciais e próteses dentárias móveis antes do exame.</li>
                                <li>Informar à técnica sobre possibilidade de gravidez.</li>
                            </ul>
                        </div>
                    `
        }
    };

    const modal = document.getElementById('exam-modal');
    const overlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.getElementById('modal-close');

    const mTitle = document.getElementById('modal-title');
    const mBody = document.getElementById('modal-body');
    const mFooter = document.getElementById('modal-footer');
    const mFormBtn = document.getElementById('modal-form-btn');

    // ✅ Mover modal pro final do body (Estratégia Portal) para fugir de "contain", "transform" de secões e bugs de CSS Fixed!
    if (modal) {
        document.body.appendChild(modal);
    }

    function openModal(examKey) {
        const data = examsData[examKey];
        if (!data) return;

        mTitle.innerText = data.title;
        mBody.innerHTML = data.content;

        if (data.formLink) {
            mFormBtn.href = data.formLink;
            mFooter.classList.remove('hidden');
            mFooter.classList.add('flex');
        } else {
            mFooter.classList.add('hidden');
            mFooter.classList.remove('flex');
        }

        modal.classList.remove('invisible', 'pointer-events-none');

        // Animate In via GSAP for smoothness
        gsap.to(modal, { autoAlpha: 1, duration: 0.3 });
        gsap.fromTo(modalContent,
            { scale: 0.95, y: 15, autoAlpha: 0 },
            { scale: 1, y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(1.5)" }
        );

        // Reset scroll view to top
        mBody.scrollTop = 0;

        // Pause smoot scroll
        if (typeof lenis !== 'undefined') lenis.stop();
    }

    function closeModal() {
        gsap.to(modalContent, { scale: 0.95, y: 15, autoAlpha: 0, duration: 0.3, ease: "power2.inOut" });
        gsap.to(modal, {
            autoAlpha: 0, duration: 0.3, onComplete: () => {
                modal.classList.add('invisible', 'pointer-events-none');
                if (typeof lenis !== 'undefined') lenis.start();
            }
        });
    }

    document.querySelectorAll('.gs-exam-card').forEach(card => {
        card.addEventListener('click', () => {
            const preparo = card.getAttribute('data-preparo');
            if (preparo) openModal(preparo);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ====== LÓGICA DO MODAL PACS ======
    const pacsModal = document.getElementById('pacs-modal');
    const pacsOverlay = document.getElementById('pacs-overlay');
    const pacsContent = document.getElementById('pacs-content');
    const pacsCloseBtn = document.getElementById('pacs-close');

    // ✅ Mover modal PACS pro final do body (Estratégia Portal) para fugir de bugs de CSS Fixed!
    if (pacsModal) {
        document.body.appendChild(pacsModal);
    }

    window.openPacsModal = function () {
        pacsModal.classList.remove('invisible', 'pointer-events-none');

        // GSAP animation
        gsap.to(pacsModal, { autoAlpha: 1, duration: 0.3 });
        gsap.fromTo(pacsContent,
            { scale: 0.95, y: -20, autoAlpha: 0 },
            { scale: 1, y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(1.2)" }
        );

        if (typeof lenis !== 'undefined') lenis.stop();
    }

    window.closePacsModal = function () {
        gsap.to(pacsContent, { scale: 0.95, y: -20, autoAlpha: 0, duration: 0.3, ease: "power2.inOut" });
        gsap.to(pacsModal, {
            autoAlpha: 0, duration: 0.3, onComplete: () => {
                pacsModal.classList.add('invisible', 'pointer-events-none');
                if (typeof lenis !== 'undefined') lenis.start();
            }
        });
    }

    if (pacsCloseBtn) pacsCloseBtn.addEventListener('click', closePacsModal);
    if (pacsOverlay) pacsOverlay.addEventListener('click', closePacsModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !pacsModal.classList.contains('invisible')) closePacsModal();
    });

    // =============================================
    // NAVBAR DARK MODE (Lógica ultra-leve)
    // =============================================
    const mainNav = document.getElementById('main-nav');

    // Ancoramos a mudança de cor do painel superior APENAS ao entrar na primeira zona escura
    // removendo toda a carga global que causava stuttering e reflows.
    ScrollTrigger.create({
        trigger: "#convenios",
        start: "top 80px", // Ponto em que a seção escura toca o header
        endTrigger: "body", // Fica escuro até o final da página
        end: "bottom bottom",
        onEnter: () => mainNav.classList.add('nav-dark'),
        onLeaveBack: () => mainNav.classList.remove('nav-dark')
    });

    // =============================================
    // SCROLL PROGRESS BAR
    // =============================================
    const scrollProgress = document.getElementById('scroll-progress');
    gsap.to(scrollProgress, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
        }
    });

    // =============================================
    // SECTION DIVIDERS — Reveal animation
    // =============================================
    document.querySelectorAll('.section-divider').forEach(divider => {
        gsap.fromTo(divider,
            { scaleX: 0, opacity: 0 },
            {
                scaleX: 1, opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: divider,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // =============================================
    // PARALLAX SUTIL nos background glows
    // =============================================
    if (!isMobile && !prefersReducedMotion) {
        gsap.utils.toArray('.bg-blob').forEach((blob, i) => {
            gsap.to(blob, {
                yPercent: -20 + (i * 10),
                ease: 'none',
                scrollTrigger: {
                    trigger: blob.closest('section') || '#hero',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        });
    }

});