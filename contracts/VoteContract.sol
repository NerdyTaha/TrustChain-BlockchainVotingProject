// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract ElectionSystem {
    struct Candidate {
        string mongoId;
        uint256 voteCount;
    }

    struct Voter {
        string mongoId;
        bool hasVoted;
    }

    struct Election {
        address admin;
        string title;
        string instituteId;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
        Candidate[] candidates;
        Voter[] voters;
    }

    mapping(uint256 => Election) public elections;
    uint256 public electionCount;

    event ElectionCreated(uint256 indexed electionId, string title, address admin);
    event CandidateAdded(uint256 indexed electionId, string candidateId);
    event VoterAdded(uint256 indexed electionId, string voterId);
    event VoteCasted(uint256 indexed electionId, string voterId);
    event ElectionStatusChanged(uint256 indexed electionId, bool isActive);

    function createElection(
        address _admin,
        string memory _title,
        string memory _instituteId,
        uint256 _startDate,
        uint256 _endDate,
        string[] memory _candidateIds,
        string[] memory _voterIds
    ) external returns (uint256) {
        require(_candidateIds.length > 0, "At least one candidate is required");
        require(_voterIds.length > 0, "At least one voter is required");

        uint256 newElectionId = electionCount;
        Election storage newElection = elections[newElectionId];
        newElection.admin = _admin;
        newElection.title = _title;
        newElection.instituteId = _instituteId;
        newElection.startDate = _startDate;
        newElection.endDate = _endDate;
        newElection.isActive = true;

        for (uint256 i = 0; i < _candidateIds.length; i++) {
            newElection.candidates.push(Candidate(_candidateIds[i], 0));
            emit CandidateAdded(newElectionId, _candidateIds[i]);
        }

        for (uint256 i = 0; i < _voterIds.length; i++) {
            newElection.voters.push(Voter(_voterIds[i], false));
            emit VoterAdded(newElectionId, _voterIds[i]);
        }

        electionCount++;
        emit ElectionCreated(newElectionId, _title, _admin);
        return newElectionId;
    }

    function castVote(uint256 _electionId, string memory _candidateId, string memory _voterId) external {
        require(elections[_electionId].isActive, "Election is not active");

        Voter[] storage voters = elections[_electionId].voters;
        Candidate[] storage candidates = elections[_electionId].candidates;

        uint256 voterIndex = type(uint256).max;
        uint256 candidateIndex = type(uint256).max;

        // Find the voter
        for (uint256 i = 0; i < voters.length; i++) {
            if (keccak256(abi.encodePacked(voters[i].mongoId)) == keccak256(abi.encodePacked(_voterId))) {
                voterIndex = i;
                break;
            }
        }
        require(voterIndex != type(uint256).max, "Voter not registered");
        require(!voters[voterIndex].hasVoted, "Voter has already voted");

        // Find the candidate
        for (uint256 i = 0; i < candidates.length; i++) {
            if (keccak256(abi.encodePacked(candidates[i].mongoId)) == keccak256(abi.encodePacked(_candidateId))) {
                candidateIndex = i;
                break;
            }
        }
        require(candidateIndex != type(uint256).max, "Candidate not found");

        // Cast the vote
        voters[voterIndex].hasVoted = true;
        candidates[candidateIndex].voteCount++;

        emit VoteCasted(_electionId, _voterId);
    }
    
    function stopElection(uint256 _electionId) external {
        elections[_electionId].isActive = false;
        emit ElectionStatusChanged(_electionId, false);
    }

    function getElectionsByAdmin(address _admin) external view returns (Election[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < electionCount; i++) {
            if (elections[i].admin == _admin) {
                count++;
            }
        }

        Election[] memory result = new Election[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < electionCount; i++) {
            if (elections[i].admin == _admin) {
                result[index] = elections[i];
                index++;
            }
        }
        return result;
    }

    function getElectionsByVoter(string memory _voterId) external view returns (Election[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < electionCount; i++) {
            for (uint256 j = 0; j < elections[i].voters.length; j++) {
                if (keccak256(abi.encodePacked(elections[i].voters[j].mongoId)) == keccak256(abi.encodePacked(_voterId))) {
                    count++;
                    break;
                }
            }
        }

        Election[] memory result = new Election[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < electionCount; i++) {
            for (uint256 j = 0; j < elections[i].voters.length; j++) {
                if (keccak256(abi.encodePacked(elections[i].voters[j].mongoId)) == keccak256(abi.encodePacked(_voterId))) {
                    result[index] = elections[i];
                    index++;
                    break;
                }
            }
        }
        return result;
    }

    function getAllElections() external view returns (Election[] memory) {
        Election[] memory result = new Election[](electionCount);
        for (uint256 i = 0; i < electionCount; i++) {
            result[i] = elections[i];
        }
        return result;
    }
}
