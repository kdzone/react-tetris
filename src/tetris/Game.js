import React, {useState, useEffect} from 'react'

import Board from "./Board";
import ScopePanel from "./ScopePanel"
import TetrisModel from "./TetrisModel";

import './Game.scss';
import HelpPanel from "./HelpPanel";

//***
const Game = () => {

    const BOARD_ROWS = 24;
    const BOARD_COLS = 12;

    // env

    const [env, setEnv] = useState({
        model: new TetrisModel(BOARD_ROWS, BOARD_COLS),
        level: 1
    });

    const handleChange = () => {
        const newLevel = Math.trunc(env.model.lineCount / 10) + 1;
        if (env.level !== newLevel)
            startTimer(env.model, false);
        setEnv({...env});
    };

    // width

    const [width, setWidth] = useState(null);

    const calcWidth = () => {
        const el = document.querySelector('.tetris .board');
        return el ? Math.ceil(el.offsetHeight / 2) : null;
    };

    const handleResize = () => {
        setWidth(calcWidth());
    };

    // effect

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    const startTimer = (m, drop) => {
        /*
        console.log('---startTimer: ' + drop);
        */
        stopTimer();

        if (!m.active)
            return;

        env.drop = drop;
        const delay = drop ? 20 : 500 - (env.level - 1) * 50;

        env.timer = setInterval(() => {
            if (!m.down()) {

                if (drop)
                    startTimer(m, false);
                else if (!m.active)
                    stopTimer();
            }
        }, delay);
    };

    const stopTimer = () => {
        if (env.timer) {
            clearInterval(env.timer);
            env.timer = null;
        }
    };

    const doStart = (m) => {
        if (m.active)
            return;

        m.onChange = handleChange;
        m.start();
        startTimer(m, false);
    };

    const doRestart = (m) => {
        stopTimer();
        m.stop();
        doStart(m);
    };

    const doPause = (m) => {
        stopTimer();
        m.pause();
    };

    const doDrop = (m) => {
        startTimer(m, !env.drop);
    };

    const handleKeyDown = (e) => {
        const keyNames = {32: 'doDrop', 80: 'doPause', 82: 'doRestart', 83: 'doStart'};

        const m = env.model;

        let key = keyNames[e.keyCode];
        if (!key) key = e.key;
        switch (key) {
            case 'doStart':
            case 'Enter':
                doStart(m);
                break;
            case 'doRestart':
                doRestart(m);
                break;
            case 'doPause':
                doPause(m);
                break;
            case 'doDrop':
                doDrop(m);
                break;
            case 'ArrowLeft':
                m.moveLt();
                break;
            case 'ArrowRight':
                m.moveRt();
                break;
            case 'ArrowDown':
                m.down();
                break;
            case 'ArrowUp':
            case 'Clear':
                m.rotate();
                break;
            default:
                //alert(`key=${e.key} : keyCode=${e.keyCode}`);
                return;
        }
        e.preventDefault();
    };

    const styles = {
        "width": width,
        "visibility": width ? "visible" : "hidden",
    };

    return (
        <div className="tetris" style={styles}>
            {/*console.log('---render')*/}
            <ScopePanel env={env}/>
            <Board board={env.model.board}/>
            {!env.model.active && <HelpPanel onStart={() => {doStart(env.model)}}/>}
        </div>
    )

};

export default Game;
