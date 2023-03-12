import './style.css';
import { states } from './config/states';
import LangtonGrid from './grid';

/* boilerplate */
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/* end boilerplate */

const cellSize = 5;
const cellsAcross = Math.floor(canvas.width / cellSize);
const cellsDown = Math.floor(canvas.height / cellSize);

let grid = new LangtonGrid(cellsAcross, cellsDown);
let prevTime = new Date();

// TODO can optimize this by only re-rendering what has changed
const drawGrid = () => {
    for(let i = 0; i < grid.cells.length; i++) {
        for(let j = 0; j < grid.cells[i].length; j++) {
            if(grid.cells[i][j].curState !== 0) {
                let x = j * cellSize;
                let y = i * cellSize;
                let state = grid.cells[i][j].curState;

                ctx.beginPath();
                ctx.rect(x, y, cellSize, cellSize);
                ctx.fillStyle = states[state];
                ctx.strokeStyle = '#4d4d4d';
                ctx.fill();
                // ctx.stroke();
            }
        }
    }
}

const animate = () => {
    let currentTime = new Date();

    if((currentTime.getTime() - prevTime.getTime()) > 10) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        grid.evalRules();
        prevTime = currentTime;
    }

    requestAnimationFrame(animate);
}

animate();
