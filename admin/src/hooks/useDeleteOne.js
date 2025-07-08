import axios from "axios";

const useDeleteSingle = (apiUrl, refetch) => {
  const deleteOne = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      refetch();
    } catch (error) {
      console.error("Delete single error:", error.message);
    };
  };

  return deleteOne;
};

export default useDeleteSingle;
