import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth.context";
import { FaArrowLeft } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { useRef } from "react";

const FlatOwnerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const apiUrl = id ? `/api/v1/flatOwner/get-single-flatOwner/${id}` : null;

  const { data } = useFetch(apiUrl, validToken);
  const flatOwner = data?.data || {};
  const pdfRef = useRef();

  const handleDownloadPDF = () => {
    html2pdf(pdfRef.current, {
      margin: 0.5,
      filename: `${flatOwner?.userId?.fullName}_flatOwner.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Flat Owner Detail</h5>
        <button className="btn btn-primary" onClick={handleDownloadPDF}>Download</button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> Back
        </button>
      </div>

      <div className="card shadow-sm p-3" ref={pdfRef}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Name:</label>
            <span>{" "}{flatOwner?.fullName}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Mobile:</label>
            <span>{" "}{flatOwner?.mobile}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Email:</label>
            <span>{" "}{flatOwner?.email}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Flat:</label>
            <span>{" "}{flatOwner?.flat?.flatNumber}</span>
          </div>
          <div className="col-md-4">
            <label className="fw-bold">ID:</label>
            <span>{" "}{flatOwner?.memberId}</span>
          </div>
          <div className="col-md-6">
            <label className="fw-bold d-block mb-1">Profile Photo:</label>
            <img src={flatOwner?.profilePhoto} alt="image" className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
          <div className="col-md-6">
            <label className="fw-bold d-block mb-1 mt-3">Aadhar Card:</label>
            <img src={flatOwner?.aadharCard} alt="image" className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
          <div className="col-md-6">
            <label className="fw-bold d-block mb-1 mt-3">Allotment:</label>
            <img src={flatOwner?.allotment} alt="image" className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
          <div className="col-md-6">
            <label className="fw-bold d-block mb-1 mt-3">Vehicle RC:</label>
            <img src={flatOwner?.vehicleRC?.[0]} alt="image" className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlatOwnerDetail;
