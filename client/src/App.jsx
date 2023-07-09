import logo from './media/logo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='headerContainer'>
          <a href="/">
          <img src={logo} className="App-logo" alt="logo" />
          </a>
          <ul className='headerList'>
            
              <li><a href="/tests">Тести з ПДР</a></li>
            
            
            <li><a href="/exam">Іспит з водіння</a></li>
            
            
            <li><a href="/profile">Особистий кабінет</a></li>
            
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
