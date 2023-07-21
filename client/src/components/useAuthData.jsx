import { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';

const useAuthData = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [cookies] = useCookies();
  const loginContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/usermail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: cookies.sessionID }),
          credentials: 'include'
        });
        if (response.status === 200) {
          const data = await response.json();
          setUserEmail(data.email || '')
        } else if (response.status === 401) {
          //delete cookie, reload page
          document.cookie = 'sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          window.location.reload(false);
        } else {
          console.log('Some other error');
        }
      } catch (error) {
        console.log('Error while getting user data', error);
      }
    }

    if (cookies.sessionID) {
      setIsAuthenticated(true);
      fetchData().catch(console.error)
    } else {
      setIsAuthenticated(false);
    }
  }, [cookies]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        loginContainerRef.current &&
        !loginContainerRef.current.contains(event.target)
      ) {
        setShowLoginForm(false);
      }
    }

    function handleEscapeKey(event) {
      if (event.keyCode === 27) {
        setShowLoginForm(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleLoginLinkClick = () => {
    setShowLoginForm(true);
  };

  const handleProfileIconClick = () => {
    setShowDropdown(!showDropdown);
  }

  const handleLogout = () => {
    document.cookie = 'sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload(false);
  }

  return {
    cookies,
    showLoginForm,
    setShowLoginForm,
    showDropdown,
    setShowDropdown,
    isAuthenticated,
    setIsAuthenticated,
    userEmail,
    setUserEmail,
    loginContainerRef,
    handleLoginLinkClick,
    handleProfileIconClick,
    handleLogout,
  };
}

export default useAuthData;
