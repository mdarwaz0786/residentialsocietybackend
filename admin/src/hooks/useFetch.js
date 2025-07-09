import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetch(apiUrl, token = "") {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const config = {
          headers: {
            Authorization: token,
          },
        };
        const response = await axios.get(apiUrl, config);
        if (response?.data?.success) {
          setData(response?.data);
        };
      } catch (err) {
        setError(err?.response?.data?.message);
      } finally {
        setIsLoading(false);
      };
    };

    fetchData();
  }, [apiUrl, token]);

  return { data, isLoading, error };
};

export default useFetch;
