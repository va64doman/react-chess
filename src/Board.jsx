import React, { useEffect, useState } from 'react'
import BoardSquare from './BoardSquare'
export default function Board({ board, turn }) {
  const [currBoard, setCurrBoard] = useState([])
  // Check if it is white turn, if not, flip the board.
  useEffect(() => {
    setCurrBoard(
      turn === 'w' ? board.flat() : board.flat().reverse()
    )
  }, [board, turn])

  // Get the piece's position. The top left of the board is 0, while the bottom right is 63.
  function getXYPosition(i) {
    const x = turn === 'w' ? i % 8 : Math.abs((i % 8) - 7)
    const y =
      turn === 'w'
        ? Math.abs(Math.floor(i / 8) - 7)
        : Math.floor(i / 8)
    return { x, y }
  }
  // Check if the piece from this position is black.
  function isBlack(i) {
    const { x, y } = getXYPosition(i)
    return (x + y) % 2 === 1
  }
  // Convert position to letter by number.
  function getPosition(i) {
    const { x, y } = getXYPosition(i)
    const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][
      x
    ]
    return `${letter}${y + 1}`
  }
  return (
    <div className="board">
      {currBoard.map((piece, i) => (
        <div key={i} className="square">
          <BoardSquare
            piece={piece}
            black={isBlack(i)}
            position={getPosition(i)}
          />
        </div>
      ))}
    </div>
  )
}