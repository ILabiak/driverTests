import './main.css';
import Login from './Login';
import Layout from './Layout';
import useAuthData from './useAuthData';
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import bannerLong from '../media/banner-long.png';
import bannerShort from '../media/banner-short.webp'

function Main() {
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
            {/* <div className='container'> */}
            <Layout showDropdown={showDropdown}
                isAuthenticated={isAuthenticated}
                userEmail={userEmail}
                handleProfileIconClick={handleProfileIconClick}
                handleLogout={handleLogout}
                handleLoginLinkClick={handleLoginLinkClick}
            />
            {/* </div > */}
            {showLoginForm && (
                <div className='loginContainer' ref={loginContainerRef}>
                    <Login />
                </div>
            )
            }
            <Box className='bannerContainer' sx={{
                height: '40vw'
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
            <Container maxWidth="lg" sx={{
                // border: '2px solid #a6a6a6',
            }}>
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
                            // display: { xs: 'none', md: 'flex' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignContent: 'center',
                            border: '2px solid #a6a6a6',
                        }}>
                            <Box className='row2' sx={{
                                display: { xs: 'none', md: 'flex' },
                                border: '2px solid #a6a6a6',
                            }}>
                                <Grid container spacing={12}>
                                    <Grid item>
                                        <div className='col1'>
                                            <span className='iconLearn'></span>
                                            <span>Вчися</span>
                                        </div>
                                    </Grid>
                                    <Grid item>
                                        <div className='col1'>
                                            <span className='iconLearn'></span>
                                            <a href="">
                                                <span>Проходь тести</span>
                                            </a>

                                        </div>
                                    </Grid>
                                    <Grid item>
                                        <div className='col1'>
                                            <span className='iconLearn'></span>
                                            <span>Складай іспит</span>
                                        </div>
                                    </Grid>
                                </Grid>



                            </Box>
                            <Box className='row3' sx={{
                                flexDirection: { xs: 'column', md: 'initial' }
                            }}>
                            </Box>
                            {/* <div className='row3'>
                                <a href='start-testing'>Розпочати тестування</a>
                                <a href='read-pdr'>Читати ПДР</a>
                                <a href='start-learning'>Пройти навчання</a>
                            </div> */}
                            <Box className='row3' sx={{
                                border: '2px solid #a6a6a6',
                            }}>
                                <Grid container>
                                    <Grid item>
                                        <a href='start-testing'>Розпочати тестування</a>
                                    </Grid>
                                    <Grid item>
                                        <a href='start-testing'>Читати ПДР</a>
                                    </Grid>
                                    <Grid item>
                                        <a href='start-testing'>Пройти навчання</a>
                                    </Grid>
                                </Grid>
                            </Box>

                        </Box>
                    </Container>

                </Box>
            </Container>
            <div className='container homepage'>

                {/* <div className='row'>
                    <div className='row1'>
                        <h1>
                            Підготуватися до складання іспиту на отримання водійського
                            посвідчення дуже просто!
                        </h1>
                    </div>
                    <div className='row2'>
                        <div className='col1'>
                            <span className='iconLearn'></span>
                            <span>Вчися</span>
                        </div>
                        <div className='col1'>
                            <span className='iconLearn'></span>
                            <span>Проходь тести</span>
                        </div>
                        <div className='col1'>
                            <span className='iconLearn'></span>
                            <span>Складай іспит</span>
                        </div>
                    </div>
                    <div className='row3'>
                        <a href='start-testing'>Розпочати тестування</a>
                        <a href='read-pdr'>Читати ПДР</a>
                        <a href='start-learning'>Пройти навчання</a>
                    </div>
                </div> */}
            </div>
        </div >
    );
}

export default Main;
