import type { FlightGroup } from '../../helpers/groupFlights';
import FlightsTable from '../FlightsTable/FlightsTable';
import styles from './FlightGroups.module.scss';

type FlightGroupsProps = {
  groups: FlightGroup[];
};

const FlightGroups = (props: FlightGroupsProps) => {
  const { groups } = props;

  return (
    <>
      {groups.map((group) => {
        const count = group.flights.length;

        return (
          <section key={group.key} className={styles.flightGroup}>
            <h3 className={styles.title}>
              {group.label}
              <span className={styles.count}>
                {count} {count === 1 ? 'flight' : 'flights'}
              </span>
            </h3>

            <FlightsTable flights={group.flights} />
          </section>
        );
      })}
    </>
  );
};

export default FlightGroups;
