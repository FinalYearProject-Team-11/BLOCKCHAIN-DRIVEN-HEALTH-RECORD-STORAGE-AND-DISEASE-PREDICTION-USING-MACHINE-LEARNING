import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/joy";
import NavBarVertical from "../components/NavBarVertical";
import Icon from "@mdi/react";
import { Modal } from 'bootstrap'
import { mdiAccountCircle } from "@mdi/js";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import Record from "../components/Record";
import Data from "../components/Data";
import Prediction from "../components/Prediction";
import * as faceapi from 'face-api.js'
// import { faceio } from "../FaceAuth";

const DoctorPortal = () => {
  const [activeComponent, setActiveComponent] = useState("Records");
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasPatient, setHasPatient] = useState(true)
  const [video, setVideo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async function() {
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
    }})()
  })

  let v = document.getElementById("myVideo");

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

  const detectFace = (v) => {
    return faceapi.detectSingleFace(v);
  };
    
  const stopMediaTracks = (stream) => {
    const tracks = stream.getTracks();
    tracks.forEach(track => {
      track.stop();
    });
  };

  const handleAuth = async () => {
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
                        localStorage.setItem('patient_Id', data.fingerprint)
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

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clearPatient = () => {
    localStorage.removeItem('PatientD_id')
    setHasPatient(true)
  }

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div className="container">
        <div className="d-flex">
          <header className="navbar-horizontal">
            <div className="navbar-horizontal-content">
              <div>HR Embedded ML</div>
              <div className="nav-hor-content d-flex">
                <div className="me-5 mt-2">
                  <Button onClick={handleAuth} variant="outlined">
                    Get Patient
                  </Button>
                  <Button onClick={clearPatient} variant="outlined" color="danger" disabled={hasPatient} className="ms-3">
                    Clear
                  </Button>
                </div>
                <div className="nav-hor-acc" onClick={handleClick}>
                  <div
                    className="nav-hor-avat"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <Icon
                      path={mdiAccountCircle}
                      size={1.5}
                      className="nav-hor-avat-img"
                    />
                  </div>
                  <span className="nav-hor-set">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2196f3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-settings"
                    >
                        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </header>
          <NavBarVertical
            key={"static"}
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />
          <div className="main-content">
            {activeComponent === "Records" && <Record isDoctor />}
            {activeComponent === "Data" && <Data isDoctor />}
            {activeComponent === "Predictions" && <Prediction isDoctor />}
          </div>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
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
  );
};

export default DoctorPortal;
