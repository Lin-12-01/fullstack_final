import LoginForm from '../../components/LoginForm';
import styles from '../../styles/components.module.css';

export default function LoginPage() {
  return (
    <div className="container">
      <div className={styles.pageHeader}>
        <h1>Login</h1>
        <p>Sign in to your TeamPM account</p>
      </div>
      <LoginForm />
    </div>
  );
}
