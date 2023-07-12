import './login.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setloginError] = useState('');

    const handleSignupClick = () => {
        const loginText = document.querySelector(".title-text .login");
        const loginForm = document.querySelector("form.login");
        loginForm.style.marginLeft = "-50%";
        loginText.style.marginLeft = "-50%";
    };

    const handleLoginClick = () => {
        const loginText = document.querySelector(".title-text .login");
        const loginForm = document.querySelector("form.login");
        loginForm.style.marginLeft = "0%";
        loginText.style.marginLeft = "0%";
    };

    const handleSignupLinkClick = () => {
        const signupBtn = document.querySelector("label.signup");
        signupBtn.click();
        return false;
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleLoginSubmit = async (event) => {


        event.preventDefault(); // Prevents form submission and page reload

        // Make the API call to the login endpoint
        try {
            const response = await fetch("http://localhost:3005/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            if (response.status === 200) {
                alert("Login successfull");

            } else if (response.status === 401) {
                alert("Invalid email or password");
                console.log(await response.json())
            } else {
                console.log("Some other error")
            }
        } catch (error) {
            console.log("Error while logging in", error);
        }
    };

    return (
        <div className="loginform">
            <div className="title-text">
                <div className="title login">Авторизація</div>
                <div className="title signup">Реєстрація</div>
            </div>
            <div className="form-container">
                <div className="slide-controls">
                    <input type="radio" name="slide" id="login" />
                    <input type="radio" name="slide" id="signup" />
                    <label onClick={handleLoginClick} htmlFor="login" className="slide login">Вхід</label>
                    <label onClick={handleSignupClick} htmlFor="signup" className="slide signup">Реєстрація</label>
                    <div className="slider-tab"></div>
                </div>
                <div className="form-inner">
                    <form action="#" className="login">
                        {!loginError && (
                            <div className="field">
                                <p className='errorForm'></p>
                            </div>
                        )}

                        <div className="field">
                            <input type="text" placeholder="Електронна пошта" onChange={handleEmailChange} required />
                        </div>
                        <div className="field password-field">
                            <input type={showPassword ? 'text' : 'password'} placeholder="Пароль" onChange={handlePasswordChange} required />
                            <span className="password-toggle" onClick={handleTogglePasswordVisibility}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>
                        <div className="pass-link"><a href="#">Забули пароль?</a></div>
                        <div className="field btn">
                            <div className="btn-layer"></div>
                            <input type="submit" onClick={handleLoginSubmit} value="Увійти" />
                        </div>
                        <div className="signup-link">Не учасник? <a onClick={handleSignupLinkClick}>Зареєструватися</a></div>
                    </form>
                    <form action="#" className="signup">
                        <div className="field">
                            <input type="text" placeholder="Електронна пошта" required />
                        </div>
                        <div className="field">
                            <input type="password" placeholder="Пароль" required />
                        </div>
                        <div className="field">
                            <input type="password" placeholder="Підтвердіть пароль" required />
                        </div>
                        <div className="field btn">
                            <div className="btn-layer"></div>
                            <input type="submit" value="Зареєструватись" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;