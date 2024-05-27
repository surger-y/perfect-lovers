const WIDTH = 101
const HEIGHT = 101
const RADIUS = (WIDTH - 1)/2
const CENTER_X = RADIUS
const CENTER_Y = RADIUS

let on = []

const createDomElements = (number = 2) => {
  for (let i = 0; i < number; i++) {
    const clockContainer = document.querySelector('.clock-container');
    const pre = document.createElement('pre');
    pre.classList.add('clock');
    clockContainer.appendChild(pre);
  }
}
createDomElements();

const createCircle = (x_centre , y_centre , r) => {
  let x = r, y = 0;
  on.push({ x: (x + x_centre), y: (y + y_centre), symbol: '*' });
  if (r > 0) {
    on.push({ x: (x + x_centre), y: (-y + y_centre), symbol: '*' });
    on.push({ x: (y + x_centre), y: (x + y_centre), symbol: '*' });
    on.push({ x: (-y + x_centre), y: (x + y_centre), symbol: '*' });
  }
  let P = 1 - r;
  while (x > y) {
    y++;
    if (P <= 0)
      P = P + 2 * y + 1;
    else {
      x--;
      P = P + 2 * y - 2 * x + 1;
    }
    if (x < y)
      break;
    on.push({ x: (x + x_centre), y: (y + y_centre), symbol: '*' });
    on.push({ x: (-x + x_centre), y: (y + y_centre), symbol: '*' });
    on.push({ x: (x + x_centre), y: (-y + y_centre), symbol: '*' });
    on.push({ x: (-x + x_centre), y: (-y + y_centre), symbol: '*' });
    if (x != y) {
    on.push({ x: (y + x_centre), y: (x + y_centre), symbol: '*' });
    on.push({ x: (-y + x_centre), y: (x + y_centre), symbol: '*' });
    on.push({ x: (y + x_centre), y: (-x + y_centre), symbol: '*' });
    on.push({ x: (-y + x_centre), y: (-x + y_centre), symbol: '*' });
    }
  }
}

const createCenter = () => {
  on.push({ x: CENTER_X, y: CENTER_Y, symbol: '+' });
}

const generateHandAngles = () => {
  const date = new Date();
  const hours = ((date.getHours() % 12) + date.getMinutes() /60) * 30;
  const minutes = date.getMinutes() * 6;
  const seconds = date.getSeconds() * 6;
  const secondsRads = -1 * (seconds * Math.PI / 180 )
  const minutesRads = -1 * (minutes * Math.PI / 180 )
  const hoursRads = -1 * (hours * Math.PI / 180 )
  return { s: secondsRads, m: minutesRads, h: hoursRads }
}

const handPoints = (CENTER_X, CENTER_Y, angle, RADIUS) => {
  const newX = CENTER_X + RADIUS * Math.cos(angle- Math.PI);
  const newY = CENTER_Y + RADIUS * Math.sin(angle - Math.PI);
  return { x: Math.floor(newX), y: Math.floor(newY) };
}

const secondsEndPoint = () => {
  return handPoints(CENTER_X, CENTER_Y, generateHandAngles().s, 46); 
}

const minutesEndPoint = () => {
  return handPoints(CENTER_X, CENTER_Y, generateHandAngles().m, 40); 
}

const hoursEndPoint = () => {
  return handPoints(CENTER_X, CENTER_Y, generateHandAngles().h, 20); 
}

const secondsSlopeCorrection = () => {
  let dx = Math.abs(secondsEndPoint().x - CENTER_X);
  let dy = Math.abs(secondsEndPoint().y - CENTER_Y);
  return { dx: dx, dy: dy }
}

const minutesSlopeCorrection = () => {
  let dx = Math.abs(minutesEndPoint().x - CENTER_X);
  let dy = Math.abs(minutesEndPoint().y - CENTER_Y);
  return { dx: dx, dy: dy }
}

const hoursSlopeCorrection = () => {
  let dx = Math.abs(hoursEndPoint().x - CENTER_X);
  let dy = Math.abs(hoursEndPoint().y - CENTER_Y);
  return { dx: dx, dy: dy }
}

const createHands = (x1, y1, x2, y2, dx, dy, symChar) => {
  let sx = (x1 < x2) ? 1 : -1;
  let sy = (y1 < y2) ? 1 : -1;
  let err = dx - dy;

  while (true) {
    on.push({ x: x1, y: y1, symbol: symChar});

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
};

const fillArray = () => {
  on = []
  createCircle(CENTER_X, CENTER_Y, RADIUS);
  createCenter();
  createHands(CENTER_X, CENTER_Y, hoursEndPoint().x, hoursEndPoint().y, hoursSlopeCorrection().dx, hoursSlopeCorrection().dy, '@');
  createHands(CENTER_X, CENTER_Y, minutesEndPoint().x, minutesEndPoint().y, minutesSlopeCorrection().dx, minutesSlopeCorrection().dy, '*');
  createHands(CENTER_X, CENTER_Y, secondsEndPoint().x, secondsEndPoint().y, secondsSlopeCorrection().dx, secondsSlopeCorrection().dy, '`');
}

const drawClocks = () => {
  fillArray();
  const clocks = document.querySelectorAll('.clock');
  const emptyGrid = (rows, columns) => [...Array(rows)]
  .map(() => Array(columns)
    .fill(' '));
  const objExists = (rowCoord, columnCoord) => {
    return on.some(obj => obj.x === rowCoord && obj.y === columnCoord)
  }
  clocks.forEach ((clock) => {
    clock.replaceChildren();
    emptyGrid(WIDTH, HEIGHT).forEach((row, rowCoord) => {
      const lineBreak = document.createTextNode("\n");
      row.forEach((column, columnCoord) => {
	if (objExists(rowCoord, columnCoord)) {
	  const index = () => { 
	    return on.findIndex(obj => obj.x === rowCoord && obj.y === columnCoord) 
	  }
	  clock.appendChild(document.createTextNode(on[index()].symbol));
	} else {
	  clock.appendChild(document.createTextNode(' '));
	}
      });
      clock.appendChild(lineBreak);
    });
  });
}

drawClocks();

setInterval(() => {
  drawClocks();
}, 1000);
