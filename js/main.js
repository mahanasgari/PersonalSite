// ============ FLOATING NAVIGATION ============

const floatingNav = document.querySelector('.floating-nav');
const heroSection = document.querySelector('#hero');

function checkNavVisibility() {
    if (window.scrollY > window.innerHeight * 0.5) {
        floatingNav.classList.add('visible');
    } else {
        floatingNav.classList.remove('visible');
    }
}
window.addEventListener('scroll', checkNavVisibility);

// Nav indicator positioning
const navIcons = document.querySelectorAll('.nav-icon');
const navIndicator = document.getElementById('navIndicator');

function updateIndicator(activeIcon) {
    if (!activeIcon || !navIndicator) return;
    const rect = activeIcon.getBoundingClientRect();
    const navRect = activeIcon.parentElement.getBoundingClientRect();
    navIndicator.style.left = (rect.left - navRect.left) + 'px';
}

// Active section detection
const sections = document.querySelectorAll('section[id]');

function updateActiveSection() {
    const scrollY = window.scrollY + window.innerHeight / 3;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollY >= top && scrollY < top + height) {
            navIcons.forEach(icon => {
                icon.classList.remove('active');
                if (icon.dataset.section === id) {
                    icon.classList.add('active');
                    updateIndicator(icon);
                }
            });
        }
    });
}
window.addEventListener('scroll', updateActiveSection);

// Initialize indicator position
setTimeout(() => {
    const activeIcon = document.querySelector('.nav-icon.active');
    if (activeIcon) updateIndicator(activeIcon);
}, 100);

// ============ MOBILE NAVIGATION ============

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============ FAQ ACCORDION ============

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        
        // Close all items
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        
        // Toggle current
        if (!isOpen) {
            item.classList.add('open');
        }
        
        // Update aria
        button.setAttribute('aria-expanded', !isOpen);
    });
});

// ============ WORD REVEAL ANIMATION ============

const wordReveals = document.querySelectorAll('.word-reveal');
wordReveals.forEach((word, i) => {
    word.style.opacity = '0';
    word.style.transform = 'translateY(110%)';
    word.style.transition = `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s, opacity 0.6s ease ${i * 0.1}s`;
    
    setTimeout(() => {
        word.style.opacity = '1';
        word.style.transform = 'translateY(0)';
    }, 300 + i * 100);
});

// ============ SCROLL REVEAL ============

const revealElements = document.querySelectorAll('.service-card, .project-row, .faq-item, .about-grid, .skills-detail-grid, .education-card, .cert-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.05}s`;
    revealObserver.observe(el);
});

// ============ SMOOTH SCROLL ============

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============ SKILL BARS ============

const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.getAttribute('data-progress');
            entry.target.style.width = `${progress}%`;
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ============ DATA PIPELINE ANIMATION (OPTIONAL) ============

const canvas = document.getElementById('pipelineCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let nodes = [];
    let connections = [];
    
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initPipeline();
    }
    
    function initPipeline() {
        particles = [];
        nodes = [];
        connections = [];
        
        const nodeCount = 8;
        const labels = ['Source', 'Extract', 'Transform', 'Validate', 'Load', 'Store', 'Analyze', 'Output'];
        
        for (let i = 0; i < nodeCount; i++) {
            const x = (width / (nodeCount + 1)) * (i + 1);
            const y = height / 2 + Math.sin(i * 0.8) * 100;
            nodes.push({
                x: x,
                y: y,
                radius: 5,
                label: labels[i],
                pulse: 0
            });
        }
        
        for (let i = 0; i < nodes.length - 1; i++) {
            connections.push({
                from: i,
                to: i + 1,
                progress: 0
            });
        }
        
        for (let i = 0; i < 15; i++) {
            particles.push(createParticle());
        }
    }
    
    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.2 + 0.05,
            color: '#808088'
        };
    }
    
    function drawNode(node) {
        node.pulse += 0.03;
        const pulseRadius = node.radius + Math.sin(node.pulse) * 2;
        
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseRadius * 1.5);
        gradient.addColorStop(0, 'rgba(100, 100, 110, 0.15)');
        gradient.addColorStop(1, 'rgba(100, 100, 110, 0)');
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(120, 120, 130, 0.5)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        ctx.fillStyle = 'rgba(160, 160, 160, 0.5)';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 25);
    }
    
    function drawConnection(conn) {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = 'rgba(60, 60, 65, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        conn.progress += 0.008;
        if (conn.progress > 1) conn.progress = 0;
        
        const flowX = fromNode.x + (toNode.x - fromNode.x) * conn.progress;
        const flowY = fromNode.y + (toNode.y - fromNode.y) * conn.progress;
        
        ctx.beginPath();
        ctx.arc(flowX, flowY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(140, 140, 140, 0.4)';
        ctx.fill();
    }
    
    function drawParticle(particle) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(128, 128, 136, ${particle.alpha})`;
        ctx.fill();
    }
    
    function updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(particle => {
            updateParticle(particle);
            drawParticle(particle);
        });
        
        connections.forEach(drawConnection);
        nodes.forEach(drawNode);
        
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    animate();
    
    window.addEventListener('resize', resizeCanvas);
}