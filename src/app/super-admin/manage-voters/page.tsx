"use client";
import { Voter } from "@/types/Voter";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const ManageElection = () => {
  const [voters, setVoters] = useState([]);

  const fetchVoters = async () => {
    try {
      const response = await axios.get("/api/voter");
      setVoters(response.data.voters);
      console.log(response.data);
    } catch (error) {
      toast.error("Failed to fetch voters");
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = axios.delete(`/api/voter/delete?id=${id}`);
      toast.promise(response, {
        loading: "Deleting voter...",
        success: (data: AxiosResponse) => {
          fetchVoters();
          return data.data.message;
        },
        error: (err: any) =>
          err.response?.data?.message || "Failed to delete voter",
      });
    } catch (error) {
      toast.error("Failed to delete voter");
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Voters</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-300 text-sm text-center">
              <th className="border border-base-content">#</th>
              <th className="border border-base-content">Voter</th>
              <th className="border border-base-content">Epic Id</th>
              <th className="border border-base-content">Email</th>
              <th className="border border-base-content">Phone</th>
              <th className="border border-base-content">Actions</th>
            </tr>
          </thead>
          <tbody>
            {voters.length > 0 ? (
              voters.map((voter: Voter, index) => (
                <tr key={voter._id} className="text-center">
                  <td className="border border-base-content p-2">
                    {index + 1}
                  </td>
                  <td className="border border-base-content p-2">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={voter.profileImage} alt="Profile Image" />
                        </div>
                      </div>
                      <div className="w-7/12">
                        <div className="font-bold text-center">
                          {voter.name}
                        </div>
                        <div className="text-sm opacity-50">
                          {voter.address.district} - {voter.address.state}{" "}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border border-base-content p-2">
                    {voter.epicId}
                  </td>
                  <td className="border border-base-content p-2">
                    {voter.email}
                  </td>
                  <td className="border border-base-content p-2">
                    {voter.phone}
                  </td>
                  <td className="border border-base-content p-2 space-x-4">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => toast("Edit functionality coming soon!")}
                    >
                      <IconEdit size={20} /> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(voter._id)}
                    >
                      <IconTrash size={20} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No voters found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageElection;
