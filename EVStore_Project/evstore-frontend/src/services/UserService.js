import ApiClient from "./ApiClient";

const UserService = {
  getAll({ keyword = "", role, page = 0, size = 20 }) {
    return ApiClient.get("/users", {
      params: { keyword, role, page, size },
    });
  },

  get(id) {
    return ApiClient.get(`/users/${id}`);
  },

  create(data) {
    return ApiClient.post("/users", data);
  },

  update(id, data) {
    return ApiClient.put(`/users/${id}`, data);
  },

  remove(id) {
    return ApiClient.delete(`/users/${id}`);
  },

  toggleActive(id, active) {
    return ApiClient.patch(`/users/${id}/active`, { active });
  },
};

export default UserService;
