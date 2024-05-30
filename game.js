
let board;

let onPieceFocus = false;
let fieldOnFocus; 
let pieceOnFocus;

let erenTurn = true;


let markedMoves = [];

function setupGame() {
    
    board = [["", "", "", "ec", "ek", "es", "",""],
                ["", "", "", "", "er", "et", "",""],
                ["", "", "", "", "", "", "",""],
                ["", "", "", "", "", "", "",""],
                ["", "", "", "", "", "", "",""],
                ["", "", "", "", "", "", "",""],
                ["", "", "", "rt","rr","", "" ,""],
                ["", "", "", "rs","rk","rc", "" ,""]
            ];

            
}

function reset() {

    location.reload();
}






function choose_direction(cur_position, last_position) {
    let piece_id;
    
    if (cur_position.row === last_position.row && cur_position.col === last_position.col) {
        piece_id = getPieceAtPosition(cur_position,board);
        if (piece_id === 'ec') {
            return 'u';
        } else {
            return 'd';
        }
    }
    
    const rotate_pieces = ['er', 'es', 'rr', 'rs'];
    piece_id = getPieceAtPosition(cur_position,board);
    
    if (!rotate_pieces.includes(piece_id)) {
        return '';
    }

    function getCurrentPositionAndAngle(piece_id) {
        let element = document.getElementById(piece_id);
        let position = givePosition(board, element.id);
        let angle = 0;
        
        switch (piece_id) {
            case 'es':
                angle = erensemiRicochet_angle;
                break;
            case 'rs':
                angle = reinarsemiRicochet_angle;
                break;
            case 'er':
                angle = erenRicochet_angle;
                break;
            case 'rr':
                angle = reinarRicochet_angle;
                break;
        }
        
        return { position, angle };
    }
    
    function calculateDifference(cur_position, last_position) {
        return {
            row: cur_position.row - last_position.row,
            col: cur_position.col - last_position.col
        };
    }

    function determineDirection(diff, angle) {
        let temp = angle >= 0 ? angle : angle + 360;

        if (diff.col === 0 && diff.row > 0) {
            if (temp === 180 || temp === 270) {
                return '';
            } else if (temp === 0) {
                return 'r';
            } else {
                return 'l';
            }
        }
        if (diff.col === 0 && diff.row < 0) {
            if (temp === 0 || temp === 90) {
                return '';
            } else if (temp === 180) {
                return 'l';
            } else {
                return 'r';
            }
        }
        if (diff.row === 0 && diff.col < 0) {
            console.log(temp);
            if (temp === 180 || temp === 90) {
                return '';
            } else if (temp === 270) {
                return 'u';
            } else {
                return 'd';
            }
        }
        if (diff.row === 0 && diff.col > 0) {
            console.log(temp);
            if (temp === 0 || temp === 270) {
                return '';
            } else if (temp === 180) {
                return 'u';
            } else {
                return 'd';
            }
        }
    }

    function specialDetermineDirection(diff, angle) {
        let temp = angle >= 0 ? angle : angle + 360;

        if (diff.col === 0 && diff.row > 0) {
            if (temp === 0 || temp === 180) {
                return 'r';
            } else {
                return 'l';
            }
        }
        if (diff.col === 0 && diff.row < 0) {
            if (temp === 0 || temp === 180) {
                return 'l';
            } else {
                return 'r';
            }
        }
        if (diff.row === 0 && diff.col < 0) {
            if (temp === 0 || temp === 180) {
                return 'd';
            } else {
                return 'u';
            }
        }
        if (diff.row === 0 && diff.col > 0) {
            if (temp === 0 || temp === 180) {
                return 'u';
            } else {
                return 'd';
            }
        }
    }

    const { position: curPos, angle } = getCurrentPositionAndAngle(piece_id);
    const diff = calculateDifference(cur_position, last_position);

    if (piece_id === 'es' || piece_id === 'rs') {
        return determineDirection(diff, angle);
    } else if (piece_id === 'er' || piece_id === 'rr') {
        return specialDetermineDirection(diff, angle);
    }
}


