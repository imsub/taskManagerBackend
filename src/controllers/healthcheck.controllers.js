import { ApiResponse } from "../utils/api-response.js";
const healthCheck = (req, res) => {
  console.log("logic to connect with db");
  
  res.status(200).json(new ApiResponse(200, { message: "Server is running" }));
};

export { healthCheck };
