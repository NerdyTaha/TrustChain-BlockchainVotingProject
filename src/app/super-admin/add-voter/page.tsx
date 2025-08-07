"use client";
import { IconCloudUpload, IconFileText } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const AddVoter = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = axios.post("/api/voter/upload", formData);
      toast.promise(response, {
        loading: "Uploading...",
        success: (res: AxiosResponse) => res.data.message,
        error: (err) => err.response?.data?.message || "Upload failed.",
      });

      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <section className="p-6 bg-base-200 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Voter</h2>

      <div className="flex flex-col items-center w-full">
        <label
          htmlFor="voterList"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-base-content border-dashed rounded-lg cursor-pointer bg-base-300"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <IconCloudUpload size={54} className="text-base-content/80" />
            <p className="mb-2 text-sm text-base-content/80">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-base-content/80">XLSX</p>
          </div>
          <input
            id="voterList"
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {file && (
          <div className="mt-3 flex items-center gap-2 bg-base-100 p-2 rounded-lg shadow-md">
            <IconFileText size={20} className="text-primary" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
        )}
      </div>

      <div className="mt-4 w-full px-32">
        <button className="btn btn-primary w-full" onClick={handleUpload}>
          Upload
        </button>
      </div>
      <div className="mt-4 w-full text-center text-base-content/80">
        Download Sample File{" "}
        <a href="sample_copy.xlsx" download className="link link-primary">
          here
        </a>
      </div>
    </section>
  );
};

export default AddVoter;
