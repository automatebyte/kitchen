import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './Navigation/Navbar';
import Home from '../pages/Home';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import OrdersPage from '../pages/OrdersPage';
import ProfilePage from '../pages/ProfilePage';
import MenuPage from '../pages/MenuPage';
import CategoriesPage from '../pages/CategoriesPage';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/orders" component={OrdersPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/categories" component={CategoriesPage} />
      </Switch>
    </div>
  );
}

export default App;
