import LockPerson from '@mui/icons-material/LockPerson';
const AccessDenied= () => {
  return (
    <div style={{display: 'grid',
    placeItems: 'center',
    height: '100%',
    placeContent: 'center',
    alignContent: 'center'}}>
      <div>
<LockPerson sx={{color:"grey", opacity:"0.4", fontSize:"10vw", border:"1px solid grey",overflow:"visible" ,borderRadius:"50%", padding:"1vw" , margin:"2vw"}} />
      </div>
     <h1>Access Denied</h1> 
     <p>
      You don`t have permisson to access this content or page.
     </p>
     <p>Please contact to adminstration </p>
     </div>
  )
}

export default AccessDenied;