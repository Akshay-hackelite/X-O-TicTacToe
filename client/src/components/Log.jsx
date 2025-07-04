import { useState } from "react"

export default function Log({gameTurns}){
    return <ol id="log">
        {gameTurns.map(turn=><li key={`${turn.square.row}${turn.square.col}`}>{turn.player} selected {turn.square.row},{turn.square.col}</li>)}
    </ol>
    

}