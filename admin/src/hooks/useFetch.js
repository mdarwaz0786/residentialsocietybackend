/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (apiUrl) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    order: "asc",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrl, { params });
      if (response?.data?.success) {
        setData(response?.data?.data);
        setTotal(response?.data?.total);
      };
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  return {
    data,
    total,
    loading,
    error,
    params,
    setParams,
    refetch: fetchData,
  };
};

export default useFetch;
