const RadioGroup = ({ label, name, options = [], selectedValue, onChange, required, error }) => (
  <div className="col-md-12">
    <div className="form-wrap">
      <label className="form-label d-block">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {options.map((option) => (
        <div className="form-check form-check-inline" key={option.value}>
          <input
            className={`form-check-input ${error ? "is-invalid" : ""}`}
            type="radio"
            name={name}
            id={`${name}_${option.value}`}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={onChange}
          />
          <label className="form-check-label" htmlFor={`${name}_${option.value}`}>
            {option.label}
          </label>
        </div>
      ))}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  </div>
);

export default RadioGroup;
