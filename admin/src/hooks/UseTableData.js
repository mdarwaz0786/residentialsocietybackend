/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";

const useTableData = (apiUrl, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "name",
    order: "asc",
    ...initialParams,
  });
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: res } = await axios.get(apiUrl, { params });
      setData(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data.map((item) => item._id));
    }
  };

  const deleteOne = async (id) => {
    await axios.delete(`${apiUrl}/${id}`);
    fetchData();
  };

  const deleteMany = async () => {
    await axios.post(`${apiUrl}/delete-multiple`, { ids: selected });
    setSelected([]);
    fetchData();
  };

  return {
    data,
    total,
    loading,
    selected,
    params,
    setParams,
    handleSelect,
    handleSelectAll,
    deleteOne,
    deleteMany,
  };
};

export default useTableData;
