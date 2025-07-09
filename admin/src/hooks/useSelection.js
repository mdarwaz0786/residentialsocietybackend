import { useState } from "react";

const useSelection = (data, key = "_id") => {
  const [selected, setSelected] = useState([]);

  const handleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    const allIds = data.map((item) => item[key]);
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(allIds);
    };
  };

  return {
    selected,
    setSelected,
    handleSelect,
    handleSelectAll,
  };
};

export default useSelection;
