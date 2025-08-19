import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useUpdateStatus = ({ token, refetch, remarks }) => {
  const [status, setStatus] = useState({});
  const [approving, setApproving] = useState({});

  const handleStatusChange = (id, value) => {
    setStatus((prev) => ({ ...prev, [id]: value }));
  };

  const updateStatus = async (url, id) => {
    try {
      if (!status[id]) {
        return toast.error("Select status");
      };

      setApproving((prev) => ({ ...prev, [id]: true }));

      const remark = remarks[id];

      if (status[id] === "Rejected" && !remark) {
        return toast.error("Enter Remarks");
      };

      const response = await axios.patch(
        `${url}/${id}`,
        { status: status[id], remarks: remark },
        { headers: { Authorization: token } }
      );

      if (response?.data?.success) {
        toast.success("Status Updated Successfully");
      };
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error while updating");
    } finally {
      setApproving((prev) => ({ ...prev, [id]: false }));
      refetch();
    };
  };

  return {
    status,
    approving,
    handleStatusChange,
    updateStatus,
  };
};

export default useUpdateStatus;
