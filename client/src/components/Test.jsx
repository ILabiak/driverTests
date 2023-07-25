/* eslint-disable jsx-a11y/anchor-is-valid */
import './test.css';
import Layout from './Layout';
import Login from './Login'
import useAuthData from './useAuthData';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePause } from '@fortawesome/free-regular-svg-icons';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Pagination } from '@mui/material';

function Test(props) {
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({});
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

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:3005/sectionquestions/${sectionId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch questions');
                }
                const fetchedQuestions = await response.json();
                setQuestions(fetchedQuestions);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, [sectionId]);

    const handleChange = async (event, value) => {
        console.log(value)
        await setQuestion(questions[value - 1])
        console.log(question)
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
                                <FontAwesomeIcon icon={faCirclePause} size='xl' className='questionButton' />
                            </a>
                            <a>
                                <FontAwesomeIcon icon={faArrowRotateLeft} size='xl' className='questionButton' />
                            </a>
                        </div>
                        <div className='testTime'>
                            <span>Загальний час тестування: 3:31</span>
                        </div>
                    </div>
                    <div className='questionPagination'>
                        <Pagination count={questions.length} showFirstButton showLastButton variant="outlined" shape="rounded" size='large' onChange={handleChange} />
                    </div>
                    <h2>{question.id}</h2>
                </div>
            </div>
        </div>
    );
}

export default Test;
