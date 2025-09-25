import React, { useState } from "react";
import styles from './SignUp.module.css';
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils";

export const SignUp = () => {

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={styles.whole}>
            <div className={styles.signin}>
                <img className={styles.logo} src={getImageUrl('blackLogo.svg')} alt="KB" />
                <h3>Register your organization</h3>

                <label htmlFor="email">Email</label>
                <input className={styles.emailInput} type="email" name="email" placeholder="admin@firs.gov.ng" autoComplete="off" />

                <label htmlFor="password">Password</label>
                <div className={styles.passwordDiv}>
                    <input type={showPassword ? 'text' : 'password'} name="password" autoComplete="off" placeholder="**********" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}><img src={getImageUrl('showPass.png')} /></button>
                </div>
                <a href="">Forgot Password</a>

                <button className={styles.signInButton} onClick={() => navigate('/dashboard')}>Sign Up</button>

                <p className={styles.have}>Already have an account? <a href="/signin">Sign In</a></p>

            </div>
        </div>
    )
}