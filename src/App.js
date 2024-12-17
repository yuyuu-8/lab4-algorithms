// App.js
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import {
  stepAlgorithm,
  DDAAlgorithm,
  bresenhamLine,
  bresenhamCircle,
  castlesPitwayAlgorithm
} from './components/Algorithms';

const App = () => {
  const canvasRef = useRef(null);
  const [algorithm, setAlgorithm] = useState('step');
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 100, y: 100 });
  const [radius, setRadius] = useState(50);
  const [gridSize, setGridSize] = useState(10);
  const [executionTime, setExecutionTime] = useState(0);

  // Функция отрисовки сетки и осей координат
  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Оси координат
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.stroke();
  };

  const drawPoints = (ctx, points) => {
    ctx.fillStyle = 'red';
    points.forEach(point => {
      ctx.fillRect(
        point.x * gridSize + ctx.canvas.width/2 - 2,
        ctx.canvas.height/2 - point.y * gridSize - 2,
        4,
        4
      );
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Отрисовка сетки
    drawGrid(ctx, canvas.width, canvas.height);
    
    // Вычисление координат относительно центра
    const x1 = startPoint.x;
    const y1 = startPoint.y;
    const x2 = endPoint.x;
    const y2 = endPoint.y;
    
    let points = [];
    let execTime = 0;

    switch(algorithm) {
      case 'step':
        const stepResult = stepAlgorithm(x1, y1, x2, y2);
        points = stepResult.points;
        execTime = stepResult.executionTime;
        break;
      case 'dda':
        const ddaResult = DDAAlgorithm(x1, y1, x2, y2);
        points = ddaResult.points;
        execTime = ddaResult.executionTime;
        break;
      case 'bresenham':
        const bresenhamResult = bresenhamLine(x1, y1, x2, y2);
        points = bresenhamResult.points;
        execTime = bresenhamResult.executionTime;
        break;
      case 'circle':
        const circleResult = bresenhamCircle(x1, y1, radius);
        points = circleResult.points;
        execTime = circleResult.executionTime;
        break;
      case 'castlespitway':
        const castlespitwayResult = castlesPitwayAlgorithm(x1, y1, x2, y2);
        points = castlespitwayResult.points;
        execTime = castlespitwayResult.executionTime;
        break;
      default:
        break;
    }

    setExecutionTime(execTime);
    drawPoints(ctx, points);
  }, [algorithm, startPoint, endPoint, radius, gridSize]);

  return (
    <div className="app">
      <div className="controls">
        <div>
          <label>Алгоритм:</label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="step">Пошаговый</option>
            <option value="dda">ЦДА</option>
            <option value="bresenham">Брезенхем (линия)</option>
            <option value="circle">Брезенхем (окружность)</option>
            <option value="castlespitway">Кастл-Питвей</option>
          </select>
        </div>
        
        <div>
          <label>Начальная точка:</label>
          <input
            type="number"
            value={startPoint.x}
            onChange={(e) => setStartPoint({...startPoint, x: parseInt(e.target.value)})}
          />
          <input
            type="number"
            value={startPoint.y}
            onChange={(e) => setStartPoint({...startPoint, y: parseInt(e.target.value)})}
          />
        </div>
        
        {algorithm !== 'circle' ? (
          <div>
            <label>Конечная точка:</label>
            <input
              type="number"
              value={endPoint.x}
              onChange={(e) => setEndPoint({...endPoint, x: parseInt(e.target.value)})}
            />
            <input
              type="number"
              value={endPoint.y}
              onChange={(e) => setEndPoint({...endPoint, y: parseInt(e.target.value)})}
            />
          </div>
        ) : (
          <div>
            <label>Радиус:</label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
            />
          </div>
        )}
        
        <div>
          <label>Размер сетки:</label>
          <input
            type="number"
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value))}
          />
        </div>
        
        <div>
          <label>Время выполнения: {executionTime.toFixed(3)} мс</label>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{border: '1px solid black'}}
      />

<div class="algorithm-description">
            <h2>Алгоритм ЦДА (DDA) для рисования линии</h2>

            <h3>Пошаговый пример:</h3>
            <p>
                Рисуем линию от точки (2, 3) до точки (7, 5).
            </p>
            <ol>
                <li>Вычисляем разности:
                    <ul>
                        <li>dx = 7 - 2 = 5</li>
                        <li>dy = 5 - 3 = 2</li>
                    </ul>
                </li>
                <li>Определяем количество шагов:
                    <ul>
                        <li>steps = max(|dx|, |dy|) = 5</li>
                    </ul>
                </li>
                <li>Вычисляем инкременты:
                    <ul>
                        <li>xIncrement = dx / steps = 5 / 5 = 1</li>
                        <li>yIncrement = dy / steps = 2 / 5 = 0.4</li>
                    </ul>
                </li>
                <li>Инициализация:
                    <ul>
                        <li>x = 2</li>
                        <li>y = 3</li>
                    </ul>
                </li>
                <li>Итерации:
                    <ul>
                        <li>Шаг 1: (2, 3) → (3, 3.4) → округляем до (3, 3)</li>
                        <li>Шаг 2: (3, 3.4) → (4, 3.8) → округляем до (4, 4)</li>
                        <li>Шаг 3: (4, 3.8) → (5, 4.2) → округляем до (5, 4)</li>
                        <li>Шаг 4: (5, 4.2) → (6, 4.6) → округляем до (6, 5)</li>
                        <li>Шаг 5: (6, 4.6) → (7, 5) → округляем до (7, 5)</li>
                    </ul>
                </li>
            </ol>
            <p>
                <strong>Результат:</strong> Пиксели, нарисованные алгоритмом: (2,3), (3,3), (4,4), (5,4), (6,5), (7,5)
            </p>
        </div>
    </div>
  );
};

export default App;
