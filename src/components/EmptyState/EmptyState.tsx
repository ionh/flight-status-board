import styles from './EmptyState.module.scss';

type EmptyStateProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

const EmptyState = (props: EmptyStateProps) => {
  const { message, actionLabel, onAction } = props;

  return (
    <div className={styles.emptyState}>
      <p className={styles.message}>{message}</p>

      {actionLabel && onAction && (
        <button type="button" className={styles.button} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
