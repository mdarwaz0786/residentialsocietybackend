import { useState } from 'react';

const SinglePdfUpload = ({ onChange }) => {
  const [file, setFile] = useState(null);

  const handlePdfChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      onChange(f);
    };
  };

  const removePdf = () => {
    setFile(null);
    onChange(null);
  };

  return (
    <div className="form-wrap">
      <input type="file" accept="application/pdf" onChange={handlePdfChange} />
      {file && (
        <div className="mt-2">
          <a href={URL.createObjectURL(file)} target="_blank" rel="noreferrer">{file.name}</a>
          <button type="button" onClick={removePdf}>Remove</button>
        </div>
      )}
    </div>
  );
};

export default SinglePdfUpload;
