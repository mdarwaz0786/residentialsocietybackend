import { useState } from 'react';

const MultipleImage = ({ onChange }) => {
  const [previews, setPreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews([...previews, ...newPreviews]);
    onChange([...previews.map(p => p.file), ...files]);
  };

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onChange(updated.map((p) => p.file));
  };

  return (
    <div className="form-wrap">
      <input type="file" accept="image/*" multiple onChange={handleImageChange} />
      <div className="preview-container d-flex flex-wrap gap-2 mt-2">
        {previews.map((p, index) => (
          <div key={index} className="position-relative">
            <img src={p.url} alt="Preview" height="100" />
            <button type="button" onClick={() => removeImage(index)}>x</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleImage;
