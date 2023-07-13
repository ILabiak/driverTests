import './main.css';
import logo from '../media/logo.png';
import { useState } from 'react';

function Layout() {
    const [showLoginForm, setShowLoginForm] = useState(false);

    const handleLoginLinkClick = () => {
        setShowLoginForm(true);
      };

    return (
        // <div className={"App" + (showLoginForm ? " active" : "")}>
        // <div className='container'>
        <header className="App-header">
          <div className='headerContainer'>
            <a href="/">
              <img src={logo} className="App-logo" alt="logo" />
            </a>
            <ul className='headerList'>
              <li><a href="/tests">Тести з ПДР</a></li>
              <li><a href="/exam">Іспит з водіння</a></li>
              <li><a href='#' onClick={handleLoginLinkClick}>Особистий кабінет</a></li>
            </ul>
          </div>
        </header>
    //   </div>
    //   </div>
    );
}

export default Layout;