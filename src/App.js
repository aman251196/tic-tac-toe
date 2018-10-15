import React, { Component } from 'react';
import './App.css';
function Square(props){
  if(props.highlight){
    return (
      <button className = "square" onClick = {props.onClick} style={{color: "red"}}>
      {props.value}
      </button> 
    );
  }else{
     return (
    <button className = "square" onClick = {props.onClick}>
    {props.value}
    </button> 
  );
  }
}

class Board extends React.Component {
  
  renderSquares(i){
    let won = false;
    if (this.props.winnerLine && this.props.winnerLine.indexOf(i) >= 0) {
           won = true;
    }
    return(
      <Square value = {this.props.squares[i]} 
       onClick = {()=> this.props.onClick(i)}
       highlight = {won}
       key = {i}
      />
    );
  }
  
  render() {
    var r = [];
    var c = [];
    var s = 0;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        c.push(this.renderSquares(s));
        s++;
      }
      r.push(<div key={i} className="board-row">{ c }</div>)
      c = [];
    }
    return (
      <div>
        {r}
      </div>     
    )
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history : [{
        squares : Array(9).fill(null),
        pos : null
      }],
      stepNumber : 0,
      xIsNext : true,
      //draw : false,
      ascending : true
    };
  }
  
  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
   
    if(squares[i] || (calculateWinner(squares) && this.state.stepNumber >= 5)){
      return ;
    }else if(this.state.stepNumber >= 5){}
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          pos : i
        }
      ]),
      stepNumber : history.length,
      xIsNext : !this.state.xIsNext,
      //draw : !squares.includes(null)
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber : step,
      xIsNext : (step % 2 === 0)
    });
  }
  toggle() {
    const ascending = this.state.ascending;
    this.setState({
      ascending: !ascending,
    });
  }
  render(){
    const history  = this.state.history;
    const current  = history[this.state.stepNumber];
    let winner;
    if(this.state.stepNumber >= 5 ){
       winner = calculateWinner(current.squares);
    }
    //let draw = this.state.draw;
    const moves = history.map((step,move) => {
      const desc = move ? `go to move ${move}` : 'go to the start';
      return (
        <li key = {move}>
          <button onClick = {()=> this.jumpTo(move)}>{move === this.state.stepNumber ? <b>{desc}</b> : desc}({Math.floor(step.pos/3)},{step.pos%3})</button>
        </li>
      );
    }); 
    
    let status ;
    let winnerLine;
    if(winner){
      status = 'Winner ' + winner.winner;
      winnerLine = winner.winnerLine;
      
    }else if(this.state.history.length === 10 && !winner){
      status = 'Draw';
    }else{
      status = 'Next Player is ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return(
      <div className = "game">
        <div className = "board-game" >
        <Board squares = {current.squares}
               onClick = {i => this.handleClick(i)}
               winnerLine = {winnerLine}
               />
        </div>
      
        <div className = "game-info">
         <div>{status}</div>
         <button onClick={() => this.toggle()}> Toggle </button>
         {(() => this.state.ascending === true? <ol>{moves}</ol> : <ol>{moves.reverse()}</ol>) ()}
        </div>
      </div>
    );
  }
}

  function calculateWinner(squares){
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for( let i = 0; i < lines.length; i++ ){
      const [a,b,c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
        return {
          winner :squares[a],
          winnerLine : lines[i]
        };
    }
    return null;
  }
export default Game;
