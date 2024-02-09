import { Link,useNavigate } from "react-router-dom";
import Profile from "pages/UserProfile";
import { memo } from "react";

const Header = () => {
  const navigate=useNavigate();
  return (
    <header>
      <img src="/logo.png" alt="shop" width={70} height={100} onClick={()=>navigate("/")}  />
      <ul >
        <Link to="/users">Users</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/products">Product</Link>
        <Link to="/create-product">Create</Link>
        <Link to="/orders">Orders</Link>


      

        <Link></Link>
      </ul>
  
      {/* <div className="flex ">
      
      display: flex;
    padding: 0.5rem;
    gap: 1rem;
    position: sticky;
    min-width: 300px;
    justify-content: space-evenly;
    overscroll-behavior-x: auto;
       
            <>
            
            </>
          
       
      </div> */}
    </header>
  );
};

export default memo(Header);
