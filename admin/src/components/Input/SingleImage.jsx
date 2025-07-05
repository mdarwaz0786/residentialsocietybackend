import { useState } from 'react';

const SingleImage = ({ onChange }) => {
  const [preview, setPreview] = useState(null);

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
    <div className="form-wrap">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <div className="preview">
          <img src={preview} alt="Preview" height="100" />
          <button type="button" onClick={removeImage}>Remove</button>
        </div>
      )}
    </div>
  );
};

export default SingleImage;
