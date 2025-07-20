import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth.context";
import { FaArrowLeft } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { useRef } from "react";
import avatar from "../../assets/avatar.png";

const VisitorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const apiUrl = id ? `/api/v1/visitor/get-single-visitor/${id}` : null;

  const { data } = useFetch(apiUrl, validToken);
  const visitor = data?.data || {};
  const pdfRef = useRef();

  const handleDownloadPDF = () => {
    html2pdf(pdfRef.current, {
      margin: 0.5,
      filename: `${visitor?.fullName}_visitor.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Vehicle Detail</h5>
        <button className="btn btn-primary" onClick={handleDownloadPDF}>Download</button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> Back
        </button>
      </div>

      <div className="card shadow-sm p-3" ref={pdfRef}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Full Name:</label>
            <span>{" "}{visitor?.visitorNumber}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Mobile:</label>
            <span>{" "}{visitor?.mobile}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Flat:</label>
            <span>{" "}{visitor?.flat?.flatNumber || "N/A"}</span>
          </div>
          <div className="col-md-4">
            <label className="fw-bold">Status:</label>
            <span>{" "}{visitor?.status}</span>
          </div>
          <div className="col-md-4">
            <label className="fw-bold d-block mb-1">Photo:</label>
            <img src={visitor?.photo || avatar} alt="photo" className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorDetail;
