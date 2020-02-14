import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Square(props)  {
    return (
        <button className="square" onClick={props.onClick}>
            <div className="squareTXT">{props.value}</div>
        </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
        <Square 
            key={i}
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
        />
    );
  }

  renderBoard() {
    let i, j;
    const items = [];
    for(i = 0; i < 3; i++)  {
      for(j = 0; j < 3; j++)  {
        items.push(this.renderSquare((i * 3) + j));
      }
    }

    return items;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
    constructor(props)  {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                moveCol: null,
                moveRow: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            isAsc: true,
        };
    }

    handleClick(i)  {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = this.state.isAsc ? history[history.length - 1] : history.length === 0 ? history[0] : history[1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i])  {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        if(this.state.isAsc)  {
          this.setState({
            history: history.concat([{
                squares: squares,
                moveRow: ( Math.floor(i / 3) + 1 ),
                moveCol: ( (i % 3) + 1 ),
            }]),
          });
        } else  {
          this.setState({
            history: history.slice(0,1).concat([{
              squares: squares,
              moveRow: ( Math.floor(i / 3) + 1 ),
              moveCol: ( (i % 3) + 1 ),
            }]).concat(history.slice(1,history.length)),
          });
        }

        this.setState({
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step)    {
        if(step === 0)  {
            this.setState({
                history:    [{
                    squares: Array(9).fill(null),
                    moveCol: null,
                    moveRow: null,
                }]
            })
        }
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    changeSort()  {
      let before = this.state.isAsc;
      this.setState({isAsc: !before});
      let restartMove = this.state.history.slice(0,1);
      let newHistory = this.state.history.slice(1,this.state.history.length + 1);
      newHistory = restartMove.concat(newHistory.reverse());
      this.setState({
        history: newHistory,
      })
    }


  render() {
    const history = this.state.history;
    const current = this.state.isAsc ? history[this.state.stepNumber] : this.state.stepNumber === 0 ? history[0] : history[this.state.history.length - this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) =>   {
        const desc = move ? 'Move #' + (this.state.isAsc ? move : (this.state.history.length) - move) + ' (' + history[move].moveRow + ', ' + history[move].moveCol + ')' : 'Restart Game';
        return  (
            <li className="move-but-list-item" key={move}>
                <button className="btn btn-info move-but" onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        )
    });
    

    let status;
    if(winner)  {
        status = 'Winner: ' + winner;
    }   else    {
        status = (this.state.xIsNext ? 'X' : 'O') + " TURN";
    }

    return (
      <div className="game">
        <div className="padding-bar col-1"></div>
        <div className="match-history col-2"></div>
        <div className="game-board col-5">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info col-2">
          <div className="status-bar">{status}</div>
          <ol className="moves-list">{moves}</ol>
          <div className="moves-footer row">
            <div className="sort-moves col-3" onClick={() => this.changeSort()}>Sort {this.state.isAsc ? '\u2191' : '\u2193'}</div>
            <div className="view-text col-9">{this.state.stepNumber === 0 ? "No Move Yet" : "Viewing Move: " + this.state.stepNumber}</div>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }