'use client';

import { UploadButton } from '../lib/uploadthing';
import styles from '../styles/components.module.css';

export default function UploadButtonComponent({
  endpoint,
  onUploadComplete,
  label = 'Upload',
}) {
  if (!endpoint) return null;

  return (
    <div className={styles.formGroup}>
      <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          if (res?.[0]?.url && onUploadComplete) {
            onUploadComplete(res[0].url);
          }
        }}
        onUploadError={(error) => {
          console.error('Upload error:', error);
        }}
        appearance={{
          button: `${styles.btn} ${styles.btnSecondary}`,
          allowedContent: 'text-sm text-gray-500',
        }}
        content={{
          button: label,
        }}
      />
    </div>
  );
}
