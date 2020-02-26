const FIG_DIMS =
    [
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 2, y: 0}], // 0
        [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}], // 1
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2}], // 2
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 0}], // 3
        [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], // 4
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}], // 5
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 0}], // 6
        [{x: 0, y: 1}, {x: 1, y: 0}, {x: 2, y: 1}], // 7 !!!
        [{x: 0, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 0}], // 8
        [{x: 0, y: 0}, {x: 0, y: 1}, {x: 2, y: 0}, {x: 2, y: 1}], // 9

        [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 2, y: 4},
            {x: 0, y: 2}, {x: 1, y: 2}, {x: 3, y: 2}, {x: 4, y: 2},
            {x: 1, y: 1}, {x: 1, y: 3}, {x: 3, y: 1}, {x: 3, y: 3}]
    ];

/*
0    1    2    3    4    5    6    7    8    9
0xx|xx00|0000|00x0|xx00|0000|0x00|0x00|x0x0|x0x0
xx0|0xx0|xxx0|xxx0|xx00|xxxx|xxx0|x0x0|0x00|x0x0
000|0000|00x0|0000|0000|0000|0000|0000|0x00|0000
000|0000|0000|0000|0000|0000|0000|0000|0000|0000
*/

export const SQ_STATE_NONE = '0';
export const SQ_STATE_ROW = '=';
export const SQ_STATE_FIG = 'x';
export const SQ_STATE_OVER = 'v';

//***
class Figure {

    constructor(model) {
        this._model = model;
        this.doNew();
    }

    //*** public

    doNew() {
        const randomIdx = Math.floor(Math.random() * FIG_DIMS.length);
        const dim = [...FIG_DIMS[randomIdx]];

        let dmax = 0;
        let ymin = 99;
        dim.forEach((p) => {
            dmax = Math.max(dmax, p.x, p.y);
            ymin = Math.min(ymin, p.y);
        });
        this._dmax = dmax;

        const x = Math.trunc((this.model.maxCols - dmax - 1) / 2);

        const ok = this._canPlace(dim, x, -ymin);
        this._show(dim, x, -ymin, ok ? SQ_STATE_FIG : SQ_STATE_OVER);
        return ok;
    }

    doMove(dx, dy) {
        return this._move(this._dim, this._cx + dx, this._cy + dy);
    }

    doRotate() {
        if (this.dmax < 1)
            return true;

        const mid = this.dmax / 2;
        const dim = [];
        this._dim.forEach((p) => {
            let [x, y] = [p.x, p.y];

            const r_max = Math.max(mid - Math.min(x, y), Math.max(x, y) - mid);
            const xy_min = mid - r_max;
            const xy_max = mid + r_max;

            let len = r_max * 2;  // длина поворота (дуги)

            const xcalc = (dx, sign = 1) => {
                if (dx > 0) {
                    if (dx > len)
                        dx = len;
                    x = x + sign * dx;
                    len = len - dx;
                }
            };

            const ycalc = (dy, sign = 1) => {
                if (dy > 0) {
                    if (dy > len)
                        dy = len;
                    y = y + sign * dy;
                    len = len - dy;
                }
            };

            while (len > 0) {
                if (x <= mid && y < mid) {
                    xcalc(x - xy_min, -1);
                    ycalc(xy_max - y);
                } else if (x < mid && y >= mid) {
                    ycalc(xy_max - y);
                    xcalc(xy_max - x);
                } else if (x >= mid && y > mid) {
                    xcalc(xy_max - x);
                    ycalc(y - xy_min, -1);
                } else if (x > mid && y <= mid) {
                    ycalc(y - xy_min, -1);
                    xcalc(x - xy_min, -1);
                }
            }

            dim.push({x, y});

        });
        //console.log(JSON.stringify(this._dim));
        //console.log(JSON.stringify(dim));

        return this._move(dim, this._cx, this._cy)
            || this._move(dim, this._cx + 1, this._cy)
            || this._move(dim, this._cx - 1, this._cy);
    }

    // private

