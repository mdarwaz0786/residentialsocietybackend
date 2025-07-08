const TableHeader = ({ columns, onSelectAll, allSelected }) => (
  <thead className="table-dark">
    <tr>
      <th>
        <input type="checkbox" checked={allSelected} onChange={onSelectAll} />
      </th>
      {columns.map((col) => (
        <th key={col.key}>{col.label}</th>
      ))}
      <th>Actions</th>
    </tr>
  </thead>
);

export default TableHeader;
