import React, { useEffect, useState } from "react";

type Company = {
  id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
};

const fetchCompanies = async (): Promise<Company[]> => {
  // Replace with your API call
  return [
    { id: "1", name: "TechCorp", email: "hr@techcorp.com", status: "pending" },
    { id: "2", name: "InnovateX", email: "contact@innovatex.com", status: "approved" },
  ];
};

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies().then(data => {
      setCompanies(data);
      setLoading(false);
    });
  }, []);

  const handleApprove = (id: string) => {
    // Call API to approve company
    setCompanies(companies =>
      companies.map(c => (c.id === id ? { ...c, status: "approved" } : c))
    );
  };

  const handleDelete = (id: string) => {
    // Call API to delete company
    setCompanies(companies => companies.filter(c => c.id !== id));
  };

  if (loading) return <div>Loading companies...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Partnered Companies</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company.id}>
              <td className="border px-4 py-2">{company.name}</td>
              <td className="border px-4 py-2">{company.email}</td>
              <td className="border px-4 py-2">{company.status}</td>
              <td className="border px-4 py-2">
                {company.status === "pending" && (
                  <button
                    className="bg-green-500 text-white px-2 py-1 mr-2"
                    onClick={() => handleApprove(company.id)}
                  >
                    Approve
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-2 py-1"
                  onClick={() => handleDelete(company.id)}
                >
                  Delete
                </button>
                {/* Add Edit button/modal as needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCompaniesPage;