
import {Pagination} from "@mui/material"
const Paginate = (props) => {
    const {page,setPage,dataPerPage,totalRecords}=props;
    const count=Math?.ceil(totalRecords/dataPerPage);
    const pageChangeHandler=(e,val)=>{
      setPage(val)
    }
  return (
    <Pagination page={page} count={count} onChange={pageChangeHandler}/>
  )
}

export default Paginate;