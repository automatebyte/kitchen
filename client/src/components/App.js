import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './Navigation/Navbar';
import Home from '../pages/Home';
import LoginPage from '../pages/LoginPage';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={LoginPage} />
      </Switch>
    </div>
  );
}

export default App;
