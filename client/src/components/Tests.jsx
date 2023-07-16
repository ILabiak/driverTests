import './tests.css';
import Layout from './Layout';
import Login from './Login'
import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';

function Main() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [cookies] = useCookies();
    const loginContainerRef = useRef(null);

    const handleLoginLinkClick = () => {
        setShowLoginForm(true);
    };

    const handleProfileIconClick = () => {
        setShowDropdown(!showDropdown);
    }

    const handleLogout = () => {
        document.cookie = 'sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.reload(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3005/usermail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ session_id: cookies.sessionID }),
                    credentials: 'include'
                });
                if (response.status === 200) {
                    const data = await response.json();
                    setUserEmail(data.email || '')
                } else if (response.status === 401) {
                    //delete cookie, reload page
                    document.cookie = 'sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    window.location.reload(false);
                } else {
                    console.log('Some other error');
                }
            } catch (error) {
                console.log('Error while getting user data', error);
            }
        }

        if (cookies.sessionID) {
            setIsAuthenticated(true);
            fetchData().catch(console.error)
        } else {
            setIsAuthenticated(false);
        }
    }, [cookies]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                loginContainerRef.current &&
                !loginContainerRef.current.contains(event.target)
            ) {
                setShowLoginForm(false);
            }
        }

        function handleEscapeKey(event) {
            if (event.keyCode === 27) {
                setShowLoginForm(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

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

export default Main;
