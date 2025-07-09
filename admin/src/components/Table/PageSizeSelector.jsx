const PageSizeSelector = ({ value, onChange, options = [5, 10, 15, 20], total }) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <label className="me-1">Show:</label>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="form-select form-select-sm d-inline w-auto">
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
        {total && !options.includes(total) && (
          <option value={total}>All</option>
        )}
      </select>
    </div>
  );
};

export default PageSizeSelector;
