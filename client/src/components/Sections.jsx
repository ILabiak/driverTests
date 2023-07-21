import './sections.css';
import Layout from './Layout';
import Login from './Login'
import useAuthData from './useAuthData';
import React from 'react';
import { useCookies } from 'react-cookie';

function Section() {
    const [cookies] = useCookies();
    const {
        showLoginForm,
        setShowLoginForm,
        showDropdown,
        setShowDropdown,
        isAuthenticated,
        setIsAuthenticated,
        userEmail,
        setUserEmail,
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
            <div style={{height: "100vh", width: "100vw", backgroundColor:"#fff"}}></div>
        </div>
        

    );
}

export default Section;
