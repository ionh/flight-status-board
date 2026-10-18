import { DataStatusEnum, type DataStatus } from '../../state/flightsReducer';
import styles from './RefreshBar.module.scss';

type RefreshBarProps = {
  status: DataStatus;
  lastUpdatedAt: Date | null;
  isRefreshing: boolean;
  onRefresh: () => void;
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const RefreshBar = (props: RefreshBarProps) => {
  const { status, lastUpdatedAt, isRefreshing, onRefresh } = props;

  const isStale = status === DataStatusEnum.Stale;

  return (
    <div className={styles.refreshBar}>
      <div className={styles.info}>
        {lastUpdatedAt && (
          <p className={styles.message}>
            Last updated at <strong>{formatTime(lastUpdatedAt)}</strong>
          </p>
        )}

        {isStale && (
          <span className={styles.staleWarning}>Couldn't refresh, data may be stale</span>
        )}

        {isRefreshing && (
          <span className={styles.refreshing}>
            <span className={styles.dot} />
            Refreshing…
          </span>
        )}
      </div>

      <button type="button" className={styles.button} onClick={onRefresh} disabled={isRefreshing}>
        Refresh
      </button>
    </div>
  );
};

export default RefreshBar;
