type StatusBoardProps = {
  title?: string;
};

const StatusBoard = ({ title = 'Departures' }: StatusBoardProps) => {
  return (
    <section>
      <h2>{title}</h2>
    </section>
  );
};

export default StatusBoard;
