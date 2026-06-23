// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active link highlighting on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
});

// Animate skill bars on scroll
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkillBars = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.getAttribute('data-progress');
            entry.target.style.width = `${progress}%`;
        }
    });
};

const skillObserver = new IntersectionObserver(animateSkillBars, {
    threshold: 0.5
});

skillBars.forEach(bar => skillObserver.observe(bar));

// Scroll reveal animation
const revealElements = document.querySelectorAll('.section-title, .timeline-item, .skill-item, .education-card, .project-card, .contact-telegram');

const revealOnScroll = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
};

const revealObserver = new IntersectionObserver(revealOnScroll, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// Data Pipeline Animation
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
        
        // Create pipeline nodes (data sources, transformations, destinations)
        const nodeCount = 8;
        const labels = ['Source', 'Extract', 'Transform', 'Validate', 'Load', 'Store', 'Analyze', 'Output'];
        
        for (let i = 0; i < nodeCount; i++) {
            const x = (width / (nodeCount + 1)) * (i + 1);
            const y = height / 2 + Math.sin(i * 0.8) * 100;
            nodes.push({
                x: x,
                y: y,
                radius: 8,
                label: labels[i],
                pulse: 0
            });
        }
        
        // Create connections between nodes
        for (let i = 0; i < nodes.length - 1; i++) {
            connections.push({
                from: i,
                to: i + 1,
                progress: 0
            });
        }
        
        // Create data particles
        for (let i = 0; i < 30; i++) {
            particles.push(createParticle());
        }
    }
    
    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            alpha: Math.random() * 0.5 + 0.3,
            color: Math.random() > 0.5 ? '#00d4ff' : '#7c3aed'
        };
    }
    
    function drawNode(node, index) {
        // Pulse effect
        node.pulse += 0.05;
        const pulseRadius = node.radius + Math.sin(node.pulse) * 3;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseRadius * 2);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Main node
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.fill();
        
        // Inner dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0a1a';
        ctx.fill();
        
        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 25);
    }
    
    function drawConnection(conn) {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Animated data flow
        conn.progress += 0.01;
        if (conn.progress > 1) conn.progress = 0;
        
        const flowX = fromNode.x + (toNode.x - fromNode.x) * conn.progress;
        const flowY = fromNode.y + (toNode.y - fromNode.y) * conn.progress;
        
        ctx.beginPath();
        ctx.arc(flowX, flowY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.fill();
    }
    
    function drawParticle(particle) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(')', `, ${particle.alpha})`).replace('rgb', 'rgba');
        ctx.fill();
    }
    
    function updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
    }
    
    function drawDataFlowText() {
        ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'left';
        
        const texts = ['ETL', 'SQL', 'Python', 'Pipeline', 'Warehouse', 'Analytics'];
        const time = Date.now() * 0.001;
        
        texts.forEach((text, i) => {
            const x = (width / (texts.length + 1)) * (i + 1);
            const y = height - 50 + Math.sin(time + i) * 10;
            ctx.fillText(text, x, y);
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw particles
        particles.forEach(particle => {
            updateParticle(particle);
            drawParticle(particle);
        });
        
        // Draw connections
        connections.forEach(drawConnection);
        
        // Draw nodes
        nodes.forEach(drawNode);
        
        // Draw floating text
        drawDataFlowText();
        
        requestAnimationFrame(animate);
    }
    
    // Initialize and start animation
    resizeCanvas();
    animate();
    
    // Handle resize
    window.addEventListener('resize', resizeCanvas);
}
