import React, { useEffect, useState } from "react";
import styles from './SignIn.module.css';
import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getToken, resetAuthDetails, setAuthDetails } from "../../store/auth.slice";
import authService from "../../services/authService";
import { getImageUrl } from "../../utils";

export const SignIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetAuthDetails());
    }, []);

    const handleSignIn = async () => {
        setLoading(true);
        try {
            const credentials = {
                email,
                password
            }
            const response = await authService.getToken(credentials);
            console.log(response)
            if (response?.success) {
                dispatch(setAuthDetails(response));
                window.location.href = "/dashboard"
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    return (
        <div className={styles.whole}>
            <div className={styles.signin}>
                <img className={styles.logo} src={getImageUrl('blackLogo.svg')} alt="FIRS" />
                <h3>Sign in to your account</h3>

                <label htmlFor="email">Email</label>
                <input
                    className={styles.emailInput}
                    type="email" name="email"
                    placeholder="admin@firs.gov.ng"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password">Password</label>
                <div className={styles.passwordDiv}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password" placeholder="**********"
                        autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}><img src={getImageUrl('showPass.png')} /></button>
                </div>
                <a href="">Forgot Password</a>

                <Button
                    className={styles.signInButton}
                    onClick={handleSignIn}
                    isLoading={loading}
                    // variant='subtle'
                    textAlign='center'
                    // background='linear-gradient(0deg, #5F57FF, #5F57FF), linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)'
                    color='#FFFFFF'
                    border='none'
                    _hover={{ background: 'linear-gradient(0deg, #5F57FF, #5F57FF), linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)' }}
                // _loading={{}}
                >
                    Sign In
                </Button>

                <p className={styles.have}>Don't have an account? <a href="/signup">Sign Up</a></p>


            </div>
        </div >
    )
}