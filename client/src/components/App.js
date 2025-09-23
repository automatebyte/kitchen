import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './Navigation/Navbar';
import Home from '../pages/Home';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </div>
  );
}

export default App;
