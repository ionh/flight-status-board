import type { ChangeEvent } from 'react';
import { GROUPINGS, type GroupingKey, GROUPING_KEYS } from '../../helpers/groupFlights';
import styles from './GroupBySelect.module.scss';

type GroupBySelectProps = {
  value: GroupingKey | null;
  onChange: (groupingKey: GroupingKey | null) => void;
};

const GroupBySelect = (props: GroupBySelectProps) => {
  const { value, onChange } = props;

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    onChange(selected === '' ? null : (selected as GroupingKey));
  };

  return (
    <label className={styles.groupBySelect}>
      <span className={styles.label}>Group by</span>

      <select className={styles.select} value={value ?? ''} onChange={onSelectChange}>
        <option value="">None</option>

        {GROUPING_KEYS.map((groupingKey) => (
          <option key={groupingKey} value={groupingKey}>
            {GROUPINGS[groupingKey].name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default GroupBySelect;
