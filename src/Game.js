import * as Chess from 'chess.js';
import {BehaviorSubject} from 'rxjs';

// Initialise the chess object.
const chess = new Chess();

// The current behaviour from the game.
export const gameSubject = new BehaviorSubject();

// Initialise the game.
export function initGame(){
    updateGame()
}

// Reset the game if end.
export function resetGame() {
    chess.reset()
    updateGame()
}

// Check if the pawn can be move with or without promotion.
export function handleMove(from, to){
    const promotions = chess.moves({ verbose: true }).filter(m => m.promotion)
    console.table(promotions);
    if(promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)){
        const pendingPromotion = { from, to, color: promotions[0].color };
        updateGame(pendingPromotion);
    }
    const {pendingPromotion} = gameSubject.getValue();

    if(!pendingPromotion){
        move(from, to, pendingPromotion);
    }

}

// Check if the piece can be move legally.
export function move(from, to, promotion) {
    let tempMove = { from, to }
    if (promotion) {
        tempMove.promotion = promotion
    }
    const legalMove = chess.move(tempMove)

    if (legalMove) {
        updateGame()
    }
}

// Update the progress of the game.
function updateGame(pendingPromotion) {
    const isGameOver = chess.game_over()

    const newGame = {
        board: chess.board(),
        pendingPromotion,
        isGameOver,
        turn: chess.turn(),
        result: isGameOver ? getGameResult() : null
    }

    gameSubject.next(newGame)
}

// Get the final result from the game.
function getGameResult() {
    var result = 'UNKNOWN REASON'
    if (chess.in_checkmate()) {
        const winner = chess.turn() === "w" ? 'BLACK' : 'WHITE'
        result = `CHECKMATE - WINNER - ${winner}`
    } else if (chess.in_draw()) {
        let reason = '50 - MOVES - RULE'
        if (chess.in_stalemate()) {
            reason = 'STALEMATE'
        } else if (chess.in_threefold_repetition()) {
            reason = 'REPETITION'
        } else if (chess.insufficient_material()) {
            reason = "INSUFFICIENT MATERIAL"
        }
        result= `DRAW - ${reason}`
    }
    return result
}