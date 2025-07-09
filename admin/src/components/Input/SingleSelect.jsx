const SingleSelect = ({ label, name, value, onChange, options, required, error, optionValue, optionKey, width }) => (
  <div className={`${width} mb-4`}>
    <label className="form-label" htmlFor={name}>
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <select
      className={`form-select ${error ? "is-invalid" : ""}`}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt[optionKey]} value={opt[optionKey]}>
          {opt[optionValue]}
        </option>
      ))}
    </select>
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
);

export default SingleSelect;