function missile_path(cur_position, last_position) {
    let missilePath = [];
    let direction = choose_direction(cur_position, last_position);
    
    if (direction == '') {
        missilePath.push(cur_position);
        return missilePath;
    }
    
    if (direction == 'u') {
        for (let i = cur_position.row + 1; i < 8; i++) {
            last_position = { ...cur_position };  
            let new_position = {
                row: i,
                col: cur_position.col
            };
            cur_position = new_position;  
            if (!checkpiecePresent(cur_position, board)) {
                missilePath.push(cur_position);
            } else {
                let path = missile_path(cur_position, last_position);
                missilePath = missilePath.concat(path);
                break;
            }
        }
    } else if (direction == 'd') {
        for (let i = cur_position.row - 1; i >= 0; i--) {
            last_position = { ...cur_position };  // Create a copy of cur_position
            let new_position = {
                row: i,
                col: cur_position.col
            };
            cur_position = new_position;  // Update cur_position with new_position
            if (!checkpiecePresent(cur_position, board)) {
                missilePath.push(cur_position);
            } else {
                let path = missile_path(cur_position, last_position);
                missilePath = missilePath.concat(path);
                break;
            }
        }
    } else if (direction == 'r') {
        for (let i = cur_position.col + 1; i < 8; i++) {
            last_position = { ...cur_position }; 
            let new_position = {
                row: cur_position.row,
                col: i
            };
            cur_position = new_position;  
            if (!checkpiecePresent(cur_position, board)) {
                missilePath.push(cur_position);
            } else {
                let path = missile_path(cur_position, last_position);
                missilePath = missilePath.concat(path);
                break;
            }
        }
    } else if (direction == 'l') {
        for (let i = cur_position.col - 1; i >= 0; i--) {
            last_position = { ...cur_position }; 
            let new_position = {
                row: cur_position.row,
                col: i
            };
            cur_position = new_position;  
            if (!checkpiecePresent(cur_position, board)) {
                missilePath.push(cur_position);
            } else {
                let path = missile_path(cur_position, last_position);
                missilePath = missilePath.concat(path);
                break;
            }
        }
    }
    
    return missilePath;
}



