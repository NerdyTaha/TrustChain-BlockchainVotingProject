"use client";

import { getContract } from "@/middlewares/blockchain.config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Candidate {
  mongoId: string;
  name: string;
  institute: string;
  voteCount: number;
}

interface Election {
  electionId: number;
  title: string;
  candidates: Candidate[];
}

const ManageElection = () => {
  const [elections, setElections] = useState<Election[]>([]);

  useEffect(() => {
    const fetchElections = async () => {
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
        const transaction = await contract.getElectionsByAdmin(walletAddress);
        toast.loading("Fetching elections...");
        const electionsData = await Promise.all(
          transaction.map(async (election: any, index: number) => {
            const candidates = await Promise.all(
              election.candidates.map(async (candidateId: string) => {
                return await fetchCandidate(candidateId);
              })
            );
            return {
              electionId: index,
              title: election.title,
              candidates: candidates.map((candidate: any) => {
                return {
                  mongoId: candidate.candidates?._id,
                  name: candidate.candidates?.name,
                  institute: candidate.candidates?.institute,
                  voteCount: parseInt(candidate.candidates?.voteCount),
                };
              }),
              status: election.isActive,
            };
          })
        );
        setElections(electionsData);
        toast.dismiss();
        toast.success("Elections fetched successfully!");
      } catch (error) {
        toast.error("Failed to fetch elections");
      }
    };
    fetchElections();
  }, []);

  const fetchCandidate = async (id: string) => {
    try {
      const response = await axios.get(`/api/candidates/get?id=${id[0]}`);
      return { candidates: { ...response.data.candidate, voteCount: id[1] } };
    } catch (error) {
      console.error("Failed to fetch candidate details", error);
      return { name: "Unknown", profileImage: "/placeholder.png" };
    }
  };

  const stopElection = async (electionId: number) => {
    try {
      const contract = await getContract();
      if (!contract) {
        toast.error("Failed to fetch contract");
        return;
      }

      const transaction = contract.stopElection(electionId);

      toast.promise(transaction, {
        loading: "Stopping election...",
        success: async () => {
          const tx = await transaction;
          const candidates = elections[electionId].candidates.map(
            (candidate) => {
              return {
                candidate: { _id: candidate.mongoId },
                vote: candidate.voteCount,
              };
            }
          );
          const formData = {
            title: elections[electionId].title,
            candidates: candidates,
            instituteName: elections[electionId].candidates[0]?.institute._id,
          };
          await axios.post("/api/elections/add", { formData });
          tx.wait();
          return "Election stopped successfully!";
        },
        error: (err: any) => {
          console.log(err);
          return "Error stopping election";
        },
      });
    } catch (error) {
      console.error("Failed to stop election", error);
      toast.error("Error stopping election");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-center uppercase mb-4">
        Manage Elections
      </h1>
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse border border-base-content">
          <thead>
            <tr className="bg-base-200">
              <th className="border p-2">Election Name</th>
              <th className="border p-2">Institute Name</th>
              <th className="border p-2">Candidate Name</th>
              <th className="border p-2">Votes</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {elections.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No elections available.
                </td>
              </tr>
            ) : (
              elections.map((election) =>
                election.candidates.map((candidate: any, idx) => {
                  return (
                    <tr key={idx} className="border">
                      <td className="border p-2 capitalize">
                        {election.title}
                      </td>
                      <td className="border p-2">
                        {candidate?.institute?.name}
                      </td>
                      <td className="border p-2">{candidate?.name}</td>
                      <td className="border p-2">{candidate?.voteCount}</td>
                      {idx === 0 && (
                        <td
                          className="border p-2"
                          rowSpan={election.candidates.length}
                        >
                          {election.status ? (
                            <button
                              className="btn btn-error"
                              onClick={() => stopElection(election.electionId)}
                            >
                              Stop Election
                            </button>
                          ) : (
                            <button className="btn btn-primary">
                              Election Stopped
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageElection;
