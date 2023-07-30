/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import './test.css';
import Layout from './Layout';
import Login from './Login'
import useAuthData from './useAuthData';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePause, faCirclePlay } from '@fortawesome/free-regular-svg-icons';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Pagination, Backdrop } from '@mui/material';
import noImage from '../media/no_image_uk.png';
import useTestHandlers from './TestHandlers';

import ExamResultBackdrop from './ExamResultBackdrop';
import TestResultBackdrop from './TestResultBackdrop';

function Test() {
    const {
        sectionName,
        formatTime,
        questionTime,
        handlePauseClick,
        isPaused,
        testTime,
        page,
        questions,
        handleChange,
        paginationStyle,
        question,
        selectedAnswer,
        handleAnswerClick,
        handleImgOpen,
        openImage,
        handleImgClose,
        openExamResults,
        handleExamResultClose,
        examFailed,
        answeredQuestions,
        openTestResults,
        handleTestResultClose
    } = useTestHandlers();

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
                    <ExamResultBackdrop
                        open={openExamResults}
                        onClose={handleExamResultClose}
                        examFailed={examFailed}
                        answeredQuestions={answeredQuestions}
                        questions={questions}
                        testTime={testTime}
                        formatTime={formatTime}
                    />
                    <TestResultBackdrop
                        open={openTestResults}
                        onClose={handleTestResultClose}
                        answeredQuestions={answeredQuestions}
                        questions={questions}
                        testTime={testTime}
                        formatTime={formatTime}
                    />
                </div>
            </div>
        </div>
    );
}

export default Test;