async function fire() {
    
    let position;
   
    if (erenTurn) {
        position = givePosition(board, 'ec');
    } else {
        position = givePosition(board, 'rc');
    }
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
     gameboard.appendChild(bullet);
    
    let missilePath =missile_path(position,position);
    console.log(missilePath);
    let field = getFieldFromPosition(position);
    const box = document.getElementById(field);
    const boxRect = box.getBoundingClientRect();
    
   
    bullet.style.left = (boxRect.left+(( boxRect.width-bullet.style.width)/2)) + 'px';
   
    bullet.style.top = (boxRect.top+(( boxRect.height-bullet.style.height)/2)) + 'px';
    bullet.style.display = 'block';
    let last_position=position;
    let index = 0;
    
    const interval = setInterval(() => {
        if (index < missilePath.length) {
            let boxPosition = missilePath[index];
            let field = getFieldFromPosition(boxPosition);
         
            const box = document.getElementById(field);
            const boxRect = box.getBoundingClientRect();
            let diff={row:boxPosition.row-last_position.row,
                      col:boxPosition.col-last_position.col
            }
               if (diff.row==0){
                bullet.style.left = (boxRect.left+(( boxRect.width-bullet.style.width)/2)) + 'px';
            
                bullet.style.top = (boxRect.top+(( boxRect.height-bullet.style.height)/2)-10) + 'px';
               }
           else { bullet.style.left = (boxRect.left+(( boxRect.width-bullet.style.width)/2)-10) + 'px';
            
            bullet.style.top = (boxRect.top+(( boxRect.height-bullet.style.height)/2)) + 'px';
           }
            index++;
            last_position=boxPosition;
        } else {
            clearInterval(interval); 
            bullet.style.display = 'none';
            let finalPosition = missilePath[missilePath.length - 1];
            let piece_id = getPieceAtPosition(finalPosition, board);
            if (piece_id) {
                let arr = Array.from(piece_id);
                if (arr.length > 1 && arr[1] === 'k') {
                    if (arr[0]=='r') {
                        alert("Team Eren wins");
                        setTimeout(reset, 500);
                    } else {
                        alert("Team Reiner wins");
                        setTimeout(reset, 500);
                    }
                }
            }
        }
      
    }, 300); 

}



 function movePiece(newField) {

    newField = newField.parentElement;

    if(markedMoves.includes(newField.id)) {

        // get position object of new piece position
        let newFieldPosition = fieldIdToBoardPosition(newField.id);
        let piecePositionOnBoard=givePosition(board,pieceOnFocus.id)
    

        /* ---------moving visual piece img--------*/
        // get positioning classes of piece to move
        let pieceRow = pieceOnFocus.classList[1];
        let pieceCol = pieceOnFocus.classList[2];

        // remove positioning classes of piece to move
        pieceOnFocus.classList.remove(pieceRow);
        pieceOnFocus.classList.remove(pieceCol);

        // get positioning classes of new piece position
        let newPieceRow = newField.classList[2];
        let newPieceCol = newField.classList[3];

        // add the positioning classes of new position to piece
        pieceOnFocus.classList.add(newPieceRow);
        pieceOnFocus.classList.add(newPieceCol);
         // put piece to move on new position
        board[newFieldPosition.row][newFieldPosition.col] = pieceOnFocus.id;

        // clear entry of previous position
        board[piecePositionOnBoard.row][piecePositionOnBoard.col] = "";

        deleteMarker();
        unmarkPiece();
        
        fire();
        changeTurn();
       
    }

        
}
function getPieceAtPosition(position, board) {
   
    let piece = board[position.row][position.col];
    return piece;
}


let countdownInterval;
let timeLeft = 10;
let timerRunning = false;
let initialTime = 10;
const timerDisplay = document.getElementById('timer');
function changeTurn() {

    let em = document.getElementById("turnIndicator");


   if(erenTurn) {
     erenTurn = false;
        em.innerHTML = "Reinar Team Turn";
     } else {
        erenTurn = true;
        em.innerHTML = "Eren Team Turn"
    }
    resetCountdown()
}
function startPauseToggle() {
    if (!timerRunning) {
        startCountdown();
        document.getElementById('pause_button').innerHTML='Pause timer';
    } else {
        pauseCountdown();
        document.getElementById('pause_button').innerHTML='Resume timer';
    }
}
function startCountdown() {
    timerRunning = true;
    countdownInterval = setInterval(updateTimer, 1000);
    var pieces = document.querySelectorAll('.piece');

    
    pieces.forEach(function(piece) {
        piece.style.pointerEvents = 'auto';
    });
}
function updateTimer() {
    timeLeft--;
    if (timeLeft >= 0) {
        timerDisplay.textContent = 'Time left: ' + timeLeft;
    } else {
        clearInterval(countdownInterval);
        timerDisplay.textContent = 'Time left: 0';
        timerRunning = false;
        if (erenTurn){ 
            alert('Time is up!  Reinar Team wins');
            setTimeout(reset, 500);
               }
        else {
            alert('Time is up!  Eren Team wins');
            setTimeout(reset, 500);
            
            }
    }
}
function pauseCountdown() {
    clearInterval(countdownInterval);
    timerRunning = false;
    var pieces = document.querySelectorAll('.piece');

 
    pieces.forEach(function(piece) {
        piece.style.pointerEvents = 'none';
       
    });
    
}
function resetCountdown() {
    clearInterval(countdownInterval);
    timeLeft = initialTime;
    timerDisplay.textContent = 'Time left: ' + timeLeft;
    timerRunning = true;
    startCountdown()
}
function instruct(){
    if (!timerRunning) {
        alert("Start or resume game to play");
        
    }
}

