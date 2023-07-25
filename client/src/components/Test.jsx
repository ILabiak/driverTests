import './test.css';
import Layout from './Layout';
import Login from './Login'
import useAuthData from './useAuthData';
import React from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePause } from '@fortawesome/free-regular-svg-icons';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';

function Test(props) {
    const { sectionId } = useParams();
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
            <div className='testpageContainer'>
                <div className='questionsContainer'>
                    <div className='testNameRow'>
                        <h5>1. Загальні положення</h5>
                    </div>
                    <div className='questionsTimeRow'>
                        <div className='questionTime'>
                            <span>Розмірковуємо над питанням: 0:12</span>
                        </div>
                        <div className='questionButtons'>
                            <a>
                                <FontAwesomeIcon icon={faCirclePause}  size='xl' className='questionButton' />
                            </a>
                            <a>
                                <FontAwesomeIcon icon={faArrowRotateLeft}  size='xl' className='questionButton' />
                            </a>
                        </div>
                        <div className='testTime'>
                            <span>Загальний час тестування: 3:31</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Test;
