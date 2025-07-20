// src/hooks/useUpdateStatus.js
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useUpdateStatus = ({ token, refetch }) => {
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

      const response = await axios.patch(
        `${url}/${id}`,
        { status: status[id] },
        { headers: { Authorization: token } }
      );

      if (response?.data?.success) {
        toast.success("Status Updated Successfully");
        setStatus((prev) => ({ ...prev, [id]: "" }));
        refetch();
      };
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error while updating");
    } finally {
      setApproving((prev) => ({ ...prev, [id]: false }));
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
