import ApiClient from "./ApiClient";

const OrderService = {
  getAll({ keyword = "", page = 0, size = 20 }) {
    return ApiClient.get("/orders", {
      params: { keyword, page, size },
    });
  },

  get(id) {
    return ApiClient.get(`/orders/${id}`);
  },

  create({ customerId, vehicleId }) {
    return ApiClient.post("/orders", { customerId, vehicleId });
  },

  updateStatus(id, status) {
    return ApiClient.patch(`/orders/${id}/status?status=${status}`);
  },
};

export default OrderService;
