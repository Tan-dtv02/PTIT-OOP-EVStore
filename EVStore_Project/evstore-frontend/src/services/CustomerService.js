import ApiClient from "./ApiClient";

const CustomerService = {
  getAll({ keyword = "", page = 0, size = 20 }) {
    return ApiClient.get("/customers", {
      params: { keyword, page, size },
    });
  },

  get(id) {
    return ApiClient.get(`/customers/${id}`);
  },

  create(data) {
    return ApiClient.post("/customers", data);
  },

  update(id, data) {
    return ApiClient.put(`/customers/${id}`, data);
  },

  remove(id) {
    return ApiClient.delete(`/customers/${id}`);
  },
};

export default CustomerService;
