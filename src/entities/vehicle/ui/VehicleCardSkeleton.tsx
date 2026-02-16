import styles from './VehicleCardSkeleton.module.css';

export function VehicleCardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.image} />
      <div className={styles.content}>
        <div className={`${styles.textLine} ${styles.title}`} />
        <div className={`${styles.textLine} ${styles.subtitle}`} />

        <div className={styles.specs}>
          <div className={styles.spec} />
          <div className={styles.spec} />
          <div className={styles.spec} />
        </div>
      </div>
    </div>
  );
}
