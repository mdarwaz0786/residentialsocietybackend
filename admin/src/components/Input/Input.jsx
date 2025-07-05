const Input = ({ label, name, type = "text", value, onChange, required, error }) => (
  <div className="col-md-6">
    <div className="form-wrap">
      <label className="col-form-label" htmlFor={name}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        className={`form-control ${error ? "is-invalid" : ""}`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  </div>
);

export default Input;