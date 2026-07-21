import React from 'react'
import Home from "./home/Home.jsx"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutPage from './about/about.jsx';
import SellerPage from './Seller/Seller.jsx';
import SavatPage from './Savat/savat.jsx';
import ProfilsePage from './Profile/Profile.jsx';
import AuthPage from './Auth/register.jsx';
import SellerRegister from './Seller/SellerRegsiter.jsx';
import SellerLogin from './Seller/SellerLogin.jsx';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/Seller" element={<SellerPage/>} />
          <Route path="/Savat" element={<SavatPage/>} />
          <Route path="/Profile" element={<ProfilsePage/>} />
          <Route path="/register" element={<AuthPage/>} />
          <Route path="/SellerRegister" element={<SellerRegister/>} />
          <Route path="/SellerLogin" element={<SellerLogin/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App