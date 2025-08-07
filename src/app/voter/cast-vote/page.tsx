"use client";

import { useUser } from "@/context/UserContext";
import { getContract } from "@/middlewares/blockchain.config";
import { Candidate } from "@/types/Candidate";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CastVote = () => {
  const [elections, setElections] = useState([]);
  const { user } = useUser();

  if (!user) return null;

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const contract = await getContract();
        if (!contract) {
          toast.error("Failed to fetch contract");
          return;
        }

        const transaction = await contract.getElectionsByVoter(user.id);
        toast.loading("Fetching elections...");

        const electionsData = await Promise.all(
          transaction.map(async (election: any, index: number) => {
            const candidates = await Promise.all(
              election.candidates.map(async (candidateId: string) => {
                return await fetchCandidate(candidateId);
              })
            );

            const hasVoted = election.voters.some(
              (voter: [string, boolean]) => voter[0] === user.id && voter[1]
            );

            return {
              electionId: index,
              title: election.title,
              isActive: election.isActive,
              candidates,
              hasVoted,
            };
          })
        );

        setElections(electionsData);
        toast.dismiss();
        toast.success("Elections fetched successfully!");
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch elections");
      }
    };

    fetchElections();
  }, []);

  const fetchCandidate = async (id: string) => {
    try {
      const response = await axios.get(`/api/candidates/get?id=${id[0]}`);
      return response.data.candidate;
    } catch (error) {
      console.error("Failed to fetch candidate details", error);
      return { name: "Unknown", profileImage: "/placeholder.png" };
    }
  };

  const castVote = async (electionId: number, candidateIndex: number) => {
    try {
      const contract = await getContract();
      if (!contract) {
        toast.error("Failed to fetch contract");
        return;
      }

      const transaction = contract.castVote(
        electionId,
        candidateIndex,
        user.id
      );

      toast.promise(transaction, {
        loading: "Casting vote...",
        success: async () => {
          const tx = await transaction;
          await tx.wait();
          return "Vote cast successfully!";
        },
        error: (err: any) => {
          console.log(err);
          return "Failed to cast vote";
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to cast vote");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 uppercase text-center">
        Cast Your Vote
      </h1>
      {elections.length === 0 ? (
        <p className="mt-5 text-center text-3xl uppercase">
          No elections available.
        </p>
      ) : (
        elections.map((election: any, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold uppercase">
                {election.title}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-white text-sm ${
                  election.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {election.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-5">
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead className="bg-base-100/50">
                    <tr>
                      <td>#</td>
                      <td>Name</td>
                      <td>Email</td>
                      <td>Phone</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {election.candidates.map(
                      (candidate: Candidate, idx: number) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="mask mask-squircle h-12 w-12">
                                  <img
                                    src={candidate?.profileImage}
                                    alt={candidate?.name}
                                  />
                                </div>
                              </div>
                              <div className="font-bold">{candidate?.name}</div>
                            </div>
                          </td>
                          <td>{candidate?.email}</td>
                          <td>{candidate?.phone}</td>
                          <td>
                            {election.isActive && !election.hasVoted ? (
                              <button
                                onClick={() =>
                                  castVote(election.electionId, candidate._id)
                                }
                                className="btn btn-primary"
                              >
                                Cast Vote
                              </button>
                            ) : election.hasVoted ? (
                              <span className="text-green-600 font-semibold">
                                Voted
                              </span>
                            ) : (
                              <span className="text-gray-500">
                                Election Closed
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default CastVote;
