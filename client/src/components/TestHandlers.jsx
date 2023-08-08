/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

const useTestHandlers = () => {
    const [openImage, setOpenImage] = useState(false);
    const [page, setPage] = useState(1);
    const [sectionName, setSectionName] = useState('')
    const [isExam, setIsExam] = useState(false)
    const [examFailed, setExamFailed] = useState(false)
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
    const [openExamResults, setOpenExamResults] = useState(false);
    const [paginationStyle, setPaginationStyle] = useState({
        '.Mui-selected': {
            borderColor: 'black',
            borderWidth: '2px',
        },
        '& .MuiPaginationItem-root': {
            height: {xs: '2.3rem', sm : '2.7rem'},
            width: {xs: '2.3rem', sm : '2.7rem'}
          },
    
    });
    const timerRef = useRef(null);
    const testTimerRef = useRef(null);

    useEffect(() => {
        // Reset the timer when a new question is loaded
        if (question.time) {
            setQuestionTime(question.time)
        } else {
            setQuestionTime(0);
        }
        let timerInterval
        if (!question.answered) {
            timerInterval = startTimer('question');
        } else {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        return () => {
            clearInterval(timerInterval); // Cleanup the timer when a new question is loaded
        };
    }, [question]);

    useEffect(() => {
        if (isExam && testTime > 1200) {
            setOpenExamResults(true);
            setExamFailed(true)
            clearInterval(testTimerRef.current)
            testTimerRef.current = null;
        }
        question.time = questionTime
    }, [questionTime])

    useEffect(() => {
        if (isExam && answeredQuestions.filter((value) => !value).length > 2) {
            setOpenExamResults(true);
            setExamFailed(true)
            clearInterval(testTimerRef.current)
            testTimerRef.current = null;
        }
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
                startTimer('test');
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        const fetchSectionName = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + `/section/${sectionId}`);
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
        if (location.pathname.includes('twenty-questions')) {
            link = process.env.REACT_APP_API_URL + '/randomquestions/20'
            setSectionName('20 випадкових питань')
        } else if (location.pathname.includes('question')) {
            link = process.env.REACT_APP_API_URL + `/sectionquestions/${sectionId}`
            fetchSectionName();
        } else if (location.pathname.includes('exam')) {
            link = process.env.REACT_APP_API_URL + '/examquestions'
            setSectionName('Іспит')
            setIsExam(true)
        }
        fetchQuestions(link);


    }, [sectionId]);

    const startTimer = (timerType) => {
        if (timerType === 'question' && !timerRef.current) {
            timerRef.current = setInterval(() => {
                setQuestionTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (timerType === 'test' && !testTimerRef.current) {
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
        startTimer('question');
    }

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
            startTimer('test');
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

    const handleExamResultClose = () => {
        setOpenExamResults(false);
    };

    return {
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
      };
}

export default useTestHandlers;
