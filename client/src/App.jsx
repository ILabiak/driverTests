import logo from './media/logo.png';
import './App.css';
import Login from './components/Login';
import React, { useState } from 'react';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(false);

  return (
    <div className={"App" + (showLoginForm ? " active" : "")}>
      <div className='container'>
      <header className="App-header">
        <div className='headerContainer'>
          <a href="/">
            <img src={logo} className="App-logo" alt="logo" />
          </a>
          <ul className='headerList'>
            <li><a href="/tests">Тести з ПДР</a></li>
            <li><a href="/exam">Іспит з водіння</a></li>
            <li><a href='#' onClick={() => setShowLoginForm(true)}>Особистий кабінет</a></li>
          </ul>
        </div>
      </header>
      </div>
      
      <div className='loginContainer'>
      {showLoginForm && <Login />}
      </div>
      
      <div className='bannerContainer'>
        <div className='bannerLong'></div>
      </div>
      <div className='container homepage'>
        <div className='row'>
          <div className='row1'>
            <h1>Підготуватися до складання іспиту на отримання водійського посвідчення дуже просто!</h1>
          </div>
          <div className='row2'>
            <div className='col1'>
              <span className='iconLearn'></span>
              <span>Вчися</span>
            </div>
            <div className='col1'>
              <span className='iconLearn'></span>
              <span>Проходь тести</span>
            </div>
            <div className='col1'>
              <span className='iconLearn'></span>
              <span>Складай іспит</span>
            </div>
          </div>
          <div className='row3'>
            <a href="start-testing">Розпочати тестування</a>
            <a href="read-pdr">Читати ПДР</a>
            <a href="start-learning">Пройти навчання</a>
          </div>
        </div>
      </div>
      {/* <Login></Login> */}
    </div>
  );
}

export default App;
