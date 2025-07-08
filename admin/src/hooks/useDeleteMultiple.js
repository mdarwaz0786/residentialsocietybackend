import axios from "axios";

const useDeleteMultiple = (apiUrl, selectedIds, setSelected, refetch) => {
  const deleteMany = async () => {
    try {
      console.log(selectedIds);
      await axios.patch(`${apiUrl}`, { ids: selectedIds });
      setSelected([]);
      refetch();
    } catch (error) {
      console.error("Delete many error:", error.message);
    };
  };

  return deleteMany;
};

export default useDeleteMultiple;
