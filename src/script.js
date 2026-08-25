import "./styles.css"

const DEFAULTCELLVALUE= "_";

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
  let cellValue= DEFAULTCELLVALUE; //primitive

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
  ]
  // Initialize the gameBoard
  const boardObj= gameBoard(3,3);

  // Function to display the game board
  const displayGameBoard = () => {
    console.log(boardObj.getGameBoard());
  }

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

  // Starts turn and inputs token
  const playTurn= () => {
    let validMove= false;

     // Check for valid moves & insert token if the move is valid
    while (validMove === false) {
      //Get the row & column for inputting token
      const inputRowColumn= prompt("Enter cell row & cell column seperated by comma, in that order");
      // Retrun if cancel is pressed (null) 
      // The case for no input given ("") is handled later with isNaN(column)
      if (inputRowColumn === null) {
        return "cancel";
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
      else if (boardObj.getGameBoard()[row][column] !== DEFAULTCELLVALUE) { 
        alert("That cell is taken! Choose an empty spot.");
      }
      else {
        // Block to execute for valid input
        validMove= true;
        //Inserts the token of currently active player in the prompted cell
        boardObj.insertToken(row, column, getActivePlayer().token);
      }
    }
  }

  // Function to check the win condition
  const checkWinCondition= () => {
    const board= boardObj.getGameBoard();
    const rows= board.length;
    const columns= board[0].length;
    const activePlayerToken= getActivePlayer().token;

    // Check horizontally (r fix, c anything)
    for (let r= 0; r< rows; r++) {
      let rowMatch;

      rowMatch= board[r].every((cell) => {
        return activePlayerToken === cell;
      })

      if (rowMatch === true) {
        return true;
      }
    }

    // Check vertically (c fix, r anything)
    for (let c= 0; c< columns; c++) {
      let columnMatch= true;

      for (let r= 0; r< rows; r++) {
        if (activePlayerToken !== board[r][c]) {
          columnMatch= false;
          break;
        }
      }

      if (columnMatch === true) {
        return true;
      }
    }

    // Check accross main diagonal (r = c = i)
    let mainDiagonalMatch= true;

    for (let i= 0; i< rows; i++) {

      if (activePlayerToken !== board[i][i]) {
        mainDiagonalMatch= false;
        break;
      }
    }
  
    if (mainDiagonalMatch === true) {
      return true;
    }

    // Check accross cross diagonal (r + c = constant (r-min + c-max or r-max + c-min))
    let  crossDiagonalMatch= true;
    let rowColumnConstantSum= 0+ columns- 1; //r-min = 0, c-max= columns- 1; 

    for (let i=0; i< rows; i++) {

      if (activePlayerToken !== board[i][rowColumnConstantSum-i]) {
        crossDiagonalMatch= false;
        break;
      }
    }

    if (crossDiagonalMatch === true) {
      return true;
    }
  }

  // Check tie condition
  const checkTieCondition= () => {
    const board= boardObj.getGameBoard();

    const isBoardFull= board.every((row) => {
      return row.every((cell) => {
        return cell !== DEFAULTCELLVALUE;
      })
    })

    return isBoardFull;
  }

  // Function incorporating earlier functions for game flow
  const playGame = () => {
    let gameOver= false;
    // Default gameBoard display
    displayGameBoard(); 

    while (!gameOver) {
      console.log(`Starting ${getActivePlayer().name}'s turn...`);
      const turnResult= playTurn();
      
      if (turnResult=== "cancel") {
        console.log(`Game was cancelled by ${getActivePlayer().name}.`);
        break;
      }

      displayGameBoard();

      if (checkWinCondition() === true) {
        console.log(`${getActivePlayer().name} wins. Game over.`);
        gameOver= true;
      } 
      else if (checkTieCondition() === true) {
        console.log(`Its a tie between ${players[0].name} & ${players[1].name}.`);
        gameOver= true;
      }
      else {
        switchPlayerTurn();
      }
    }
  }

  return {playGame};
}

// Game starts & initializes internally
const game= gameController();

game.playGame();


