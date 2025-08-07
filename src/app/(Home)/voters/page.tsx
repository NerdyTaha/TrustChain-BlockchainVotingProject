"use client";
import { Voter } from "@/types/Voter";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Voters = () => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filteredVoters, setFilteredVoters] = useState<Voter[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const votersPerPage = 20;

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await axios.get("/api/voter");
        setVoters(response.data.voters);
        setFilteredVoters(response.data.voters);
      } catch (error) {
        toast.error("Failed to fetch voters");
      }
    };
    fetchVoters();
  }, []);

  // Handle Search Filtering
  useEffect(() => {
    const filtered = voters.filter((voter) =>
      voter.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredVoters(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [search, voters]);

  // Pagination Logic
  const indexOfLastVoter = currentPage * votersPerPage;
  const indexOfFirstVoter = indexOfLastVoter - votersPerPage;
  const currentVoters = filteredVoters.slice(
    indexOfFirstVoter,
    indexOfLastVoter
  );

  const totalPages = Math.ceil(filteredVoters.length / votersPerPage);

  return (
    <section className="bg-base-300 min-h-screen p-6 flex flex-col items-center">
      {/* Search Input */}
      <div className="w-full max-w-2xl mb-6">
        <input
          type="text"
          placeholder="Search by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      {/* Voter Cards Grid */}
      <div className="text-base-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentVoters.length > 0 ? (
          currentVoters.map((voter) => (
            <div
              key={voter._id}
              className="max-w-sm bg-base-100 border border-base-content rounded-lg shadow-md"
            >
              <img
                className="rounded-t-lg w-full h-48 object-cover"
                src={voter.profileImage}
                alt={voter.name}
              />
              <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold text-base-content">
                  {voter.name}
                </h5>
                <p className="text-sm text-base-content/70">
                  <strong>EPIC ID:</strong> {voter.epicId}
                  <br />
                  <strong>Email:</strong> {voter.email}
                  <br />
                  <strong>Phone:</strong> {voter.phone}
                  <br />
                  <strong>DOB:</strong>{" "}
                  {new Date(voter.dob).toLocaleDateString()}
                  <br />
                  <strong>Address:</strong> {voter.address.address},{" "}
                  {voter.address.district}, {voter.address.state},{" "}
                  {voter.address.country}
                  <br />
                  <strong>Pincode:</strong> {voter.address.pincode}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xl font-semibold text-center col-span-full">
            No voters found.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex text-base-content justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-outline"
          >
            Prev
          </button>
          <span className="text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="btn btn-outline"
          >
            Next
          </button>
        </div>
      )}

      {/* Not Found Message */}
      <div className="mt-8 text-center">
        <p className="text-lg text-base-content/80">
          Not your name?{" "}
          <a
            href="https://forms.gle/ZywwxXbPYjYB4Szq70"
            target="_blank"
            className="link link-primary"
          >
            Add yourself here!
          </a>
        </p>
      </div>
    </section>
  );
};

export default Voters;
