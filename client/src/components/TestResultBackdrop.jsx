/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Backdrop } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function TestResultBackdrop({ open, onClose, answeredQuestions, questions, formatTime }) {
    const navigate = useNavigate();

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={onClose}
        >
            <div className='resultsContainer'>
                <div className='resultsInfo'>
                    <span className='examResultsText' >Результати тестування</span>
                    <span className='examAdditionalText'>Правильно {answeredQuestions.filter(Boolean).length}/{questions.length} запитань</span>
                    <ul>
                        <button onClick={() => navigate('/sections')}>
                            <li className='topButton'>
                                <label>
                                    Повернутись до тем
                                </label>
                            </li>
                        </button>
                        <button>
                            <li className='bottomButton'>
                                <label>
                                    Залишитись та проаналізувати помилки
                                </label>
                            </li>
                        </button>
                    </ul>
                </div>
            </div>
        </Backdrop>
    );
}

export default TestResultBackdrop;
