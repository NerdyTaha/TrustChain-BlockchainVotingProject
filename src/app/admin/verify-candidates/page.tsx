"use client";
import { Candidate } from "@/types/Candidate";
import { IconCheck, IconTrash, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const VerifyCandidatesPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("/api/candidates");
      setCandidates(response.data.candidates);
    } catch (error) {
      toast.error("Failed to fetch candidates");
    }
  };

  const handleVerify = async (
    id: string,
    status: boolean,
    candidate: Candidate
  ) => {
    try {
      const response = axios.put(`/api/candidates/verify`, {
        id,
        candidate,
        status,
      });
      toast.promise(response, {
        loading: "Updating candidate status...",
        success: () => {
          fetchCandidates();
          return `Candidate ${status ? "approved" : "rejected"} successfully!`;
        },
        error: (err: any) =>
          err.response.data.message || "Failed to update candidate status",
      });
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Candidate deleted successfully!");
        fetchCandidates();
      } else {
        toast.error("Failed to delete candidate.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-center">Verify Candidates</h2>

      <div className="overflow-x-auto rounded-lg border border-base-300 shadow-md">
        {candidates && candidates.length !== 0 ? (
          <table className="table w-full">
            {/* Table Head */}
            <thead>
              <tr className="bg-base-300 text-base-content text-base font-semibold text-center">
                <th className="py-3">#</th>
                <th>Name & Email</th>
                <th>Institute</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {candidates.map((candidate, index) => (
                <tr
                  key={candidate._id}
                  className="hover:bg-base-100 transition-all duration-200"
                >
                  <td className="text-center font-semibold">{index + 1}</td>

                  {/* Candidate Profile */}
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12 object-cover">
                          <img
                            src={
                              candidate.profileImage || "/default-avatar.png"
                            }
                            alt={candidate.name}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{candidate.name}</div>
                        <div className="text-sm opacity-50">
                          {candidate.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Institute Name & Role */}
                  <td className="text-center">
                    <span className="font-semibold">
                      {candidate.institute.name}
                    </span>
                    <br />
                    <span className="badge badge-outline badge-sm">
                      {candidate.role}
                    </span>
                  </td>

                  {/* Approval Status */}
                  <td className="text-center">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        candidate.isApproved
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {candidate.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="flex items-center justify-center space-x-2">
                    {!candidate.isApproved ? (
                      <button
                        onClick={() =>
                          handleVerify(candidate._id!, true, candidate)
                        }
                        className="btn btn-success btn-sm flex items-center gap-1"
                      >
                        <IconCheck size={16} /> Approve
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleVerify(candidate._id!, false, candidate)
                        }
                        className="btn btn-warning btn-sm flex items-center gap-1"
                      >
                        <IconX size={16} /> Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(candidate._id!)}
                      className="btn btn-error btn-sm flex items-center gap-1"
                    >
                      <IconTrash size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="mt-4 text-center font-semibold text-2xl">
            No candidates have been registered yet! 🚀
          </div>
        )}
      </div>
    </>
  );
};

export default VerifyCandidatesPage;
