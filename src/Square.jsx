import React from 'react';

export default function Square({children, black}){
    // Each square must be opposite color to the adjacent horizontal and vertical squares.
    const bgClass = black ? 'square-black' : 'square-white';
    return (
        <div className={`${bgClass} board-square`}>
            {children}
        </div>
    )
}