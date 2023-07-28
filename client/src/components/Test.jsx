/* eslint-disable jsx-a11y/anchor-is-valid */
import './test.css';
import Layout from './Layout';
import Login from './Login'
import useAuthData from './useAuthData';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePause, faCirclePlay } from '@fortawesome/free-regular-svg-icons';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Pagination } from '@mui/material';
import noImage from '../media/no_image_uk.png';

function Test() {
    const [page, setPage] = React.useState(1);
    const [sectionName, setSectionName] = useState('')
    const [isPaused, setIsPaused] = useState(false)
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const { sectionId } = useParams();
    const [questionTime, setQuestionTime] = useState(0);
    const [testTime, setTestTime] = useState(0);
    const timerRef = useRef(null);
    const testTimerRef = useRef(null);
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

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    const startTimer = () => {
        if (!timerRef.current) {
            timerRef.current = setInterval(() => {
                setQuestionTime(prevTime => prevTime + 1);
            }, 1000);
        }
    };

    const startTestTimer = () => {
        if (!testTimerRef.current) {
            testTimerRef.current = setInterval(() => {
                setTestTime(prevTime => prevTime + 1);
            }, 1000);
        }
    };

    const createTimer = () => {
        if (question.time) {
            setQuestionTime(question.time)
        } else {
            setQuestionTime(0);
        }
        startTimer();
    }

    useEffect(() => {
        // Reset the timer when a new question is loaded
        if (question.time) {
            setQuestionTime(question.time)
        } else {
            setQuestionTime(0);
        }
        let timerInterval
        if (!question.answered) {
            timerInterval = startTimer();
        } else {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        return () => {
            clearInterval(timerInterval); // Cleanup the timer when a new question is loaded
        };
    }, [question]);

    useEffect(() => {
        question.time = questionTime
    }, [questionTime])

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
                startTestTimer()
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        const fetchSectionName = async () => {
            try {
                const response = await fetch(`http://localhost:3005/section/${sectionId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch section name');
                }
                const fetchedData = await response.json();
                setSectionName(fetchedData?.name)
            } catch (error) {
                console.error('Error fetching section name:', error);
            }
        };
        fetchQuestions();
        fetchSectionName();
    }, [sectionId]);

    const handleChange = async (event, value) => {
        await setQuestion(questions[value - 1])
        setPage(value);
        setSelectedAnswer(null);
    }

    const handleAnswerClick = (event) => {
        const selectedId = parseInt(event.currentTarget.id);
        question.answered = true;
        setSelectedAnswer(selectedId);
        clearInterval(timerRef.current);
        timerRef.current = null;

        setTimeout(() => {
            const currentQuestionIndex = questions.findIndex((q) => q.id === question.id);
            if (currentQuestionIndex < questions.length - 1) {
                setQuestion(questions[currentQuestionIndex + 1])
                setPage(page + 1)
                setSelectedAnswer(null);
            } else {
            }
        }, 1500)
    };

    const handlePauseClick = async () => {
        await setIsPaused(!isPaused)
        if (!isPaused) {
            clearInterval(timerRef.current);
            clearInterval(testTimerRef.current)
            timerRef.current = null;
            testTimerRef.current = null;
        } else {
            if (!question.answered) {
                createTimer()
                
            }
            startTestTimer()
        }
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
                        <h5>{sectionName}</h5>
                    </div>
                    <div className='questionsTimeRow'>
                        <div className='questionTime'>
                            <span>Розмірковуємо над питанням: {formatTime(questionTime)}</span>
                        </div>
                        <div className='questionButtons'>
                            <a onClick={handlePauseClick}>
                                {isPaused ? <FontAwesomeIcon icon={faCirclePlay} size='xl' className='questionButton' />
                                    : <FontAwesomeIcon icon={faCirclePause} size='xl' className='questionButton' />
                                }
                            </a>
                            <a onClick={() => {
                                setTimeout(() => {
                                    window.location.reload(false)
                                }, 500)
                            }}>
                                <FontAwesomeIcon icon={faArrowRotateLeft} size='xl' className='questionButton' />
                            </a>
                        </div>
                        <div className='testTime'>
                            <span>Загальний час тестування: {formatTime(testTime)}</span>
                        </div>
                    </div>
                    {isPaused ? (
                        <div className='testPaused'>
                            <div className='testPausedTextContainer'>
                                <h2>Пауза</h2>
                                <h5>Щоб продовжити, натисніть</h5>
                                <a onClick={handlePauseClick}>
                                    <FontAwesomeIcon icon={faCirclePlay} size='xl' className='questionButton' />
                                </a>

                            </div>

                        </div>
                    ) : (
                        <div>
                            <div className='questionPagination'>
                                <Pagination page={page} count={questions.length} showFirstButton showLastButton variant="outlined" shape="rounded" size='large' onChange={handleChange}
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
                                        if (isSelected) {
                                            question.selected = index
                                        }
                                        if (question.selected && question.selected === index) {
                                            isSelected = true
                                        }
                                        const isCorrect = question.rightAnswerIndex === index;
                                        let answerClass = isSelected
                                            ? isCorrect
                                                ? 'correct-answer'
                                                : 'wrong-answer'
                                            : 'defaultli';

                                        if (question.answered) {
                                            if (isCorrect) {
                                                answerClass = 'correct-answer'
                                            } else if (answerClass !== 'wrong-answer') {
                                                answerClass = 'disabledLi'
                                            }
                                        }

                                        return (
                                            <li
                                                key={answerId}
                                                id={answerId}
                                                className={answerClass}
                                                onClick={question.answered ? () => { } : handleAnswerClick}
                                            >
                                                <label>{answer.text}</label>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className='image'>
                                    <img alt="questionPicture" src={question.image == null ? noImage : question.image} />
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Test;
