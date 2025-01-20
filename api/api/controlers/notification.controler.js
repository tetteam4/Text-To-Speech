// import Notification from "../models/notification.model.js";

// export const getNotification = async (req, res, next) => {
//   try {
//     const notifications = await Notification.find({
//       receiverId: req.user.id,
//     }).populate("senderId", "username profilePicture");
//     res.status(200).json(notifications);
//   } catch (error) {
//     next(error);
//   }
// };
// export const readNotification = async (req, res, next) => {
//   try {
//     await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
//     res.status(200).json({ message: "notifi read successfully" });
//   } catch (error) {
//     next(error);
//   }
// };
