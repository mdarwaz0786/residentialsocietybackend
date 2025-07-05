const MultipleSelect = ({ label, name, options, selected, setSelected, required, error }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (value && !selected.includes(value)) {
      setSelected([...selected, value]);
    };
  };

  const handleRemove = (val) => {
    setSelected(selected.filter((v) => v !== val));
  };

  return (
    <div className="col-md-6">
      <div className="form-wrap">
        <label className="col-form-label" htmlFor={name}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
        <select className={`form-select ${error ? "is-invalid" : ""}`} id={name} name={name} value="" onChange={handleChange}>
          <option value="">Select</option>
          {options.filter((o) => !selected.includes(o._id)).map((opt) => (
            <option key={opt._id} value={opt._id}>
              {opt.name}
            </option>
          ))}
        </select>
        {error && <div className="invalid-feedback">{error}</div>}

        <div className="selected-container mt-2">
          {selected.map((val, idx) => {
            const label = options.find((o) => o._id === val)?.name || val;
            return (
              <span key={idx} className="selected-item me-2">
                {label}
                <button
                  type="button"
                  className="btn btn-sm btn-light ms-1"
                  onClick={() => handleRemove(val)}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MultipleSelect;