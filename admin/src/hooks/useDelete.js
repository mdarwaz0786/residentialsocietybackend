import { useState } from 'react';
import axios from 'axios';

function useDelete() {
  const [deleteResponse, setDeleteResponse] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteData = async (apiUrl, token = "") => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const config = {
        headers: {
          Authorization: token,
        },
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

  return { deleteData, deleteResponse, isDeleting, deleteError };
};

export default useDelete;