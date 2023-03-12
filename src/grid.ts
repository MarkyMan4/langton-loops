import { initialLoop } from "./config/initialLoop";
import { rules } from "./config/rules";

class LangtonGrid {
    private width: number;
    private height: number;
    public cells: Cell[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.cells = [];

        for(let i = 0; i < height; i++) {
            let row: Cell[] = [];

            for(let j = 0; j < width; j++) {
                row.push(new Cell(0, 0));
            }

            this.cells.push(row);
        }

        // precompute neighbors
        for(let i = 0; i < height; i++) {
            for(let j = 0; j < width; j++) {
                let upNeighbor = i > 0 ? this.cells[i - 1][j] : new Cell(0, 0);
                let rightNeighbor = j < this.cells[i].length - 1 ? this.cells[i][j + 1] : new Cell(0, 0);
                let downNeighbor = i < this.cells.length - 1 ? this.cells[i + 1][j] : new Cell(0, 0);
                let leftNeighbor = j > 0 ? this.cells[i][j - 1] : new Cell(0, 0);
                let neighbors = [upNeighbor, rightNeighbor, downNeighbor, leftNeighbor];
                this.cells[i][j].neighbors = neighbors;
            }
        }

        this.initializeLoop();
    }

    // sets the initial state
    private initializeLoop() {
        const centerX = Math.floor(this.width / 2) - 5;
        const centerY = Math.floor(this.height / 2) - 5;

        for(let i = centerY; i < centerY + initialLoop.length; i++) {
            for(let j = centerX; j < centerX + initialLoop[i - centerY].length; j++) {
                this.cells[i][j].curState = initialLoop[i - centerY][j - centerX];
            }
        }

        for(let i = 0; i < this.cells.length; i++) {
            for(let j = 0; j < this.cells[i].length; j++) {
                let currentState = this.cells[i][j].curState;

                let upState = this.cells[i][j].neighbors[0].curState;
                let rightState = this.cells[i][j].neighbors[1].curState;
                let downState = this.cells[i][j].neighbors[2].curState;
                let leftState = this.cells[i][j].neighbors[3].curState;

                let key = `${currentState}${upState}${rightState}${downState}${leftState}`;
                let newState = rules.get(key);

                this.cells[i][j].nextState = newState !== undefined ? newState : currentState
            }
        }
    }

    /*
    For each cell, set prevState to currentState
    Then evaluate the rules based on prevState
    Set result of evaluation to currentState
    */
    evalRules() {
        for(let i = 0; i < this.cells.length; i++) {
            for(let j = 0; j < this.cells[i].length; j++) {
                let currentState = this.cells[i][j].curState;

                let upState = i > 0 ? this.cells[i - 1][j].curState : 2;
                let rightState = j < this.cells[i].length - 1 ? this.cells[i][j + 1].curState : 2;
                let downState = i < this.cells.length - 1 ? this.cells[i + 1][j].curState : 2;
                let leftState = j > 0 ? this.cells[i][j - 1].curState : 2;

                let key = `${currentState}${upState}${rightState}${downState}${leftState}`;
                let newState = rules.get(key);

                this.cells[i][j].nextState = newState !== undefined ? newState : currentState
            }
        }

        for(let i = 0; i < this.cells.length; i++) {
            for(let j = 0; j < this.cells[i].length; j++) {
                this.cells[i][j].curState = this.cells[i][j].nextState;
            }
        }
    }
}

class Cell {
    private _curState: number;
    private _nextState: number;
    private _neighbors: Cell[]; // list of neighbors in clockwise order starting with top neighbor

    constructor(curState: number, nextState: number) {
        this._curState = curState;
        this._nextState = nextState;
        this._neighbors = [];
    }

    public get curState() {
        return this._curState;
    }

    public set curState(newCurState: number) {
        this._curState = newCurState;
    }

    public get nextState() {
        return this._nextState;
    }

    public set nextState(newNextState: number) {
        this._nextState = newNextState;
    }

    public get neighbors() {
        return this._neighbors;
    }

    public set neighbors(newNeighbors: Cell[]) {
        this._neighbors = newNeighbors;
    }
}

export default LangtonGrid;
