import  {useNavigate} from "react-router-dom";
const EmptyCart=()=> {
    const navigate=useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 40px)',padding:"1vw"}}>  
   <img
        srcSet={`/emptycart.png?w=248&fit=crop&auto=format&dpr=2 2x`}
        src={`/emptycart.png?w=248&fit=crop&auto=format`}
        alt={"emptycartImage"}
        loading="lazy"
      />
      <p style={{padding:"1vw", textTransform:"capitalize", fontSize:"2rem"}}>
            Your cart is <span className='text-red-700'>empty!</span></p>
    <p>
            Looks like you haven&apos;t added anything to your cart yet. Browse our
            collection and start shopping!
            </p>
              <button style={{color:"rgb(185 28 28)", borderColor:"rgb(185 28 28)",margin:"2px"}} onClick={()=>navigate("/")}>
                Go To Homepage
              </button>
   
    </div>
  );
}

export default EmptyCart;
