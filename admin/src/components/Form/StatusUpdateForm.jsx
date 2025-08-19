const StatusUpdateForm = ({ id, currentStatus, status, approving, onChange, onSubmit }) => {
  return (
    <form style={{ display: "flex", columnGap: "0.5rem" }} onSubmit={(e) => { e.preventDefault(); onSubmit(id) }}>
      <select
        value={status[id] || currentStatus}
        onChange={(e) => onChange(id, e.target.value)}
        className="form-select"
      >
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
        <option value="Pending">Pending</option>
      </select>
      <button type="submit" className="btn btn-primary" disabled={approving[id]}>Update</button>
    </form>
  );
};

export default StatusUpdateForm;
