import './sections.css';
import Layout from './Layout';
import Login from './Login'
import useAuthData from './useAuthData';
import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

function Sections() {
    const navigate = useNavigate();
    const [sectionsData, setSectionsData] = useState([]);
    const {
        open,
        showDropdown,
        isAuthenticated,
        userEmail,
        loginContainerRef,
        handleLoginLinkClick,
        handleProfileIconClick,
        handleLogout,
    } = useAuthData();

    const renderSections = () => {
        return sectionsData.map((section) => (
            <div className='sectionCol' key={section.id}>
                <div className='sectionInfo'>
                    <span className='sectionText'>{section.name}</span>
                </div>
                <button onClick={() => navigate(`/question/${section.id}`)} className='sectionButton'>
                    <span>
                        <FontAwesomeIcon icon={faPlay} style={{ color: '#555555' }} />
                    </span>
                </button>
            </div>
        ));
    };

    useEffect(() => {
        // Fetch the data from the API endpoint
        fetch('/sections')
            .then((response) => response.json())
            .then((data) => setSectionsData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className='App'>
            <div className='container'>
                <Layout showDropdown={showDropdown}
                    isAuthenticated={isAuthenticated}
                    userEmail={userEmail}
                    handleProfileIconClick={handleProfileIconClick}
                    handleLogout={handleLogout}
                    handleLoginLinkClick={handleLoginLinkClick}
                />
            </div >
            <Login open={open} loginContainerRef={loginContainerRef} />
            <div className='container sectionspage'>
                <div className='menuHeader'>
                    <Grid container className='menuheader container' maxWidth="lg" spacing={{ xs: 1.5, sm: 2, md: 0 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <li className='singleton current-menu-li'>
                                <button onClick={() => navigate('/sections')} className="sections">Питання до теми</button>
                            </li>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <li className='singleton'>
                                <button onClick={() => navigate('/twenty-questions')} className="twenty-questions">20 випадкових питань</button>
                            </li>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <li className='singleton'>
                                <button onClick={() => navigate('/favourites')} className="favourites">Обрані питання</button>
                            </li>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <li className='singleton'>
                                <button onClick={() => navigate('/exam')} className="exam">Іспит</button>
                            </li>
                        </Grid>
                    </Grid>
                </div>

                <div className='sectionsContainer'>
                    <Box className='sectionRows' maxWidth="lg">
                        {renderSections()}
                    </Box>
                </div>

            </div>
        </div>


    );
}

export default Sections;
