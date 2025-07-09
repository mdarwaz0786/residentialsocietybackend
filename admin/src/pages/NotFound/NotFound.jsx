import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center px-4">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="text-muted mb-4">Sorry, the page you are looking for doesn't exist.</p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default NotFound;
