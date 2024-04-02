import { useEffect, useState, useRef } from 'react'
import '../styles.sass'
import { Modal } from 'bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Grid, Paper } from '@mui/material'
import LandingImg from '../assets/images/Landing_Background.jpg'
import { Button, Box, TextField, Divider, Collapse } from '@mui/material'
import Typography from '@mui/material/Typography';
import Web3 from "web3";
import { MyContractAddress } from '../MyContractABI'
import { faceio } from '../FaceAuth'
import * as faceapi from 'face-api.js'
import axios from 'axios'

const Landing = () => {

  const [dShow, setDShow] = useState(true);
  const [pShow, setPShow] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [video, setVideo] = useState(null);
  const [snapshot, setSnapshot] = useState(null);


  const intervalRef = useRef(null);

  let v = document.getElementById("myVideo");

  const navigate = useNavigate()
  useEffect(() => {
    (async function(){
      if(localStorage.getItem("Patient_id")){
        navigate("/Patient")
      }
      try{
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        ]);
      }
      catch(err){
        console.log(err)
      }
    })()
    
    function alert(){
      const status = localStorage.getItem("Admin");
      if(status === "false"){
        const MyModal = new Modal(document.getElementById("alertModal"))
        MyModal.show()
        localStorage.clear()
      }
    }
    alert()

    setChecked(true)
  }, [setChecked, navigate])

  const handleDocClick = () => {
      if(!dShow){
        setPShow(false);
        setDShow(true);
      }
  }

  const handlePatClick = () => {
    if(!pShow){
      setDShow(false);
      setPShow(true);
    }
  }

  const takeSnapshot = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');

    console.log(dataUrl)

    return dataUrl;
  };

  // const startFaceDetection = async () => {
  //   try {
  //     const signUpModalElement = document.getElementById("signUpModal");
  //     const signUpModal = new Modal(signUpModalElement);
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 250, height: 250 }, audio: false });
  //     setVideo(stream);

  //     signUpModalElement.addEventListener('shown.bs.modal', async () => {
  //       try {
  //         v.srcObject = stream;
  //         intervalRef.current = setInterval(async () => {
  //           const detections = await faceapi.detectSingleFace(v);
  //           if (detections && detections.score > 0.5) {
  //             console.log("Face detected");
  //             clearInterval(intervalRef.current);
  //             const snapshot = await takeSnapshot();
  //             const tracks = stream.getTracks(); // Get the tracks array
  //             tracks.forEach(track => { // Iterate over the tracks array
  //               track.stop();
  //             });
  //             signUpModal.hide();
  //             callYourAPI('Placeholder', snapshot, 'http://localhost:5000/register')
  //           }
  //         }, 100);
  //       } catch (err) {
  //         console.log('navigator.getUserMedia error: ', err);
  //       }
  //     });

  //     signUpModalElement.addEventListener('hidden.bs.modal', () => {
  //       const tracks = stream.getTracks(); // Get the tracks array
  //       tracks.forEach(track => { // Iterate over the tracks array
  //         track.stop();
  //       });
  //       clearInterval(intervalRef.current);
  //       document.body.classList.remove('modal-open');
  //     });

  //     signUpModal.show();
  //   } catch (error) {
  //     console.error("Error during face detection:", error);
  //   }
  // };

  const startFaceDetection = () => {
    try {
      const signUpModalElement = document.getElementById("signUpModal");
      const signUpModal = new Modal(signUpModalElement);
  
      navigator.mediaDevices.getUserMedia({ video: { width: 250, height: 250 }, audio: false })
        .then(stream => {
          setVideo(stream);
          if (!v) {
            throw new Error("Video element not found");
          }
          v.srcObject = stream;
  
          // Wait for the modal to show
          return new Promise(resolve => {
            signUpModalElement.addEventListener('shown.bs.modal', resolve, { once: true });
            signUpModal.show();
          });
        })
        .then(() => {
          // Once modal is shown, start face detection
          detectFace(v)
            .then(detections => {
              if (detections && detections.score > 0.1) {
                console.log("Face detected");
                takeSnapshot()
                  .then(snapshot => {
                    signUpModal.hide();
                    const stream = v.srcObject;
                    stopMediaTracks(stream);
                    callYourAPI('Placeholder', snapshot, 'http://localhost:5000/register')
                    .then(data => {
                      console.log(data)
                      handlePL({
                        facialId: data.fingerprint
                      })
                      navigate('/')
                    })
                  })
                  .catch(error => {
                    console.error("Error taking snapshot:", error);
                  });
              } else {
                // Handle case where face is not detected
                console.log("No face detected");
                signUpModal.hide();
                const stream = v.srcObject;
                stopMediaTracks(stream);
              }
            })
            .catch(error => {
              console.error("Face detection error:", error);
            });
        })
        .catch(error => {
          console.error("Error during face detection:", error);
        });
    } catch (error) {
      console.error("Error during face detection:", error);
    }
  };
  
  const detectFace = (v) => {
    return faceapi.detectSingleFace(v);
  };
    
  const stopMediaTracks = (stream) => {
    const tracks = stream.getTracks();
    tracks.forEach(track => {
      track.stop();
    });
  };
  
  const startFaceDetectionLogin = async () => {
    try {
      const signUpModalElement = document.getElementById("signUpModal");
      const signUpModal = new Modal(signUpModalElement);
  
      navigator.mediaDevices.getUserMedia({ video: { width: 250, height: 250 }, audio: false })
        .then(stream => {
          setVideo(stream);
          if (!v) {
            throw new Error("Video element not found");
          }
          v.srcObject = stream;
  
          // Wait for the modal to show
          return new Promise(resolve => {
            signUpModalElement.addEventListener('shown.bs.modal', resolve, { once: true });
            signUpModal.show();
          });
        })
        .then(() => {
          // Once modal is shown, start face detection
          detectFace(v)
            .then(detections => {
              if (detections && detections.score > 0.1) {
                console.log("Face detected");
                takeSnapshot()
                  .then(snapshot => {
                    signUpModal.hide();
                    const stream = v.srcObject;
                    stopMediaTracks(stream);
                    callYourAPI('', snapshot, 'http://localhost:5000/authenticate')
                    .then(data => {
                      if(data.fingerprint){
                        console.log(data)
                        localStorage.setItem('Patient_id', data.fingerprint)
                        navigate('/Patient')
                      }
                    })
                  })
                  .catch(error => {
                    console.error("Error taking snapshot:", error);
                  });
              } else {
                // Handle case where face is not detected
                console.log("No face detected");
                signUpModal.hide();
                const stream = v.srcObject;
                stopMediaTracks(stream);
              }
            })
            .catch(error => {
              console.error("Face detection error:", error);
            });
        })
        .catch(error => {
          console.error("Error during face detection:", error);
        });
    } catch (error) {
      console.error("Error during face detection:", error);
    }
  };

  const callYourAPI = async (name, imageData, url) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          image: imageData
        }),
      });
      const data = await response.json();
      return data;
    } catch (err) {
        console.error('Error calling API:', err);
    }
  };

  const closeVideo = async () => {
    console.log(video)
    const tracks = video.getTracks();
    tracks.forEach(track => {
      track.stop()
    });
  };
  
  const handlePL = async (data) => {
    try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const userAddress = web3.currentProvider.selectedAddress;

      const contractAddress = MyContractAddress;

      const contractABI = [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "patientID",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            }
          ],
          "name": "EnrollPatient",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];

      const contract = new web3.eth.Contract(contractABI, contractAddress);

      const encodedData = contract.methods.EnrollPatient(data.facialId, 'PlaceHolder').encodeABI();
  
      const tx = {
        to: contractAddress,
        from: userAddress,
        data: encodedData,
      };

      const receipt = await web3.eth.sendTransaction(tx);

      console.log('Transaction receipt:', receipt);
      navigate('/')
    } else {
      console.error('MetaMask is not installed or not enabled');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  }

  const handleAuth = () => {
      faceio.authenticate({
          "locale": "auto"
      }).then(userData => {
          localStorage.setItem("Patient_id", userData.facialId)
          console.log("Success, user identified")
          console.log("Linked facial Id: " + userData.facialId)
          handlePA(userData)
      })
  }

  const handlePA = async (data) => {
    try {
      
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
  
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const userAddress = web3.currentProvider.selectedAddress;
  
        const contractAddress = MyContractAddress;
  
        const contractABI = [
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "patientID",
                "type": "string"
              }
            ],
            "name": "patientLogin",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": "true"
          }
        ];
  
        const contract = new web3.eth.Contract(contractABI, contractAddress);
  
        const encodedData = contract.methods.patientLogin(data.facialId).encodeABI();
      
        const result = await web3.eth.call({
          to: contractAddress,
          from: userAddress,
          data: encodedData,
        }, 'latest');

        const decodedResult = web3.eth.abi.decodeParameter('bool', result);
        console.log('Decoded result:', decodedResult);
        if(decodedResult) {
          navigate('/Patient')
        }
      } else {
        console.error('MetaMask is not installed or not enabled');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleF = () => {

  }

  const handleLogin = async () => {
    try {
      
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
  
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const userAddress = web3.currentProvider.selectedAddress;
  
        const contractAddress = MyContractAddress;
  
        const contractABI = [
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "username",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "password",
                "type": "string"
              }
            ],
            "name": "DoctorLogin",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ];
  
        const contract = new web3.eth.Contract(contractABI, contractAddress);
  
        const encodedData = contract.methods.DoctorLogin(name, password).encodeABI();
      
        const result = await web3.eth.call({
          to: contractAddress,
          from: userAddress,
          data: encodedData,
        }, 'latest');

        const decodedResult = web3.eth.abi.decodeParameter('bool', result);
        console.log('Decoded result:', decodedResult);
        if(decodedResult) 
          navigate('/Doctor')
      } else {
        console.error('MetaMask is not installed or not enabled');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <>
      <Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${LandingImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh', 
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Container sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
          }}>
            <Collapse in={checked}>
              <Paper elevation={24} sx={{
                height: '65vh', 
                width: '30vw',
                padding: '10px',
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly'
                }}>
                  <Button onClick={handleDocClick}>Doctor</Button>
                  <Button onClick={handlePatClick}>Patient</Button>
                </Box>
                {dShow && 
                    <Box sx={{
                      paddingTop: '20px'
                    }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                      }} >
                        <Typography variant="h6">
                          Doctor Login
                        </Typography>
                      </Box>
                      <Box>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          paddingTop: '10px'
                        }} >
                          <TextField
                            required
                            id="username"
                            label="Username"
                            onChange={() => setName(document.getElementById('username').value)}
                          />
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          paddingTop: '10px'
                        }} >
                          <TextField
                            required
                            id="password"
                            label="Password"
                            type='password'
                            onChange={() => setPassword(document.getElementById('password').value)}
                          />
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          padding: '10px',
                          paddingTop: '20px'
                        }}>
                          <Button onClick={handleF}>Forgot Password?</Button>
                          <Button onClick={handleLogin} variant='outlined' sx={{ marginLeft: 'auto' }}>Login</Button>
                        </Box>
                        <Divider>
                          or
                        </Divider>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          paddingTop: '20px'
                        }} >
                          <Link to='/Register'>
                            <Button variant='contained'>
                              Register
                            </Button>
                          </Link>
                        </Box>
                      </Box>
                    </Box>
                  }
                  {pShow &&
                    <Box sx={{
                      paddingTop: '20px'
                    }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                      }} >
                        <Typography variant="h6">
                          Patient Login
                        </Typography>
                      </Box>
                      <Box>
                        <Box sx={{
                          display: 'flex',
                          padding: '10px',
                          justifyContent: 'center',
                          paddingTop: '20px'
                        }}>
                          <Button onClick={startFaceDetectionLogin} variant='outlined' >Login</Button>
                        </Box>
                        <Divider>
                          or
                        </Divider>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          paddingTop: '20px'
                        }} >
                          <Button variant='contained' onClick={startFaceDetection}>
                            Register
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  }
              </Paper>
            </Collapse>
          </Container>
        </Grid>
      </Grid>
      <div className="modal fade" id="alertModal" tabIndex="-1" aria-labelledby="alertModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Alert</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Only Admin access the page.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="signUpModal" tabIndex="-1" aria-labelledby="signUpModalLabel" aria-hidden="true" >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Facial Authentication</h1>
              
            </div>
            <div className="modal-body">
              <div id ="camera-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>        
                  <div id ="face-input">
                      <video id="myVideo"  autoPlay></video>
                  </div>
              </div>
            </div>
            <div className="modal-footer">
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing