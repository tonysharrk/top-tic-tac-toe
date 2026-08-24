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

  // Function for getting the gameboard with only the cell values (Getter for the board)
  const getGameBoard= () => {
    return board.map((row) => {
      return row.map((cell) => {
        return cell.getCellValue();
      })
    })
  }
  
  return {getGameBoard};
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


const board= gameBoard(3,3);
console.log(board.getGameBoard());

// function gamecontroller