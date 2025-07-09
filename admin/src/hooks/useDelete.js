import { useState } from 'react';
import axios from 'axios';

function useDelete() {
  const [response, setResponse] = useState(null);
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
      setResponse(res.data);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    };
  };

  return { deleteData, response, isDeleting, deleteError };
};

export default useDelete;