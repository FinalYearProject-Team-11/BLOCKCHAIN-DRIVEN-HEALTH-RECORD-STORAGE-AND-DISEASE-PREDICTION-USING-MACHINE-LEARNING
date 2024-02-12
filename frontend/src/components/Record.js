import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { MyContractAddress } from '../MyContractABI';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import { addDocumentHashToPatientABI, getPatientABI } from '../MyContractABI';
import Modal from '@mui/joy/Modal';
import { Card, CardContent, Typography } from '@mui/material'
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { create } from "ipfs-http-client";
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import InputFileUpload from './InputFileUpload';
import { Input } from '@mui/joy';

const Record = ({ isDoctor }) => {
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState({
        name: [],
        hash: []
    })

    useEffect(() => {
        (async function() {
            if(record.hash.length === 0) {
                try {
                    if (window.ethereum) {
                        const web3 = new Web3(window.ethereum);
                        await window.ethereum.request({ method: 'eth_requestAccounts' });
                        const userAddress = web3.currentProvider.selectedAddress;
                        const contractAddress = MyContractAddress;
                    
                        const contractABI = getPatientABI;
                    
                        const contract = new web3.eth.Contract(contractABI, contractAddress);
                    
                        const encodedData = contract.methods.getPatient(localStorage.getItem("Patient_id") ?? localStorage.getItem("PatientD_id")).encodeABI();
                    
                        const result = await web3.eth.call({
                            to: contractAddress,
                            from: userAddress,
                            data: encodedData,
                        }, 'latest');
                    
                        const decodedResult = web3.eth.abi.decodeParameters(["address", "string", "int64", "string[]", "string[]"], result);

                        console.log(decodedResult)
    
                        if (decodedResult[3] !== null) {
                            setRecord({
                                name: decodedResult[3],
                                hash: decodedResult[4]
                            });
                            console.log(record);
                        }
                    } else {
                        console.error('MetaMask is not installed or not enabled');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        })();
    }, [record]); 


    async function getPatient() {
            try {
                if (window.ethereum) {
                    const web3 = new Web3(window.ethereum);
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const userAddress = web3.currentProvider.selectedAddress;
                    const contractAddress = MyContractAddress;
                
                    const contractABI = getPatientABI;
                
                    const contract = new web3.eth.Contract(contractABI, contractAddress);
                
                    const encodedData = contract.methods.getPatient(localStorage.getItem("Patient_id") ?? localStorage.getItem("PatientD_id")).encodeABI();
                
                    const result = await web3.eth.call({
                        to: contractAddress,
                        from: userAddress,
                        data: encodedData,
                    }, 'latest');
                
                    const decodedResult = web3.eth.abi.decodeParameters(["address", "string", "int64", "string[]", "string[]"], result);

                    console.log(decodedResult)

                    if (decodedResult[3] !== null) {
                        setRecord({
                            name: decodedResult[3],
                            hash: decodedResult[4]
                        });
                        console.log(record);
                    }
                } else {
                    console.error('MetaMask is not installed or not enabled');
                }
            } catch (error) {
                console.error('Error:', error);
            }
    }

    const ipfsClient = create({
        host: 'localhost',
        port: 5001,  
        protocol: 'http',
    });

    async function uploadFile(e) {
        e.preventDefault();
        setOpen(false);
        console.log('hello')
        let fileName = document.getElementById('recName').value
        const file = document.getElementById('file').files[0]
        const reader = new FileReader(file);
        let ipfsHash;
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
            const blob = new Blob([reader.result], { type: file.type });
            const result = await ipfsClient.add(blob);
            ipfsHash = result.path;
            console.log(result)
            console.log('File added to IPFS with hash:', ipfsHash);
        };
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = web3.currentProvider.selectedAddress
            const contractAddress = MyContractAddress;                    
            const contractABI = addDocumentHashToPatientABI;
            const contract = new web3.eth.Contract(contractABI, contractAddress);       
            setTimeout(async () => {
                const encodedData = contract.methods.addDocumentHashToPatient(localStorage.getItem("Patient_id") ?? localStorage.getItem("PatientD_id"), ipfsHash, fileName).encodeABI();        
                const tx = {
                    to: contractAddress,
                    from: userAddress,
                    data: encodedData,
                };
                const receipt = await web3.eth.sendTransaction(tx);
                console.log(receipt)
                setRecord({
                    name: [...record.name, fileName],
                    hash: [...record.hash, ipfsHash]
                });
            }
            , 1000)
        } else {
            console.error('MetaMask is not installed or not enabled');
        }
    }

    return (
        <div>
            <div style={{ backgroundColor: "white", borderRadius: '6px', padding: '8px', boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.2)'  }} className="d-flex justify-content-between">
                <h3 style={{ marginBottom: '0px' }}>Records</h3>
                {isDoctor &&
                    <Button
                        variant="outlined"
                        color="neutral"
                        startDecorator={<Add />}
                        onClick={() => setOpen(true)}
                    >
                        New Record
                    </Button>
                }
            </div>
            <div>
                {record.hash.map((item, index) => (
                    <Card key={index} style={{ margin: "8px", minWidth: "200px" }}>
                        <CardContent>
                            <Typography variant="body1" color="textSecondary">
                                {record.name[index]}
                            </Typography>
                            <a
                              href={`http://localhost:8080/ipfs/${item}`}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              >
                                <Typography variant="body1" color="textSecondary">
                                    <Button variant='success'>
                                        <span class="material-icons-outlined"></span>
                                        View
                                    </Button>
                                </Typography>
                            </a>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Upload a new Record</DialogTitle>
                    <DialogContent>lorem</DialogContent>
                    <form
                      onSubmit={(event) => {
                        return uploadFile(event);
                      }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <InputFileUpload />
                            </FormControl>
                          <Button type="submit">Submit</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </div>
    );
};

export default Record;
