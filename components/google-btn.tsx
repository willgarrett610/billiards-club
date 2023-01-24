import styles from '@/styles/GoogleBtn.module.css';
import { googleDark } from './icons';

type GoogleBtnProps = {
  onClick: () => void
};

export default ({onClick} : GoogleBtnProps) => {
  return (<div onClick={onClick} className={styles.googleBtn}>
    <div className={styles.iconCont}>
      <div className={styles.iconBack}>
        {googleDark}
      </div>
    </div>
    <div className={styles.textCont}>
      <div className={styles.text}>Sign in with Google</div>
    </div>
  </div>)
}