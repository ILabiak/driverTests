import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import Main from "./components/Main";


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
