import { useEffect, useState } from "react";
import socket from "../socket.js";

export default function Player({ initialname, symbol, isActive, names, isCurrentPlayer }) {
  const [isEditing, setIsEditing] = useState(false);
  const [playerName, setPlayerName] = useState(initialname);


  useEffect(() => {
    if (!isEditing && names[symbol]) { // we should use useefect because other wise if we write code inside useefect directly it will cause infinite loop.and another thing &&names[symbol] so that initially it does not run on first time as we want initial name because names[symbol]is null
      setPlayerName(names[symbol]);
    }
  }, [names, symbol, isEditing]);

  function handleEditClick() {
    if (isEditing) {//this means on clicking save that is we are not typing because at that time state will be is editing , it becomes !isediting afterwards(state change happens later)
      socket.emit("updateName", { symbol, name: playerName });//if we have to sync the names , then we have to give it to server and there by listener it will store it and then again emit it and then that will be listend in app.jsx and there after listening it ,a func will run which will change the state and hence player will again be called, and when it will be called this times then names obj will be used due to useefect 
    }
    setIsEditing(prev => !prev);
  }

  function handleChange(e) {
    setPlayerName(e.target.value);
  }

  const editablePlayerName = isEditing ? (
    <input type="text" value={playerName} onChange={handleChange} />
  ) : (
    <span className="player-name">{playerName}</span>
  );

  return (
    <li className={isActive ? "active" : undefined}>
      <span className="player">
        {editablePlayerName}
        <span className="player-symbol">{symbol}</span>
      </span>
      {isCurrentPlayer && (
        <button onClick={handleEditClick}>
          {isEditing ? "Save" : "Edit"}
        </button>
      )}
    </li>
  );
}
