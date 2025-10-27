


// app/companies/page.tsx

import Company from "@/components/Company/Company";
// import Company from "@/components/Company/CompanyClient";

// app/companies/page.tsx
// import CompanyClient from "@/components/CompanyClient";  // or wherever you keep it

export default async function CompaniesPage() {
  // Server-side fetches
  const statsRes = await fetch(
    "http://localhost:8000/api/v1/companies/total-stats"
  );
  const statsJson = await statsRes.json();
  const stats = statsJson.data.stats;

  const listRes = await fetch(
    "http://localhost:8000/api/v1/companies/stats?sort=complaints_desc&page=1&limit=9"
  );
  const listJson = await listRes.json();
  const companies = listJson.data.companies;
  const totalCompanies = listJson.data.totalCompanies;

  return (
    <Company
      initialStats={stats}
      initialCompanies={companies}
      initialTotal={totalCompanies}
    />
  );
}
