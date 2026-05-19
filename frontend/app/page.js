import Link from 'next/link';
import styles from '../styles/components.module.css';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Team Project Management Platform</h1>
        <p>
          Organize projects, assign tasks, collaborate with teams, and stay updated
          in real time. Built with MERN stack, Next.js, WebSockets, and UploadThing.
        </p>
        <div className="heroActions">
          <Link href="/login" className={`${styles.btn} ${styles.btnPrimary}`}>
            Login
          </Link>
          <Link href="/register" className={`${styles.btn} ${styles.btnOutline}`}>
            Register
          </Link>
        </div>
      </section>
      <div className="container">
        <div className={styles.grid}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Projects & Tasks</h3>
            <p className={styles.cardMeta}>
              Create projects, add tasks, set priorities, and track progress with search and filters.
            </p>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Teams</h3>
            <p className={styles.cardMeta}>
              Build teams, manage members, and link projects for collaborative workflows.
            </p>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Real-time</h3>
            <p className={styles.cardMeta}>
              See who is online, receive live notifications, and get instant task updates via WebSocket.
            </p>
          </article>
        </div>
      </div>
    </>
  );
}
