import ApiClient from "./ApiClient";

const DashboardService = {
  async getOverview() {
    const res = await ApiClient.get("/dashboard/overview");
    return res.data;
  }
};

export default DashboardService;
