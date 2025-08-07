"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const Result = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get("/api/elections/get");
        console.log(response.data);
        setResults(response.data.elections);
      } catch (error) {
        console.error("Failed to fetch results", error);
      }
    };
    fetchElections();
  }, []);

  return (
    <section className="py-12 px-6 bg-base-100 min-h-[calc(100vh-64px)]">
      <h1 className="text-3xl text-base-content font-bold text-center mb-6 uppercase">
        Election Results
      </h1>

      {results.length === 0 ? (
        <p className="text-center text-xl text-base-content">
          No election results available.
        </p>
      ) : (
        results.map((election: any, index) => (
          <div
            key={index}
            className="bg-base-300 text-base-content shadow-xl border p-6 rounded-lg mb-6"
          >
            <h2 className="text-2xl font-semibold text-center uppercase">
              {election.title}
            </h2>
            <p className="text-center text-base-content/50 mt-1">
              Institution: {election.institution.name}
            </p>

            {election.result ? (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Winner:</h3>
                <div className="flex items-center gap-4 bg-success p-4 rounded-lg">
                  <img
                    src={election.result.profileImage || "/placeholder.png"}
                    alt={election.result.name}
                    className="w-16 h-16 rounded-full border"
                  />
                  <div>
                    <p className="text-xl font-semibold">
                      {election.result.name}
                    </p>
                    <span className="badge badge-success badge-lg mt-2">
                      Winner
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-red-500 mt-4">
                No results declared yet.
              </p>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">All Candidates:</h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Candidate</th>
                      <th>Votes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {election.candidates.map((candidate, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td className="flex items-center gap-3">
                          <img
                            src={
                              candidate.candidate?.profileImage ||
                              "/placeholder.png"
                            }
                            alt={candidate.candidate?.name}
                            className="w-10 h-10 rounded-full border"
                          />
                          {candidate.candidate?.name}
                        </td>
                        <td>{candidate.vote}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default Result;
