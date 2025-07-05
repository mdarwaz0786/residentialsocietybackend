const Checkbox = ({ label, name, checked, onChange, required, error }) => (
  <div className="col-md-12">
    <div className="form-wrap">
      <div className="form-check">
        <input
          className={`form-check-input ${error ? "is-invalid" : ""}`}
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
        />
        <label className="form-check-label" htmlFor={name}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  </div>
);

export default Checkbox;
