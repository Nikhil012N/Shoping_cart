import { useEffect } from 'react'
import { AxiosConfig, apiUrls } from 'utils';
const Success = () => {
    useEffect(() => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');
  
     AxiosConfig(`${apiUrls?.checkoutSuccess}?session_id=${sessionId}`)
        .then((res) =>{ console.log(res)});
    }, []);

  return (
    
    <div>success</div>
  )
}

export default Success;