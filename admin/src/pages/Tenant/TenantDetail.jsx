import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth.context";
import { FaArrowLeft } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { useRef } from "react";
import ImageDownloadButton from "../../components/Button/ImageDownloadButton";

const TenantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const apiUrl = id ? `/api/v1/tenant/get-single-tenant/${id}` : null;

  const { data } = useFetch(apiUrl, validToken);
  const tenant = data?.data || {};
  const pdfRef = useRef();

  const handleDownloadPDF = () => {
    html2pdf(pdfRef.current, {
      margin: 0.5,
      filename: `${tenant?.fullName}_tenant.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Tenant Detail</h5>
        <button className="btn btn-primary" onClick={handleDownloadPDF}>Download</button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> Back
        </button>
      </div>

      <div className="card shadow-sm p-3" ref={pdfRef}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Name:</label>
            <span>{" "}{tenant?.fullName}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Mobile:</label>
            <span>{" "}{tenant?.mobile}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Email:</label>
            <span>{" "}{tenant?.email}</span>
          </div>
          <div className="col-md-4">
            <label className="fw-bold">Status:</label>
            <span>{" "}{tenant?.status}</span>
          </div>
          <div className="col-md-4">
            <label className="fw-bold">ID:</label>
            <span>{" "}{tenant?.memberId || "N/A"}</span>
          </div>
          <div className="col-md-6 mt-2">
            <label className="fw-bold d-block mb-1">Profile Photo:</label>
            <img src={tenant?.profilePhoto} alt="profileImage" className="img-thumbnail" />
            <ImageDownloadButton src={tenant?.profilePhoto} filename={`${tenant?.fullName}-profile-photo`} />
          </div>
          <div className="col-md-6 mt-2">
            <label className="fw-bold d-block mb-1 mt-3">Aadhar Card:</label>
            <img src={tenant?.aadharCard} alt="aadharCard" className="img-thumbnail" />
            <ImageDownloadButton src={tenant?.aadharCard} filename={`${tenant?.fullName}-aadhar-card`} />
          </div>
          <div className="col-md-6 mt-3">
            <label className="fw-bold d-block mb-1 mt-3">Rent Agreement:</label>
            <img src={tenant?.rentAgreement} alt="rentAgreement" className="img-thumbnail" />
            <ImageDownloadButton src={tenant?.rentAgreement} filename={`${tenant?.fullName}-rent-agreement`} />
          </div>
          <div className="col-md-6 mt-3">
            <label className="fw-bold d-block mb-1 mt-3">Police Verification:</label>
            <img src={tenant?.policeVerification} alt="policeVerification" className="img-thumbnail" />
            <ImageDownloadButton src={tenant?.policeVerification} filename={`${tenant?.fullName}-police-verification`} />
          </div>
          {
            tenant?.vehicleRC && tenant?.vehicleRC?.length > 0 && tenant?.vehicleRC?.map((vehicle, index) => (
              <div className="col-md-6" key={index}>
                <label className="fw-bold d-block mb-1 mt-3">Vehicle RC {index + 1}:</label>
                <img src={vehicle} alt="vehicleRC" className="img-thumbnail" />
                <ImageDownloadButton src={vehicle} filename={`${tenant?.fullName}-vehicle-rc-${index + 1}`} />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default TenantDetail;
