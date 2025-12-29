export const getMyProfile = (req, res) => {
  return res.status(200).json({
    user: req.user
  });
};
