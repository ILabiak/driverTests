import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Main from './components/Main';
import Sections from './components/Sections';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='sections' element={<Sections />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
