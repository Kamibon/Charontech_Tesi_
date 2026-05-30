// JavaScript source code
import React from "react";
import { Route, Routes } from "react-router";

import { Signup } from "./pages/signup.js";
import { Home } from "./pages/page.js";
import { Writersreg } from "./pages/writers_reg.js";
import { Personal } from "./pages/personal.js";
import { Chisiamo } from "./pages/Chisiamo.js";
import { Login } from "./pages/login.js";
import { WLogin } from "./pages/w_login.js";
const Main = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/writers" element={<Writersreg />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/personal" element={<Personal />}/>
      <Route path="/chi" element={<Chisiamo />}/>
      <Route path="/wlogin" element={<WLogin />}/>
    </Routes>
  );
};

export { Main };
