import "./styles.css"

function gameBoard(rows, columns) {
  const board= []; //non-primitive

  // Create the gameboard
  for (let i=0; i< rows; i++) {
    board.push([]);
    for (let j= 0; j< columns; j++) {
      board[i].push(cell());
    }
  }
  // Get the gameboard with only the cell values (Getter for the board)
  const getGameBoard= () => {
    return board.map((row) => {
      return row.map((cell) => {
        return cell.getCellValue();
      })
    })
  }
  // Insert input in any cell (Setter for cells)
  const insertToken= (row, column, value) => {
    board[row][column].setCellValue(value);
  }

  return {getGameBoard, insertToken};
}

//Get & Setter for specific cells
function cell() {
  let cellValue= "_"; //primitive

  const getCellValue= () => {
    return cellValue;
  };

  const setCellValue= (value) => {
    cellValue = value;
  };

  return {getCellValue, setCellValue};
}

function gameController(player1Name= "Player 1", player2Name= "Player 2") {
  const players= [
    {
      name: player1Name,
      token: "X",
    },
    {
      name: player2Name,
      token: "O",
    }
  ];

  const board= gameBoard(3,3);
  console.log(board.getGameBoard());

  //Default active player initially is Player 1
  let activePlayer= players[0];

  //Gets currently active player
  const getActivePlayer= () => {
    return activePlayer;
  }
  
  //Switches player turn
  const switchPlayerTurn= () => {
    activePlayer= (activePlayer === players[0])? players[1]: players[0];
  }

  const playTurn= () => {
    let validMove= false;

     // Check for valid moves & insert token if the move is valid
    while (validMove === false) {
      //Get the row & column for inputting token
      const inputRowColumn= prompt("Enter cell row & cell column seperated by comma, in that order");
      // Retrun if cancel is pressed (null) 
      // The case for no input given ("") is handled later with isNaN(column)
      if (inputRowColumn === null) {
        return;
      }

      // If cancel is not pressed, parse the input
      const cellRowColumn= inputRowColumn.split(",").map((number) => {
        return Number(number.trim());
      });
      const row = cellRowColumn[0];
      const column= cellRowColumn[1];
      
      // Check for invalid input
      if (row< 0 || row> 2|| column<0 || column>2 || isNaN(row) || isNaN(column)) {
        alert("Invalid coordinate! Please enter numbers between 0 and 2.");
      } 
      else if (board[row][column] !== 0) { 
        alert("That cell is taken! Choose an empty spot.");
      }
      else {
        // Block to execute for valid input
        validMove= true;
        //Inserts the token of currently active player in the prompted cell
        board.insertToken(row, column, getActivePlayer().token);
        console.log(board.getGameBoard());
      }
    }
  }

  const winCondition= () => {
    return true;
  }

  return {getActivePlayer, switchPlayerTurn, playTurn};
}

// Game start
const game= gameController();
// 

