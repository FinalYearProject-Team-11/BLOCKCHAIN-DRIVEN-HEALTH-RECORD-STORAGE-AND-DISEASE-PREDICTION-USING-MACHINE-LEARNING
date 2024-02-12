// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {

    struct Doctor {
        address docAddress;
        string username;
        string password;
        string _documentHash;
        bool isAuthenticated;
    }

    struct Patient {
        address patAddress;
        string name;
        int64 age;
        string[] recName;
        string[] documentHashes;
    }

    struct Parameters {
        int64 age;
        int64 GENDER;
        int64 SMOKING;
        int64 YELLOW_FINGERS;
        int64 ANXIETY;
        int64 PEER_PRESSURE;
        int64 CHRONIC_DISEASE;
        int64 FATIGUE;
        int64 ALLERGY;
        int64 WHEEZING;
        int64 ALCOHOL_CONSUMING;
        int64 COUGHING;
        int64 SHORTNESS_OF_BREATH;
        int64 SWALLOWING_DIFFICULTY;
        int64 CHEST_PAIN;
        int64 height;
        int64 weight;
        int64 Diastolic_BP;
        int64 Systolic_BP;
        int64 cholesterol;
        int64 gluc;
        int64 active;
    }

    struct Disease {
        bool lung_cancer;
        bool cardiovascular_disease;
    }

    mapping(string => Patient) private patientData;
    mapping(string => Doctor) private doctorData;
    mapping(string => Parameters) private predictionData;
    mapping(string => Disease) private diseaseData;

    string[] public doctorIds;
    string[] patientIds;

    event IPFSHashAdded(uint256 indexed id, string ipfsHash);
    event DoctorEnrollReq(string indexed docId, string username, string _documentHash, string password);
    event DoctorAuthenticated(string indexed docId);
    event PatientEnrolled(string indexed patientId, string name);

    function EnrollPatient(string memory patientID, string memory name) public {
        require(bytes(name).length > 0, "IPFS hash cannot be empty");
        Patient memory temp;
        Parameters memory temp1 = initializeDefaultParameters();
        Disease memory temp2 = Disease({lung_cancer: false, cardiovascular_disease: false});
        temp.patAddress = msg.sender;
        temp.name = name;
        temp.age = 0;
        patientData[patientID] = temp;
        patientIds.push(patientID);
        predictionData[patientID] = temp1;
        diseaseData[patientID] = temp2;
        emit PatientEnrolled(patientID, name);
    }

    function initializeDefaultParameters() internal pure returns (Parameters memory) {
    return Parameters({ 
            age: -10,
            GENDER: -10,
            ALCOHOL_CONSUMING: -10,
            ALLERGY: -10,
            ANXIETY: -10,
            CHEST_PAIN: -10,
            cholesterol: -10,
            CHRONIC_DISEASE: -10,
            COUGHING: -10,
            Diastolic_BP: -10,
            FATIGUE: -10,
            gluc: -10,
            height: -10,
            PEER_PRESSURE: -10,
            SHORTNESS_OF_BREATH: -10,
            SMOKING: -10,
            SWALLOWING_DIFFICULTY: -10,
            Systolic_BP: -10,
            weight: -10,
            WHEEZING: -10,
            YELLOW_FINGERS: -10,
            active: -10
        });
    }

    function addDocumentHashToPatient(string memory patientID, string memory documentHash, string memory name) public {
        require(bytes(documentHash).length > 0, "Document hash cannot be empty");
        Patient storage patient = patientData[patientID];
        patient.documentHashes.push(documentHash);
        patient.recName.push(name);
    }

    function patientLogin(string memory patientID) public view returns (bool) {
        Patient memory temp;
        for(uint i = 0;i < patientIds.length; i++){
            if(keccak256(abi.encodePacked(patientIds[i])) == keccak256(abi.encodePacked(patientID))){
                temp = patientData[patientID];
                break;
            }
        }

        if(msg.sender != temp.patAddress){
            return false;
        }

        return true;
    }

    function EnrollDoctor(string memory docId, string memory username, string memory _documenthash, string memory password) public  {
        require(bytes(_documenthash).length > 0, "Cannot be empty");
        require(bytes(password).length > 0, "Cannot be empty");
        require(bytes(username).length > 0, "Cannot be empty");
        Doctor memory temp;
        temp.docAddress = msg.sender;
        temp.username = username;
        temp.password = password;
        temp._documentHash = _documenthash;
        temp.isAuthenticated = false;
        doctorData[docId] = temp;
        doctorIds.push(docId);
        emit DoctorEnrollReq(docId, username, _documenthash, password);
    }

    function authorizeDoctor(string memory docId) public {
        Doctor memory temp = doctorData[docId];
        temp.isAuthenticated = true;
        doctorData[docId] = temp;
        emit DoctorAuthenticated(docId);
    }

    function setParameter(
        string memory patientID,
        Parameters memory params
    ) public {
        predictionData[patientID] = params;
    }

    function setDisease(string memory patientID, Disease memory params) public {
        diseaseData[patientID] = params;
    }


    function DoctorLogin(string memory username, string memory password) public view returns(bool) {
        Doctor memory temp;
        for(uint i = 0; i<doctorIds.length;i++){
            string memory name = doctorData[doctorIds[i]].username;
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(username))){
                temp = doctorData[doctorIds[i]];
                break;
            }
        }

        if(msg.sender != temp.docAddress){
            return false;
        }

        if(temp.isAuthenticated){
            if(keccak256(abi.encodePacked(password)) != keccak256(abi.encodePacked(temp.password))){
                return false;
            }
        }
        else{
            return false;
        }
        return true;
    }

    function getPatient(string memory patientID) public view returns (address patAddress, string memory name, int64 age, string[] memory recName, string[] memory documentHash) {
        require(bytes(patientID).length > 0, "Doctor id is required");
        return (patientData[patientID].patAddress, patientData[patientID].name, patientData[patientID].age, patientData[patientID].recName, patientData[patientID].documentHashes);
    }

    function getUnauthenticatedDoctorsIds() public view returns (string[] memory) {
        return doctorIds;
    }

    function getUnauthenticatedDoctor(string calldata docId) public view returns (address docAddress, string memory username, string memory password, string memory _documentHash, bool isAuthenticated) {
        require(bytes(docId).length > 0,"Doctor id is requied");
        return (doctorData[docId].docAddress, doctorData[docId].username, doctorData[docId].password, doctorData[docId]._documentHash, doctorData[docId].isAuthenticated);
    }

    function getParameters(string memory patientID) public view returns (Parameters memory) {
        return predictionData[patientID];
    }

    function getDisease(string memory patientID) public view returns (bool LC, bool CVD) {
        return (diseaseData[patientID].lung_cancer, diseaseData[patientID].cardiovascular_disease);
    }

}