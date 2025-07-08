import { useState } from 'react';

const MultiplePdfUpload = ({ onChange }) => {
  const [files, setFiles] = useState([]);

  const handlePdfChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const filtered = newFiles.filter((f) => f.type === 'application/pdf');
    setFiles([...files, ...filtered]);
    onChange([...files, ...filtered]);
  };

  const removePdf = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange(updated);
  };

  return (
    <div className="form-wrap">
      <input type="file" accept="application/pdf" multiple onChange={handlePdfChange} />
      <ul className="mt-2">
        {files.map((f, index) => (
          <li key={index}>
            <a href={URL.createObjectURL(f)} target="_blank" rel="noreferrer">{f.name}</a>
            <button type="button" onClick={() => removePdf(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MultiplePdfUpload;
