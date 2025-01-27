// import jwt from "jsonwebtoken";
// import { errorHandler } from "./error.js";

// // all info need when we whant vri person is vrifyted or not
// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.access_token;
//   if (!token) {
//     return next(errorHandler(401, "Unauthorized"));
//   }
//   jwt.verify(token, "hussain", (err, user) => {
//     if (err) {
//       return next(errorHandler(401, "Unauthorized"));
//     }
//     req.user = user;
//     next();
//   });
// };



import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import { setOnline, setOffline } from "./onlineStatus.js";
// all info need when we whant vri person is vrifyted or not
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, "hussain", (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    req.user = user;
    setOnline(user.id);
    res.on("finish", () => setOffline(user.id));
    next();
  });
};
