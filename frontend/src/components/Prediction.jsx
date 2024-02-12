import { useState, useEffect } from "react"
import Web3 from "web3"
import { Card, CardContent, Typography } from '@mui/material'
import Button from "@mui/joy/Button";
import { MyContractAddress, getParameterABI, getDiseaseABI, setDiseaseABI } from "../MyContractABI"
import axios from "axios";

const Prediction = ({ isDoctor }) => {
    const [data, setData] = useState(null)
    const [prediction, setPrediction] = useState([])
    const [canPredictLung, setCanPredictLung] = useState(true)
    const [canPredictCardio, setCanPredictCardio] = useState(true)
    const [lungParameters, setLungParameters] = useState(null)
    const [cardioParameters, setCardioParameters] = useState(null)
    const lung_parameters = {
        "age": 0,
        "SMOKING": 0,
        "YELLOW_FINGERS": 0,
        "ANXIETY": 0,
        "PEER_PRESSURE": 0,
        "CHRONIC_DISEASE": 0,
        "FATIGUE": 0,
        "ALLERGY": 0,
        "WHEEZING": 0,
        "ALCOHOL_CONSUMING": 0,
        "COUGHING": 0,
        "SHORTNESS_OF_BREATH": 0,
        "SWALLOWING_DIFFICULTY": 0,
        "CHEST_PAIN": 0
    }

    const cardio_parameters = {
        "age": 0,
        "GENDER": 0,
        "height": 0,
        "weight": 0,
        "Diastolic_BP": 0,
        "Systolic_BP": 0,
        "cholesterol": 0,
        "gluc": 0,
        "SMOKING": 0,
        "ALCOHOL_CONSUMING": 0,
        "active": 0
    }

    const disease = ["LUNG_CANCER", "CARDIOVASCULAR_DISEASE"]

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

                          const lung = Object.keys(lung_parameters)
                          const cardio = Object.keys(cardio_parameters)


                        lung.forEach(key => {
                            if(Number(decodedResult[key]) === -10) setCanPredictLung(false)
                            lung_parameters[key] = Number(decodedResult[key])
                        })
                        setLungParameters(lung_parameters)
                        cardio.forEach(key => {
                            if(Number(decodedResult[key]) === -10) {
                                setCanPredictCardio(false)
                            }
                            cardio_parameters[key] = Number(decodedResult[key])
                        })
                        setCardioParameters(cardio_parameters)
                        // setDataKeys(Object.keys(decodedResult).slice(23, 48));
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
            })();

            (async function() {
                try {
                    if (window.ethereum) {
                        const web3 = new Web3(window.ethereum);
                        await window.ethereum.request({ method: 'eth_requestAccounts' });
                        const userAddress = web3.currentProvider.selectedAddress
                        const contractAddress = MyContractAddress;
                    
                        const contractABI = getDiseaseABI;
                    
                        const contract = new web3.eth.Contract(contractABI, contractAddress);
                    
                        const encodedData = contract.methods.getDisease(localStorage.getItem("Patient_id") ?? localStorage.getItem("PatientD_id")).encodeABI();
                    
                        const result = await web3.eth.call({
                            to: contractAddress,
                            from: userAddress,
                            data: encodedData,
                        }, 'latest');
                    
                        const decodedResult = web3.eth.abi.decodeParameters(['bool','bool'], result);

                        console.log(decodedResult)
                        let values = Object.values(decodedResult).slice(0, 2)
                        setPrediction(values)
                        // console.log(values)



                    } else {
                    console.error('MetaMask is not installed or not enabled');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            })();
        }
    },[prediction])

    async function predict() {
        try {
            let memo = [...prediction]
            let temp = [...prediction]
            if(canPredictLung) {
                let res = await axios.post('http://localhost:5000/lung_cancer', lungParameters, {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                  }
                )
                temp[0] = Boolean(res.data.predictions[0])
            }
            if(canPredictCardio) {
                let res1 = await axios.get('http://localhost:5000/cardio_disease', cardioParameters, {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                  }
                )
                temp[1] = Boolean(res1.data.predictions[0])
            }
            console.log(temp, "hello")
            setPrediction(temp)
            if(memo[0] !== temp[0] || memo[1] !== temp[1]) setParameters(temp)
        } 
        catch (error) {
            console.error('Error:', error);
        }
    }

    async function setParameters(prediction) {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = web3.currentProvider.selectedAddress
            const contractAddress = MyContractAddress;                    
            const contractABI = setDiseaseABI;
            const contract = new web3.eth.Contract(contractABI, contractAddress);        
            const encodedData = contract.methods.setDisease(localStorage.getItem("Patient_id") ?? localStorage.getItem("PatientD_id"), prediction).encodeABI();        
            const tx = {
                to: contractAddress,
                from: userAddress,
                data: encodedData,
            };       
            const receipt = await web3.eth.sendTransaction(tx);
            console.log(receipt)
        } else {
            console.error('MetaMask is not installed or not enabled');
        }
    }

    return (
        <>
            <div style={{ backgroundColor: "white", borderRadius: '6px', padding: '8px', boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.2)'  }} className="d-flex justify-content-between">
                <h3 style={{ marginBottom: '0px' }}>Predictions</h3>
                {
                isDoctor && 
                    <Button onClick={() => predict()}>Get Predictions</Button>
                }
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                {prediction.map((item, index) => (
                  <Card key={index} style={{ margin: "8px", minWidth: "200px", backgroundColor: item ? "#f62020c7" : "#b0ffa0" }}>
                    <CardContent>
                      <Typography variant="h5" color="textSecondary">
                        {disease[index]}
                      </Typography>
                      <Typography variant="h6" color="">
                        {item ? "YES" : "NO" }
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
            </div>
        </>
    )
}

export default Prediction