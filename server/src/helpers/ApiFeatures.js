import mongoose from "mongoose";

const ApiFeatures = (req, searchableFields = [], filterableFields = [], options = {}) => {
  const { search = "", ...restFilters } = req.query;

  // Query parameters
  const sortBy = req.query.sortBy || options.defaultSortBy || "createdAt";
  const order = req.query.order || options.defaultOrder || "desc";
  const page = parseInt(req.query.page) || options.defaultPage || 1;
  const limit = parseInt(req.query.limit) || options.defaultLimit || 10;

  const query = { ...options.softDelete && { isDeleted: false } };

  // Fuzzy search with regex on multiple fields
  if (search && searchableFields.length > 0) {
    const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
    query.$or = searchableFields.map((field) => ({ [field]: searchRegex }));
  };

  // Filtering
  for (const key of filterableFields) {
    const value = restFilters[key];
    if (value) {
      if (mongoose.Types.ObjectId.isValid(value)) {
        query[key] = value;
      } else {
        query[key] = { $eq: value };
      };
    };
  };

  // Sorting
  const sort = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  // Pagination
  const skip = (page - 1) * limit;

  return { query, sort, skip, limit, page };
};

export default ApiFeatures;
