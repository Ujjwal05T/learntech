"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  ArrowLeft,
  Trash2,
  Mail,
  Building2,
  AlertTriangle,
  Save,
  X,
  Edit2,
} from "lucide-react";
import { useToken } from "@/hooks/useToken";

interface ContactPerson {
  fullName?: string;
  position?: string;
  contact?: string;
  [key: string]: any;
}

interface Company {
  _id: string;
  companyName?: string;
  companyEmail?: string;
  contactPerson?: ContactPerson;
  createdAt?: string | { $date?: string } | Date;
  // add other fields your API returns
  [key: string]: any;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { getToken } = useToken();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  // local editable form state (do not include companyEmail/_id as editable)
  const [form, setForm] = useState({
    companyName: "",
    contactFullName: "",
    contactPosition: "",
    contactContact: "",
  });

  useEffect(() => {
    if (!id) return;
    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (company) {
      setForm({
        companyName: company.companyName || "",
        contactFullName: company.contactPerson?.fullName || "",
        contactPosition: company.contactPerson?.position || "",
        contactContact: company.contactPerson?.contact || "",
      });
    }
  }, [company]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const res = await axios.get(`${API_URL}/admin/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setCompany(res.data.data);
      } else {
        setError("Company not found");
      }
    } catch (err: unknown) {
      const errObj = err as AxiosError;
      console.error("Error fetching company:", err);
      setError(errObj.response?.data?.message || errObj.message || "Failed to fetch company");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this company? This action cannot be undone.")) return;
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");
      const res = await axios.delete(`${API_URL}/admin/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        router.push("/admin");
      } else {
        setError("Failed to delete company");
      }
    } catch (err: unknown) {
      const errObj = err as AxiosError;
      console.error("Error deleting company:", err);
      setError(errObj.response?.data?.message || errObj.message || "Failed to delete company");
    }
  };

  const formatCreatedAt = (value: Company["createdAt"]) => {
    if (!value) return "—";
    let dateStr = "";
    if (typeof value === "string") dateStr = value;
    else if (value instanceof Date) dateStr = value.toISOString();
    else if (typeof value === "object" && (value as any).$date) dateStr = (value as any).$date;
    else dateStr = String(value);

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleString();
  };

  const onChange = (field: string, value: string) => {
    setForm((s) => ({ ...s, [field]: value }));
    setSuccess("");
    setError("");
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (!company) return;
    if (!form.companyName.trim()) {
      setError("Company name is required.");
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      // Build payload: only editable fields
      const payload: any = {
        companyName: form.companyName.trim(),
        contactPerson: {
          fullName: form.contactFullName.trim() || undefined,
          position: form.contactPosition.trim() || undefined,
          contact: form.contactContact.trim() || undefined,
        },
      };

      // Clean undefined fields to avoid overwriting with undefined
      if (!payload.contactPerson.fullName) delete payload.contactPerson.fullName;
      if (!payload.contactPerson.position) delete payload.contactPerson.position;
      if (!payload.contactPerson.contact) delete payload.contactPerson.contact;
      // If contactPerson ended up empty, remove it
      if (Object.keys(payload.contactPerson).length === 0) delete payload.contactPerson;

      const res = await axios.put(`${API_URL}/admin/companies/${company._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        // refresh local company state from response if provided, else merge optimistically
        const updated = res.data.data || { ...company, ...payload };
        setCompany(updated);
        setIsEditing(false);
        setSuccess("Company updated successfully.");
      } else {
        setError(res.data?.message || "Failed to update company");
      }
    } catch (err: unknown) {
      const errObj = err as AxiosError;
      console.error("Error updating company:", err);
      setError(errObj.response?.data?.message || errObj.message || "Failed to update company");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // revert form values to company state
    if (company) {
      setForm({
        companyName: company.companyName || "",
        contactFullName: company.contactPerson?.fullName || "",
        contactPosition: company.contactPerson?.position || "",
        contactContact: company.contactPerson?.contact || "",
      });
    }
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060317] to-[#0c0825] text-white pt-20 pb-12">
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-10 w-10 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Company Details</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {!isEditing ? (
              <Button
                size="sm"
                variant="outline"
                className="bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="border border-gray-700/40"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600/10 text-green-400 border border-green-500/30 hover:bg-green-600/20"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </>
            )}

            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {error && (
          <Card className="bg-red-600/10 border-red-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="text-red-300">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="bg-green-600/10 border-green-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <p className="text-green-300">{success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30">
          <CardHeader>
            <CardTitle>{company ? company.companyName || "Company" : "Company"}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-3">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
                <span className="text-gray-400">Loading company...</span>
              </div>
            ) : company ? (
              <div className="space-y-6">
                {/* COMPANY NAME (editable) */}
                <div>
                  <p className="text-sm text-gray-400">Company Name</p>
                  {!isEditing ? (
                    <p className="text-white font-medium">{company.companyName || "—"}</p>
                  ) : (
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) => onChange("companyName", e.target.value)}
                      className="mt-2 w-full rounded bg-gray-800/60 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>

                {/* COMPANY EMAIL (read-only) */}
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email (readonly)</p>
                    <p className="text-white font-medium">{company.companyEmail || "—"}</p>
                  </div>
                </div>

                {/* CONTACT PERSON (editable) */}
                <div>
                  <p className="text-sm text-gray-400">Contact Person</p>
                  {!isEditing ? (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Full name</p>
                        <p className="text-white">{company.contactPerson?.fullName || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Position</p>
                        <p className="text-white">{company.contactPerson?.position || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Contact</p>
                        <p className="text-white">{company.contactPerson?.contact || "—"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Full name</p>
                        <input
                          type="text"
                          value={form.contactFullName}
                          onChange={(e) => onChange("contactFullName", e.target.value)}
                          className="mt-1 w-full rounded bg-gray-800/60 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Position</p>
                        <input
                          type="text"
                          value={form.contactPosition}
                          onChange={(e) => onChange("contactPosition", e.target.value)}
                          className="mt-1 w-full rounded bg-gray-800/60 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Contact</p>
                        <input
                          type="text"
                          value={form.contactContact}
                          onChange={(e) => onChange("contactContact", e.target.value)}
                          className="mt-1 w-full rounded bg-gray-800/60 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* CREATED AT (read-only) */}
                <div>
                  <p className="text-sm text-gray-400">Created At</p>
                  <p className="text-white">{formatCreatedAt(company.createdAt)}</p>
                </div>

                {/* Render any additional fields returned by the API (excluding common ones) */}
                {Object.entries(company)
                  .filter(
                    ([key]) =>
                      !["_id", "companyName", "companyEmail", "contactPerson", "createdAt", "__v"].includes(
                        key
                      )
                  )
                  .map(([key, value]) => (
                    <div key={key} className="flex items-start gap-3">
                      <div>
                        <p className="text-sm text-gray-400">{key}</p>
                        <p className="text-white break-words">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-gray-400">No company data available.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}