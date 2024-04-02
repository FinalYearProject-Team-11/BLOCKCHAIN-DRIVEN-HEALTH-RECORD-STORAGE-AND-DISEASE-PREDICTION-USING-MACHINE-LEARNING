
const AdminContractAddress = '0xdE0519F00a4977b7726A71c480C77B9F410De795'

const MyContractAddress = '0x100f985E16Ad678bbBdd48F1b9ED737d42d796Ac'

const isAdminFunctionABI = [{
  "inputs": [],
  "name": "isAdminFunction",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}];

const getUnauthenticatedDoctorsIdsABI = [{
  "inputs": [],
  "name": "getUnauthenticatedDoctorsIds",
  "outputs": [
    {
      "internalType": "string[]",
      "name": "",
      "type": "string[]"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}];

const getUnauthenticatedDoctorABI = [{
  "inputs": [
    {
      "internalType": "string",
      "name": "docId",
      "type": "string"
    }
  ],
  "name": "getUnauthenticatedDoctor",
  "outputs": [
    {
      "internalType": "address",
      "name": "docAddress",
      "type": "address"
    },
    {
      "internalType": "string",
      "name": "username",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "password",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_documentHash",
      "type": "string"
    },
    {
      "internalType": "bool",
      "name": "isAuthenticated",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}];

const setParameterABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "patientID",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "int64",
            "name": "age",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "GENDER",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "SMOKING",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "YELLOW_FINGERS",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "ANXIETY",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "PEER_PRESSURE",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "CHRONIC_DISEASE",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "FATIGUE",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "ALLERGY",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "WHEEZING",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "ALCOHOL_CONSUMING",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "COUGHING",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "SHORTNESS_OF_BREATH",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "SWALLOWING_DIFFICULTY",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "CHEST_PAIN",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "height",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "weight",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "Diastolic_BP",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "Systolic_BP",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "cholesterol",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "gluc",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "active",
            "type": "int64"
          }
        ],
        "internalType": "struct MyContract.Parameters",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "setParameter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const getParameterABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "patientID",
        "type": "string"
      }
    ],
    "name": "getParameters",
    "outputs": [
      {
        "components": [
          {
            "internalType": "int64",
            "name": "age",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "GENDER",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "SMOKING",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "YELLOW_FINGERS",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "ANXIETY",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "PEER_PRESSURE",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "CHRONIC_DISEASE",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "FATIGUE",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "ALLERGY",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "WHEEZING",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "ALCOHOL_CONSUMING",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "COUGHING",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "SHORTNESS_OF_BREATH",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "SWALLOWING_DIFFICULTY",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "CHEST_PAIN",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "height",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "weight",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "Diastolic_BP",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "Systolic_BP",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "cholesterol",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "gluc",
            "type": "int64"
          },
          {
            "internalType": "int64",
            "name": "active",
            "type": "int64"
          }
        ],
        "internalType": "struct MyContract.Parameters",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]

const getDiseaseABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "patientID",
        "type": "string"
      }
    ],
    "name": "getDisease",
    "outputs": [
      {
        "internalType": "bool",
        "name": "LC",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "CVD",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]

const setDiseaseABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "patientID",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "bool",
            "name": "lung_cancer",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "cardiovascular_disease",
            "type": "bool"
          }
        ],
        "internalType": "struct MyContract.Disease",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "setDisease",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const addDocumentHashToPatientABI = [ 
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "patientID",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "documentHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "addDocumentHashToPatient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const getPatientABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "patientID",
        "type": "string"
      }
    ],
    "name": "getPatient",
    "outputs": [
      {
        "internalType": "address",
        "name": "patAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "int64",
        "name": "age",
        "type": "int64"
      },
      {
        "internalType": "string[]",
        "name": "recName",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "documentHash",
        "type": "string[]"
      },
      {
        "internalType": "string",
        "name": "summary",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const addSummaryToPatientABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "patientID",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "summary",
        "type": "string"
      }
    ],
    "name": "addSummaryToPatient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export {
  AdminContractAddress,
  MyContractAddress,
  isAdminFunctionABI,
  getUnauthenticatedDoctorsIdsABI,
  getUnauthenticatedDoctorABI,
  setParameterABI,
  getParameterABI,
  getDiseaseABI,
  setDiseaseABI,
  addDocumentHashToPatientABI,
  getPatientABI,
  addSummaryToPatientABI
}
  

  
