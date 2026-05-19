'use client';

import { useWebSocket } from '../context/WebSocketContext';
import styles from '../styles/components.module.css';

export default function NotificationsPanel() {
  const { notifications, markAllRead, clearNotifications } = useWebSocket();

  return (
    <section className={styles.panel}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className={styles.panelTitle}>Notifications</h3>
        <div style={{ display: 'flex', gap: 4 }}>
          <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={markAllRead}>
            Mark read
          </button>
          <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={clearNotifications}>
            Clear
          </button>
        </div>
      </div>
      {notifications.length === 0 ? (
        <p className={styles.cardMeta}>No notifications yet</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`${styles.notification} ${!n.read ? styles.notificationUnread : ''}`}
          >
            {n.message}
          </div>
        ))
      )}
    </section>
  );
}
