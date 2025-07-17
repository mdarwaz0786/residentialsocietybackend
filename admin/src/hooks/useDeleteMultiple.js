import { useState } from 'react';
import axios from 'axios';

function useDeleteMultiple(apiUrl) {
  const [deleteResponse, setDeleteResponse] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteMultiple = async (ids = [], token = "") => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const config = {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        data: { ids },
      };
      const res = await axios.delete(apiUrl, config);
      if (res?.data?.success) {
        setDeleteResponse(res?.data);
      };
    } catch (error) {
      setDeleteError(error?.response?.data?.message);
    } finally {
      setIsDeleting(false);
    };
  };

  return { deleteMultiple, deleteResponse, isDeleting, deleteError };
};

export default useDeleteMultiple;