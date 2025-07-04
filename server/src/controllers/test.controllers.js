// test controller
export const testController = async (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "Server is successfully running" });
  } catch (error) {
    return res.status(200).json({ success: false, message: "Server error" });
  };
};