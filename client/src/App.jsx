import { useState,useEffect } from "react"
import Player from "./components/Player.jsx"
import socket from "./socket.js"
import GameBoard from "./components/GameBoard.jsx"
import Log from "./components/Log.jsx"
import Gameover from "./components/Gameover.jsx"


const WINNING_COMBINATIONS=[[{row:0,col:0},{row:0,col:1},{row:0,col:2}],[{row:0,col:0},{row:1,col:0},{row:2,col:0}],[{row:2,col:0},{row:2,col:1},{row:2,col:2}],[{row:0,col:2},{row:1,col:2},{row:2,col:2}],[{row:0,col:0},{row:1,col:1},{row:2,col:2}],[{row:0,col:2},{row:1,col:1},{row:2,col:0}],[{row:0,col:1},{row:1,col:1},{row:2,col:1}],[{row:1,col:0},{row:1,col:1},{row:1,col:2}]]

const initialGameBoard=[
    [null,null,null],
    [null,null,null],
    [null,null,null]
]

function deriveGameBoard(gameTurns){
  let gameBoard=initialGameBoard.map(t=>[...t])//not gameboard=initialgameboard will make both the refernce same so in the end when i have to restart by clicking restart button i have to make it initialgameboard so i have to preserve that variable so deep copy is done as shallow copy in nested things will lead to same reference for the nested elements
    gameTurns.map(t=>{
    const {square,player}=t;
    const{row,col}=square;
    gameBoard[row][col]=player
  })
  return gameBoard
}


function deriveWinner(gameBoard,names){
  let winner=null;

  for(const combination of WINNING_COMBINATIONS){
    const firstsquare= gameBoard[combination[0].row][combination[0].col]
    const secondsquare= gameBoard[combination[1].row][combination[1].col]
    const thirdsquare= gameBoard[combination[2].row][combination[2].col]
    if(firstsquare&&firstsquare===secondsquare&&secondsquare===thirdsquare){
      winner=firstsquare
    }
  }
  return winner
}

function App() {
    const [symbol, setSymbol] = useState(null);
    const [names, setNames] = useState({X:null,O:null});//player names with symbol keys
    const [players, setPlayers] = useState({});//socketid keys with symbols
    

const opponentSymbol=symbol==="X"?"O":"X"
  
  const[gameTurns,setGameTurns]=useState([])
  //const[activePlayer,setActivePlayer]=useState('X')
   useEffect(() => {
    socket.on('symbol', setSymbol);
    socket.on('gameTurns', setGameTurns);
    socket.on('roomFull', () => alert('Room is full'));
     socket.on('names', setNames); // 👈 listen for name updates
      socket.on('players', (players) => {
      setPlayers(players); // 👈 add this state
      });

    return () => socket.disconnect();
  }, []);



  const gameBoard=deriveGameBoard(gameTurns)
  const isWaitingForPlayer = Object.keys(players).length < 2;


  const winner=deriveWinner(gameBoard,names)

  const hasDraw=gameTurns.length==9&&!winner
  const activePlayer = gameTurns.length % 2 === 0 ? 'X' : 'O';

  /*function selectSquareChangesPlayer(rowIndex,colIndex){
    //setActivePlayer((currActivePlayer)=>currActivePlayer=='X'?'O':'X')//always use funcn method to change states when the new state is dependent on previous state.
    setGameTurns(prevTurns=>{//State updates within the same event handler are batched together, causing only one re-render.i.e setActivePlayer and setgameturn run asyn and after updating both value(dk which finishes first)will cause re render once not twice.React waits until the entire event handler (handleClick) finishes executing.then it applies all the updates to the state and triggers a single re-render.
      const currentPlayer=deriveActivePlayer(prevTurns)
      const updatedTurns=[{square:{row:rowIndex,col:colIndex},player:currentPlayer},...prevTurns]//we are not usingplayer:activePlayer as we can't get latest activePlayer always as we can't use setState((currActiveplayer)=>)i.e. functional approach in now.so we used a simple variable method for it.
      return updatedTurns
    })
  }*/

 function selectSquareChangesPlayer(row, col) {
    if (
    isWaitingForPlayer){return}
    if (gameBoard[row][col] === null && symbol === activePlayer && !winner) {
      socket.emit('makeMove', { square: { row, col }, player: symbol });
    }
  }

  /*function handleRestart(){
    setGameTurns([])//react , when passing[] this automatically creates new reference array and set it .we are directly mutating array but in case of passing[] ,it renders due to the reason explained earlier in line
  
  }*/
   function handleRestart() {
    socket.emit('restart');
  }
  return (
    <>
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialname="You" symbol={symbol} isActive={activePlayer === symbol} names={names} isCurrentPlayer={true}/> {/* for each person his symbol is fixed from socket.io and we have already captured it so from taht we can find the value of all props and then can set only valid user can change only his name and initial names are shown properly */}
          <Player initialname="Opponent" symbol={opponentSymbol} isActive={activePlayer === opponentSymbol} names={names} isCurrentPlayer={false}/>
          
        </ol>
        {winner||hasDraw?<Gameover winner={winner} names={names} symbol={symbol} Restart={handleRestart}/>:undefined}
        <GameBoard onSelectSquare={selectSquareChangesPlayer} gameBoard={gameBoard}/>
      
      
        {/*Summary: 
        Props as References and Closures in JavaScript
        why in above gameboard line we just passed selectsquarechangesplayer function but inside it is using setgameturns and we are not passing it explicitely. then also in gameboard component this function works fine. It does not work if we import this function in gameboard component explicitely and then use it because:

1. Passing Functions as Props:

In React, when a function is passed as a prop, the function is passed by reference.

The function retains its original closure (lexical environment), allowing it to access variables defined in its scope at the time of its declaration.

This is why the function works correctly when called from the child component—it has access to state variables (e.g., setGameTurns) from its parent component.


2. Importing a Function:

When a function is exported and imported into another module, it loses access to its closure because it no longer resides in the same lexical scope where it was defined.

Dependencies like setGameTurns are not automatically imported with the function and must be explicitly passed or redefined in the new module.

This is intentional to maintain modularity and isolate scopes between files.


3. Why Closures Work with Props:

Closures in JavaScript preserve access to the scope in which a function was declared.

When a function is passed as a prop, the parent component provides it with the closure needed to reference variables like setGameTurns.


4.Why Closures Don't Automatically Work Across Modules:

Modules in JavaScript are designed to be isolated units with their own scope.

Exporting a function only exports the function logic, not its surrounding closure.

To use such a function in another module, dependencies (e.g., state setters like setGameTurns) must be explicitly passed.

 */}
      </div>
      <Log gameTurns={gameTurns}/>
    </main>

    </>
    
  )
}

export default App
