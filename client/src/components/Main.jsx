/* eslint-disable jsx-a11y/anchor-is-valid */
import logo from '../media/logo.png';
import './main.css';
import Login from './Login';
import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import profileIcon from '../media/profile-icon.png'
import Layout from './Layout';

function Main() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const loginContainerRef = useRef(null);
    const [cookies] = useCookies();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    return (
        <div className={'App' + (showLoginForm ? ' active' : '')}>
            <div className='container'>
                <Layout showDropdown={showDropdown}
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

            <div className='bannerContainer'>
                <div className='bannerLong'></div>
            </div>
            <div className='container homepage'>
                <div className='row'>
                    <div className='row1'>
                        <h1>
                            Підготуватися до складання іспиту на отримання водійського
                            посвідчення дуже просто!
                        </h1>
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
                        <a href='start-testing'>Розпочати тестування</a>
                        <a href='read-pdr'>Читати ПДР</a>
                        <a href='start-learning'>Пройти навчання</a>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Main;
