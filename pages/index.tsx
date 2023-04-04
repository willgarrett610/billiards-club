import { Header } from '@/components/header/header';

import styles from '@/styles/Home.module.css';

export default function Home() {
    return (
        <main>
            <Header />
            <div className={styles.about}>
                Welcome to the NMT Billy Aards club website! This website is still in development. Please email william.garrett@student.nmt.edu if you have any issues.
            </div>
        </main>
    );
}
