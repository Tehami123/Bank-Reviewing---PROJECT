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

const ShareStory = () => {
  // state variables for the form data
  const [isLoading, setisLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyType[]>([]);

  //   formdata for  our backend request
  const [formData, setFormData] = useState({
    vibe: "neutral",
    companyName: "",
    isAnonymous: false,
    name: "",
    userType: "individual customer",
    title: "",
    story: "",
  });
  // router for navigation
  const router = useRouter();

  // prepare company options for the inputs

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

  // functuin to handle form changes
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // fetch out company from backend
  useEffect(() => {
    const fetchCompanies = async () => {
      const companyReq = async () =>
        await axios.get(`http://localhost:8000/api/v1/companies/all`);

      const result = await handleRequest(companyReq, setisLoading);

      if (result?.data.status === "success") {
        setCompanies(result.data.data.companies);
        // console.log("COMPANIES FETCHED:", result.data.data.companies); // ✅ Log here
      } else {
        console.warn("Failed to fetch companies");
      }
    };

    fetchCompanies();
  }, []);

  // submit funtion

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

  // console.log("Submitting payload:", payload);

  const shareStoryReq = async () =>
    await axios.post(`http://localhost:8000/api/v1/reviews/create`, payload, { withCredentials: true });

  const result = await handleRequest(shareStoryReq, setisLoading);

  if (result?.data.status === "success") {
    toast.success("Story Submitted Successfully!");
    router.push("/reviews");
  }
};

  
  

  return (
    <div className="min-h-screen mt-10 bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-md  shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold mt-4 text-center">
          Share Your Banking Experience
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* vibe */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              <Heart className="inline w-4 h-4 mr-2" />
              Vibe
            </label>
            <Select
              instanceId="vibe-select" // ✅ stable ID for SSR
              name="vibe"
              options={vibeOptions}
              value={{
                value: formData.vibe,
                label:
                  formData.vibe.charAt(0).toUpperCase() +
                  formData.vibe.slice(1),
              }}
              onChange={(selected) =>
                setFormData({ ...formData, vibe: selected?.value || "neutral" })
              }
              isSearchable={false}
            />
          </div>
          {/* company name */}

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              <Building2 className="inline w-4 h-4 mr-2" />
              Company
            </label>
            <Select
              options={companyOptions}
              instanceId={"company-select"}
              value={companyOptions.find(
                (opt) => opt.value === formData.companyName
              )}
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
            <label className="text-sm text-gray-700">Post Anonymously</label>
          </div>

          {/* Name field and only show this if isAnonymous is false */}
          {!formData.isAnonymous && (
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                <User className="inline w-4 h-4 mr-2" />
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Your Name"
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          )}

          {/* User Type Select Field */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              <Briefcase className="inline w-4 h-4 mr-2" />
              User Type
            </label>
            <Select
              name="userType"
              instanceId={"user-type-select"}
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
          {/* title */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              <FileText className="inline w-4 h-4 mr-2" />
              Story Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter Your Story Title"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {/* Story Description */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              <FileText className="inline w-4 h-4 mr-2" />
              Story
            </label>
            <textarea
              name="story"
              value={formData.story}
              onChange={handleChange}
              placeholder="Describe Your experience"
              rows={6}
              required
              className="border rounded px-3 py-2 w-full resize-y"
            />
          </div>

          {/* Share Story Button */}
          <div className="text-right">
            <LoadingButton
              isLoading={isLoading}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded cursor-pointer disabled:opacity-50"
            >
              <span className="inline-flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Share Story
              </span>

            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareStory;
