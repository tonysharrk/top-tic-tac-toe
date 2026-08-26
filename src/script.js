import "./styles.css"

const DEFAULTCELLVALUE= "";

function gameBoard(rows, columns) {
  const board= []; //non-primitive

  // Create the gameboard
  const initializeGameBoard= () => {
    // Always reset the variable before creating anything inside it. Because the variable is declared outside this function scope, so its state is maintained by this function through closure.
    board.length= 0;

    for (let r=0; r< rows; r++) {
      board.push([]);
      for (let c= 0; c< columns; c++) {
        board[r].push(cell());
      }
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

  const resetGameBoard= () => {
    initializeGameBoard();
  }

  initializeGameBoard();

  return {getGameBoard, resetGameBoard, insertToken};
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

  const getBoardDetails= () => {
    return {
      board: boardObj.getGameBoard(),
      rows: boardObj.getGameBoard().length,
      columns: boardObj.getGameBoard()[0].length
    };
  };

  //Default active player initially is Player 1
  let activePlayer= players[0];

  //Gets currently active player
  const getActivePlayer= () => {
    return activePlayer;
  }

  // Reset game board & reset active player turn
  const resetBoard= () => {
    boardObj.resetGameBoard();
    activePlayer= players[0];
  }
  
  //Switches player turn
  const switchPlayerTurn= () => {
    activePlayer= (activePlayer === players[0])? players[1]: players[0];
  }

  // Starts turn and inputs token
  const playTurn= (row, column) => {
    if (row< 0 || row> 2|| column<0 || column>2 || isNaN(row) || isNaN(column)) {
      return "Invalid coordinate! Please enter numbers between 0 and 2.";
    } 
    else if (boardObj.getGameBoard()[row][column] !== DEFAULTCELLVALUE) { 
      return "That cell is taken! Choose an empty spot.";
    }
    else {
      //Inserts the token of currently active player in the prompted cell
      boardObj.insertToken(row, column, getActivePlayer().token);
    }
  }

  // Function to check the win condition
  const checkWinCondition= () => {   
    const activePlayerToken= getActivePlayer().token;
    const {board, rows, columns} = getBoardDetails();

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
    const board= getBoardDetails().board;

    const isBoardFull= board.every((row) => {
      return row.every((cell) => {
        return cell !== DEFAULTCELLVALUE;
      })
    })

    return isBoardFull;
  }

  // Function incorporating earlier functions for game flow
  const playRound = () => {
    if (checkWinCondition() === true) {
     return `${getActivePlayer().name} wins. Game over.`;
    } 
    else if (checkTieCondition() === true) {
      return `Its a tie between ${players[0].name} & ${players[1].name}.`;
    }
    else {
      switchPlayerTurn();
    }   
  }

  return {getBoardDetails, getActivePlayer, switchPlayerTurn, playTurn, playRound, resetBoard};
}


// Display logic
const announceTurn= document.querySelector(".turn");
const gameBoardContainer= document.querySelector(".gameboard");
const messageDiv= document.querySelector(".message");
const resetButton= document.querySelector(".reset-btn");

function screenController() {
  // Game starts & initializes internally
  const game= gameController();
  
  // Iniialize the variables
  let isGameOver = false;
  announceTurn.textContent= `${game.getActivePlayer().name}'s Turn...`;
  messageDiv.textContent= "";
  
  // Render Gameboard in gameBoardContainer
  const renderGameBoard= () => {
    gameBoardContainer.textContent = "";
    const gameBoard= game.getBoardDetails();

    for (let r=0; r< gameBoard.rows; r++) {
      const row= document.createElement("div");
      // row.textContent= gameBoard.board[r];

      for (let c=0; c< gameBoard.columns; c++) {
        const cell= document.createElement("div");
        cell.textContent= gameBoard.board[r][c];
        cell.classList.add("cell");
        cell.dataset.row= r;
        cell.dataset.column= c;

        row.appendChild(cell);
      }

      gameBoardContainer.appendChild(row);
    }
  }

  // Define what happens on click
  const clickEventHandler= (event) => {
    if (isGameOver) {
      return;
    }

    if (event.target.classList.contains("cell")) {
      const selectedCellRow= Number(event.target.dataset.row);
      const selectedCellColumn= Number(event.target.dataset.column);
      const moveResult= game.playTurn(selectedCellRow, selectedCellColumn);

      if (typeof moveResult === "string") {
        messageDiv.textContent= moveResult;
      }
      else {
        messageDiv.textContent = "";
        renderGameBoard();
        const gameResult= game.playRound();

        if (typeof gameResult === "string") {
          messageDiv.textContent= gameResult;
          announceTurn.textContent= `Game Ended.`
          isGameOver = true;
        }
        else {
          announceTurn.textContent= `${game.getActivePlayer().name}'s Turn...`;
        }
      }
    }
  }

  // Set logic to input token on click on any cell
  gameBoardContainer.addEventListener("click", clickEventHandler);

  // Resets the gameboard
  resetButton.addEventListener("click", () => {
    // Resets internal game board
    game.resetBoard();
    // Resets variables defined at the top inside screenController()
    isGameOver= false;
    announceTurn.textContent= `${game.getActivePlayer().name}'s Turn...`;
    messageDiv.textContent = "";
    // renders the game board from internal board again
    renderGameBoard();
  })

  // Default after page load
  renderGameBoard();
}

screenController();