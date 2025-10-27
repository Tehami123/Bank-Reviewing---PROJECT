// utils/companyApi.ts
// utils/companyApi.ts
import axios from "axios";

export function fetchTotalStats() {
  return axios.get("http://localhost:8000/api/v1/companies/total-stats");
}

export function fetchCompanies(params: {
  sort: string;
  search: string;
  page: number;
  limit: number;
}) {
  return axios.get("http://localhost:8000/api/v1/companies/stats", {
    params
  });
}
