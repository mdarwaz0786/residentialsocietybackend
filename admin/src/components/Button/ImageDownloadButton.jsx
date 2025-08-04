const ImageDownloadButton = ({ src, filename = 'download' }) => {
  if (!src) {
    return null;
  };

  const handleImageDownload = (base64String, baseFilename) => {
    const match = base64String.match(/^data:(image\/[a-zA-Z]+);base64,/);
    const mimeType = match?.[1] || 'image/jpeg';

    const extension = mimeType.split('/')[1] || 'jpeg';
    const fullFilename = `${baseFilename}.${extension}`;

    const link = document.createElement('a');
    link.href = base64String;
    link.download = fullFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button className="btn btn-sm btn-outline-primary mt-2 mb-2" onClick={() => handleImageDownload(src, filename)}>
      Download
    </button>
  );
};

export default ImageDownloadButton;
