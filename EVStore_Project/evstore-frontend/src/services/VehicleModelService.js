import ApiClient from "./ApiClient";

const VehicleModelService = {
  getAll({ keyword = "", page = 0, size = 20 }) {
    return ApiClient.get("/vehicle-models", {
      params: { keyword, page, size },
    });
  },

  get(id) {
    return ApiClient.get(`/vehicle-models/${id}`);
  },

  create(data) {
    return ApiClient.post("/vehicle-models", data);
  },

  update(id, data) {
    return ApiClient.put(`/vehicle-models/${id}`, data);
  },

  remove(id) {
    return ApiClient.delete(`/vehicle-models/${id}`);
  },
};

export default VehicleModelService;
