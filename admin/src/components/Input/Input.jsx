const Input = ({ label, name, type = "text", value, onChange, required, error, width }) => (
  <div className={`${width} mb-4`}>
    <label className="form-label" htmlFor={name}>
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
);

export default Input;