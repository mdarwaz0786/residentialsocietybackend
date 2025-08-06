import { useAuth } from "../../context/auth.context";
import useFetch from "../../hooks/useFetch";
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import ImageDownloadButton from "../../components/Button/ImageDownloadButton";

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { validToken } = useAuth();
  const apiUrl = id ? `/api/v1/user/get-single-user/${id}` : null;

  const { data } = useFetch(apiUrl, validToken);
  const user = data?.data || {};
  const pdfRef = useRef();

  const handleDownloadPDF = () => {
    html2pdf(pdfRef.current, {
      margin: 0.5,
      filename: `${user.fullName}_profile.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    });
  };

  const Info = ({ label, value }) => (
    <div className="col-sm-6">
      <div className="border p-2 rounded bg-light">
        <strong>{label}:</strong>{" "}{value}</div>
    </div>
  );

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-dark">User Profile</h5>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>Download</button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}><FaArrowLeft className="me-1" /> Back</button>
        </div>
        <div className="card border-0 shadow p-4" ref={pdfRef}>
          <div className="row">
            <div className="col-md-4 text-center">
              <img src={user?.profilePhoto} alt="Profile" className="border-primary mb-3" style={{ width: "300px", height: "300px", objectFit: "cover" }} />
              <ImageDownloadButton src={user?.profilePhoto} filename={`${user?.fullName}-user`} />
              <h5 className="text-primary">{user?.fullName}</h5>
            </div>
            <div className="col-md-8">
              <div className="row g-3">
                <Info label="Mobile" value={user?.mobile} />
                <Info label="Email" value={user?.email} />
                <Info label="ID" value={user?.memberId} />
                <Info label="Role" value={user?.role?.roleName} />
                <Info label="Status" value={user?.status} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetail;
