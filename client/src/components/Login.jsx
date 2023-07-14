import './login.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    login: false,
    signup: false,
    signupConfirm: false,
  });
  const [loginStatusText, setloginStatusText] = useState('');
  const [loginSuccess, setloginSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignupClick = () => {
    const loginText = document.querySelector('.title-text .login');
    const loginForm = document.querySelector('form.login');
    loginForm.style.marginLeft = '-50%';
    loginText.style.marginLeft = '-50%';
  };

  const handleLoginClick = () => {
    const loginText = document.querySelector('.title-text .login');
    const loginForm = document.querySelector('form.login');
    loginForm.style.marginLeft = '0%';
    loginText.style.marginLeft = '0%';
  };

  const handleSignupLinkClick = () => {
    const signupBtn = document.querySelector('label.signup');
    signupBtn.click();
    return false;
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword((prevShowPassword) => ({
      ...prevShowPassword,
      [field]: !prevShowPassword[field],
    }));
  };

  const handleErrorCancelClick = () => {
    setloginSuccess(false);
    setloginStatusText('');
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault(); // Prevents form submission and page reload

    // Make the API call to the login endpoint
    try {
      const response = await fetch('http://localhost:3005/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 200) {
        // alert("Login successfull");
        setloginSuccess(true);
        setloginStatusText('Успішна авторизація');
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else if (response.status === 401) {
        // alert("Invalid email or password");
        setloginSuccess(false);
        setloginStatusText('Неправильна пошта чи пароль');
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        // console.log(await response.json())
      } else {
        setloginSuccess(false);
        setloginStatusText('Помилка на сервері');
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        console.log('Some other error');
      }
    } catch (error) {
      setloginSuccess(false);
      setloginStatusText('Помилка на сервері');
      console.log('Error while logging in', error);
    }
  };

  useEffect(() => {
    const storedAuthStatus = localStorage.getItem('isAuthenticated');

    if (storedAuthStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className='loginform'>
      <div className='title-text'>
        <div className='title login'>Авторизація</div>
        <div className='title signup'>Реєстрація</div>
      </div>
      <div className='form-container'>
        <div className='slide-controls'>
          <input type='radio' name='slide' id='login' />
          <input type='radio' name='slide' id='signup' />
          <label
            onClick={handleLoginClick}
            htmlFor='login'
            className='slide login'
          >
            Вхід
          </label>
          <label
            onClick={handleSignupClick}
            htmlFor='signup'
            className='slide signup'
          >
            Реєстрація
          </label>
          <div className='slider-tab'></div>
        </div>
        <div className='form-inner'>
          <form action='#' className='login'>
            {loginStatusText && (
              <div className='field loginStatusField'>
                <p
                  className={
                    loginSuccess ? 'loginSuccessForm' : 'loginErrorForm'
                  }
                >
                  {loginStatusText}
                </p>
                <button
                  onClick={handleErrorCancelClick}
                  className={
                    loginSuccess ? 'closeSuccessButton' : 'closeErrorButton'
                  }
                >
                  <FontAwesomeIcon icon={loginSuccess ? faCheck : faTimes} />
                </button>
              </div>
            )}

            <div className='field'>
              <input
                type='text'
                placeholder='Електронна пошта'
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className='field password-field'>
              <input
                type={showPassword.login ? 'text' : 'password'}
                placeholder='Пароль'
                onChange={handlePasswordChange}
                required
              />
              <span
                className='password-toggle'
                onClick={() => handleTogglePasswordVisibility('login')}
              >
                <FontAwesomeIcon
                  icon={showPassword.login ? faEyeSlash : faEye}
                />
              </span>
            </div>
            <div className='pass-link'>
              <a href='#'>Забули пароль?</a>
            </div>
            <div className='field btn'>
              <div className='btn-layer'></div>
              <input type='submit' onClick={handleLoginSubmit} value='Увійти' />
            </div>
            <div className='signup-link'>
              Не учасник? <a onClick={handleSignupLinkClick}>Зареєструватися</a>
            </div>
          </form>
          <form action='#' className='signup'>
            <div className='field'>
              <input type='text' placeholder='Електронна пошта' required />
            </div>
            <div className='field'>
              <input
                type={showPassword.signup ? 'text' : 'password'}
                placeholder='Пароль'
                required
              />
              <span
                className='password-toggle'
                onClick={() => handleTogglePasswordVisibility('signup')}
              >
                <FontAwesomeIcon
                  icon={showPassword.signup ? faEyeSlash : faEye}
                />
              </span>
            </div>
            <div className='field'>
              <input
                type={showPassword.signupConfirm ? 'text' : 'password'}
                placeholder='Підтвердіть пароль'
                required
              />
              <span
                className='password-toggle'
                onClick={() => handleTogglePasswordVisibility('signupConfirm')}
              >
                <FontAwesomeIcon
                  icon={showPassword.signupConfirm ? faEyeSlash : faEye}
                />
              </span>
            </div>
            <div className='field btn'>
              <div className='btn-layer'></div>
              <input type='submit' value='Зареєструватись' />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
