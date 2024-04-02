import Web3 from "web3";
import { MyContractAddress, getParameterABI, setParameterABI } from "../MyContractABI";
import { useEffect, useState } from "react";
import { Card, CardContent, Typography } from '@mui/material'
import Button from "@mui/joy/Button";

const Data = ({ isDoctor }) => {

    const [dataKeys, setDataKeys] = useState([])
    const [data, setData] = useState(null)

    const orderedData = {
        "age": 1,
        "GENDER": 2,
        "SMOKING": 3,
        "YELLOW_FINGERS": 4,
        "ANXIETY": 5,
        "PEER_PRESSURE": 6,
        "CHRONIC_DISEASE": 7,
        "FATIGUE": 8,
        "ALLERGY": 9,
        "WHEEZING": 10,
        "ALCOHOL_CONSUMING": 11,
        "COUGHING": 12,
        "SHORTNESS_OF_BREATH": 13,
        "SWALLOWING_DIFFICULTY": 14,
        "CHEST_PAIN": 15,
        "height": 16,
        "weight": 17,
        "Diastolic_BP": 18,
        "Systolic_BP": 19,
        "cholesterol": 20,
        "gluc": 21,
        "active": 22
    }

    useEffect(() => {
        if(!data) {
            (async function() {
                try {
                    if (window.ethereum) {
                        const web3 = new Web3(window.ethereum);
                        await window.ethereum.request({ method: 'eth_requestAccounts' });
                        const userAddress = web3.currentProvider.selectedAddress
                        const contractAddress = MyContractAddress;
                    
                        const contractABI = getParameterABI;
                    
                        const contract = new web3.eth.Contract(contractABI, contractAddress);
                    
                        const encodedData = contract.methods.getParameters(localStorage.getItem("Patient_id") ?? localStorage.getItem("PatientD_id")).encodeABI();
                    
                        const result = await web3.eth.call({
                            to: contractAddress,
                            from: userAddress,
                            data: encodedData,
                        }, 'latest');
                    
                        const decodedResult = web3.eth.abi.decodeParameters([
                            {
                                type: "int64",
                                name: "age"
                            },
                            {
                                type: "int64",
                                name: "GENDER"
                            },
                            {
                                type: "int64",
                                name: "SMOKING"
                            },
                            {
                              type: "int64",
                              name: "YELLOW_FINGERS"
                            },
                            {
                                type: "int64",
                                name: "ANXIETY"
                            },
                            {
                                type: "int64",
                                name: "PEER_PRESSURE"
                            },
                            {
                                type: "int64",
                                name: "CHRONIC_DISEASE"
                            },
                            {
                                type: "int64",
                                name:  "FATIGUE"
                            },
                            {
                                type: "int64",
                                name:  "ALLERGY"
                            },
                            {
                                type: "int64",
                                name:  "WHEEZING"
                            },
                            {
                                type: "int64",
                                name:  "ALCOHOL_CONSUMING"
                            },
                            {
                                type: "int64",
                                name:  "COUGHING"
                            },
                            {
                                type: "int64",
                                name:  "SHORTNESS_OF_BREATH"
                            },
                            {
                                type: "int64",
                                name:  "SWALLOWING_DIFFICULTY"
                            },
                            {
                                type: "int64",
                                name:  "CHEST_PAIN"
                            },
                            {
                                type: "int64",
                                name:  "height"
                            },
                            {
                                type: "int64",
                                name:  "weight"
                            },
                            {
                                type: "int64",
                                name:  "Diastolic_BP"
                            },
                            {
                                type: "int64",
                                name: "Systolic_BP"
                            },
                            {
                                type: "int64",
                                name: "cholesterol"
                            },
                            {
                                type: "int64",
                                name:  "gluc"
                            },
                            {
                                type: "int64",
                                name:  "active"
                            }
                          ], result);

                          const temp = Object.keys(decodedResult)

                          setDataKeys(temp.slice(23, 48));
                          let FResult = Object.keys(decodedResult).slice(23, 48).reduce((result, key) => {
                            result[key] = Number(decodedResult[key]);
                        
                            return result;
                        }, {});
                          setData(FResult);
                    } else {
                    console.error('MetaMask is not installed or not enabled');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            })()
        }
    
    })

    const handleSave = (item) => {
        if(isNaN(document.getElementById(item).value)) return
        data[item] = Number(document.getElementById(item).value)
        orderedData[item] = Number(document.getElementById(item).value)
        console.log(Object.values(data))
        console.log(Object.values(orderedData))
    }

    async function setParameter() {
        try {
      
            if (window.ethereum) {
              const web3 = new Web3(window.ethereum);
        
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              
              const userAddress = web3.currentProvider.selectedAddress;
        
              const contractAddress = MyContractAddress;
        
              const contractABI = setParameterABI;
        
              const contract = new web3.eth.Contract(contractABI, contractAddress);
        
              const encodedData = contract.methods.setParameter(localStorage.getItem("Patient_id") ?? localStorage.getItem("PatientD_id"), Object.values(data)).encodeABI();
      
            const tx = {
                to: contractAddress,
                from: userAddress,
                data: encodedData,
            };
        
            const receipt = await web3.eth.sendTransaction(tx);
        
            console.log('Transaction receipt:', receipt);
        
            } else {
              console.error('MetaMask is not installed or not enabled');
            }
          } catch (error) {
            console.error('Error:', error);
          }
    }

    return (
        <div>
            <div style={{ backgroundColor: "white", borderRadius: '6px', padding: '8px', boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.2)' }} className="d-flex justify-content-between">
                <h3 style={{ marginBottom: '0px' }}>Data</h3>
                {isDoctor &&
                    <Button onClick={() => setParameter()}>Apply</Button>
                }
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                {dataKeys.map((item, index) => (
                  <Card key={index} style={{ margin: "8px", minWidth: "200px" }}>
                    <CardContent>
                      <Typography variant="body1" color="textSecondary">
                        {item}
                      </Typography>
                      <input type="text" defaultValue={data[item] === -10 ? '' : data[item]} id={item}/>
                      {isDoctor && <Button onClick={() => handleSave(item)} variant="solid" color="success" size="sm" sx={{
                        marginLeft: '10px',
                        marginTop: '2px',
                      }} >Save</Button>}
                    </CardContent>
                  </Card>
                ))}
            </div>
        </div>
    )
}

export default Data