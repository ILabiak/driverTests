import './sections.css';
import Layout from './Layout';
import Login from './Login'
import useAuthData from './useAuthData';
import React from 'react';

function Sections() {
    const {
        showLoginForm,
        showDropdown,
        isAuthenticated,
        userEmail,
        loginContainerRef,
        handleLoginLinkClick,
        handleProfileIconClick,
        handleLogout,
      } = useAuthData();

    return (
        <div className={'App' + (showLoginForm ? ' active' : '')}>
        <div className='container'>
            <Layout  showDropdown={showDropdown}
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            handleProfileIconClick={handleProfileIconClick}
            handleLogout={handleLogout}
            handleLoginLinkClick={handleLoginLinkClick}
            />
        </div >
        {showLoginForm && (
                <div className='loginContainer' ref={loginContainerRef}>
                    <Login />
                </div>
            )
            }
            <div className='container sectionspage'>
                <div className='menuHeader'>
                    <ul className='menuheader container'>
                        <li className='singleton current-menu-li'>
                        <a href="/sections" class="sections">Питання до теми</a>
                        </li>
                        <li className='singleton'>
                        <a href="/twenty-questions" class="twenty-questions">20 випадкових питань</a>
                        </li>
                        <li className='singleton'>
                        <a href="/favourites" class="favourites">Обрані питання</a>
                        </li>
                        <li className='singleton'>
                        <a href="/exam" class="exam">Іспит</a>
                        </li>
                    </ul>
                </div>
                <div className='sectionRows'>

                </div>
            </div>
            {/* <div style={{height: "100vh", width: "100vw", backgroundColor:"#fff"}}></div> */}
        </div>
        

    );
}

export default Sections;
