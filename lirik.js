    let baris = $("p");
    let lyricTimer = null;
    let lirik = [
        "Karena kamu cantik",
        "Kan ku beri segalanya apa yang ku punya",
        "Dan hatimu baik",
        "Sempurnalah duniaku saat kau disisiku",
        "Bukan karena make up di wajahmu",
        "Atau lipstik merah itu",
        "Lembut hati tutur kata",
        "Terciptalah cinta yang ku puja"
    ];

    let playing = false;
    let audio = $("#lagu")[0];
    let lyricsTimeout; // To track the lyrics timeout
    let lineTimeouts = []; // Store all individual line timers

    $(document).ready(function () {
        // Play/Pause on button click
        $("#play").click(togglePlayPause);
        $("#stop").click(togglePlayPause);

        // Play/Pause on spacebar
        $(document).keydown(function(e) {
            if (e.keyCode === 32) { // Spacebar key
                e.preventDefault();
                togglePlayPause();
            }
        });
    });

    function resetLyrics() {
        clearTimeout(lyricsTimeout);

        // Clear all line timeouts
        lineTimeouts.forEach(timeout => clearTimeout(timeout));
        lineTimeouts = [];

        // Clear all lines
        for (let i = 0; i < 8; i++) {
            $(baris[i]).css('opacity', 0).empty();  // Clear and hide all lines
        }
    }


    function togglePlayPause() {
        if (playing) {
            // Pause the audio without resetting the song position
            audio.pause();
            $("#play").animate({ opacity: 1 }, 500); // Show play button
            $("#stop").animate({ opacity: 0 }, 500); // Hide stop button
            $("#load").removeClass("playing");
            playing = false;

            // Reset lyrics when paused
            resetLyrics();
        } else {
            // Play the audio from the current position
            audio.play();
            $("#play").animate({ opacity: 0 }, 500); // Hide play button
            $("#stop").animate({ opacity: 1 }, 500); // Show stop button
            $("#load").addClass("playing");
            playing = true;

            // Reset the song to the beginning when play is clicked
            audio.currentTime = 0;  // This resets the song to the start

            // Reset lyrics and start animation
            resetLyrics();
            
            // Start lyrics after the initial delay
            lyricsTimeout = setTimeout(() => {
                playLyrics(); // Restart the lyric animation from the beginning
            }, 3750);

            // Reset after song ends
            audio.onended = function () {
                playing = false;
                $("#play").animate({ opacity: 1 }, 500);
                $("#stop").animate({ opacity: 0 }, 500);
                $("#load").removeClass("playing");
            };
        }
    }

    function playLyrics() {
        // Ensure all lines are played with correct timing
        playLine(0, 0, "rainbow-char");
        playLine(1, 3500, "float-char");
        playLine(2, 7000, "shake-char");
        playLine(3, 10500, "pulse-char");
        playLine(4, 14000, "spin-char");
        playLine(5, 17500, "wave-char");
        playLine(6, 21000, "rainbow-char");
        playLine(7, 24500, "glow-char");
    }

    function playLine(index, delay, primaryAnim) {
        if (!playing) return;
        const timeoutId = setTimeout(() => {
            const lineElement = baris[index];
            const text = lirik[index];
            const charDuration = 70; // Durasi per huruf dalam ms (sesuaikan dengan tempo lagu)
            const cursorBlinkSpeed = 600; // Kecepatan kedip kursor
    
            // Tambahkan latar belakang dengan efek blur
            lineElement.classList.add('line-background');
            
            // Bersihkan dan persiapkan baris
            lineElement.innerHTML = '';
            lineElement.style.opacity = 1;
            lineElement.classList.add('line-entrance');
            
            // Buat container untuk efek ketikan
            const typewriterContainer = document.createElement('div');
            typewriterContainer.className = 'typewriter-container';
            lineElement.appendChild(typewriterContainer);
            
            // Buat elemen teks yang akan diisi
            const textSpan = document.createElement('span');
            textSpan.className = 'typewriter-text';
            typewriterContainer.appendChild(textSpan);
            
            // Buat kursor (menggunakan CSS yang ada)
            const cursorSpan = document.createElement('span');
            cursorSpan.className = 'typewriter-cursor';
            cursorSpan.textContent = '|';
            typewriterContainer.appendChild(cursorSpan);
            
            // Animasi ketikan huruf per huruf
            let i = 0;
            const typeWriter = setInterval(() => {
                if (i < text.length) {
                    // Tambahkan karakter dengan animasi
                    const charSpan = document.createElement('span');
                    charSpan.textContent = text[i];
                    charSpan.className = getCharacterAnimationStyle(i, text[i], primaryAnim);
                    
                    // Menambahkan efek acak untuk karakter
                    const effects = ['fade-char', 'rainbow-char', 'float-char', 'shake-char', 'pulse-char', 'spin-char', 'wave-char', 'glow-char'];
                    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
                    charSpan.classList.add(randomEffect);
    
                    textSpan.appendChild(charSpan);
                        
                    // Apply karaoke-highlight style for each character
                    charSpan.classList.add('karaoke-highlight'); // Apply the karaoke highlight effect
                    setTimeout(() => {
                        charSpan.classList.remove('karaoke-highlight');
                    }, charDuration * 0.7);
                        
                    i++;
                } else {
                    // Selesai mengetik, hapus kursor dan clear interval
                    clearInterval(typeWriter);
                    setTimeout(() => {
                        cursorSpan.style.opacity = '0';
                            
                        // Tambahkan efek khusus untuk baris tertentu
                        if ([0, 3, 7].includes(index)) {
                            addFloatingHearts(lineElement);
                            addSparkleEffect(lineElement);
                        }
                    }, 300);
                }
            }, charDuration);
            
            // Hapus animasi entrance setelah selesai
            setTimeout(() => {
                lineElement.classList.remove('line-entrance');
            }, 1000);
        
        }, delay);
            
        lineTimeouts.push(timeoutId);
    }
    
    
    
    
    // Rest of your existing functions remain the same...
    function getCharacterAnimationStyle(index, char, primaryAnim) {
        if (char === " ") {
            return "space-char";  // Kelas untuk menangani spasi agar tidak menyebabkan masalah
        }
        const randomFactor = Math.random();
        const positionFactor = index % 5 / 5;
    
        if (randomFactor > 0.7 - positionFactor) {
            return primaryAnim;
        }
        return getRandomAnimation();
    }
    
    
    function getRandomAnimation() {
        const animationStyles = [
            { name: "fade-char", weight: 1 },
            { name: "bounce-char", weight: 1 },
            { name: "rotate-char", weight: 1 }
        ];
        const totalWeight = animationStyles.reduce((sum, style) => sum + style.weight, 0);
        let random = Math.random() * totalWeight;
        let weightSum = 0;
    
        for (const style of animationStyles) {
            weightSum += style.weight;
            if (random <= weightSum) {
                return style.name;
            }
        }
        return "fade-char";
    }
    
    function addFloatingHearts(lineElement) {
        const heartCount = 5 + Math.floor(Math.random() * 4);
        for(let i = 0; i < heartCount; i++) {
            setTimeout(() => {
                const heart = document.createElement("span");
                heart.className = "floating-heart";
                heart.innerHTML = ["❤", "💖", "✨", "❣", "💕", "💘"][Math.floor(Math.random() * 6)];
                heart.style.setProperty('--hue', Math.random() * 360);
                heart.style.setProperty('--size', Math.random());
                heart.style.setProperty('--speed', 2 + Math.random() * 3);
                heart.style.left = `${Math.random() * 85 + 7.5}%`;
                heart.style.bottom = `${Math.random() * 15 + 5}%`;
    
                lineElement.appendChild(heart);
    
                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.remove();
                    }
                }, 3000);
            }, i * 100);
        }
    }
    
    function addSparkleEffect(lineElement) {
        const sparkleContainer = document.createElement("div");
        sparkleContainer.className = "sparkle-container";
        lineElement.appendChild(sparkleContainer);
    
        const sparkleCount = 8 + Math.floor(Math.random() * 5);
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement("span");
            sparkle.className = "sparkle";
            sparkle.style.setProperty('--x', Math.random() * 100);
            sparkle.style.setProperty('--y', Math.random() * 100);
            sparkle.style.setProperty('--delay', Math.random() * 1.5);
            sparkle.style.setProperty('--size', 0.3 + Math.random() * 0.7);
            sparkle.style.setProperty('--hue', Math.random() * 30 + 210);
            sparkleContainer.appendChild(sparkle);
        }
    }

    function initWaveVisualizer() {
        const canvas = document.createElement('canvas');
        canvas.id = 'waveVisualizer';
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        let time = 0;

        const settings = {
            opacity: 0.25,
            waveHeight: 0.12,
            speed: 1.0,
            blendMode: 'soft-light'
        };

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        const colors = [
            'hsla(185, 95%, 65%, 0.25)',
            'hsla(225, 95%, 75%, 0.25)',
            'hsla(285, 90%, 70%, 0.25)'
        ];

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < 4; i++) {
                drawWaveLayer(i);
            }
            time += 0.008 * settings.speed;
            requestAnimationFrame(animate);
        }

        function drawWaveLayer(layerIndex) {
            const centerY = canvas.height * (0.5 + layerIndex * 0.1);
            const amplitude = canvas.height * settings.waveHeight * (layerIndex + 1);
            const frequency = 0.0012 + (layerIndex * 0.0004);

            ctx.beginPath();

            for (let x = 0; x <= canvas.width; x += 3) {
                const wave1 = Math.sin(x * frequency + time) * amplitude;
                const wave2 = Math.cos(x * frequency * 0.6 + time * 1.5) * amplitude * 0.7;
                const wave3 = Math.sin(x * frequency * 1.3 + time * 0.7) * amplitude * 0.4;
                const y = centerY + wave1 + wave2 + wave3;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();

            const gradient = ctx.createLinearGradient(0, centerY - amplitude * 2, 0, centerY + amplitude * 2);
            gradient.addColorStop(0, colors[layerIndex % colors.length]);
            gradient.addColorStop(0.5, adjustHSLAOpacity(colors[(layerIndex + 1) % colors.length], 0.4));
            gradient.addColorStop(1, 'hsla(0, 0%, 100%, 0)');

            ctx.fillStyle = gradient;
            ctx.fill();
        }

        function adjustHSLAOpacity(hsla, newOpacity) {
            return hsla.replace(/[\d\.]+\)$/, newOpacity + ')');
        }

        animate();
    }

    const style = document.createElement('style');
    style.textContent = `
    #waveVisualizer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        pointer-events: none;
        opacity: 0.85;
        mix-blend-mode: overlay;
        background: transparent;
    }`;
    document.head.appendChild(style);

    window.addEventListener('load', initWaveVisualizer);
