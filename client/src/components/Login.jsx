import './login.css';


function Login() {

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

    return (
        <div className="loginform">
            <div className="title-text">
                <div className="title login">Login Form</div>
                <div className="title signup">Signup Form</div>
            </div>
            <div className="form-container">
                <div className="slide-controls">
                    <input type="radio" name="slide" id="login" />
                    <input type="radio" name="slide" id="signup" />
                    <label onClick={handleLoginClick} htmlFor="login" className="slide login">Login</label>
                    <label onClick={handleSignupClick} htmlFor="signup" className="slide signup">Signup</label>
                    <div className="slider-tab"></div>
                </div>
                <div className="form-inner">
                    <form action="#" className="login">
                        <div className="field">
                            <input type="text" placeholder="Email Address" required />
                        </div>
                        <div className="field">
                            <input type="password" placeholder="Password" required />
                        </div>
                        <div className="pass-link"><a href="#">Forgot password?</a></div>
                        <div className="field btn">
                            <div className="btn-layer"></div>
                            <input type="submit" value="Login" />
                        </div>
                        <div className="signup-link">Not a member? <a onClick={handleSignupLinkClick}>Signup now</a></div>
                    </form>
                    <form action="#" className="signup">
                        <div className="field">
                            <input type="text" placeholder="Email Address" required />
                        </div>
                        <div className="field">
                            <input type="password" placeholder="Password" required />
                        </div>
                        <div className="field">
                            <input type="password" placeholder="Confirm password" required />
                        </div>
                        <div className="field btn">
                            <div className="btn-layer"></div>
                            <input type="submit" value="Signup" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;