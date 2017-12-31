var StarsFrame = React.createClass({
  render: function(){
    var stars = [];
    for(var i = 0; i < this.props.numStars; i++) {
      stars.push(
          <span className="glyphicon glyphicon-star"></span>
        );
    }
    return (
        <div id="stars-frame">
          <div className="well">
            {stars}
          </div>
        </div>
      );
  }
});

var ButtonFrame = React.createClass({
  render: function(){
    var disabled, button, correct = this.props.correct, finish = (this.props.redraws == 0);
    
    switch(correct) {
      case true:
        button = (
            <button className="btn btn-success btn-lg" onClick={this.props.acceptAnswer}>
              <span className="glyphicon glyphicon-ok"></span>
            </button>
          );
        break;
      case false:
        button = (
            <button className="btn btn-danger btn-lg">
              <span className="glyphicon glyphicon-remove"></span>
            </button>
          );
        break;
      default:
        disabled = (this.props.selectedNumbers.length === 0);
        button = (
            <button className="btn btn-primary btn-lg" disabled={disabled} 
                    onClick={this.props.checkAnswer}>
            =
            </button>
          );
    }
    
    return (
        <div id="button-frame">
          {button}
          <br /> <br />
          <button className="btn btn-warning btn-xs" disabled={finish} onClick={this.props.redraw} >
            <span className="glyphicon glyphicon-refresh"> {this.props.redraws} </span>
          </button>
        </div>
      );
  }
});

var AnswerFrame = React.createClass({
  render: function(){
    var props = this.props;
    var selectedNumbers = props.selectedNumbers.map(function(i){
      return (
          <span onClick={props.unselectNumber.bind(null, i)}>{i}</span>
        )
    });
  
    return (
        <div id="answers-frame">
          <div className="well">
            {selectedNumbers}
          </div>
        </div>
      );
  }
});

var NumbersFrame = React.createClass({
  render: function(){
    var numbers = [], className, 
    selectNumber = this.props.selectNumber,
    usedNumbers = this.props.usedNumbers,
    selectedNumbers = this.props.selectedNumbers;
    
    for(var i = 1; i <= 9; i++) {
      className = "number selected-" + (selectedNumbers.indexOf(i) >= 0);
      className += " used-" + (usedNumbers.indexOf(i) >= 0);
      numbers.push(
          <div className={className} onClick={selectNumber.bind(null,i)}> {i} </div>
        );
    }
    
    return (
        <div id="numbers-frame">
          <div className="well">
            {numbers}
          </div>
        </div>
      );
  }
});

var DoneFrame = React.createClass({
  render: function(){
    return (
        <div className="well text-center">
        <h2>{this.props.doneStatus}</h2>
        </div>
      );
  }
});

var Game = React.createClass({
  getInitialState: function(){
    return {
      selectedNumbers: [],
      usedNumbers: [],
      redraws: 5,
      numStars: this.randomNumber(),
      correct: null,
      doneStatus: null
    };  
  },
  
  selectNumber: function(clickedNumber){
    if(this.state.selectedNumbers.indexOf(clickedNumber) < 0
        && this.state.usedNumbers.indexOf(clickedNumber) < 0) {
      this.setState({
          selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
          correct: null
        });
    }
  },
  
  unselectNumber: function(clickedNumber) {
    var selectedNumbers = this.state.selectedNumbers,
    indexOfNumber = selectedNumbers.indexOf(clickedNumber);
    selectedNumbers.splice(indexOfNumber,1);
    this.setState({
      selectedNumbers: selectedNumbers,
      correct: null
    });
    
  },
  
  acceptAnswer: function() {
    var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
    this.setState({
      selectedNumbers: [],
      usedNumbers: usedNumbers,
      correct: null,
      numStars: this.randomNumber()
    }, function() {
      this.updateDoneStatus();
    });
  },
  
  redraw: function() {
    if(this.state.redraws > 0) {
        this.setState({
          selectedNumbers: [],
          numStars: this.randomNumber(),
          correct: null,
          redraws: this.state.redraws - 1
        }, function(){
          this.updateDoneStatus();
        });
    }
  },
  
  updateDoneStatus: function() {
    if(this.state.usedNumbers.length === 9) {
      this.setState({
        doneStatus: 'Done Nice!'
      });
    }
    if(this.state.redraws === 0 && !this.possibleSolutions()) {
      this.setState({
        doneStatus: 'Game Over!'
      });
    }
  },
  
  possibleSolutions: function() {
    var numStars = this.state.numStars,
    possibleNumbers=[],
    usedNumbers = this.state.usedNumbers;
    
    for(var i = 1; i <= 9; i++) {
      if(usedNumbers.indexOf(i) < 0) {
        possibleNumbers.push(i);
      }
    }
    return this.possibleCompination(possibleNumbers, numStars);
  },
  
  possibleCompination: function(a,k){
    var set = new Set();
    for(var i = 0; i < a.length; i++) {
      set.add(a[i]);
    }
    if(set.has(k)) {
      return true;
    }
    
    for(var i = 1; i < k; i++) {
      var rest = k - i;
      if(rest != i && set.has(i) && set.has(rest)){
        return true;
      }
    }
    return false;
  },
  
  randomNumber: function() {
    return Math.floor(Math.random() * 9) + 1;
  },
  
  sumOfSelectedNumbers: function(){
    return this.state.selectedNumbers.reduce(function(p,n){
      return p + n;
    }, 0);
  },
  
  checkAnswer: function(){
    var correct = (this.state.numStars === this.sumOfSelectedNumbers());
    this.setState({correct: correct});
  },
  
  render: function(){
    var selectedNumbers = this.state.selectedNumbers,
        usedNumbers = this.state.usedNumbers,
        numStars = this.state.numStars,
        correct = this.state.correct,
        redraws = this.state.redraws,
        doneStatus = this.state.doneStatus,
        bottomFrame;
        
        if(doneStatus) {
          bottomFrame = <DoneFrame doneStatus={doneStatus} /> 
        } else {
          bottomFrame = <NumbersFrame selectedNumbers={selectedNumbers}
                          usedNumbers={usedNumbers}
                          selectNumber={this.selectNumber} />
        }
    return (
        <div id="game">
          <h2>Play Nine</h2>
          <hr />
          <div className="clearfix">
            <StarsFrame numStars={numStars} />
            
            <ButtonFrame selectedNumbers={selectedNumbers}
                         correct={correct} 
                         checkAnswer={this.checkAnswer}
                         acceptAnswer={this.acceptAnswer}
                         redraw={this.redraw}
                         redraws={redraws}/>
            
            <AnswerFrame selectedNumbers={selectedNumbers} 
                         unselectNumber={this.unselectNumber} />
          </div>
          {bottomFrame}
        </div>
      );
  }
});



React.render(
  <Game />,
  document.getElementById('container')
);
