export default function Gameover({winner,names,symbol,Restart}){
      let message;
    if (winner) {
        if (names[winner]) {
            message = `🎉 Congratulations ${names[winner]} won!`;
        } 
        else if (symbol === winner) {
            message = "🎉 You won!";
        }else {
            message = "😢 You lost.";
        }
    }else {
    message = "It's a draw!";
    }
    return(
        <div id="game-over">
        <h2>Game Over !</h2>
        <p>{message}</p>
        
        <p>
            <button onClick={Restart}>Rematch!</button>
        </p>
        </div>  
    )
}