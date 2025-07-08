const FormWrapper = ({ title, onSubmit, children }) => {
  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{title}</h5>
        </div>
        <form onSubmit={onSubmit}>
          <div className="card-body">
            <div className="row">{children}</div>
          </div>
          <div className="card-footer text-end">
            <button type="submit" className="btn btn-primary me-2">Submit</button>
            <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormWrapper;
