import { RouterProvider } from "react-router-dom"
import router from "./components/Routing";
import {Toaster} from "react-hot-toast";
import { logOutAll } from "./pages/UserProfile";
import { useEffect } from "react";
import { allLoginChannel } from "./pages/UserLogin";
function App() {
useEffect(()=>{
logOutAll();
allLoginChannel();
  
},[])
  return (<>
  <Toaster
  position="bottom-right"
  reverseOrder={false}
/>
  <RouterProvider router={router} />   
     </>
  )
}

export default App;
