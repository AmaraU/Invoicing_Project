import { Outlet } from 'react-router-dom';
import styles from '../App.module.css';
import { Header } from '../Components/Header/Header';
import { useEffect } from 'react';

export const DashboardLayout = () => {

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
            window.location.href = "/signin";
        }
        console.log(token)
    })
    return (
        <>
            <Header />
            <div className={styles.withHeader}>
                <div className={styles.outlet}>
                    <Outlet />
                </div>
            </div>
        </>
    );
}