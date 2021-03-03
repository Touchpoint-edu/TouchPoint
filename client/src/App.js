
import React, {useState, useEffect} from 'react';
import { callAPI } from './api.js';
import Loading from './Loading.js';
import Home from './Home.js'
import Nav from './Nav.js';
import { DataStoreContext} from "./contexts";
import Dashboard from "./Dashboard";

// import Home from './Home.js';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';

function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);


  return (
    <DataStoreContext.Provider value = {{user, setUser}}>
      <Router>
      {isLoading ? <Loading/> : <>
        <div className = "container-fluid shadow">  
            <Nav />
        </div>
          <main className = "col-10">
            <Switch>
              <Route path="/" exact={true}>
                  <Home/>
              </Route>
              <Route path="/dashboard" exact={true}>
                  <Dashboard/>
              </Route>
              <Route path="*">
              </Route>
            </Switch>
          </main>
      </>}
      </Router>
    </DataStoreContext.Provider>


  );
}

export default App;



// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';

// class App extends Component {

//   constructor(props) {
//     super(props);
//     this.state = { apiResponse: "" };
//   }

//   callAPI() {
//     fetch("/getTest")
//         .then(res => res.text())
//         .then(res => this.setState({ apiResponse: res }));
//   }

//   componentWillMount() {
//     this.callAPI();
//   }
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <iframe src="https://giphy.com/embed/Vuw9m5wXviFIQ" width="480" height="398"
//           frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p>
//           <a href="https://giphy.com/gifs/rickroll-rick-astley-never-gonna-give-you-up-Vuw9m5wXviFIQ"></a></p>
//           <p className="App-intro">{this.state.apiResponse}</p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
// }

