const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let scale = 20.0;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let lastDrawnFunction = null;
let lastDrawnParams = null;

// Обработчики событий для панорамирования
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        offsetX += dx;
        offsetY += dy;
        redraw();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
});

// Зум с помощью колесика мыши
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomIntensity = 0.05;
    const delta = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
    const previousScale = scale;
    scale = Math.min(Math.max(5, scale * delta), 50);


    document.getElementById('scale').value = scale.toFixed(1);
    document.getElementById('scaleValue').textContent = `Масштаб: ${scale.toFixed(1)}`;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = scale / previousScale;
    offsetX = mouseX - zoomFactor * (mouseX - offsetX);
    offsetY = mouseY - zoomFactor * (mouseY - offsetY);

    redraw();
});

function updateScale() {
    scale = parseFloat(document.getElementById('scale').value);
    scale = Math.min(Math.max(5, scale), 50); // Убедимся, что scale в пределах [5, 50]
    document.getElementById('scale').value = scale.toFixed(1);
    document.getElementById('scaleValue').textContent = `Масштаб: ${scale.toFixed(1)}`;
    redraw();
}

// Функция для перерисовки графика
function redraw() {
    drawGrid();
    if (lastDrawnFunction && lastDrawnParams) {
        lastDrawnFunction(...lastDrawnParams);
    }
}

// Функция для рисования сетки
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2 + offsetX;
    const centerY = canvas.height / 2 + offsetY;

    let labelStep = 1;

    if (scale >= 20) {
        labelStep = 1;
    } else if (scale >= 10) {
        labelStep = 2;
    } else {
        labelStep = 5;
    }

    const gridStep = scale; // Сетка рисуется каждый логический шаг

    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();

    const startX = -Math.ceil(centerX / gridStep);
    const endX = Math.ceil((canvas.width - centerX) / gridStep);
    for (let i = startX; i <= endX; i++) {
        const x = centerX + i * gridStep;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    const startY = -Math.ceil(centerY / gridStep);
    const endY = Math.ceil((canvas.height - centerY) / gridStep);
    for (let i = startY; i <= endY; i++) {
        const y = centerY + i * gridStep;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    ctx.font = `${Math.max(10, scale / 2)}px Arial`;
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = startX; i <= endX; i++) {
        if (i === 0) continue;
        const x = centerX + i * gridStep;
        if (i % labelStep === 0) {
            ctx.fillText(i, x, centerY + 5);
        }
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = startY; i <= endY; i++) {
        if (i === 0) continue;
        const y = centerY + i * gridStep;
        if (i % labelStep === 0) {
            ctx.fillText(-i, centerX - 5, y);
        }
    }
}

// Получение координат из полей ввода
function getInputCoordinates() {
    return {
        x1: parseInt(document.getElementById('x1').value),
        y1: parseInt(document.getElementById('y1').value),
        x2: parseInt(document.getElementById('x2').value),
        y2: parseInt(document.getElementById('y2').value),
        radius: parseInt(document.getElementById('radius').value)
    };
}

// Генерация случайных координат
function randomizeCoordinates() {
    const max = Math.floor(canvas.width / 2 / scale);
    document.getElementById('x1').value = Math.floor(Math.random() * 2 * max - max);
    document.getElementById('y1').value = Math.floor(Math.random() * 2 * max - max);
    document.getElementById('x2').value = Math.floor(Math.random() * 2 * max - max);
    document.getElementById('y2').value = Math.floor(Math.random() * 2 * max - max);
    document.getElementById('radius').value = Math.floor(Math.random() * max);
}

// Функция для рисования пикселя
function plotPixel(x, y, color = '#ff0000', connect = true) {
    const centerX = canvas.width / 2 + offsetX;
    const centerY = canvas.height / 2 + offsetY;
    const pixelX = centerX + x * scale;
    const pixelY = centerY - y * scale;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(pixelX, pixelY, Math.max(1, scale / 10), 0, 2 * Math.PI);
    ctx.fill();

    if (connect && plotPixel.lastX !== undefined && plotPixel.lastY !== undefined) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1, scale / 20);
        ctx.moveTo(plotPixel.lastX, plotPixel.lastY);
        ctx.lineTo(pixelX, pixelY);
        ctx.stroke();
    }

    plotPixel.lastX = pixelX;
    plotPixel.lastY = pixelY;
}

