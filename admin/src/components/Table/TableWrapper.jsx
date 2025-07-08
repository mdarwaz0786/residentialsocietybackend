const TableWrapper = ({ children }) => (
  <div className="table-responsive">
    <table className="table table-bordered table-striped">{children}</table>
  </div>
);
export default TableWrapper;
