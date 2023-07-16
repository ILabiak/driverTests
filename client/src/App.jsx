import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Main from './components/Main';
import Tests from './components/Tests';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='tests' element={<Tests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