    _canPlace(dim, x, y) {
        return !dim.find((p) => {
            const ix = x + p.x;
            const iy = y + p.y;

            if (ix < 0 || ix >= this.model.maxCols ||
                iy < 0 || iy >= this.model.maxRows)
                return true;

            const state = this.board[iy][ix];
            return !(state === SQ_STATE_NONE || state === SQ_STATE_FIG);
        });
    }

    _move(dim, x, y) {
        if (!this._canPlace(dim, x, y))
            return false;

        this._hide();
        this._show(dim, x, y);
        return true;
    }

    _fill(state) {
        this._dim.forEach((p) => {
            const y = this._cy + p.y;
            if (y < this.model.maxRows)
                this.board[y][this._cx + p.x] = state;
        });
    }

    _hide() {
        this._fill(SQ_STATE_NONE);
    }

    _show(dim, x, y, state = SQ_STATE_FIG) {
        this._dim = dim;
        this._cx = x;
        this._cy = y;
        this._fill(state);
        this.model._changed();
    }

// properties

    get model() {
        return this._model;
    }

    get board() {
        return this.model.board;
    }

    get dmax() {
        return this._dmax;
    }

}

//***
export default class TetrisModel {

    constructor(maxRows, maxCols) {
        this._maxRows = maxRows;
        this._maxCols = maxCols;
        this.init();
    }

    init() {
        this._active = false;
        this._gameOver = false;
        this._figure = null;
        this._figCount = 0;
        this._lineCount = 0;
        this._scope = 0;

        this._board = [];
        for (let y = 0; y < this.maxRows; y++)
            this._newRow(y);
    }

    start() {
        if (this.active)
            return;

        if (this.gameOver)
            this.init();

        if (!this._figure)
            this._figure = new Figure(this);

        this._active = true;
    }

    stop() {
        this._active = false;
        this._gameOver = true;
        this._figure = null;
    }

    pause() {
        this._active = false;
        this._changed();
    }

    down() {
        if (!this.active)
            return false;

        if (this._figure.doMove(0, +1))
            return true;

        this._scope += Math.floor(this._figure._cy / 5);

        this._figCount++;
        this._checkRows();
        !this._figure.doNew() && this.stop();
        return false;
    }

    moveLt() {
        return this.active
            && this._figure.doMove(-1, 0);
    }

    moveRt() {
        return this.active
            && this._figure.doMove(1, 0);
    }

    rotate() {
        return this.active
            && this._figure.doRotate();
    }

    _newRow(y) {
        const row = new Array(this.maxCols);
        row.fill(SQ_STATE_NONE);
        this.board[y] = row;
    }

    _checkRows() {

        const scroll = (ridx) => {
            for (let y = ridx; y > 0; y--)
                this.board[y] = this.board[y - 1];
            this._newRow(0);
        };

        let rr = 0; // removed rows
        let ridx = this.maxRows - 1;
        while (ridx > 0) {

            let ok = true;
            const row = this.board[ridx];
            row.forEach((st, i) => {
                switch (st) {
                    case SQ_STATE_FIG:
                        row[i] = SQ_STATE_ROW;
                        break;
                    case SQ_STATE_NONE:
                        ok = false;
                        break;
                }
            });

            if (ok) {
                scroll(ridx);
                rr++;
            } else
                ridx--;
        }

        if (rr > 0) {
            this._lineCount =+ rr;

            // 100 300 700 1500
            this._scope +=  Math.pow(2, rr) * 100 - 100;
        }

    }

    _changed() {
        this._onChange && this._onChange(this);
    }

    // properties

    get maxCols() {
        return this._maxCols;
    }

    get maxRows() {
        return this._maxRows;
    }

    get board() {
        return this._board;
    }

    get active() {
        return this._active;
    }

    get gameOver() {
        return this._gameOver;
    }

    get figCount() {
        return this._figCount;
    }

    get lineCount() {
        return this._lineCount;
    }

    get scope() {
        return this._scope;
    }

    get onChange() {
        return this._onChange;
    }

    set onChange(handler) {
        this._onChange = handler;
    }
}

