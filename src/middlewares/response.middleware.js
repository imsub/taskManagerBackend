import { ApiResponse } from "../utils/api-response.js"
const apiResponse = (req, res) => {
    if (req.apiResponse) {
        const { statusCode, data, message } = req.apiResponse;
        const response = new ApiResponse(statusCode, data, message);
        return res.status(statusCode).json(response);
    }
};
export {apiResponse};