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
            <div className='pdrTestContainer'>
              <li><a href="/tests">Тести з ПДР</a></li>
            </div>
            <div className='pdrTestContainer'>
            <li><a href="/exam">Іспит з водіння</a></li>
            </div>
          </ul>
        </div>

      </header>
    </div>
  );
}

export default App;
