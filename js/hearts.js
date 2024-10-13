const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let stars = [];
let shootingStars = [];
const numberOfStars = 150; // Número de estrellas en el fondo

// Función para redimensionar el canvas al tamaño de la ventana
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars(); // Crear estrellas al redimensionar
    drawScene(); // Dibujar la escena con las estrellas y corazones
}

// Función para crear estrellas de fondo
function createStars() {
    stars = [];
    for (let i = 0; i < numberOfStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2, // Tamaño aleatorio de la estrella
            color: 'white'
        });
    }
}

// Función para dibujar las estrellas de fondo
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fillStyle = star.color;
        ctx.fill();
    }
}

// Función para crear una estrella fugaz con forma de corazón
function createShootingStar() {
    const size = Math.random() * 30 + 10; // Tamaño del corazón
    shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height / 2, // Solo aparecerán en la parte superior
        size: size,
        speed: Math.random() * 4 + 4, // Velocidad de la estrella fugaz
        trail: [] // Para crear el efecto de estela
    });
}

// Función para dibujar las estrellas fugaces en forma de corazón
function drawShootingStars() {
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        let star = shootingStars[i];
        
        // Dibujar la estrella fugaz como corazón
        drawHeart(star.x, star.y, star.size, 'white');
        
        // Añadir a la estela
        star.trail.push({ x: star.x, y: star.y });
        if (star.trail.length > 15) star.trail.shift(); // Limitar la longitud de la estela
        
        // Dibujar la estela con el mismo grosor del corazón
        for (let t = 0; t < star.trail.length; t++) {
            let transparency = (1 - t / star.trail.length) * 0.5;
            let trailX = star.trail[t].x;
            let trailY = star.trail[t].y;
            
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${transparency})`;
            ctx.lineWidth = star.size * (1 - t / star.trail.length); // Grosor del tamaño del corazón
            if (t > 0) {
                ctx.moveTo(star.trail[t - 1].x, star.trail[t - 1].y);
                ctx.lineTo(trailX, trailY);
                ctx.stroke();
            }
        }
        
        // Mover la estrella fugaz
        star.x += star.speed;
        star.y += star.speed / 2;
        
        // Eliminar la estrella fugaz si sale del canvas
        if (star.x > canvas.width || star.y > canvas.height) {
            shootingStars.splice(i, 1);
        }
    }
}

// Función para dibujar un corazón
function drawHeart(x, y, size, color) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Curvas del corazón
    ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    
    // Rellenar el corazón con el color seleccionado
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// Función para generar un color aleatorio en formato hexadecimal
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Función para dibujar múltiples corazones
function drawMultipleHearts() {
    const numberOfHearts = 30; // Número de corazones a dibujar
    for (let i = 0; i < numberOfHearts; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 50 + 20; // Tamaño de los corazones
        const color = getRandomColor();
        drawHeart(x, y, size, color);
    }
}

// Función para dibujar toda la escena
function drawScene() {
    drawStars(); // Dibujar estrellas
    // drawMultipleHearts(); // Dibujar corazones
    drawShootingStars(); // Dibujar estrellas fugaces como corazones con estela de líneas
}

// Animar la escena
function animate() {
    drawScene(); // Redibujar la escena completa
    if (Math.random() < 0.02) { // Probabilidad de que aparezca una estrella fugaz
        createShootingStar();
    }
    requestAnimationFrame(animate); // Continuar la animación
}

// Redimensionar el canvas cuando la ventana cambia de tamaño
window.addEventListener('resize', resizeCanvas);

// Inicializar el canvas con el tamaño de la ventana y comenzar la animación
resizeCanvas();
animate();
