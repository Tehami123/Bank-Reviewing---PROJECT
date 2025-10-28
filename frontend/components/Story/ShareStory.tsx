"use client";
import { BASE_API_URL } from "@/server";
import { CompanyType } from "@/type";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { handleRequest } from "../utils/apiRequest";
import { Briefcase, Building2, FileText, Heart, Send, User } from "lucide-react";
import { LoadingButton } from "../utils/LoadingButton";
import { toast } from "sonner";
import { useTheme } from "next-themes";

const getSelectStyles = (theme: "light" | "dark" | undefined) => ({
  control: (base: any) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#000" : "#fffff",
    borderColor: theme === "dark" ? "#333" : "#ccc",
    color: theme === "dark" ? "#fff" : "#000",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#000" : "#fff",
    color: theme === "dark" ? "#fff" : "#000",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? theme === "dark"
        ? "#1e1e1e"
        : "#e6e6e6"
      : state.isFocused
      ? theme === "dark"
        ? "#2a2a2a"
        : "#f5f5f5"
      : theme === "dark"
      ? "#000"
      : "#fff",
    color: theme === "dark" ? "#fff" : "#000",
    cursor: "pointer",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: theme === "dark" ? "#fff" : "#000",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: theme === "dark" ? "#999" : "#666",
  }),
});

const ShareStory = () => {
  const [isLoading, setisLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    vibe: "neutral",
    companyName: "",
    isAnonymous: false,
    name: "",
    userType: "individual customer",
    title: "",
    story: "",
  });

  const router = useRouter();

  const companyOptions = companies.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const vibeOptions = [
    { value: "neutral", label: "Neutral" },
    { value: "positive", label: "Positive" },
    { value: "negative", label: "Negative" },
  ];

  const userTypeOptions = [
    { value: "individual customer", label: "Individual Customer" },
    { value: "business customer", label: "Business Customer" },
    { value: "bank employee", label: "Bank Employee" },
    { value: "former employee", label: "Former Employee" },
    { value: "investor", label: "Investor" },
    { value: "other", label: "Other" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      const companyReq = async () =>
        await axios.get(`http://localhost:8000/api/v1/companies/all`);

      const result = await handleRequest(companyReq, setisLoading);

      if (result?.data.status === "success") {
        setCompanies(result.data.data.companies);
      } else {
        console.warn("Failed to fetch companies");
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.isAnonymous && !formData.name.trim()) {
      toast.error("Name is required when not posting anonymously");
      return;
    }

    const payload = {
      vibe: formData.vibe,
      companyName: formData.companyName,
      isAnonymous: formData.isAnonymous,
      userType: formData.userType,
      title: formData.title,
      story: formData.story,
      ...(formData.isAnonymous ? {} : { name: formData.name.trim() }),
    };

    const shareStoryReq = async () =>
      await axios.post(`http://localhost:8000/api/v1/reviews/create`, payload, { withCredentials: true });

    const result = await handleRequest(shareStoryReq, setisLoading);

    if (result?.data.status === "success") {
      toast.success("Story Submitted Successfully!");
      router.push("/reviews");
    }
  };

  return (
    <div className="min-h-screen mt-10 dark:bg-gray-950/20 dark:text-white bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-black dark:text-white rounded-md shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold mt-4 text-blue-600 text-center">
          Share Your Banking Experience
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vibe */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              <Heart className="inline w-4 h-4 mr-2" /> Vibe
            </label>
            <Select
              styles={getSelectStyles(theme)}
              instanceId="vibe-select"
              name="vibe"
              options={vibeOptions}
              value={{
                value: formData.vibe,
                label: formData.vibe.charAt(0).toUpperCase() + formData.vibe.slice(1),
              }}
              onChange={(selected) =>
                setFormData({ ...formData, vibe: selected?.value || "neutral" })
              }
              isSearchable={false}
            />
          </div>

          {/* Company */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              <Building2 className="inline w-4 h-4 mr-2" /> Company
            </label>
            <Select
              styles={getSelectStyles(theme)}
              options={companyOptions}
              instanceId="company-select"
              value={companyOptions.find((opt) => opt.value === formData.companyName)}
              onChange={(selected) =>
                setFormData({ ...formData, companyName: selected?.value || "" })
              }
              placeholder="Select a company"
              isSearchable={true}
            />
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">Post Anonymously</label>
          </div>

          {/* Name (only if not anonymous) */}
          {!formData.isAnonymous && (
            <div>
              <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
                <User className="inline w-4 h-4 mr-2" /> Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Your Name"
                className="border rounded px-3 py-2 w-full dark:bg-black dark:border-gray-700 dark:text-white"
              />
            </div>
          )}

          {/* User Type */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              <Briefcase className="inline w-4 h-4 mr-2" /> User Type
            </label>
            <Select
              styles={getSelectStyles(theme)}
              name="userType"
              instanceId="user-type-select"
              options={userTypeOptions}
              value={{
                value: formData.userType,
                label: formData.userType
                  .split(" ")
                  .map((word) => word[0].toUpperCase() + word.slice(1))
                  .join(" "),
              }}
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  userType: selected?.value || "individual customer",
                })
              }
              isSearchable={true}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              <FileText className="inline w-4 h-4 mr-2" /> Story Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter Your Story Title"
              className="border rounded px-3 py-2 w-full dark:bg-black dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Story */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              <FileText className="inline w-4 h-4 mr-2" /> Story
            </label>
            <textarea
              name="story"
              value={formData.story}
              onChange={handleChange}
              placeholder="Describe Your Experience"
              rows={6}
              required
              className="border rounded px-3 py-2 w-full resize-y dark:bg-black dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Submit */}
          <div className="text-right">
            <LoadingButton
              isLoading={isLoading}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded cursor-pointer disabled:opacity-50"
            >
              <span className="inline-flex items-center">
                <Send className="w-4 h-4 mr-2" /> Share Story
              </span>
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareStory;
