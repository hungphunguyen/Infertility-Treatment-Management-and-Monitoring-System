import { http } from "./config";

export const customerService = {
  createFeedback: (data) => {
    return http.post("/v1/feedbacks", data);
  },

  getAllFeedback: (customerId, page, size) => {
    return http.get("v1/feedbacks", {
      params: {
        customerId,

        page,
        size,
      },
    });
  },

  checkIsValid: (recordId) => {
    return http.get(`/feedback/isValidToFeedback/${recordId}`);
  },

  updateFeedback: (id, data) => {
    return http.put(`/v1/feedbacks/${id}`, data);
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
    return http.post(`/payment/vnpay/create/${recordId}`);
  },

  paymentReloadForCustomer: (recordId) => {
    return http.post(`/payment/momo/reload/${recordId}`);
  },

  paymentCancelForCustomer: (recordId) => {
    return http.delete(`/payment/cancelled/${recordId}`);
  },
};
