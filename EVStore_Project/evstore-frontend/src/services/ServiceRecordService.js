// src/services/ServiceRecordService.js
import ApiClient from "./ApiClient";

const ServiceRecordService = {
  // Lấy danh sách dịch vụ theo order
  getByOrder(orderId) {
    return ApiClient.get(`/services/${orderId}`);
  },

  // Tạo dịch vụ mới
  create({ orderId, serviceName, description }) {
    return ApiClient.post("/services/create", null, {
      params: { orderId, serviceName, description },
    });
  },

  // Cập nhật trạng thái dịch vụ
  updateStatus({ id, status }) {
    return ApiClient.patch(`/services/${id}/status`, null, {
      params: { status },
    });
  },
};

export default ServiceRecordService;