function showMoves(element) {

    let emId = element.id;

    let activeBoard = board;

    if((emId.startsWith("e") && erenTurn) || (emId.startsWith("r") && !erenTurn)) {
        
        if(pieceOnFocus) {
    
            deleteMarker();
            unmarkPiece();
        } else {
    
            pieceOnFocus = element;
    
            let piecePosition = givePosition(activeBoard, element.id);
    
            let pieceType = getPieceType(element.id);
    
            let legalMoves = getLegalMoves(piecePosition, pieceType, activeBoard);
    
            markPieceOnFocus(piecePosition);
            markLegalMoves(legalMoves);
        }
    }
}

function checkIfPieceIsOnField(position, activeBoard) {

    if(activeBoard[position.row][position.col]) {
        return true;
    } else {
        return false;
    }
}

function checkpiecePresent(position, board) {
   
    let piece = board[position.row][position.col];
    if(piece){
        return true
    }
    else{
        return false
    }
}
function getLegalMoves(piecePosition, pieceType, activeBoard) {

   

    let legalMoves = [];

    let position;

    switch(pieceType) {
           

        case 'c':
              for(let j=-1;j<2;j=j+2){
                position = {
                    row: piecePosition.row,
                    col : piecePosition.col+j
                };
                if(!checkpiecePresent(position, activeBoard)) {

                           
                    legalMoves.push(position);
                }

              } 
              break;


        default:

            

            for(let j = -1; j < 2; j++) {

                if(j == 0) {
                    
                    if(piecePosition.col-1 >= 0) {

                        position = {
                            row: piecePosition.row,
                            col : piecePosition.col-1
                        };

                        if(!checkpiecePresent(position, activeBoard)) {

                           
                                legalMoves.push(position);
                            }
                        }
                        
                    

                    if( piecePosition.col+1 < 8) {

                        position = {
                            row: piecePosition.row,
                            col : piecePosition.col+1
                        };

                        if(!checkpiecePresent(position, activeBoard)) {

                                legalMoves.push(position);
                            }
                        }
                    }
                    
                 else {

                    if(piecePosition.row+j >= 0 && piecePosition.row+j < 8) {
                        
                        for( let k = -1; k < 2; k++) {

                            if(piecePosition.col+k >= 0 && piecePosition.col+k < 8) {
                                position = {
                                    row: piecePosition.row+j,
                                    col : piecePosition.col+k
                                };

                                if(!checkpiecePresent(position, activeBoard)) {

                                       legalMoves.push(position);
                                }
                            }
                        }
                    }
                }
            }

            break;
    }
    return legalMoves;
}


function deleteMarker() {

    let marker = document.getElementsByClassName("marker");

    

    while(marker[0]) {
        marker[0].remove();
    }

  

    markedMoves = [];
}

function getFieldFromPosition(position) {

    let row = position.row +1;
    let col;
    
    switch(position.col) {

        case 0:
        	col = "A";
            break;
            
        case 1:
            col = "B";
            break;

        case 2:
            col = "C";
            break;

        case 3:
            col = "D";
            break;

        case 4:
            col = "E";
            break;

        case 5:
            col = "F";
            break;

        case 6:
            col = "G";
            break;

        case 7:
            col = "H";
            break;
    }

    return row+col;
}

function markPieceOnFocus(piecePosition) {

    onPieceFocus = true;

    let boardPosition = getFieldFromPosition(piecePosition);

    fieldOnFocus = document.getElementById(boardPosition);

    fieldOnFocus.style.backgroundColor = "#e68540 ";
    let id =pieceOnFocus.id
    let arr=Array.from(id)
    if (arr[1]=='r'  || arr[1]=='s'){
        document.getElementById('rotate_buttons').style.display = 'block';
    }
}

function unmarkPiece() {
    let id =pieceOnFocus.id
    let arr=Array.from(id)
    if (arr[1]=='r'  || arr[1]=='s'){
        document.getElementById('rotate_buttons').style.display = 'none';
    }
    pieceOnFocus = null;

    fieldOnFocus.style.backgroundColor = "";

    fieldOnFocus = null;
}

