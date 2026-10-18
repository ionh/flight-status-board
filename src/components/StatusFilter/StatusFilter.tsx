import { FLIGHT_STATUS_LABELS } from '../../domain/flight.constants';
import { FlightStatusEnum, type FlightStatus } from '../../domain/flight.types';
import styles from './StatusFilter.module.scss';

type StatusFilterProps = {
  value: FlightStatus | null;
  onChange: (status: FlightStatus | null) => void;
};

type Option = {
  label: string;
  value: FlightStatus | null;
};

const OPTIONS: Option[] = [
  { label: 'All', value: null },
  ...Object.values(FlightStatusEnum).map((status) => ({
    label: FLIGHT_STATUS_LABELS[status],
    value: status,
  })),
];

const StatusFilter = (props: StatusFilterProps) => {
  const { value, onChange } = props;

  return (
    <div className={styles.statusFilter}>
      <span className={styles.label}>Status</span>

      {OPTIONS.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.label}
            type="button"
            className={`${styles.option} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilter;
