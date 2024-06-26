import './App.css';
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import Home from './components/Home/Home';
import Checkout from './components/Checkout/Checkout';
import Login from './components/Login/Login';
import Product from './components/Product/Product';
import Products from './components/Products/Products';
import Profile from './components/Profile/Profile';
import Register from './components/Register/Register';
import LandingPage from './components/LandingPage/LandingPage';

export default function App() {
  const [user, setUser] = useState({});
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");

    if (loggedInUser && loggedInUser !== "undefined") {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/register" element={<Register setUser={setUser} />}/>
          <Route path="/login" element={<Login setUser={setUser} />}/>
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />}/>
          <Route path="/products" element={<Products/>}/>
          <Route path="/product/:id" element={<Product user={user} setCartData={setCartData} />}/>
          <Route path="/checkout" element={<Checkout cartData={cartData} setCartData={setCartData} />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
