'use client';

import { useWebSocket } from '../context/WebSocketContext';
import styles from '../styles/components.module.css';

export default function OnlineUsers() {
  const { onlineUsers } = useWebSocket();

  return (
    <section className={styles.panel}>
      <h3 className={styles.panelTitle}>Online Users ({onlineUsers.length})</h3>
      {onlineUsers.length === 0 ? (
        <p className={styles.cardMeta}>No users online</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {onlineUsers.map((u) => (
            <li key={u._id} style={{ marginBottom: '0.5rem' }}>
              <span className={styles.onlineDot} />
              {u.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
