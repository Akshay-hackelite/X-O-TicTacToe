import { useState } from "react"

const initialGameBoard=[
    [null,null,null],
    [null,null,null],
    [null,null,null]
]
export default function GameBoard({onSelectSquare,activePlayerSymbol}){
   
    const[gameBoard,setGameBoard]=useState(initialGameBoard)
    
    function handleSelectSquare(rowIndex,colIndex){
        setGameBoard((prevGameBoard)=>{
            const updatedBoard=[...prevGameBoard.map(innerArray=>[...innerArray])]
            updatedBoard[rowIndex][colIndex]=activePlayerSymbol
            return updatedBoard
        })
        onSelectSquare()
       
    }
        
/*
        const updatedBoard=gameBoard.map(innerArray=>[...innerArray])
            updatedBoard[rowIndex][colIndex]='X'
            setGameBoard(updatedBoard)
        */
   
    /*A shallow copy creates a new object or array at the top level but does not recursively copy nested objects or arrays. If the original data structure contains nested references (e.g., objects or arrays inside an array), the shallow copy will share those references with the original.This is essentially duplicating the outer layer but maintaining references for inner layers.but in deep copy Recursively duplicates all nested objects or arrays, ensuring no references are shared between the original and the copy.This fully breaks the connection between the original and the copy. 
    
    so above was nested so we have to do deep copy and deep copy is done by above method. we can see prevarray was 2d array and after using it with map it's elements are 1d array and in 1d array we are using spread operator which do shallow copy but remember in 1 d array or object shallow copy is same as deep copy.For flat structures like 1D arrays or objects with only primitive values, the behavior of a shallow copy is the same as a deep copy, because:Primitives are copied by value.No nested references exist to worry about.splice and spread creates shallow copy.
eg 1: 
const arr = [1, 2, 3];
const shallowCopy = arr.slice(); // Creates a new array
shallowCopy[0] = 99;

console.log(arr); // [1, 2, 3] (unchanged)
console.log(shallowCopy); // [99, 2, 3] (independent)
 
eg2:
const obj = { a: 1, b: 2 };
const shallowCopy = { ...obj }; // Shallow copy
shallowCopy.a = 99;

console.log(obj); // { a: 1, b: 2 } (unchanged)
console.log(shallowCopy); // { a: 99, b: 2 } (independent)

for 2d array:
eg1 Example with Shallow Copy::
const nestedArr = [[1, 2], [3, 4]];
const shallowCopy = nestedArr.slice();

shallowCopy[0][0] = 99;

console.log(nestedArr); // [[99, 2], [3, 4]] (nested data affected)
console.log(shallowCopy); // [[99, 2], [3, 4]] (same reference for inner arrays)

Example with Deep Copy:

const nestedArr = [[1, 2], [3, 4]];
const deepCopy = nestedArr.map(innerArray => [...innerArray]);

deepCopy[0][0] = 99;

console.log(nestedArr); // [[1, 2], [3, 4]] (unchanged)
console.log(deepCopy); // [[99, 2], [3, 4]] (independent)

Key Insight:

Shallow copy vs. deep copy determines how much of the structure is copied.

Copy by value vs. reference determines how individual elements within the structure behave when copied.

*/

/* why are we making deep copy now i.e independent copy of state?? because very important when we have array or object as state .don't modify the original state directly.we should deep copy it in other and then pass this copied array to setstate so that state changes and rendering occurs otherwise if we do not do deep copy and do this
setGameBoard((prevGameBoard) => {
    prevGameBoard[rowIndex][colIndex] = 'X'; // Directly mutates the original array
    return prevGameBoard; // Returns the same reference
});
so the refernece is same and state actually doesn't change and rendering not occured.because in array and objects state depends on refernce values so in order to render again refernce should change in case of objects and arrays. 
*/
    return (
        <>
        <ol  id="game-board">
            {gameBoard.map((row,rowIndex)=><li key={rowIndex}>
               <ol>
                {row.map((playerSymbol,colIndex)=>(
                    <li key={colIndex}>
                        <button onClick={()=>handleSelectSquare(rowIndex,colIndex)}>{playerSymbol}</button>
                    </li>
                ))}
               </ol>

            </li>)}
        </ol>
        </>
    )
}