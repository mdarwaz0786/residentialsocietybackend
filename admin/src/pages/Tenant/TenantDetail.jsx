import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth.context";
import { FaArrowLeft } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { useRef } from "react";

const TenantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const apiUrl = id ? `/api/v1/tenant/get-single-tenant/${id}` : null;

  const { data } = useFetch(apiUrl, validToken);
  const maintenanceStaff = data?.data || {};
  const pdfRef = useRef();

  const handleDownloadPDF = () => {
    html2pdf(pdfRef.current, {
      margin: 0.5,
      filename: `${maintenanceStaff?.fullName}_tenant.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Maintenance Staff Detail</h5>
        <button className="btn btn-primary" onClick={handleDownloadPDF}>Download</button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> Back
        </button>
      </div>

      <div className="card shadow-sm p-3" ref={pdfRef}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Name:</label>
            <span>{" "}{maintenanceStaff?.fullName}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Mobile:</label>
            <span>{" "}{maintenanceStaff?.mobile}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Email:</label>
            <span>{" "}{maintenanceStaff?.email}</span>
          </div>
          <div className="col-md-4">
            <label className="fw-bold">Status:</label>
            <span>{" "}{maintenanceStaff?.status}</span>
          </div>
          <div className="col-md-4">
            <label className="fw-bold">ID:</label>
            <span>{" "}{maintenanceStaff?.memberId}</span>
          </div>
          <div className="col-md-6 mt-2">
            <label className="fw-bold d-block mb-1">Profile Photo:</label>
            <img src={maintenanceStaff?.profilePhoto} alt="profileImage" className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
          <div className="col-md-6 mt-2">
            <label className="fw-bold d-block mb-1 mt-3">Aadhar Card:</label>
            <img src={maintenanceStaff?.aadharCard} alt="aadharCard" className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
          <div className="col-md-6 mt-3">
            <label className="fw-bold d-block mb-1 mt-3">Rent Agreement:</label>
            <img src={maintenanceStaff?.rentAgreement} alt="rentAgreement" className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
          <div className="col-md-6 mt-3">
            <label className="fw-bold d-block mb-1 mt-3">Police Verification:</label>
            <img src={maintenanceStaff?.policeVerification} alt="policeVerification" className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
          <div className="col-md-6 mt-3">
            <label className="fw-bold d-block mb-1 mt-3">Vehicle RC:</label>
            <img src={maintenanceStaff?.vehicleRC} alt="vehicleRC" className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetail;
