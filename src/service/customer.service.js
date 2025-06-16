import { http } from "./config";

export const customerService = {
  createFeedback: (data) => {
    return http.post("/feedback", data);
  },

  getFeedbackCustomer: (customerId) => {
    return http.get(`/feedback/for-customer/${customerId}`);
  },

  checkIsValid: (recordId) => {
    return http.get(`/feedback/isValidToFeedback/${recordId}`);
  },
};
