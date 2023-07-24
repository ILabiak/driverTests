import './sections.css';
import Layout from './Layout';
import Login from './Login'
import useAuthData from './useAuthData';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

function Sections() {
    const [sectionsData, setSectionsData] = useState([]);
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

    const renderSections = () => {
        return sectionsData.map((section) => (
            <div className='sectionCol' key={section.id}>
                <div className='sectionInfo'>
                    <span className='sectionText'>{section.name}</span>
                </div>
                <a href={`/question/${section.id}`} className='sectionButton'>
                    <span>
                        <FontAwesomeIcon icon={faPlay} style={{ color: '#555555' }} />
                    </span>
                </a>
            </div>
        ));
    };

    useEffect(() => {
        // Fetch the data from the API endpoint
        fetch('http://localhost:3005/sections')
            .then((response) => response.json())
            .then((data) => setSectionsData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

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
            <div className='container sectionspage'>
                <div className='menuHeader'>
                    <ul className='menuheader container'>
                        <li className='singleton current-menu-li'>
                            <a href="/sections" class="sections">Питання до теми</a>
                        </li>
                        <li className='singleton'>
                            <a href="/twenty-questions" class="twenty-questions">20 випадкових питань</a>
                        </li>
                        <li className='singleton'>
                            <a href="/favourites" class="favourites">Обрані питання</a>
                        </li>
                        <li className='singleton'>
                            <a href="/exam" class="exam">Іспит</a>
                        </li>
                    </ul>
                </div>
                <div className='sectionsContainer'>
                <div className='sectionRows'>
                    {renderSections()}
                </div>
                </div>
            </div>
        </div>


    );
}

export default Sections;
