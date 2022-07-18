import React, { useEffect,useState } from "react";
import './TicTacToeContainer.css'
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001")

const TicTacToe = () => {
    
    const [turn, setTurn] = useState('❌')
    const [cells, setCells] = useState(Array(9).fill('')) //Creates an array of 9 items which are a blank string, these will go on to be assigned 'x' or 'o'.
    const [winner, setWinner] = useState(null)
    
    useEffect(() => {
        socket.on("updated_board", (data) => {
            setCells(data.squares);
            checkForWinner(data.squares);
        })
    }, [cells])

    const checkForWinner = (squares) => {
        let combos = {
            across: [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8]
            ],
            down: [
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8]
            ],
            diagonal: [
                [0, 4, 8],
                [2, 4, 6]
            ]
        }
        for (let combo in combos) {
            combos[combo].forEach((pattern) => {
                //console.log(pattern);
                if (
                    squares[pattern[0]] === '' ||
                    squares[pattern[1]] === '' ||
                    squares[pattern[2]] === '' 
                ) {
                    //do nothing
                } else if (squares[pattern[0]] === squares[pattern[1]] &&
                    squares[pattern[1]] === squares[pattern[2]]
                ) {
                    setWinner(`The winner is ${squares[pattern[0]]}`);
                } else if(squares.includes("") === false) {
                    setWinner("It's a Draw!")
                }
            })
        }
    }

    const handleClick = (num) => {
        //alert(num)
        if (cells[num] !== '') {
            alert('already clicked');
            return;
        }
        let squares = [...cells]
        if (turn === '❌') {
            squares[num] = '❌'
            setTurn('⭕');
        } else {
            squares[num] = '⭕'
            setTurn('❌')
        }
        socket.emit("player_move", {squares, winner})
        checkForWinner(squares)
        setCells(squares)
        //console.log(squares)
    }

	const handleRestart = () => {
		setWinner(null);
		setCells(Array(9).fill(''));
	};

    const Cell = ({ num }) => {
        return <td onClick={() => {handleClick(num);}}>{cells[num]}</td>
    }

    return (
        <div className="container">
            <p>Turn: {turn}</p>
            <table>
                <tbody>
                    <tr>
                        <Cell num={0}/>
                        <Cell num={1}/>
                        <Cell num={2}/>
                    </tr>
                    <tr>
                        <Cell num={3}/>
                        <Cell num={4}/>
                        <Cell num={5}/>
                    </tr>
                    <tr>
                        <Cell num={6}/>
                        <Cell num={7}/>
                        <Cell num={8}/>
                    </tr>
                </tbody>
            </table>
			{winner && (
				<>
					<p>{winner}</p>
					<button onClick={() => handleRestart()}>Play Again</button>
				</>
			)}
        </div>
    )
}

export default TicTacToe;