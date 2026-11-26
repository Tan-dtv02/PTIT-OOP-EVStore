// src/services/VehicleService.js
import ApiClient from "./ApiClient";

const VehicleService = {
  getAll({ keyword = "", status, model, page = 0, size = 20 }) {
    return ApiClient.get("/vehicles", {
      params: { keyword, status, model, page, size },
    });
  },

  get(id) {
    return ApiClient.get(`/vehicles/${id}`);
  },

  create(data) {
    return ApiClient.post("/vehicles", data);
  },

  update(id, data) {
    return ApiClient.put(`/vehicles/${id}`, data);
  },

  remove(id) {
    return ApiClient.delete(`/vehicles/${id}`);
  },
};

export default VehicleService;
