"use client";
import { Admin } from "@/types/Admin";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MangeAdmins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const fetchAdmins = async () => {
    const response = await axios.get("/api/admins");
    setAdmins(response.data.admins);
  };
  useEffect(() => {
    fetchAdmins();
  }, []);
  const handleApproveAdmin = async (id: string, isApproved: boolean) => {
    try {
      const response = axios.put(
        `/api/admins/approve?id=${id}&isApproved=${isApproved}`,
        {
          isApproved,
        }
      );
      toast.promise(response, {
        loading: "Approving Admin...",
        success: () => {
          fetchAdmins();
          return "Admin approved!";
        },
        error: "Failed to approve admin!",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve admin!");
    }
  };
  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-center">
        Manage Admins of Constituency
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-300 text-sm text-center">
              <th className="border border-base-content">#</th>
              <th className="border border-base-content">Admin</th>
              <th className="border border-base-content">Email</th>
              <th className="border border-base-content">Phone</th>
              <th className="border border-base-content">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? (
              admins.map((admin, index) => (
                <tr key={admin._id} className="text-center">
                  <td className="border border-base-content p-2">
                    {index + 1}
                  </td>
                  <td className="border border-base-content p-2">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={admin.profileImage} alt="Profile Image" />
                        </div>
                      </div>
                      <div className="w-7/12">
                        <div className="font-bold text-center">
                          {admin.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border border-base-content p-2">
                    {admin.email}
                  </td>
                  <td className="border border-base-content p-2">
                    {admin.phone}
                  </td>
                  <td className="border border-base-content p-2 space-x-4">
                    {admin.isApproved ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => toast("Approved Admin!")}
                      >
                        Approved
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleApproveAdmin(admin._id, true)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No Admin found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MangeAdmins;
