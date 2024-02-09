import { useEffect, useRef } from 'react'
import { AxiosConfig, apiUrls } from 'utils';
import {useNavigate} from "react-router-dom";
import styles from "./cart.module.css";
import VerifiedIcon from '@mui/icons-material/Verified';
const Success = () => {
  const navigate=useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const sessionId = urlParams.get('session_id');
  const cardRef=useRef();
    useEffect(() => {
  
  if(!sessionId) {
    navigate("/");
  }
     AxiosConfig(`${apiUrls?.checkoutSuccess}?session_id=${sessionId}`)
        .then((res) => {cardRef.current.classList.add(styles?.successAnimate); setTimeout(()=>{navigate("/orders")},5000)});
    }, [urlParams]);

    
  return (
    <div style={{display:"grid",placeItems:"center",justifyContent:"center"}}>
    <div class={styles?.successContainer} ref={cardRef}>
    <h1><VerifiedIcon  sx={{fontSize:'50px' ,color:"var(--success)"}}/>Your Order Has Been Placed Successfully</h1>
    <p>Thank you for your order. </p>
    <p>We are redirecting you to Orders section</p>
    </div>
    </div>)
}

export default Success;