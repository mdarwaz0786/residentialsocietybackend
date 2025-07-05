const SingleSelect = ({ label, name, value, onChange, options, required, error }) => (
  <div className="col-md-6">
    <div className="form-wrap">
      <label className="col-form-label" htmlFor={name}>
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
          <option key={opt._id} value={opt._id}>
            {opt.name}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  </div>
);

export default SingleSelect;