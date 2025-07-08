import { useState } from 'react';
import axios from 'axios';

function useCreate(apiUrl) {
  const [response, setResponse] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(null);

  const postData = async (payload, token = "", isFormData = false) => {
    setIsPosting(true);
    setPostError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData && { 'Content-Type': 'multipart/form-data' }),
        },
      };
      const res = await axios.post(apiUrl, payload, config);
      setResponse(res.data);
    } catch (err) {
      setPostError(err);
    } finally {
      setIsPosting(false);
    };
  };

  return { postData, response, isPosting, postError };
};

export default useCreate;