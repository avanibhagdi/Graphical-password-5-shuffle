import React, { useState,useEffect } from "react";
import { collection, setDoc,  doc, getDoc, getDocs , } from "firebase/firestore";
import { db } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCirclePlay } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



export default function Imagepassword() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [numClicks, setNumClicks] = useState(0);
  const [numShuffles, setNumShuffles] = useState(0);
  const [imageStack, setImageStack] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedNumbers,setSelectedNumbers] = useState([]);
  const [array, setArray] = useState([...Array(24)].map((_, index) => index));
  const [timer,setTimer] = useState(0);
  const [text,setText] = useState("");
  const pilot_users = ["pilot1", "pilot2", "pilot3", "pilot4", "pilot5", "pilot6", "pilot7", "pilot8", "pilot9", "pilot10", "pilot11", "pilot12", "pilot13"];
  const [doSuffle,setDoSuffle] = useState(false)
  const navigate = useNavigate();


  useEffect(() => {
 
    if(!localStorage.getItem("name")){
      navigate("/")
    }
  });


    const initCheck =async ()=>{
      try{
        const docRef = doc(db, "celeb_graphical_password_4x6_final",localStorage.getItem("name"));
        const docSnap = await getDoc(docRef);
       if (docSnap.exists()){
        setText("Confirm Passfaces")
        
       
        setDoSuffle(true)
       }else{
       
        setDoSuffle(false)

        setText("Confirm Passfaces")
       }
      }
      catch(er){
      console.log(er)
      }
        }


  useEffect(()=>{
initCheck()
  },[])

  useEffect(()=>{
    setTimeout(() => {
      setTimer(timer+1)
     }, 1000);
  },[timer])

  
    const checkURL = async() => {
      var uname = localStorage.getItem("name");
      const numid = parseInt(uname);
      if((isNaN(numid) || numid<1 || numid>50) && (!pilot_users.includes(uname))){
        toast.error("Invalid User");
        return;
      }
      const docRef = doc(db, "celeb_graphical_password_4x6_final",localStorage.getItem("name"));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()){
        // console.log(docSnap.data())
        const attemptsCollectionRef = collection(db, "celeb_graphical_password_4x6_final", localStorage.getItem("name"), "attempts");
        const attemptsSnapshot = await getDocs(attemptsCollectionRef);
        const numberOfAttempts = attemptsSnapshot.size;
        const subdoc = await getDocs(
          collection(db, "celeb_graphical_password_4x6_final/" + docSnap.id + "/attempts")
        );
  
        var last_recall = 0;
        var last_correct_recall = 0;
        var last_attempt_rec = 0;
        var last_status = -1;
        subdoc.forEach((dat) => {
          console.log(dat.data().status);
          if (dat.data().status == true){
            last_status = 1;
            last_correct_recall = Number(dat.data().recall);
          }
          else{
            last_status = 0;
          }
          last_recall = Number(dat.data().recall);
          last_attempt_rec = Number(dat.data().attempt);
        });
  
        const link_recall = Number(localStorage.getItem("recall"));
        const link_attempt_rec = Number(localStorage.getItem("attempt"));
        if(last_status == -1){
          if(!((link_recall === 1) && (link_attempt_rec === 1))){
            toast.error("Invalid Session");
            return;
          }
        }
        else{
          if(last_correct_recall === last_recall){
            if(!(((link_recall === last_recall + 1) && (link_attempt_rec === 1)) || ((link_recall === last_recall) && (link_attempt_rec === last_attempt_rec + 1)))){
              toast.error("Invalid Session");
              return;
            }
          }
          else{
            if(last_attempt_rec === 4){
              if(!((link_recall === last_recall + 1) && (link_attempt_rec === 1))){
                toast.error("Invalid Session");
                return;
              }
            }
            else{
              if(!((link_recall === last_recall ) && (link_attempt_rec === last_attempt_rec + 1))){
                toast.error("Invalid Session");
                return;
              }
            }
          }
        }
        if(link_recall > 3 || link_attempt_rec > 4 || link_attempt_rec < 1 || link_recall < 1){
          toast.error("Invalid Link");
          return;
        }
        console.log(last_correct_recall)
        console.log(last_recall)
        console.log(last_attempt_rec);
      }
      else{
        if(Number(localStorage.getItem("recall"))!==0){
          toast.error("Invalid session")
          return
        }
      }
      shuffleArray();
    }
  const handleImageClick = (image,index, position) => {
    if (numClicks < 6) {
      if(numClicks+1!==6){
        shuffleArray()
      }
      window.scrollTo(0,0);
      
      setSelectedImages([...selectedImages, image]);
      setImageStack([...imageStack, image]);
      setSelectedNumbers([...selectedNumbers,index])
      setNumClicks(numClicks + 1);
      setSelectedPositions([...selectedPositions, position]);
  
          
    }
    
  };

  const handleBackButtonClick = () => {
    if (numClicks > 0) {
      setImageStack(imageStack.slice(0, -1));
      setSelectedImages(selectedImages.slice(0, -1));
      setSelectedNumbers(selectedNumbers.slice(0,-1));
      setSelectedPositions(selectedPositions.slice(0,-1));

      setNumClicks(numClicks - 1);
      
      // if(numClicks!==){
        shuffleArray()
      // }

    }
  };
  const shuffleArray = () => {
if(true){
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  setArray(newArray);
  setNumShuffles(numShuffles+1);
}
  };

  const isPasswordCorrect = () => {
    if (selectedImages.length !== 6) {
      return false;
    }
    // for (let i = 0; i < password.length; i++) {
    //   if (selectedImages[i] !== password[i]) {
    //     return false;
    //   }
    // }
    return true;
  };

  const handleConfirmClick = async ()=>{
    const docRef = doc(db, "celeb_graphical_password_4x6_final",localStorage.getItem("name"));
    const docSnap = await getDoc(docRef);
   if (docSnap.exists()){
  //  console.log(docSnap.data())
  //  const attemptsCollectionRef = collection(db, "celeb_graphical_password_4x6_final", localStorage.getItem("name"), "attempts");
  //  const attemptsSnapshot = await getDocs(attemptsCollectionRef);
 
  //  const numberOfAttempts = attemptsSnapshot.size;

  //  if(numberOfAttempts>=4){
  //   toast.error("You have exhausted all recall attempts")
  //   return
  //  }

   if(docSnap.data().setup.toString()===selectedNumbers.toString()){
    await setDoc(doc(db, "celeb_graphical_password_4x6_final",localStorage.getItem("name"),"attempts",`recall-${Date.now()}`), {
      timestamp: new Date().toString(),
      setup:docSnap.data().setup,
      recall:selectedNumbers ,
      positions: selectedPositions,
      incorrect:"",
      status:true   ,
      time_taken:timer,
      recall:localStorage.getItem("recall"),
      attempt: localStorage.getItem("attempt"),

    });
    navigate("/verified");
   }else{
    var incorrect = []
    selectedNumbers.forEach((element,index) => {
      if (element !== docSnap.data().setup[index]){
       incorrect.push(docSnap.data().setup[index])
      } 
    });
    await setDoc(doc(db, "celeb_graphical_password_4x6_final",localStorage.getItem("name"),"attempts",`recall-${Date.now()}`), {
      timestamp: new Date().toString(),
      setup:docSnap.data().setup,
      recall:selectedNumbers ,
      positions: selectedPositions,
      status:false  ,
      incorrect:incorrect,
      time_taken:timer,
      recall:localStorage.getItem("recall"),
      attempt: localStorage.getItem("attempt"),


    });
    navigate("/error");
   }
   }
   else{
   
    await setDoc(doc(db, "celeb_graphical_password_4x6_final",localStorage.getItem("name")), {
      timestamp: new Date().toString(),
      name: localStorage.getItem("name"),
      setup:selectedNumbers   ,
      setup_positions: selectedPositions,
      setup_time_taken:timer

    });
    navigate("/success");
   }
    
  }
  return (
      <center>
        <div className="outer__layer">
          {imageStack.length > 0 && (
           
         <FontAwesomeIcon className="btnI" onClick={handleBackButtonClick} icon={faCircleArrowLeft}/>
           
          )}
          {imageStack.length >= 0 && numShuffles<1 && (
           
           <FontAwesomeIcon className="btnS" onClick={checkURL} icon={faCirclePlay}/>
             
            )}
  
  {imageStack.length === 6 &&(
          <button className="confirm-button " 
          onClick={handleConfirmClick}
          >
           <span className="confirm-button-text"> {text}</span>
          </button>
        )}
         {imageStack.length !== 6 && numShuffles > 0 &&(
           <p className="inner__text">Pick a Face</p>)
         }
         {imageStack.length !== 6 && numShuffles > 0 && numClicks===0&&(
         <p className="inner__text2">Male Politicians / Public Figures</p>)
       }
       {imageStack.length !== 6 && numShuffles > 0 && numClicks===1&&(
         <p className="inner__text2">Female Politicians / Public Figures</p>)
       }
       {imageStack.length !== 6 && numShuffles > 0 && numClicks===2&&(
         <p className="inner__text2">Male Actors</p>)
       }
       {imageStack.length !== 6 && numShuffles > 0 && numClicks===3&&(
         <p className="inner__text2">Female Actresses</p>)
       }
       {imageStack.length !== 6 && numShuffles > 0 && numClicks===4&&(
         <p className="inner__text2">Sports</p>)
       }
       {imageStack.length !== 6 && numShuffles > 0 && numClicks===5&&(
         <p className="inner__text2">Music</p>)
       }
  
        {imageStack.length !== 6 && numShuffles === 0 &&(
           <p className="inner__text1">Press Play to Start</p>)
         }
  
    
          {/* cirlce start  */}
  
          <div className="outer__div__circle">
            {selectedImages.map((image, index) => (
              <div key={index} className="inner__circle">
             {
            <img src={image} key={index} />
           }
              </div>
            ))}
            {numShuffles > 0  && ([...Array(6 - selectedImages.length)].map((image, index) => (
              <div key={index} className="inner__circle"></div>
            )))}
          </div>
  
          {/* cirlce ends  */}
  
          {numShuffles > 0 &&(<div className="images__box">
            <div className="grid-container">
              {
                array.map((im,index)=><div key={im} onClick={() => handleImageClick(require(`../assets/Celeb${numClicks+1>6?6:numClicks+1}/${im+1}.jpg`),im+1, index+1)} className="grid-item">
                <img alt="img1" src={require(`../assets/Celeb${numClicks+1>6?6:numClicks+1}/${im+1}.jpg`)} width={76} height={76} />
              </div>)
              }
             
            </div>
          </div>)}
        </div>
        {/* <small ><b>User: {localStorage.getItem("name")}</b></small> */}
      </center>
    );
  }