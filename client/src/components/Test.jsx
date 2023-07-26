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
import noImage from '../media/no_image_uk.png';

function Test(props) {
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState(null);
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
                await setQuestions(fetchedQuestions);
                await setQuestion(fetchedQuestions[0])
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

    const handleAnswerClick = (event) => {
        const selectedId = parseInt(event.currentTarget.id);
        question.answered = true;
        setSelectedAnswer(selectedId);
    };

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
                        <Pagination count={questions.length} showFirstButton showLastButton variant="outlined" shape="rounded" size='large' onChange={handleChange}
                            sx={{
                                '& .MuiPaginationItem-root:nth-child(5)': {
                                    backgroundColor: 'green',
                                },
                            }}
                        />
                    </div>
                    <div className='questionTextDiv'>
                        <span>{question.text || 'loading'}</span>
                    </div>
                    <div className='answersBlock'>
                        <ul className='answers'>
                            {question && question.answers && question.answers.map((answer, index) => {
                                const answerId = answer.id;
                                let isSelected = selectedAnswer === answerId;
                                if(isSelected){
                                    question.selected = index
                                }
                                if(question.selected && question.selected == index){
                                    isSelected = true
                                }
                                const isCorrect = question.rightAnswerIndex === index;
                                let answerClass = isSelected
                                    ? isCorrect
                                        ? 'correct-answer'
                                        : 'wrong-answer'
                                    : '';

                                if(question.answered){
                                    if(isCorrect) {
                                        answerClass = 'correct-answer'
                                    }
                                }

                                return (
                                    <li
                                        key={answerId}
                                        id={answerId}
                                        className={answerClass}
                                        onClick={question.answered ? ()=> {} :handleAnswerClick}
                                    >
                                        <label>{answer.text}</label>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className='image'>
                            <img src={question.image == null ? noImage : question.image} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Test;
