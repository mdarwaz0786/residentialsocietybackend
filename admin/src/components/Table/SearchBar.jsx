const SearchBar = ({ value, onChange }) => (
  <input
    type="text"
    className="form-control w-25"
    placeholder="Search..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default SearchBar;
