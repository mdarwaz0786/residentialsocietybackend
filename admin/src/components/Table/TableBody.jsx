const TableBody = ({ data, columns, selected, onSelect, onEdit, onDelete }) => (
  <tbody>
    {data.length === 0 ? (
      <tr>
        <td colSpan={columns.length + 2} className="text-center text-muted">
          No records found.
        </td>
      </tr>
    ) : (
      data.map((item) => (
        <tr key={item._id}>
          <td>
            <input
              type="checkbox"
              checked={selected.includes(item._id)}
              onChange={() => onSelect(item._id)}
            />
          </td>

          {columns.map((col) => (
            <td key={col.key}>
              {col.render ? col.render(item[col.key], item) : item[col.key]}
            </td>
          ))}

          <td>
            <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(item._id)}>
              Edit
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(item._id)}>
              Delete
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
);

export default TableBody;
