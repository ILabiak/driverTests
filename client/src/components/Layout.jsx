/* eslint-disable jsx-a11y/anchor-is-valid */
import logo from '../media/logo.png';
import React from 'react';
import profileIcon from '../media/profile-icon.png';
import './layout.css';

function Layout(props) {
  const {
    showDropdown,
    isAuthenticated,
    userEmail,
    handleProfileIconClick,
    handleLogout,
    handleLoginLinkClick
  } = props;

  return (
    <header className='App-header'>
      <div className='headerContainer'>
        <a href='/'>
          <img src={logo} className='App-logo' alt='logo' />
        </a>
        <ul className='headerList'>
          <li>
            <a href='/sections'>Тести з ПДР</a>
          </li>
          <li>
            <a href='/exam'>Іспит з водіння</a>
          </li>
          <li className={showDropdown ? 'headerProfileActive' : ''}>
            {isAuthenticated ? (
              <div className="profileContainer">
                <div className="action" onClick={handleProfileIconClick}>
                  <div className="profile">
                    <img src={profileIcon} alt="profile-img" />
                  </div>
                  <div className={`menu ${showDropdown ? 'active' : ''}`}>
                    <h3>
                      {userEmail}<br />
                      <span>Звичайний користувач</span>
                    </h3>
                    <ul>
                      <li>
                        <a href="#">Мій профіль</a>
                      </li>
                      <li>
                        <a href="/sections">Teсти</a>
                      </li>
                      <li>
                        <i className="far fa-envelope"></i>
                        <a onClick={handleLogout}>Вийти</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <li>
                <a onClick={handleLoginLinkClick}>
                  Особистий кабінет
                </a>
              </li>

            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Layout;
