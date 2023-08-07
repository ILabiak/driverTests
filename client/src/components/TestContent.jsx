/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import './test.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePause, faCirclePlay } from '@fortawesome/free-regular-svg-icons';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Pagination, Backdrop } from '@mui/material';
import noImage from '../media/no_image_uk.png';
import useTestHandlers from './TestHandlers';
import Box from '@mui/material/Box';

import ExamResultBackdrop from './ExamResultBackdrop';
import TestResultBackdrop from './TestResultBackdrop';

function TestContent() {
    const {
        sectionName,
        questionTime,
        isPaused,
        testTime,
        page,
        questions,
        paginationStyle,
        question,
        selectedAnswer,
        openImage,
        openExamResults,
        examFailed,
        answeredQuestions,
        openTestResults,
        formatTime,
        handlePauseClick,
        handleChange,
        handleAnswerClick,
        handleImgOpen,
        handleImgClose,
        handleExamResultClose,
        handleTestResultClose
    } = useTestHandlers();


    return (
        <div className='testpageContainer'>
            <Box className='questionsContainer' maxWidth="lg" sx={{
                marginTop: { xs: '10px', md: '40px' },
                padding: { xs: '0 10px', md: 0 }
            }}>

                {/* <div className='questionsContainer'> */}
                <div className='testNameRow'>
                    <h5>{sectionName}</h5>
                </div>
                <div className='questionsTimeRow'>
                    <div className='questionTime'>
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' }
                        }}>
                            <span className='questionTimeText'>Розмірковуємо над питанням: {formatTime(questionTime)}</span>
                        </Box>
                        <Box sx={{
                            display: { xs: 'flex', md: 'none' }
                        }}>
                            <span className='questionTimeMobText'>{formatTime(questionTime)}</span>
                        </Box>

                    </div>
                    <Box className='questionButtons' sx={{
                        fontSize: '2.5rem'
                    }}>
                        <a onClick={handlePauseClick}>
                            {isPaused ? <FontAwesomeIcon icon={faCirclePlay} className='questionButton' />
                                : <FontAwesomeIcon icon={faCirclePause} className='questionButton' />
                            }
                        </a>
                        <a onClick={() => {
                            setTimeout(() => {
                                window.location.reload(false)
                            }, 500)
                        }}>
                            <FontAwesomeIcon icon={faArrowRotateLeft} className='questionButton' />
                        </a>
                    </Box>
                    <div className='testTime'>
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' }
                        }}>
                            <span className='questionTimeText'>Загальний час тестування: {formatTime(testTime)}</span>
                        </Box>
                        <Box sx={{
                            display: { xs: 'flex', md: 'none' }
                        }}>
                            <span className='questionTimeMobText'>{formatTime(testTime)}</span>
                        </Box>
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
                            <Box sx={{
                                display: { xs: 'none', sm: 'flex' }
                            }}>
                                <Pagination page={page} count={questions.length} showFirstButton showLastButton variant="outlined" shape="rounded" size="large" onChange={handleChange}
                                    sx={paginationStyle}
                                />
                            </Box>
                            <Box sx={{
                                display: { xs: 'flex', sm: 'none' }
                            }}>
                                <Pagination page={page} count={questions.length} variant="outlined" shape="rounded" onChange={handleChange}
                                    sx={paginationStyle}
                                />
                            </Box>

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
                {/* </div> */}
            </Box>

        </div>
    );
}

export default TestContent;
