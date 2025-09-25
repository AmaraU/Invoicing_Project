import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';
import { getImageUrl } from '../utils';

export const Welcome = () => {

    const navigate = useNavigate();

    return (
        <div className={styles.whole}>
            <div className={styles.div}>
                <img src={getImageUrl('whiteLogo.svg')} />
                {/* <button onClick={()=>navigate('admin-signin')}>VAT Monitoring</button> */}
                <button onClick={() => navigate('fin-signin')}></button>
            </div>
        </div>
    );
}