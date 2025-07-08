import Pagination from "../../components/Table/Pagination";
import SearchBar from "../../components/Table/SearchBar";
import TableBody from "../../components/Table/TableBody";
import TableHeader from "../../components/Table/TableHeader";
import TableWrapper from "../../components/Table/TableWrapper";
import useDeleteMultiple from "../../hooks/useDeleteMultiple";
import useDeleteSingle from "../../hooks/useDeleteOne";

import useFetch from "../../hooks/useFetch";
import useSelection from "../../hooks/useSelection";

const ProductList = () => {
  const fetchUrl = "/api/v1/user/get-all-user";
  const singleDeleteUrl = "/api/v1/user/delete-single-user";
  const multipleDeleteUrl = "/api/v1/user/delete-multiple-user";

  const {
    data,
    total,
    loading,
    params,
    setParams,
    refetch
  } = useFetch(fetchUrl);

  const {
    selected,
    setSelected,
    handleSelect,
    handleSelectAll
  } = useSelection(data);

  console.log(selected)

  const handleDelete = (id) => {
    console.log(id);
  }

  const { deleteMany } = useDeleteSingle(multipleDeleteUrl, selected, setSelected, refetch);

  const handleSearchChange = (search) => {
    setParams({ ...params, search, page: 1 });
  };

  const handleToggleVisibility = (id) => {
    // You can make an API call here to update visibility if needed
    console.log("Toggle visibility for:", id);
  };

  const handleEdit = (id) => {
    console.log(id);
  };

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Mobile" },
  ];

  if (loading) {
    return <h6>Loading...</h6>
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>User List</h4>
        <SearchBar value={params.search} onChange={handleSearchChange} />
      </div>

      <button
        className="btn btn-danger btn-sm mb-3"
        onClick={deleteMany}
        disabled={selected.length === 0}
      >
        Delete Selected
      </button>

      <TableWrapper>
        <TableHeader
          columns={columns}
          onSelectAll={handleSelectAll}
          allSelected={selected.length === data.length && data.length > 0}
        />

        <TableBody
          data={data}
          columns={columns}
          selected={selected}
          onSelect={handleSelect}
          onToggle={handleToggleVisibility}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </TableWrapper>

      <Pagination
        page={params.page}
        total={total}
        limit={params.limit}
        onPageChange={(newPage) => setParams({ ...params, page: newPage })}
      />
    </div>
  );
};

export default ProductList;
