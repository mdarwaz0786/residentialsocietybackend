const TextAreaInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
  rows = 4,
  error = "",
}) => {
  return (
    <div className="form-wrap mb-3">
      <label className="col-form-label" htmlFor={name}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <textarea
        className={`form-control ${error ? "is-invalid" : ""}`}
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default TextAreaInput;
