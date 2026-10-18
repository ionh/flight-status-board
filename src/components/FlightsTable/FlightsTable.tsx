import type { Flight } from '../../domain/flight.types';
import StatusBadge from '../StatusBadge/StatusBadge';
import styles from './FlightsTable.module.scss';

type FlightsTableProps = {
  flights: Flight[];
};

const FlightsTable = (props: FlightsTableProps) => {
  const { flights } = props;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Departure</th>
          <th>Flight</th>
          <th>Destination</th>
          <th>Terminal</th>
          <th>Gate</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {flights.map((flight) => (
          <tr key={flight.id}>
            <td className={styles.mono}>{flight.departureTime}</td>
            <td className={styles.mono}>{flight.flightNumber}</td>
            <td>{flight.destination}</td>
            <td>{flight.terminal}</td>
            <td className={styles.mono}>{flight.gate}</td>
            <td>
              <StatusBadge status={flight.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FlightsTable;
