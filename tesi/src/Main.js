// JavaScript source code
import React from 'react';
import { Route, Routes } from 'react-router';

import { Signup } from './signup';
import { Home } from './page.js'
import {Writersreg } from './writers_reg'
import { Personal } from './personal.js';
import { Chisiamo } from './Chisiamo.js';
import { Login } from './login.js';
import { WLogin } from './w_login.js';
const Main = () => {
    return (
        <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/signup' element={<Signup />}></Route>
            <Route path='/writers' element={<Writersreg />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/personal' element={<Personal />}></Route>
            <Route path='/chi' element={<Chisiamo />}></Route>
            <Route path='/wlogin' element={<WLogin />}></Route>
        </Routes>
    );
}

export { Main } ;

