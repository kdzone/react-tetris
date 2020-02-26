import React from 'react';

import {SQ_STATE_ROW, SQ_STATE_FIG, SQ_STATE_OVER} from "./TetrisModel";

//***
const Square = ({st}) => {

    const cn =
        st === SQ_STATE_ROW ? 'r' :
            st === SQ_STATE_FIG ? 'f' :
                st === SQ_STATE_OVER ? 'v' :
                    null;
    return (
        <div className={cn}>
            {/*st*/}
        </div>

    )
};

//***
const Row = ({row}) => {
    return (
        <div className="row">
            {
                row.map((st, idx) => {
                    return (
                        <Square key={idx} st={st}/>
                    )
                })
            }
        </div>
    )

};

//***
const Board = (props) => {

    return (
        <div className="board">
            {
                props.board.map((row, idx) => {
                    return (
                        <Row key={idx} row={row}/>
                    )
                })
            }
        </div>
    )

};

export default Board;