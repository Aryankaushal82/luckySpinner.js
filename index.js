const prompt  = require('prompt-sync')();

//global variables
const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = {
    'A':2,
    'B':4,
    'C':6,
    'D':8
}

const SYMBOL_VALUES = {
    'A':5,
    'B':4,
    'C':3,
    'D':2
}

//collect user deposit
const deposit = ()=>{
    while (true){
        const depositAmount = prompt("enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);
        if(!numberDepositAmount || isNaN(numberDepositAmount)|| numberDepositAmount<=0){
            console.log("Please enter the valid amount, try again.");
        }
        else return numberDepositAmount;
    }
}

const getNumberOfLines = ()=>{
    while (true){
        const numOfLines = prompt("enter the number of lines from 1-3: ");
        const numberNumOfLines = parseInt(numOfLines);
        if(!numberNumOfLines || isNaN(numberNumOfLines) || numberNumOfLines<=0 || numberNumOfLines>3){
            console.log("Please enter the valid number of lines, try again.");
        }
        else return numberNumOfLines;
    }
}
const getBettingAmount=(balance,numOfLines)=>{
    while (true){
        const betAmount = prompt("please enter the bet per line amount: ");
        const numberBetAmount = parseFloat(betAmount);
        if(!numberBetAmount || isNaN(numberBetAmount) || numberBetAmount<=0 || numberBetAmount>(balance/numOfLines)){
            console.log("Please enter the valid bet amount,try again");
        }
        else return numberBetAmount;
    }
}

const spin = ()=>{
    const symbols = [];
    for (const [symbol,count] of Object.entries(SYMBOLS_COUNT)) {
        for(let i=0;i<count;i++)symbols.push(symbol);
    }
    const reels = [];
    for(let i=0;i<ROWS;i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for(let j=0;j<COLS;j++){
            const randomIndex = parseInt((Math.random()*100)%reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

const transpose = (reels)=>{
    const transposedReels = [];
    for(let i=0;i<ROWS;i++){
        transposedReels.push([]);
        for(let j=0;j<COLS;j++){
            transposedReels[i].push(reels[j][i]);
        }
    }
    return transposedReels;

}

const checkWinnings = (rows,bet,lines)=>{
    let winnings=0;
    for(let row=0;row<lines;row++){
        const symbols = rows[row];
        let allSame = true;
        for(const symbol of symbols){
            if(symbol!=symbols[0]){
                allSame = false;
                break;
            }
        }
        if(allSame){
            winnings+=bet*SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
}

const printingRows = (reels) =>{
    // console.log(reels);
    for(const row of reels){
        let rowString = "";
        console.log("here are the rows: ");
        for(const [i,symbol] of row.entries()){
            rowString+=symbol;
            if(i!=row.length-1){
                rowString+=" | ";
            }
        }
        console.log(rowString);
    }
}
const game =()=>{
    let balance = deposit();
    while (true){
        console.log("your balance is $ ",balance);
        const numOfLines = getNumberOfLines();
        const bettingAmount = getBettingAmount(balance,numOfLines);
        balance-=bettingAmount;
        const reels = spin();
        const rows = transpose(reels);
        printingRows(rows);
        const winnings = checkWinnings(rows,bettingAmount,numOfLines);
        balance+=winnings;
        console.log("you won the amount $ ",winnings.toString());
        if(balance<=0){
            console.log("you are ran out of money");
            break;
        }
        const playAgain = prompt("do you want to play again (y/n): ");
        if(playAgain!='y') break;
    }
}

game();

