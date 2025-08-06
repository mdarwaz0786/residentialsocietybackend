import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../context/auth.context";
import { FaArrowLeft } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { useRef } from "react";
import formatDate from "../../helpers/formatDate";
import ImageDownloadButton from "../../components/Button/ImageDownloadButton";

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { validToken } = useAuth();
  const apiUrl = id ? `/api/v1/complaint/get-single-Complaint/${id}` : null;

  const { data } = useFetch(apiUrl, validToken);
  const complaint = data?.data || {};
  const pdfRef = useRef();

  const handleDownloadPDF = () => {
    html2pdf(pdfRef.current, {
      margin: 0.5,
      filename: `${complaint?.createdBy?.fullName}_complaint.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Complaint Detail</h5>
        <button className="btn btn-primary" onClick={handleDownloadPDF}>Download</button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> Back
        </button>
      </div>

      <div className="card shadow-sm p-3" ref={pdfRef}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Title:</label>
            <span>{" "}{complaint?.title}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Type:</label>
            <span>{" "}{complaint?.type}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Status:</label>
            <span>{" "}{complaint?.status}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Created By:</label>
            <span>{" "}{complaint?.createdBy?.fullName}</span>
          </div>
          <div className="col-md-4 mb-2">
            <label className="fw-bold">Date:</label>
            <span>{" "}{formatDate(complaint?.date)}</span>
          </div>
          {
            (complaint?.image) && (
              <div className="col-md-6">
                <label className="fw-bold d-block mb-1">Image:</label>
                <img src={complaint?.image} alt="image" className="img-thumbnail" />
                <ImageDownloadButton src={complaint?.image} filename={`${complaint?.createdBy?.fullName}-complaint`} />
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
