"use client";
"use strict";
import { getContract, initBlockchain } from "@/middlewares/blockchain.config";
import { Candidate } from "@/types/Candidate";
import { MAHARASHTRA_DISTRICTS, MAHARASHTRA_TALUKAS } from "@/utils/Constants";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const ManageElection = () => {
  const [institutes, setInstitutes] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const setupBlockchain = async () => {
      try {
        const initialBlockchain = initBlockchain();
        toast.promise(initialBlockchain, {
          loading: "Connecting to blockchain...",
          success: "Connected to blockchain!",
          error: "Failed to connect to blockchain",
        });
      } catch (error) {
        console.error("Error setting up blockchain:", error);
      }
    };

    setupBlockchain();
    fetchInstitutes();
    fetchVoters();
  }, []);

  const [filter, setFilter] = useState({
    country: "India",
    state: "Maharashtra",
    district: "",
    taluka: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    instituteName: "",
    startDate: "",
    endDate: "",
    candidates: [],
    voters: [],
  });

  useEffect(() => {
    fetchCandidates();
  }, [formData.instituteName]);

  useEffect(() => {
    filterVoters();
  }, [filter, voters]);

  const fetchCandidates = async () => {
    if (!formData.instituteName) return;
    try {
      const response = await axios.get(
        `/api/candidates/institute?id=${formData.instituteName}`
      );
      const candidates = response.data.candidates;
      setCandidates(
        candidates.filter((candidate: any) => candidate.isApproved)
      );
    } catch (error) {
      toast.error("Failed to fetch candidates");
    }
  };

  const fetchInstitutes = async () => {
    try {
      const response = await axios.get(
        "/api/institutions/getAllInstitueByAdmin"
      );
      setInstitutes(response.data.institute);
    } catch (error) {
      toast.error("Failed to fetch institutions");
    }
  };

  const fetchVoters = async () => {
    try {
      const response = await axios.get(`/api/voter`);
      setVoters(response.data.voters);
    } catch (error) {
      toast.error("Failed to fetch voters");
    }
  };

  const filterVoters = () => {
    const filtered = voters.filter(
      (voter: any) =>
        voter.address.country === filter.country &&
        voter.address.state === filter.state &&
        (filter.district ? voter.address.district === filter.district : true) &&
        (filter.taluka ? voter.address.taluka === filter.taluka : true)
    );
    setFilteredVoters(filtered);
  };

  const handleCheckboxChange = (category: string, value: string) => {
    setFormData((prevData) => {
      const updatedList = prevData[category]?.includes(value)
        ? prevData[category].filter((item) => item !== value)
        : [...(prevData[category] || []), value];
      return { ...prevData, [category]: updatedList };
    });
  };

  const handleSelectAllVoters = () => {
    if (selectAll) {
      setFormData({ ...formData, voters: [] });
    } else {
      setFormData({
        ...formData,
        voters: filteredVoters.map((voter: any) => voter._id),
      });
    }
    setSelectAll(!selectAll);
  };

  const handleStartElection = async () => {
    if (
      !formData.title ||
      !formData.title.trim() ||
      formData.candidates.length === 0
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    if (!window.ethereum) {
      toast.error("MetaMask is not installed!");
      return;
    }
    try {
      const contract = await getContract();
      if (!contract) {
        toast.error("Failed to fetch contract");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];
      let transaction = null;
      const startTimestamp = Math.floor(
        new Date(formData.startDate).getTime() / 1000
      );
      const endTimestamp = Math.floor(
        new Date(formData.endDate).getTime() / 1000
      );
      transaction = contract.createElection(
        walletAddress,
        formData.title,
        formData.instituteName,
        startTimestamp,
        endTimestamp,
        formData.candidates,
        formData.voters
      );
      toast.promise(transaction, {
        loading: "Creating election...",
        success: async () => {
          const tx = await transaction;
          await tx.wait();
          console.log(tx);
          return "Election created successfully!";
        },
        error: (error: unknown) => {
          console.log(error);
          return "Failed to create election";
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to start election");
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Elections</h2>

      {/* New Election Form */}
      <div className="mb-8 p-6 bg-base-300 rounded-lg shadow">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Start New Election
        </h3>

        <div className="space-y-4 w-full">
          <label className="form-control w-full">
            <span className="label-text">Election Name</span>
            <input
              type="text"
              placeholder="Enter election name"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text">Institute Name</span>
            <select
              value={formData.instituteName}
              className="input input-bordered w-full"
              onChange={(e) =>
                setFormData({ ...formData, instituteName: e.target.value })
              }
            >
              <option value="">Select Institute</option>
              {institutes.map((institute: any) => (
                <option key={institute._id} value={institute._id}>
                  {institute.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control w-full">
            <span className="label-text">Choose Candidate</span>
            {formData.instituteName && (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {candidates.length !== 0 ? (
                  candidates.map((candidate: Candidate) => (
                    <label
                      key={candidate._id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={formData.candidates.includes(candidate._id)}
                        onChange={() =>
                          handleCheckboxChange("candidates", candidate._id)
                        }
                        className="checkbox checkbox-primary"
                      />
                      <span>{candidate.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-red-500">
                    No Approved Candidates available for this Institute
                  </p>
                )}
              </div>
            )}
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="form-control">
              <span className="label-text">Start Date</span>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="input input-bordered"
              />
            </label>

            <label className="form-control">
              <span className="label-text">End Date</span>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="input input-bordered"
              />
            </label>
          </div>

          {/* Voter Filters */}
          <div className="grid grid-cols-2 gap-2">
            <select
              className="select w-full"
              value={filter.district}
              onChange={(e) =>
                setFilter({ ...filter, district: e.target.value })
              }
            >
              <option value="">Select District</option>
              {MAHARASHTRA_DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <select
              className="select w-full"
              value={filter.taluka}
              onChange={(e) => setFilter({ ...filter, taluka: e.target.value })}
            >
              <option value="">Select Taluka</option>
              {filter.district &&
                MAHARASHTRA_TALUKAS[filter.district]?.map((taluka) => (
                  <option key={taluka} value={taluka}>
                    {taluka}
                  </option>
                ))}
            </select>
          </div>

          {/* Select All Button */}
          <button
            className="btn btn-outline btn-primary w-full my-2"
            onClick={handleSelectAllVoters}
          >
            {selectAll ? "Deselect All Voters" : "Select All Voters"}
          </button>

          {/* Display Voters */}
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {filteredVoters.map((voter: any) => (
              <label key={voter._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.voters.includes(voter._id)}
                  onChange={() => handleCheckboxChange("voters", voter._id)}
                  className="checkbox checkbox-primary"
                />
                <span>{voter.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary w-full mt-4"
          onClick={handleStartElection}
        >
          Start Election
        </button>
      </div>
    </>
  );
};

export default ManageElection;
