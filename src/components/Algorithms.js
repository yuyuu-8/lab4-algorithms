// algorithms.js

export const stepAlgorithm = (x1, y1, x2, y2) => {
    const startTime = performance.now();
    const points = [];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = Math.round(x1 + dx * t);
      const y = Math.round(y1 + dy * t);
      points.push({x, y});
    }
  
    return { points, executionTime: performance.now() - startTime };
  };
  
  export const DDAAlgorithm = (x1, y1, x2, y2) => {
    const startTime = performance.now();
    const points = [];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
  
    const xIncrement = dx / steps;
    const yIncrement = dy / steps;
  
    let x = x1;
    let y = y1;
  
    for (let i = 0; i <= steps; i++) {
      points.push({x: Math.round(x), y: Math.round(y)});
      x += xIncrement;
      y += yIncrement;
    }
  
    return { points, executionTime: performance.now() - startTime };
  };
  
  export const bresenhamLine = (x1, y1, x2, y2) => {
    const startTime = performance.now();
    const points = [];
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = x1 < x2 ? 1 : -1;
    let sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
  
    while (true) {
      points.push({x: x1, y: y1});
      if (x1 === x2 && y1 === y2) break;
      let e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  
    return { points, executionTime: performance.now() - startTime };
  };
  
  export const bresenhamCircle = (centerX, centerY, radius) => {
    const startTime = performance.now();
    const points = [];
    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;
  
    const addPoints = (x, y) => {
      points.push({x: centerX + x, y: centerY + y});
      points.push({x: centerX - x, y: centerY + y});
      points.push({x: centerX + x, y: centerY - y});
      points.push({x: centerX - x, y: centerY - y});
      points.push({x: centerX + y, y: centerY + x});
      points.push({x: centerX - y, y: centerY + x});
      points.push({x: centerX + y, y: centerY - x});
      points.push({x: centerX - y, y: centerY - x});
    };
  
    while (y >= x) {
      addPoints(x, y);
      x++;
      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6;
      }
    }
  
    return { points, executionTime: performance.now() - startTime };
  };
  
  export const castlesPitwayAlgorithm = (x1, y1, x2, y2) => {
    const startTime = performance.now();
    const points = [];
    let dx = x2 - x1;
    let dy = y2 - y1;
    let x = x1;
    let y = y1;
  
    const sign = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
    const abs = Math.abs;
  
    const sx = sign(dx);
    const sy = sign(dy);
    dx = abs(dx);
    dy = abs(dy);
  
    let exchange = false;
    if (dy > dx) {
      [dx, dy] = [dy, dx];
      exchange = true;
    }
  
    let e = 2 * dy - dx;
  
    for (let i = 0; i <= dx; i++) {
      points.push({x, y});
      while (e >= 0) {
        if (exchange) x += sx;
        else y += sy;
        e -= 2 * dx;
      }
      if (exchange) y += sy;
      else x += sx;
      e += 2 * dy;
    }
  
    return { points, executionTime: performance.now() - startTime };
  };
  