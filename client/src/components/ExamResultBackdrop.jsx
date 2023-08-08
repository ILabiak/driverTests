/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Backdrop } from '@mui/material';
import {useNavigate } from 'react-router-dom';

function ResultBackdrop({ open, onClose, examFailed, answeredQuestions, questions, testTime, formatTime }) {
  const navigate = useNavigate();

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={onClose}
    >
      <div className='resultsContainer'>
        <div className='resultsInfo'>
          <span className='examResultsText'>{examFailed ? 'Іспит не складено' : 'Іспит складено'}</span>
          <div className='additionalTextContainer'>
            <span className='examAdditionalText'>Кількість помилок: {answeredQuestions.filter((value) => !value).length}</span>
            <span className='examAdditionalText'>Витрачено часу: {formatTime(testTime)}</span>
          </div>
          <ul>
            <button onClick={() => navigate('/exam')}>
              <li className='topButton'>
                <label>
                  Почати заново
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

export default ResultBackdrop;
