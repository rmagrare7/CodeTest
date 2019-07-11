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
    this.state = { data: [], filtered: [], filter: "" };
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

  filterResult = (data, refine) => {
    let refineResults = data;

    if (refine !== "") {
      refineResults = data.filter(function(data) {
        if (
          data.name.toLowerCase() === refine.toLowerCase() ||
          data.address.toLowerCase() === refine.toLowerCase() ||
          data.area.toLowerCase() === refine.toLowerCase()
        ) {
          return data;
        } else {
          return false;
        }
      });
    }
    return refineResults;
  };

  handleChange = event => {
    this.setState({ filter: event.target.value });
  };

  render() {
  
    let searchResult = this.filterResult(this.state.data, this.state.filter);
    console.log("this.state.data") 
    console.log(this.state)  
    console.log(this.state.data)
    console.log(this.state.filter)
    console.log(searchResult)
    let results = searchResult.map(restaurant => {
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
