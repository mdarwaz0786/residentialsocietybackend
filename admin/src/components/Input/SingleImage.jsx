import { useEffect, useState } from "react";

const SingleImage = ({ label, name, value, onChange, required = false, error, width }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (value && typeof value === "string") {
      setPreview(value);
    };
  }, [value]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    };
  };

  const removeImage = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className={`${width} mb-4`}>
      <label className="form-label" htmlFor={name}>
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <input
        type="file"
        id={name}
        name={name}
        accept="image/*"
        className={`form-control ${error ? "is-invalid" : ""}`}
        onChange={handleImageChange}
      />
      {error && <div className="invalid-feedback">{error}</div>}

      {preview && (
        <div className="mt-3">
          <img
            src={preview}
            alt="Preview"
            className="img-thumbnail mb-2"
            style={{ maxHeight: "150px" }}
          />
          <div>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={removeImage}
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleImage;
