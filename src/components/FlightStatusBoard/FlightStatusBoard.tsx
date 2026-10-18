import { useMemo, useState } from 'react';
import { filterFlights, type FlightFilters } from '../../helpers/filterFlights';
import { groupFlights, type GroupingKey } from '../../helpers/groupFlights';
import { sortByDepartureTime } from '../../helpers/sortFlights';
import { useFlights } from '../../hooks/useFlights';
import { DataStatusEnum } from '../../state/flightsReducer';
import EmptyState from '../EmptyState/EmptyState';
import FlightGroups from '../FlightGroups/FlightGroups';
import FlightsTable from '../FlightsTable/FlightsTable';
import GroupBySelect from '../GroupBySelect/GroupBySelect';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import RefreshBar from '../RefreshBar/RefreshBar';
import StatusFilter from '../StatusFilter/StatusFilter';
import styles from './FlightStatusBoard.module.scss';

const NO_FILTERS: FlightFilters = {
  status: null,
};

const FlightStatusBoard = () => {
  const { status, flights, lastUpdatedAt, isRefreshing, refresh } = useFlights();
  const [filters, setFilters] = useState<FlightFilters>(NO_FILTERS);
  const [groupingKey, setGroupingKey] = useState<GroupingKey | null>(null);

  const sortedFlights = useMemo(() => {
    return sortByDepartureTime(flights);
  }, [flights]);

  const visibleFlights = useMemo(() => {
    return filterFlights(sortedFlights, filters);
  }, [sortedFlights, filters]);

  const groupedFlights = useMemo(() => {
    return groupingKey ? groupFlights(visibleFlights, groupingKey) : null;
  }, [visibleFlights, groupingKey]);

  const onStatusFilterChange = (newStatus: FlightFilters['status']) => {
    setFilters((prevFilters) => ({ ...prevFilters, status: newStatus }));
  };

  const resetFilters = () => {
    setFilters(NO_FILTERS);
  };

  const renderFlights = () => {
    if (flights.length === 0) {
      return <EmptyState message="No flights scheduled" actionLabel="Refresh" onAction={refresh} />;
    }

    if (visibleFlights.length === 0) {
      return (
        <EmptyState
          message="No flights match this filter"
          actionLabel="Show all flights"
          onAction={resetFilters}
        />
      );
    }

    if (groupedFlights) {
      return <FlightGroups groups={groupedFlights} />;
    }

    return <FlightsTable flights={visibleFlights} />;
  };

  if (status === DataStatusEnum.InitialLoading) {
    return <LoadingIndicator label="Loading flights…" />;
  }

  if (status === DataStatusEnum.InitialError) {
    return (
      <EmptyState message="Could not load flights" actionLabel="Try again" onAction={refresh} />
    );
  }

  return (
    <section>
      <h2 className={styles.sectionTitle}>Departures</h2>

      <RefreshBar
        status={status}
        lastUpdatedAt={lastUpdatedAt}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
      />

      <div className={styles.actions}>
        <StatusFilter value={filters.status} onChange={onStatusFilterChange} />
        <GroupBySelect value={groupingKey} onChange={setGroupingKey} />
      </div>

      {renderFlights()}
    </section>
  );
};

export default FlightStatusBoard;
