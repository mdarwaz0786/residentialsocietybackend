import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth.context";
import { FaArrowLeft } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { useRef } from "react";

const MaidDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const apiUrl = id ? `/api/v1/maid/get-single-maid/${id}` : null;

  const { data } = useFetch(apiUrl, validToken);
  const maid = data?.data || {};
  const pdfRef = useRef();

  const handleDownloadPDF = () => {
    html2pdf(pdfRef.current, {
      margin: 0.5,
      filename: `${maid?.fullName}_maid.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Maid Detail</h5>
        <button className="btn btn-primary" onClick={handleDownloadPDF}>Download</button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> Back
        </button>
      </div>

      <div className="card shadow-sm p-3" ref={pdfRef}>
        <div className="row">
          <div className="col-md-6 mb-2">
            <label className="fw-bold">Full Name:</label>
            <span>{" "}{maid?.fullName}</span>
          </div>
          <div className="col-md-6 mb-2">
            <label className="fw-bold">Mobile:</label>
            <span>{" "}{maid?.mobile}</span>
          </div>
          <div className="col-md-6 mb-2">
            <label className="fw-bold">Flat:</label>
            <span>{" "}{maid?.flat?.flatNumber}</span>
          </div>
          <div className="col-md-6">
            <label className="fw-bold">Status:</label>
            <span>{" "}{maid?.status}</span>
          </div>
          <div className="col-md-6">
            <label className="fw-bold d-block mb-1">Photo:</label>
            <img src={maid?.photo} alt="Maid" className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
          <div className="col-md-6">
            <label className="fw-bold d-block mb-1">Aadhar Card:</label>
            <img src={maid?.aadharCard} alt="aadharCard" className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaidDetail;
