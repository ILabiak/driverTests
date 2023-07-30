/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import './test.css';
import Layout from './Layout';
import Login from './Login'
import useAuthData from './useAuthData';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePause, faCirclePlay } from '@fortawesome/free-regular-svg-icons';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Pagination, Backdrop } from '@mui/material';
import noImage from '../media/no_image_uk.png';

function Test() {
    const [openImage, setOpenImage] = useState(false);
    const [page, setPage] = useState(1);
    const [sectionName, setSectionName] = useState('')
    const { sectionId } = useParams();
    const location = useLocation();
    const [isPaused, setIsPaused] = useState(false)
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({});
    const [questionTime, setQuestionTime] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState([])
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [testTime, setTestTime] = useState(0);
    const [openTestResults, setOpenTestResults] = useState(false);
    const [paginationStyle, setPaginationStyle] = useState({
        '.Mui-selected': {
            borderColor: 'black',
            borderWidth: '2px',
        }
    });
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
        if (answeredQuestions.length === questions.length && questions.length > 0) {
            setOpenTestResults(true)
            clearInterval(testTimerRef.current)
            testTimerRef.current = null;
        }
    }, [answeredQuestions])

    useEffect(() => {
        const fetchQuestions = async (link) => {
            try {
                const response = await fetch(link);
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
        let link
        if(location.pathname.includes('twenty-questions')){
            link = 'http://localhost:3005/randomquestions/20'
            setSectionName('20 випадкових питань')
        }else if(location.pathname.includes('question')){
            link = `http://localhost:3005/sectionquestions/${sectionId}`
            fetchSectionName();
        }
        fetchQuestions(link);
        
        
        console.log('location ', location)
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
        const answerIndex = question.answers.findIndex((e) => e.id === selectedId)
        if (question.rightAnswerIndex === answerIndex) {
            question.correctAnswer = true
        } else {
            question.correctAnswer = false
        }
        const currentQuestionIndex = questions.findIndex((q) => q.id === question.id);
        const buttonColor = question.correctAnswer ? '#3daa32' : '#e4615d'
        setPaginationStyle((prevStyle) => ({
            ...prevStyle,
            [`& [aria-label="Go to page ${currentQuestionIndex + 1}"] `]: {
                backgroundColor: buttonColor,
                color: "white",
            },
            [`& [aria-label="Go to page ${currentQuestionIndex + 1}"]:hover `]: {
                backgroundColor: buttonColor,
                color: "white",
                borderColor: 'black',
                borderWidth: '2px'
            },
            [`& [aria-label="page ${currentQuestionIndex + 1}"].Mui-selected`]: {
                backgroundColor: buttonColor,
                color: "white",
                borderColor: 'black',
                borderWidth: '2px'
            },
            [`& [aria-label="page ${currentQuestionIndex + 1}"].Mui-selected:hover`]: {
                backgroundColor: buttonColor,
                color: "white",
                borderColor: 'black',
                borderWidth: '2px'
            }
        }));
        clearInterval(timerRef.current);
        timerRef.current = null;
        setAnsweredQuestions((arr) => [...arr, question.correctAnswer])

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setQuestion(questions[currentQuestionIndex + 1])
                setPage(page + 1)
                setSelectedAnswer(null);
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

    const handleImgClose = () => {
        setOpenImage(false);
    };


    const handleImgOpen = () => {
        setOpenImage(true);
    };

    const handleTestResultClose = () => {
        setOpenTestResults(false);
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
                                    sx={paginationStyle}
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
                                <div className='image' onClick={question.image !== null ? handleImgOpen : () => { }}>
                                    <img alt="questionPicture" src={question.image == null ? noImage : question.image} />
                                </div>
                                <Backdrop
                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                    open={openImage}
                                    onClick={handleImgClose}
                                >
                                    <div className='BackDropImage' onClick={handleImgOpen}>
                                        <img alt="questionPicture" src={question.image == null ? noImage : question.image} />
                                    </div>
                                </Backdrop>
                            </div>
                        </div>
                    )}
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openTestResults}
                        onClick={handleTestResultClose}
                    >
                        <div className='resultsContainer'>
                            <div className='resultsInfo'>
                                <span>Результати тестування</span>
                                <span>Правильно {answeredQuestions.filter(Boolean).length}/{questions.length} запитань</span>
                                <ul>
                                    <a href="/sections">
                                        <li className='topButton'>
                                            <label >
                                                Повернутись до тем
                                            </label>
                                        </li>
                                    </a>
                                    <a>
                                        <li className='bottomButton'>
                                            <label >
                                                Залишитись та проаналізувати помилки
                                            </label>
                                        </li>
                                    </a>

                                </ul>
                            </div>

                        </div>
                    </Backdrop>
                </div>
            </div>
        </div>
    );
}

export default Test;
