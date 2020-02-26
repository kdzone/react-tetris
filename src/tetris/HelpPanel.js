import React from 'react';

//***
const HelpPanel = ({onStart}) => {

    return (
        <div className="help">
            <h3>Tetris with nezhdanchik</h3>
            <h5>version 1.0</h5>
            <ul>
                <li>[S] - start</li>
                <li>[R] - restart</li>
                <li>[P] - pause</li>
                <li>[&#8594;] - move to left</li>
                <li>[&#8592;] - move to right</li>
                <li>[&#8593;] - rotate</li>
                <li>[&#8595;] - down</li>
                <li>[space] - drop</li>
            </ul>
            <button onClick={onStart} >
                Start
            </button>
        </div>
    )
};

export default HelpPanel;