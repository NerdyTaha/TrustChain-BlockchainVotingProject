"use client";
import { useUser } from "@/context/UserContext";
import { Institute } from "@/types/Institute";
import { IconTrash } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const InstitutionsPage = () => {
  const { user } = useUser();
  const [institute, setInstitute] = useState([]);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !user) {
      toast.error("Something went wrong!!!");
      return;
    }
    try {
      const response = axios.post("/api/institutions", { name, user });
      toast.promise(response, {
        loading: "Adding Institute....",
        success: (data: AxiosResponse) => {
          fetchInstitute();
          return data.data.message;
        },
        error: (err: any) => {
          return err.response.data.message;
        },
      });
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const fetchInstitute = async () => {
    try {
      const response = await axios.get("/api/institutions/get");
      setInstitute(response.data.institute);
      console.log(institute);
    } catch {
      console.log("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this institute?"))
      return;
    try {
      const response = axios.delete(`/api/institutions/delete?id=${id}`);
      toast.promise(response, {
        loading: "Deleting Institute....",
        success: (data: AxiosResponse) => {
          fetchInstitute();
          return data.data.message;
        },
        error: (err: any) => {
          return err.response.data.message;
        },
      });
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchInstitute();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 capitalize text-center">
        Manage your election constituency
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Consituency Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="input input-bordered"
          required
        />
        <button type="submit" className="btn btn-primary w-1/2 mx-auto">
          Add constituency
        </button>
      </form>
      {institute && institute.length === 0 ? (
        <div className="mt-5 text-center text-2xl">
          No Constituency has been added yet!!
        </div>
      ) : (
        <div className="mt-5 text-center">
          <p className="text-2xl text-center capitalize">
            Your added constituency{" "}
          </p>
          <div className="overflow-x-auto mt-3">
            <table className="table table-zebra">
              <thead className="text-base">
                <tr className="text-center">
                  <th>#</th>
                  <th>Constituency Name</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {institute.map((institute: Institute, index) => {
                  return (
                    <tr key={index} className="text-center">
                      <th>{index + 1}</th>
                      <td>{institute.name}</td>
                      <td>
                        <button
                          className="btn btn-error btn-outline"
                          onClick={() => {
                            handleDelete(institute._id);
                          }}
                        >
                          <IconTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default InstitutionsPage;
