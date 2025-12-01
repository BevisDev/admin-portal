const BoardView = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
        overflowX: "auto",
        paddingBottom: 24,
      }}
    >
      {/* {columns.map((col) => (
        <BoardColumnCard key={col.id} col={col} />
      ))} */}
    </div>
  );
};

export default BoardView;
