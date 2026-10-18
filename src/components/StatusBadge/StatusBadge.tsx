import { FLIGHT_STATUS_LABELS } from '../../domain/flight.constants';
import { FlightStatusEnum, type FlightStatus } from '../../domain/flight.types';
import styles from './StatusBadge.module.scss';

const STATUS_CLASS_NAMES: Record<FlightStatus, string> = {
  [FlightStatusEnum.OnTime]: styles.onTime,
  [FlightStatusEnum.Delayed]: styles.delayed,
  [FlightStatusEnum.Cancelled]: styles.cancelled,
};

type StatusBadgeProps = {
  status: FlightStatus;
};

const StatusBadge = (props: StatusBadgeProps) => {
  const { status } = props;

  return (
    <span className={`${styles.statusBadge} ${STATUS_CLASS_NAMES[status]}`}>
      {FLIGHT_STATUS_LABELS[status]}
    </span>
  );
};

export default StatusBadge;
