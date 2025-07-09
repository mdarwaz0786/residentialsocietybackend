import { useState } from 'react';
import axios from 'axios';

function useDeleteMultiple(apiUrl) {
  const [response, setResponse] = useState(null);
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
      setResponse(res.data);
    } catch (err) {
      setDeleteError(err);
    } finally {
      setIsDeleting(false);
    };
  };

  return { deleteMultiple, response, isDeleting, deleteError };
};

export default useDeleteMultiple;