// Сброс предыдущих координат для соединения линий
function resetPlotPixel() {
    plotPixel.lastX = undefined;
    plotPixel.lastY = undefined;
}

// Алгоритм пошагового рисования линии
function stepByStep(x1, y1, x2, y2) {
    const start = performance.now();
    resetPlotPixel();

    let positionX = x1;
    let positionY = y1;
    const endX = x2;
    const endY = y2;
    const stepX = (x2 > x1) ? 1 : -1;
    const stepY = (y2 > y1) ? 1 : -1;

    while (true) {
        plotPixel(positionX, positionY);

        if (positionX === endX && positionY === endY) {
            break;
        }

        if (positionX !== endX) {
            positionX += stepX;
        }

        if (positionY !== endY) {
            positionY += stepY;
        }
    }

    return performance.now() - start;
}

// Алгоритм ЦДА (DDA)
function DDA(x1, y1, x2, y2) {
    const start = performance.now();
    resetPlotPixel();

    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    let x = x1;
    let y = y1;

    for (let i = 0; i <= steps; i++) {
        plotPixel(Math.round(x), Math.round(y));
        x += xIncrement;
        y += yIncrement;
    }
    return performance.now() - start;
}


// Алгоритм Брезенхема для линии
function bresenham(x0, y0, x1, y1) {
    const start = performance.now();
    resetPlotPixel();

    // Преобразуем координаты в целые числа
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    const deltax = Math.abs(x1 - x0);
    const deltay = Math.abs(y1 - y0);
    let error = 0;
    const deltaerr = deltay + 1;
    let x = x0;
    let y = y0;
    const diry = (y1 - y0) > 0 ? 1 : (y1 - y0) < 0 ? -1 : 0;

    const dirx = x0 < x1 ? 1 : -1;

    if (deltax >= deltay) {
        // Основная ось X
        const deltaerr = (deltay + 1);
        for (x = x0; x != x1 + dirx; x += dirx) {
            plotPixel(x, y);
            error += deltaerr;
            if (error >= deltax + 1) {
                y += diry;
                error -= deltax + 1;
            }
        }
    } else {
        // Основная ось Y
        const deltaerr = (deltax + 1);
        for (y = y0; y != y1 + diry; y += diry) {
            plotPixel(x, y);
            error += deltaerr;
            if (error >= deltay + 1) {
                x += dirx;
                error -= deltay + 1;
            }
        }
    }

    return performance.now() - start;
}


function castlePitteway(x1, y1, x2, y2) {
    const start = performance.now();
    resetPlotPixel();

    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    const sx = (x2 >= x1) ? 1 : -1;
    const sy = (y2 >= y1) ? 1 : -1;

    let x = dx;
    let y = dy;

    let sequence = [];

    while (x !== y) {
        if (x > y) {
            sequence.push('s');
            x -= y;
        } else {
            sequence.push('d');
            y -= x;
        }
    }
    sequence = sequence.concat(Array(x).fill('sd'));

    let x_curr = x1;
    let y_curr = y1;
    plotPixel(x_curr, y_curr);

    for (let i = 0; i < sequence.length; i++) {
        if (sequence[i] === 's') {
            x_curr += sx;
        } else if (sequence[i] === 'd') {
            y_curr += sy;
        } else if (sequence[i] === 'sd') {
            x_curr += sx;
            y_curr += sy;
        }
        plotPixel(x_curr, y_curr);
    }

    return performance.now() - start;
}