function markLegalMoves(positions) {

    for(let position of positions) {

        let boardPosition = getFieldFromPosition(position);

        markedMoves.push(boardPosition);

        let field = document.getElementById(boardPosition);

       

        let dot = document.createElement("div");

        dot.classList.add("marker");
        dot.setAttribute("onclick", "movePiece(this)");
        dot.innerHTML = "•";

        field.appendChild(dot);
    }

}

function getPieceType(id) {

    let arr = Array.from(id);

   
        return arr[1];
    

}

function givePosition(boardArray, elementId) {

    for(let i = 0; i < boardArray.length; i++) {
        for(let j = 0; j < boardArray[i].length; j++) {

            if(boardArray[i][j] === elementId) {
                return position = {
                    row: i,
                    col: j
                };
            }
        }
    }
}

function fieldIdToBoardPosition(fieldId) {

    let id = Array.from(fieldId);
    let row;
    let col;

    switch(id[0]) {

        case '1':
            row = 0;
            break;
        case '2':
            row = 1;
            break;
        case '3':
            row = 2;
            break;
        case '4':
            row = 3;
            break;
        case '5':
            row = 4;
            break;
        case '6':
            row = 5;
            break;
        case '7':
            row = 6;
            break;
        case '8':
            row = 7;
            break;
    }

    switch(id[1]) {

        case 'A':
            col = 0;
            break;
        case 'B':
            col = 1;
            break;
        case 'C':
            col = 2;
            break;
        case 'D':
            col = 3;
            break;
        case 'E':
            col = 4;
            break;
        case 'F':
            col = 5;
            break;
        case 'G':
            col = 6;
            break;
        case 'H':
            col = 7;
            break;
    }

    return position = {
        row: row,
        col: col
    };
}

function getAllActivePiecesOfPlayer(player, activeBoard) {

    let activePiecesOfPlayer = [];

    for(let i = 0; i < activeBoard.length; i++) {
        for(let j = 0; j < activeBoard[i].length; j++) {

            if(activeBoard[i][j].startsWith(player)) {
                activePiecesOfPlayer.push(activeBoard[i][j]);
            }
        }
    }

    return activePiecesOfPlayer;
}

function rotateLeft(){
    let rotationAngle=update_angles(-90);
     pieceOnFocus.style.transform=`rotate(${rotationAngle}deg)`;
    unmarkPiece();
    deleteMarker();
    fire();   
    changeTurn();
     
}
function rotateRight(){
    let rotationAngle=update_angles(90);
    pieceOnFocus.style.transform=`rotate(${rotationAngle}deg)`;
    deleteMarker();
    unmarkPiece();
    fire();
    changeTurn();   
   
    
}
let erenRicochet_angle=0
let reinarRicochet_angle=0
let erensemiRicochet_angle=0
let reinarsemiRicochet_angle=0
function reset_angle(angle){
    if (angle==360 || angle==-360){
        return 0
    }
    else{
        return angle
    }
}
function update_angles(rotated_angle){
    let id= pieceOnFocus.id
    let arr = Array.from(id);
    if (arr[0]=='e' && arr[1]=='r'){
        erenRicochet_angle+=rotated_angle;
        erenRicochet_angle=reset_angle(erenRicochet_angle);
        return erenRicochet_angle
    }
    else if  (arr[0]=='e' && arr[1]=='s' ){
        erensemiRicochet_angle+=rotated_angle;
        erensemiRicochet_angle=reset_angle(erensemiRicochet_angle);
        return erensemiRicochet_angle

    } 
    else if  (arr[0]=='r' && arr[1]=='s' ){
        reinarsemiRicochet_angle+=rotated_angle;
        reinarsemiRicochet_angle=reset_angle(reinarsemiRicochet_angle);
        return reinarsemiRicochet_angle
    } 
    else{
        reinarRicochet_angle+=rotated_angle;
        reinarRicochet_angle=reset_angle(reinarRicochet_angle);
        return reinarRicochet_angle
    }
}

setupGame();