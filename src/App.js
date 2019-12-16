import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class  App extends Component {
  // constructor(props)
  // {
  //   super(props);
  //   this.state = { manager: ''};
  // }

  state=
  {
     manager : '',
     players: [],
     balance: '',
     value:'',
     message:''
  }
  async componentDidMount()
  {
    await window.ethereum.enable();
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager, players,balance});
    
  }

  onSubmit= async (event)=>{
     event.preventDefault();
     const accounts = await web3.eth.getAccounts();
     console.log(this.state.value);
     console.log(accounts[0]);
     this.setState({message : 'transaction is in process...'})
     await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
     });
     this.setState({message:'you have been entered'})
  }

  onClick = async ()=>{
    //event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    
    this.setState({message : 'transaction is in process...'})
    await lottery.methods.pickWinner().send({
     from: accounts[0]
    
    });
    this.setState({message:'a winner has been picked'})
  }
  render(){
    console.log(web3.version);
  return (
    
    <div>
      <h2>Lotttery Contract</h2>
      <p>This contract is managed by {this.state.manager}</p>
      <p>There are currently {this.state.players.length} competing to win {web3.utils.fromWei(this.state.balance,'ether')} ether</p>
      <hr/>
      <form onSubmit={this.onSubmit}>
        <h4>Want to try another luck ?</h4>
        <div>
          <label>
            Amount of ether to enter
          </label>
          <input
           value={this.state.value}
           onChange = {event => this.setState({value: event.target.value})}
          />
          <button>Enter</button>
        </div>
      </form>
      <hr/>

      <h4>Ready to pick a winner</h4>
      <button onClick={this.onClick}>Pick a Winner</button>
      <h1>{this.state.message}</h1>
    </div>
    

  )};
}

export default App;
