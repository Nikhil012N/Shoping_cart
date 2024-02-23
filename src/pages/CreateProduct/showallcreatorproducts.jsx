import React, { useEffect, useState } from 'react';
import styles from "./product.module.css";
import toast from "react-hot-toast"
import { AxiosConfig, apiUrls } from 'src/utils';
const showProducts = () => {
const [products,setProducts]=useState([]);
useEffect(()=>{
const fetch=async()=>{
try{
const response=await AxiosConfig?.get(apiUrls?.creatorsProduct);
return setProducts(response?.products)
}
catch(error){
  toast.error(error?.message)
}
}
fetch()
   },[]);
   console.log(products)
  return (
    <div >
      <div className={styles?.card}>
<table>
  <thead>
    <tr>
    {products?.map((head) => (
                <td key={head} style={{ color: "white" }}>
                  {head}
                </td>
              ))}
    </tr>
  </thead>
  <tbody>
  {products?.map((row) => (
              <tr key={row?._id} style={{ textAlignLast: "left" }}>
                <td align="right">{row.name}</td>
                <td align="right">{row.username}</td>
                <td align="right">{row.email}</td>
                <td align="right">{row.age}</td>
                <td align="right">{row.gender}</td>
                <td>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    color="warning"
                    onClick={() => setOpenPopUp(row?._id)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => {
                      confirm(
                        `Do you want to delete user name ${row.username}`
                      ) && deleteHandler(row);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
  </tbody>
  <tfoot>
    <tr>
      <td rowSpan={2}> {products&& <Paginate dataPerPage={dataPerPage} page={page} setPage={setPage} totalRecords={userData?.length}  />
     }
     <CustomSelect
            arr={["10", "20", "50"]}
            setSelect={setFilter}
            getSelect={filter?.limit}
            keys={"limit"}
          /></td>
    </tr>
 
  </tfoot>
</table>
</div>

   
          </div> )
}

export default showProducts;