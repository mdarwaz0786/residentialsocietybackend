import { useState } from 'react';
import axios from 'axios';

function useDelete(apiUrl) {
  const [response, setResponse] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteData = async (token = '') => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.delete(apiUrl, config);
      setResponse(res.data);
    } catch (err) {
      setDeleteError(err);
    } finally {
      setIsDeleting(false);
    };
  };

  return { deleteData, response, isDeleting, deleteError };
};

export default useDelete;