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

  updateFeedback: (id, data) => {
    return http.put(`/feedback/update-feedback/${id}`, data);
  },

  uploadImg: (payload) => {
    return http.put(`/blogs/update/img`, payload, {
      "Content-Type": "multipart/form-data",
    });
  },

  paymentForCustomer: (recordId) => {
    return http.post(`/payment/momo/create/${recordId}`);
  },

  paymentNotificationForCustomer: (recordId) => {
    return http.get(`/payment/result/${recordId}`);
  },

  paymentVnpayForCustomer: (recordId) => {
    return http.get(`/payment/vnpay/${recordId}`);
  },
};
