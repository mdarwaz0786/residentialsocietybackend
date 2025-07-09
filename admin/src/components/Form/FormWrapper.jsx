import { useNavigate } from "react-router-dom";

const FormWrapper = ({ title, onSubmit, children }) => {
  const navigation = useNavigate();
  return (
    <div className="container mt-2">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">{title}</h6>
          <button type="button" className="btn btn-secondary" onClick={() => navigation(-1)}>Back</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="card-body">
            <div className="row">{children}</div>
          </div>
          <div className="card-footer text-end">
            <button type="submit" className="btn btn-primary me-3">Submit</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigation(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormWrapper;
