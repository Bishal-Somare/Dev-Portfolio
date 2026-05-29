/**
 * Bishal Somare | Personal Portfolio Interactive Script
 * Tech Stack: Pure Vanilla ES6 JavaScript (No Frameworks)
 * Patterns: Modular, Performance Optimized, Event-Driven
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Core State & Variable Configs
    // --------------------------------------------------------------------------
    const state = {
        activeTheme: localStorage.getItem('porto_theme') || 'dark',
        mobileDrawerOpen: false,
        typingArray: [
            "AI Engineer",
            "GenAI Learner",
            "Agentic AI Explorer",
            "Backend Developer",
            "LangGraph Enthusiast",
            "Cloud Learner"
        ],
        typingIndex: 0,
        typingCharIndex: 0,
        isTypingDeleting: false,
        typingSpeed: 100, // ms speed
        simRunning: false
    };

    // --------------------------------------------------------------------------
    // 2. Interactive Loading Page dismissal
    // --------------------------------------------------------------------------
    const loader = document.getElementById('loader');
    const dismissLoader = () => {
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600); // match transition timing
        }
    };
    // Backup fallback in case window load triggers slowly
    setTimeout(dismissLoader, 3500);
    window.addEventListener('load', dismissLoader);

    // --------------------------------------------------------------------------
    // 3. Accessibility Active Theme Toggling
    // --------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Apply initial theme state
    if (state.activeTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (document.body.classList.contains('light-theme')) {
                document.body.classList.remove('light-theme');
                state.activeTheme = 'dark';
            } else {
                document.body.classList.add('light-theme');
                state.activeTheme = 'light';
            }
            localStorage.setItem('porto_theme', state.activeTheme);
        });
    }

    // --------------------------------------------------------------------------
    // 4. Scroll Header Sticky Behavior & Progress Tracker
    // --------------------------------------------------------------------------
    const header = document.getElementById('header');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const backToTopBtn = document.getElementById('back-to-top');

    const handleScrollMetrics = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // 1. Sticky Header Translucent background
        if (header) {
            if (scrollTop > 50) {
                header.style.background = state.activeTheme === 'dark' 
                    ? 'rgba(3, 7, 18, 0.92)' 
                    : 'rgba(249, 250, 251, 0.94)';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.background = state.activeTheme === 'dark' 
                    ? 'rgba(3, 7, 18, 0.7)' 
                    : 'rgba(249, 250, 251, 0.8)';
                header.style.boxShadow = 'none';
            }
        }

        // 2. Reading progress calculation
        if (scrollProgressBar && docHeight > 0) {
            const scrollPercentage = (scrollTop / docHeight) * 100;
            scrollProgressBar.style.width = `${scrollPercentage}%`;
        }

        // 3. Back-to-Top Button visibility
        if (backToTopBtn) {
            if (scrollTop > 600) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    };

    window.addEventListener('scroll', handleScrollMetrics);
    handleScrollMetrics(); // Initial bootstrap

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --------------------------------------------------------------------------
    // 5. Section Active State Viewport Tracking (IntersectionObserver)
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const observerOption = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // focused targeting center field
        threshold: 0
    };

    const sectionFocusObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Desktop Links syncing
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // Mobile Links syncing
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOption);

    sections.forEach(section => {
        sectionFocusObserver.observe(section);
    });

    // --------------------------------------------------------------------------
    // 6. Responsive Menu Slide-over Drawer
    // --------------------------------------------------------------------------
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuDrawerLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMobileDrawer = (forceVal) => {
        const toggleState = typeof forceVal === 'boolean' ? forceVal : !state.mobileDrawerOpen;
        state.mobileDrawerOpen = toggleState;
        
        if (mobileMenuDrawer && mobileMenuToggle) {
            if (state.mobileDrawerOpen) {
                mobileMenuDrawer.classList.add('active');
                mobileMenuToggle.classList.add('active');
                document.body.style.overflow = 'hidden'; // block scrolls when drawer active
            } else {
                mobileMenuDrawer.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    };

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => toggleMobileDrawer());
    }
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => toggleMobileDrawer(false));
    }
    mobileMenuDrawerLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileDrawer(false));
    });

    // --------------------------------------------------------------------------
    // 7. Dynamic Text Typing Cycle (Hero Subtitle)
    // --------------------------------------------------------------------------
    const typingSpan = document.getElementById('typing-text');
    
    const executeTypingTick = () => {
        if (!typingSpan) return;

        const currentFullStr = state.typingArray[state.typingIndex];
        
        if (state.isTypingDeleting) {
            // Subtract characters
            state.typingCharIndex--;
            state.typingSpeed = 50; // faster deletions
        } else {
            // Add characters
            state.typingCharIndex++;
            state.typingSpeed = 100; // standard writing
        }

        typingSpan.textContent = currentFullStr.substring(0, state.typingCharIndex);

        if (!state.isTypingDeleting && state.typingCharIndex === currentFullStr.length) {
            // Full text written, pause briefly before deleting
            state.typingSpeed = 1800; 
            state.isTypingDeleting = true;
        } else if (state.isTypingDeleting && state.typingCharIndex === 0) {
            // Word deleted, move on to the next one
            state.isTypingDeleting = false;
            state.typingIndex = (state.typingIndex + 1) % state.typingArray.length;
            state.typingSpeed = 300; // pause before typing next word
        }

        setTimeout(executeTypingTick, state.typingSpeed);
    };

    if (typingSpan) {
        setTimeout(executeTypingTick, 800);
    }

    // --------------------------------------------------------------------------
    // 8. Interactive Graph System Canvas (LangGraph Simulator)
    // --------------------------------------------------------------------------
    const btnTriggerAiSim = document.getElementById('btn-trigger-ai-sim');
    const simulationScreen = document.getElementById('ai-simulation-screen');
    const nodes = {
        user: document.getElementById('node-user'),
        planner: document.getElementById('node-planner'),
        rag: document.getElementById('node-rag'),
        eval: document.getElementById('node-eval')
    };
    const edges = {
        userPlanner: document.getElementById('edge-user-planner'),
        plannerRag: document.getElementById('edge-planner-rag'),
        ragEval: document.getElementById('edge-rag-eval'),
        evalUser: document.getElementById('edge-eval-user')
    };

    // Calculate absolute SVG wire pathways for connecting node points safely
    const recalculateGraphEdges = () => {
        const svgElement = document.querySelector('.graph-edge-svg');
        if (!svgElement || !nodes.user || !nodes.planner || !nodes.rag || !nodes.eval) return;

        const svgRect = svgElement.getBoundingClientRect();

        const getNodeCoordinates = (node) => {
            const rect = node.getBoundingClientRect();
            return {
                x: (rect.left + rect.width / 2) - svgRect.left,
                y: (rect.top + rect.height / 2) - svgRect.top
            };
        };

        const coordUser = getNodeCoordinates(nodes.user);
        const coordPlanner = getNodeCoordinates(nodes.planner);
        const coordRag = getNodeCoordinates(nodes.rag);
        const coordEval = getNodeCoordinates(nodes.eval);

        // Map line pathways directly
        if (edges.userPlanner) {
            edges.userPlanner.setAttribute('d', `M ${coordUser.x} ${coordUser.y} L ${coordPlanner.x} ${coordPlanner.y}`);
        }
        if (edges.plannerRag) {
            edges.plannerRag.setAttribute('d', `M ${coordPlanner.x} ${coordPlanner.y} L ${coordRag.x} ${coordRag.y}`);
        }
        if (edges.ragEval) {
            edges.ragEval.setAttribute('d', `M ${coordRag.x} ${coordRag.y} L ${coordEval.x} ${coordEval.y}`);
        }
        if (edges.evalUser) {
            edges.evalUser.setAttribute('d', `M ${coordEval.x} ${coordEval.y} L ${coordUser.x} ${coordUser.y}`);
        }
    };

    // Initial positioning compute & resize debounce listener
    setTimeout(recalculateGraphEdges, 500);
    window.addEventListener('resize', () => {
        setTimeout(recalculateGraphEdges, 80);
    });

    const appendSimLog = (message, logType = 'info') => {
        if (!simulationScreen) return;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        const logLine = document.createElement('span');
        logLine.className = 'log-line';
        if (logType === 'success') logLine.classList.add('sim-success');
        if (logType === 'info') logLine.classList.add('sim-info');
        if (logType === 'muted') logLine.classList.add('text-muted');

        logLine.innerHTML = `<span class="text-muted">[${timeStr}]</span> ${message}`;
        simulationScreen.appendChild(logLine);
        simulationScreen.scrollTop = simulationScreen.scrollHeight; // auto-scroll downwards
    };

    const activateNode = (activeNodeKey) => {
        // Clear all nodes and set target active
        Object.keys(nodes).forEach(key => {
            if (nodes[key]) nodes[key].classList.remove('active-graph-node');
        });
        if (nodes[activeNodeKey]) {
            nodes[activeNodeKey].classList.add('active-graph-node');
        }
    };

    const activateEdgeOnly = (activeEdgeKey) => {
        // Clear paths and illuminate selecting path
        Object.keys(edges).forEach(key => {
            if (edges[key]) edges[key].classList.remove('active-path');
        });
        if (edges[activeEdgeKey]) {
            edges[activeEdgeKey].classList.add('active-path');
        }
    };

    const triggerAgenticSimulation = async () => {
        if (state.simRunning) return;
        state.simRunning = true;
        
        if (btnTriggerAiSim) {
            btnTriggerAiSim.disabled = true;
            btnTriggerAiSim.innerHTML = 'Compiling... <i class="fa-solid fa-spinner animate-pulse-subtle"></i>';
        }

        try {
            // STEP 1: Node User Trigger
            appendSimLog("SIGNAL REFRESH: Launching state supervisor flow graph.", "muted");
            activateNode('user');
            activateEdgeOnly(null);
            appendSimLog("Node '[1] User Query' energized. Initial payload state locked: query=\"Extract CRM schema models\".", "info");
            await new Promise(resolve => setTimeout(resolve, 1400));

            // Move User -> Planner
            activateEdgeOnly('userPlanner');
            appendSimLog("Transmitting state packets across edge Router -> Planner...", "muted");
            await new Promise(resolve => setTimeout(resolve, 600));

            // STEP 2: Planner Trigger
            activateNode('planner');
            activateEdgeOnly(null);
            appendSimLog("Node '[2] Coordinator' running decision sequence. LangGraph state router: routing decision determined -> 'RETR_RAG_AGENT'.", "info");
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Move Planner -> RAG
            activateEdgeOnly('plannerRag');
            appendSimLog("Routing execution loop coordinates to Semantic Vector Retriever...", "muted");
            await new Promise(resolve => setTimeout(resolve, 600));

            // STEP 3: RAG Trigger
            activateNode('rag');
            activateEdgeOnly(null);
            appendSimLog("Node '[3] Semantic Search' scanning ChromaDB vector coordinates. Multi-query MMR retriever filters successfully pulled 4 candidates.", "info");
            await new Promise(resolve => setTimeout(resolve, 1600));

            // Move RAG -> Eval (Guardrail)
            activateEdgeOnly('ragEval');
            appendSimLog("Formatting candidates payload, routing to Guardrail evaluator for citation analysis...", "muted");
            await new Promise(resolve => setTimeout(resolve, 600));

            // STEP 4: Eval (Guardrail) trigger
            activateNode('eval');
            activateEdgeOnly(null);
            appendSimLog("Node '[4] Guardrail Grader' analyzing retrieved response. Hallucination index score: 0.012 [SUCCESS].", "info");
            await new Promise(resolve => setTimeout(resolve, 1300));

            // Return to User
            activateEdgeOnly('evalUser');
            appendSimLog("Terminating graph sequence. Formulating response layout payload...", "muted");
            await new Promise(resolve => setTimeout(resolve, 800));

            // Final wrap-up
            activateNode('user');
            activateEdgeOnly(null);
            appendSimLog("SUCCESS: Core interpreter compiled all branches. Query processed under 15ms total latency. Output state resolved.", "success");

        } catch (err) {
            appendSimLog(`ERROR: Pipeline failed exception: ${err.message}`, "error");
        } finally {
            state.simRunning = false;
            if (btnTriggerAiSim) {
                btnTriggerAiSim.removeAttribute('disabled');
                btnTriggerAiSim.innerHTML = 'Run Flow <i class="fa-solid fa-play"></i>';
            }
        }
    };

    if (btnTriggerAiSim) {
        btnTriggerAiSim.addEventListener('click', triggerAgenticSimulation);
    }

    // Direct single-node click overrides for user exploration
    Object.keys(nodes).forEach(key => {
        if (nodes[key]) {
            nodes[key].addEventListener('click', () => {
                if (state.simRunning) return;
                activateNode(key);
                appendSimLog(`Exploratory touch query resolved node ID '${key.toUpperCase()}'. State isolated.`, "muted");
            });
        }
    });

    // --------------------------------------------------------------------------
    // 9. Contribution calendar Simulation (GitHub Grid Builder)
    // --------------------------------------------------------------------------
    const contributionsGrid = document.getElementById('github-contributions-target');
    
    if (contributionsGrid) {
        contributionsGrid.innerHTML = ''; // reset container
        
        // Generate 168 cells: 24 columns for width, 7 rows representing days
        const totalPixels = 24 * 7;
        const colorLevels = ['lvl-0', 'lvl-1', 'lvl-2', 'lvl-3', 'lvl-4'];
        
        for (let i = 0; i < totalPixels; i++) {
            const pixel = document.createElement('div');
            pixel.className = 'matrix-pixel';
            
            // Generate randomized distribution blocks focusing on active levels
            let levelClass = 'lvl-0';
            const randVal = Math.random();
            
            if (randVal > 0.85) {
                levelClass = 'lvl-4';
            } else if (randVal > 0.65) {
                levelClass = 'lvl-3';
            } else if (randVal > 0.45) {
                levelClass = 'lvl-2';
            } else if (randVal > 0.2) {
                levelClass = 'lvl-1';
            }
            
            pixel.classList.add(levelClass);
            
            // Add custom interactive element details
            const contributionsCount = levelClass === 'lvl-0' ? 0 : 
                                 levelClass === 'lvl-1' ? Math.floor(Math.random() * 2) + 1 :
                                 levelClass === 'lvl-2' ? Math.floor(Math.random() * 3) + 3 :
                                 levelClass === 'lvl-3' ? Math.floor(Math.random() * 4) + 6 :
                                 Math.floor(Math.random() * 6) + 10;
            
            pixel.title = `${contributionsCount} commits on standard calendar index d_${i}`;
            
            pixel.addEventListener('mouseover', () => {
                pixel.style.filter = 'brightness(1.5)';
            });
            pixel.addEventListener('mouseout', () => {
                pixel.style.filter = '';
            });

            contributionsGrid.appendChild(pixel);
        }
    }

    // --------------------------------------------------------------------------
    // 10. Core Case Study Filtering System
    // --------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Adjust active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');

                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    // Trigger fade in animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 280); // match transition rates
                }
            });
        });
    });

    // --------------------------------------------------------------------------
    // 11. Spec sheet Deep-dive Modals triggers
    // --------------------------------------------------------------------------
    const deepDiveButtons = document.querySelectorAll('.btn-deep-dive');
    const closeButtons = document.querySelectorAll('[data-close]');
    const modals = document.querySelectorAll('.modal-overlay');

    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // preserve background viewport offsets
        }
    };

    const closeModal = (modal) => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // reactivate background scroll lines
        }
    };

    deepDiveButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetModalId = btn.getAttribute('data-modal');
            openModal(targetModalId);
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-close');
            const modal = document.getElementById(targetId);
            closeModal(modal);
        });
    });

    // Close on click outside boundary
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close on escape check
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });

    // --------------------------------------------------------------------------
    // 12. Contact Form client-side validation & simulated transmissions
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatusMsg = document.getElementById('form-status-msg');
    const submitBtn = document.getElementById('btn-submit-contact');

    if (contactForm && formStatusMsg && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // suppress default HTML reload triggers

            const senderName = document.getElementById('form-name').value.trim();
            const senderEmail = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const payload = document.getElementById('form-message').value.trim();

            // Reset borders
            document.querySelectorAll('.form-input').forEach(inp => {
                inp.classList.remove('input-error');
            });

            // Standard boundary checks
            if (!senderName || !senderEmail || !subject || !payload) {
                formStatusMsg.textContent = "SIGNAL FAILED: Complete all required parameters first.";
                formStatusMsg.className = 'form-status-msg error';
                return;
            }

            // Lock controls during transmission
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Connecting satellite client... <i class="fa-solid fa-satellite-dish animate-pulse-subtle"></i>';

            formStatusMsg.textContent = "Negotiating SSL handshakes... Routing state packet.";
            formStatusMsg.className = 'form-status-msg success';

            try {
                // Simulate network latency delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                formStatusMsg.textContent = "Pushing database payload matrix to index registries...";
                await new Promise(resolve => setTimeout(resolve, 1000));

                formStatusMsg.innerHTML = `<i class="fa-regular fa-paper-plane"></i> Telemetry delivered successfully! Code index: TX_REC_${Math.floor(Math.random() * 90000) + 10000}. Bishal will evaluate soon.`;
                formStatusMsg.className = 'form-status-msg success';
                
                // Reset inputs upon success
                contactForm.reset();

            } catch (err) {
                formStatusMsg.textContent = "TRANSMISSION FAILED: Link connection timeout.";
                formStatusMsg.className = 'form-status-msg error';
            } finally {
                submitBtn.removeAttribute('disabled');
                submitBtn.innerHTML = 'Execute Transmission <i class="fa-solid fa-paper-plane"></i>';
            }
        });
    }

    // --------------------------------------------------------------------------
    // 13. High-Performance Particle Canvas Backdrop Simulation (Hero Section)
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        
        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };

        const initParticles = () => {
            particlesArray = [];
            const numParticles = Math.min(Math.floor(canvas.width / 24), 55);
            
            for (let i = 0; i < numParticles; i++) {
                particlesArray.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.4,
                    speedY: (Math.random() - 0.5) * 0.4,
                    alpha: Math.random() * 0.45 + 0.1
                });
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = state.activeTheme === 'dark' 
                ? 'rgba(16, 185, 129, 0.45)' 
                : 'rgba(5, 150, 105, 0.35)';

            for (let i = 0; i < particlesArray.length; i++) {
                const p = particlesArray[i];
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Move coordinate
                p.x += p.speedX;
                p.y += p.speedY;

                // Bounce guidelines
                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            }

            // Draw line connections representing graph nodes
            ctx.strokeStyle = state.activeTheme === 'dark' 
                ? 'rgba(16, 185, 129, 0.04)' 
                : 'rgba(5, 150, 105, 0.05)';
            ctx.lineWidth = 1;

            for (let i = 0; i < particlesArray.length; i++) {
                for (let j = i; j < particlesArray.length; j++) {
                    const dist = Math.hypot(particlesArray[i].x - particlesArray[j].x, particlesArray[i].y - particlesArray[j].y);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(drawParticles);
        };

        resizeCanvas();
        initParticles();
        drawParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
    }

    // --------------------------------------------------------------------------
    // 14. Scroll Reveal Element animations handler (Viewport boundaries)
    // --------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-element');
    
    const triggerElementsReveal = () => {
        const thresholdLine = window.innerHeight * 0.88; // trigger when element is visible in lower viewport bound
        
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < thresholdLine) {
                el.classList.add('revealed');
            }
        });
    };

    window.addEventListener('scroll', triggerElementsReveal);
    // Trigger initial calculation to illuminate top components
    setTimeout(triggerElementsReveal, 350);
});
