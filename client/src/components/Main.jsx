import './main.css';
import Login from './Login';
import Layout from './Layout';
import useAuthData from './useAuthData';
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import bannerLong from '../media/banner-long.png';
import bannerShort from '../media/banner-short.webp'
import {useNavigate } from 'react-router-dom';

function Main() {
    const navigate = useNavigate();
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

    return (
        <div className='App'>
            <Layout showDropdown={showDropdown}
                isAuthenticated={isAuthenticated}
                userEmail={userEmail}
                handleProfileIconClick={handleProfileIconClick}
                handleLogout={handleLogout}
                handleLoginLinkClick={handleLoginLinkClick}
            />
            <Login open={open} loginContainerRef={loginContainerRef} />
            <Box className='bannerContainer' sx={{
                height: '80vw'
            }}>
                <Container sx={{
                    display: { xs: 'none', sm: 'flex' }
                }}>
                    <img src={bannerLong} alt="" />
                </Container>
                <Container sx={{
                    display: { xs: 'flex', sm: 'none' }
                }}>
                    <img src={bannerShort} alt="" />
                </Container>

            </Box>
            <Container maxWidth="lg">
                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div className='row1'>
                        <h1>
                            Підготуватися до складання іспиту на отримання водійського
                            посвідчення дуже просто!
                        </h1>
                    </div>
                    <Container sx={{
                        marginTop: '10px',
                        display: 'block'
                    }}>
                        <Box sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignContent: 'center',
                        }}>
                            <Box className='row2' sx={{
                                flexDirection: 'column',
                            }}>
                                <Grid container spacing={12} sx={{
                                    display: { xs: 'none', md: 'flex' },
                                }}>
                                    <Grid item md={4} xs={12}>
                                        <div className='col1'>
                                            <span className='iconLearn'></span>
                                            <span className='col1Text'>Вчися</span>
                                        </div>
                                    </Grid>
                                    <Grid item md={4}>
                                        <div className='col1'>
                                            <span className='iconLearn'></span>
                                            <span className='col1Text'>Проходь тести</span>
                                        </div>
                                    </Grid>
                                    <Grid item md={4}>
                                        <div className='col1'>
                                            <span className='iconLearn'></span>
                                            <span className='col1Text'>Складай іспит</span>
                                        </div>
                                    </Grid>
                                </Grid>

                                <Box className='row3' sx={{
                                    marginTop: '20px'
                                }}>
                                    <Grid container spacing={{ xs: 4, md: 12 }} sx={{
                                        flexDirection: { xs: 'column', md: 'initial' }
                                    }}>
                                        <Grid item xs={4}>
                                            <Box className='row3-button' onClick={() => navigate('/sections')} sx={{
                                                width: { xs: '80vw', md: '180px' }
                                            }}>
                                                <button>Розпочати тестування</button>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box className='row3-button' onClick={() => navigate('/sections')} sx={{
                                                width: { xs: '80vw', md: '180px' }
                                            }}>
                                                <button>Читати ПДР</button>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box className='row3-button' onClick={() => navigate('/sections')} sx={{
                                                width: { xs: '80vw', md: '180px' }
                                            }}>
                                                <button>Пройти навчання </button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </Container>
            <div className='container homepage'>
            </div>
        </div >
    );
}

export default Main;
