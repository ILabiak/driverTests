import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Main from './components/Main';
import Sections from './components/Sections';
import Test from './components/Test'

function App() {
  return (

    <BrowserRouter basename='/driverTests'>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='sections' element={<Sections />} />
        <Route path='question/:sectionId' element={<Test />} />
        <Route path='twenty-questions' element={<Test />} />
        <Route path='exam' element={<Test />} />
      </Routes>

    </BrowserRouter>

  );
}

export default App;
