import React, { Component } from "react";
import "./App.css";
import { createStore } from "redux";
import search from "./reducers";

const store = createStore(
  search,
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  getData = () => {
    if(this.query.value !== ""){
    var url = new URL("https://opentable.herokuapp.com/api/restaurants");
    var params = { city: this.query.value }; // or:
    url.search = new URLSearchParams(params);

    fetch(url, {
      method: "GET",
      credentials: "same-origin"
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        store.dispatch({ type: "update", json: response.restaurants });
        this.setState({ data: response.restaurants });
      }).catch(response => {
        console.log(response)
      });
    }
  };

  handleChange = event => {
    this.setState({ filter: event.target.value });
  };

  render() {
    let results = this.state.data.map(restaurant => {
      return <ResultsRow key={restaurant.name} data={restaurant} />;
    });

    return (
      <div className="App">
        <h1>Find nearby restaurants</h1>
        <div className="App-header">
          <input
            type="text"          
            className="input"
            ref={input => (this.query = input)}
          />
          <button className="button-search" onClick={this.getData}>
            Search
          </button>
        </div>
        {results}
      </div>
    );
  }
}

const ResultsRow = props => {
  return (
    <div className="results-row">
      <h5 className="results-name">{props.data.name}</h5>
      <div>{props.data.address}</div>
      <div>${props.data.price}</div>
    </div>
  );
};




export default App;
