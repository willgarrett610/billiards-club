import styles from '@/styles/GoogleBtn.module.css';
import { googleDark } from './icons';

type GoogleBtnProps = {
  scale?: number,
  top?: number,
  right?: number,
  onClick: () => void
};

export default ({onClick, scale = 1, top = 7, right = 7} : GoogleBtnProps) => {
  return (
  <div onClick={onClick} className={styles.googleBtn} style={{fontSize: scale + "em", top: top + "px", right: right + "px"}}>
    <div className={styles.iconCont}>
      <div className={styles.iconBack}>
        {googleDark}
      </div>
    </div>
    <div className={styles.textCont}>
      <div className={styles.text}>Sign in with Google</div>
    </div>
  </div>
  )
}