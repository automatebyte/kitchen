import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Navbar from './Navigation/Navbar';
import Footer from './Footer/Footer';
import Home from '../pages/Home';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import OrdersPage from '../pages/OrdersPage';
import ProfilePage from '../pages/ProfilePage';
import MenuPage from '../pages/MenuPage';
import CategoriesPage from '../pages/CategoriesPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AdminPage from '../pages/AdminPage';

function App() {
  return (
    <AuthProvider>
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
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/admin" component={AdminPage} />
        </Switch>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