// Алгоритм Брезенхема для окружности с корректным соединением точек
function bresenhamCircle(xc, yc, r) {
    const start = performance.now();
    resetPlotPixel();

    let x = 0;
    let y = r;
    let d = 3 - 2 * r;

    let points = [];

    while (x <= y) {
        points.push({ x: x + xc, y: y + yc });
        points.push({ x: y + xc, y: x + yc });
        points.push({ x: y + xc, y: -x + yc });
        points.push({ x: x + xc, y: -y + yc });
        points.push({ x: -x + xc, y: -y + yc });
        points.push({ x: -y + xc, y: -x + yc });
        points.push({ x: -y + xc, y: x + yc });
        points.push({ x: -x + xc, y: y + yc });

        if (d < 0) {
            d = d + 4 * x + 6;
        } else {
            d = d + 4 * (x - y) + 10;
            y--;
        }
        x++;
    }

    // Удаляем дубликаты
    points = points.filter((point, index, self) =>
        index === self.findIndex((p) => p.x === point.x && p.y === point.y)
    );

    // Сортируем точки по углу относительно центра
    points.sort((a, b) => {
        const angleA = Math.atan2(a.y - yc, a.x - xc);
        const angleB = Math.atan2(b.y - yc, b.x - xc);
        return angleA - angleB;
    });

    // Рисуем окружность, соединяя последовательные точки
    ctx.beginPath();
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = Math.max(1, scale / 20);
    if (points.length > 0) {
        const firstPoint = points[0];
        const canvasCenterX = canvas.width / 2 + offsetX;
        const canvasCenterY = canvas.height / 2 + offsetY;
        ctx.moveTo(canvasCenterX + firstPoint.x * scale, canvasCenterY - firstPoint.y * scale);
        for (let i = 1; i < points.length; i++) {
            const p = points[i];
            ctx.lineTo(canvasCenterX + p.x * scale, canvasCenterY - p.y * scale);
        }
        ctx.lineTo(canvasCenterX + firstPoint.x * scale, canvasCenterY - firstPoint.y * scale);
        ctx.stroke();
    }

    // Дополнительно, рисуем точки для наглядности
    points.forEach(p => {
        plotPixel(p.x - xc, p.y - yc, '#ff0000', false);
    });

    return performance.now() - start;
}

function drawStepByStep() {
    const coords = getInputCoordinates();
    drawGrid();
    const time = stepByStep(coords.x1, coords.y1, coords.x2, coords.y2);
    document.getElementById('timing').textContent = `Пошаговый алгоритм: ${time.toFixed(3)} мс`;
    lastDrawnFunction = stepByStep;
    lastDrawnParams = [coords.x1, coords.y1, coords.x2, coords.y2];
}

function drawDDA() {
    const coords = getInputCoordinates();
    drawGrid();
    const time = DDA(coords.x1, coords.y1, coords.x2, coords.y2);
    document.getElementById('timing').textContent = `Алгоритм ЦДА: ${time.toFixed(3)} мс`;
    lastDrawnFunction = DDA;
    lastDrawnParams = [coords.x1, coords.y1, coords.x2, coords.y2];
}

function drawBresenham() {
    const coords = getInputCoordinates();
    drawGrid();
    const time = bresenham(coords.x1, coords.y1, coords.x2, coords.y2);
    document.getElementById('timing').textContent = `Алгоритм Брезенхема (линия): ${time.toFixed(3)} мс`;
    lastDrawnFunction = bresenham;
    lastDrawnParams = [coords.x1, coords.y1, coords.x2, coords.y2];
}
function drawCastlePitteway() {
    const coords = getInputCoordinates();
    drawGrid();
    const time = castlePitteway(coords.x1, coords.y1, coords.x2, coords.y2);
    document.getElementById('timing').textContent = `Алгоритм Кастла-Питвея: ${time.toFixed(3)} мс`;
    lastDrawnFunction = castlePitteway;
    lastDrawnParams = [coords.x1, coords.y1, coords.x2, coords.y2];
}

function drawBresenhamCircle() {
    const coords = getInputCoordinates();
    drawGrid();
    const time = bresenhamCircle(0, 0, coords.radius);
    document.getElementById('timing').textContent = `Алгоритм Брезенхема (окружность): ${time.toFixed(3)} мс`;
    lastDrawnFunction = bresenhamCircle;
    lastDrawnParams = [0, 0, coords.radius];
}

drawGrid();
