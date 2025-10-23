// Enhanced Starfield Animation - More Dynamic
        const canvas = document.getElementById('starfield');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = [];
        const shootingStars = [];
        const movingCircles = [];
        
        // Regular stars - smaller and blinking
        for (let i = 0; i < 500; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 0.3 + Math.random() * 0.8,
                opacity: Math.random(),
                speed: Math.random() * 0.5,
                twinkleSpeed: 0.03 + Math.random() * 0.05,
                blinkPhase: Math.random() * Math.PI * 2
            });
        }

        // Create moving circles
        function createMovingCircle() {
            const size = 2 + Math.random() * 4;
            movingCircles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: size,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                opacity: 0.3 + Math.random() * 0.4,
                color: Math.random() > 0.5 ? '#8b5cf6' : '#ec4899',
                pulseSpeed: 0.02 + Math.random() * 0.03,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }

        // Initialize moving circles
        for (let i = 0; i < 20; i++) {
            createMovingCircle();
        }

        // Create shooting/breaking star
        function createShootingStar() {
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height / 2,
                length: 60 + Math.random() * 40,
                speed: 10 + Math.random() * 5,
                opacity: 1,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
                particles: []
            });
        }

        // Create breaking star effect
        function breakStar(x, y) {
            const particleCount = 8 + Math.random() * 8;
            const particles = [];
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * (2 + Math.random() * 3),
                    vy: Math.sin(angle) * (2 + Math.random() * 3),
                    radius: 0.8 + Math.random() * 1.5,
                    opacity: 1,
                    life: 1
                });
            }
            return particles;
        }

        // Shooting stars with breaking effect
        setInterval(() => {
            if (Math.random() < 0.5) createShootingStar();
        }, 1500);

        function animateStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw regular blinking stars
            stars.forEach(star => {
                star.blinkPhase += star.twinkleSpeed;
                star.opacity = 0.3 + Math.abs(Math.sin(star.blinkPhase)) * 0.7;
                
                const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 2);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
                gradient.addColorStop(1, `rgba(139, 92, 246, ${star.opacity * 0.3})`);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw moving circles
            movingCircles.forEach((circle, index) => {
                circle.x += circle.vx;
                circle.y += circle.vy;
                circle.pulsePhase += circle.pulseSpeed;
                const pulse = 0.8 + Math.sin(circle.pulsePhase) * 0.2;
                
                if (circle.x < 0 || circle.x > canvas.width) circle.vx *= -1;
                if (circle.y < 0 || circle.y > canvas.height) circle.vy *= -1;
                
                circle.x = Math.max(0, Math.min(canvas.width, circle.x));
                circle.y = Math.max(0, Math.min(canvas.height, circle.y));

                const circleGradient = ctx.createRadialGradient(
                    circle.x, circle.y, 0,
                    circle.x, circle.y, circle.radius * pulse * 3
                );
                circleGradient.addColorStop(0, `${circle.color}${Math.floor(circle.opacity * 255).toString(16).padStart(2, '0')}`);
                circleGradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = circleGradient;
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, circle.radius * pulse * 3, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = `${circle.color}${Math.floor(circle.opacity * 255).toString(16).padStart(2, '0')}`;
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, circle.radius * pulse, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw shooting stars with breaking effect
            shootingStars.forEach((star, index) => {
                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;
                star.opacity -= 0.008;

                if (star.opacity > 0 && star.opacity > 0.3) {
                    const gradient = ctx.createLinearGradient(
                        star.x, star.y,
                        star.x - Math.cos(star.angle) * star.length,
                        star.y - Math.sin(star.angle) * star.length
                    );
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
                    gradient.addColorStop(0.5, `rgba(139, 92, 246, ${star.opacity * 0.6})`);
                    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(
                        star.x - Math.cos(star.angle) * star.length,
                        star.y - Math.sin(star.angle) * star.length
                    );
                    ctx.stroke();

                    const headGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 5);
                    headGlow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
                    headGlow.addColorStop(1, 'transparent');
                    ctx.fillStyle = headGlow;
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, 5, 0, Math.PI * 2);
                    ctx.fill();
                } else if (star.opacity <= 0.3 && star.particles.length === 0) {
                    star.particles = breakStar(star.x, star.y);
                }

                if (star.particles.length > 0) {
                    star.particles.forEach((particle, pIndex) => {
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        particle.vy += 0.1;
                        particle.life -= 0.02;
                        particle.opacity = particle.life;

                        if (particle.life > 0) {
                            ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
                            ctx.beginPath();
                            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                            ctx.fill();

                            const pGlow = ctx.createRadialGradient(
                                particle.x, particle.y, 0,
                                particle.x, particle.y, particle.radius * 2
                            );
                            pGlow.addColorStop(0, `rgba(236, 72, 153, ${particle.opacity})`);
                            pGlow.addColorStop(1, 'transparent');
                            ctx.fillStyle = pGlow;
                            ctx.beginPath();
                            ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
                            ctx.fill();
                        } else {
                            star.particles.splice(pIndex, 1);
                        }
                    });
                }

                if (star.opacity <= 0 && star.particles.length === 0) {
                    shootingStars.splice(index, 1);
                }
            });

            requestAnimationFrame(animateStars);
        }
        animateStars();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Space Intro Effects
        const spaceIntro = document.getElementById('space-intro');
        const introContent = document.querySelector('.intro-content');

        function createSpeedLines() {
            for (let i = 0; i < 20; i++) {
                const line = document.createElement('div');
                line.className = 'speed-line';
                line.style.width = `${Math.random() * 300 + 100}px`;
                line.style.top = `${Math.random() * 100}%`;
                line.style.left = `${Math.random() * 100}%`;
                line.style.animationDelay = `${Math.random() * 2}s`;
                introContent.appendChild(line);
            }
        }

        function createParticles() {
            setTimeout(() => {
                for (let i = 0; i < 40; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    const angle = (Math.PI * 2 * i) / 40;
                    const distance = 200 + Math.random() * 100;
                    particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
                    particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
                    particle.style.left = '50%';
                    particle.style.top = '50%';
                    particle.style.animationDelay = `${1.5 + Math.random() * 0.5}s`;
                    introContent.appendChild(particle);
                }
            }, 500);
        }

        createSpeedLines();
        createParticles();

        setTimeout(() => {
            spaceIntro.classList.add('hidden');
        }, 5000);

        // Smooth scroll and section animations
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileOverlay = document.getElementById('mobileOverlay');

        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking overlay
        mobileOverlay.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Mobile nav link clicks
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                    mobileNavLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });

        // Navbar scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });

        // Smooth scroll on nav click
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });

        // Fetch Codeforces Data
        async function fetchCodeforcesData() {
            try {
                const response = await fetch('https://codeforces.com/api/user.info?handles=Sidhant08');
                const data = await response.json();
                if (data.status === 'OK' && data.result && data.result.length > 0) {
                    const user = data.result[0];
                    document.getElementById('cf-current').textContent = user.rating || 'N/A';
                    document.getElementById('cf-max').textContent = user.maxRating || 'N/A';
                    document.getElementById('cf-rank').textContent = user.rank || 'Unrated';
                } else {
                    throw new Error('Invalid response');
                }
            } catch (error) {
                console.error('Codeforces fetch error:', error);
                document.getElementById('cf-current').textContent = '1461';
                document.getElementById('cf-max').textContent = '1461';
            }
        }

        // Load profile data
        fetchCodeforcesData();