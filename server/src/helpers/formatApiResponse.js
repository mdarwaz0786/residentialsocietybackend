const formatApiResponse = ({ data = [], total = 0, page = 1, limit = 20 }) => {
  return {
    success: true,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data,
  };
};

export default formatApiResponse;
