import styles from './LoadingIndicator.module.scss';

type LoadingIndicatorProps = {
  label?: string;
};

const LoadingIndicator = (props: LoadingIndicatorProps) => {
  const { label } = props;

  return (
    <div className={styles.loadingIndicator}>
      <span className={styles.spinner} />

      {label && <p className={styles.label}>{label}</p>}
    </div>
  );
};

export default LoadingIndicator;
