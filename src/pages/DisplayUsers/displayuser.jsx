
import { useCallback, useEffect, useState } from "react";
import { apiUrls,AxiosConfig } from "utils";
import toast from "react-hot-toast";
import styles from "./users.module.css"
import {
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import CustomSelect from "components/Select";
import EditPopup from "./editpopup";
import Paginate from "components/Pagination";

const DisplayUser = () => {
  const [userData, setUserData] = useState();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [filter, setFilter] = useState({
    limit: "10",
  
  });
  useEffect(() => {
   AxiosConfig.get(`${apiUrls?.getAllUsers}?limit=${filter?.limit}&sort=${filter?.sort}`)
      .then((res) =>{console.log("Result",res); setUserData(res?.users)})
      .catch((error) => toast.error(error?.message));
  }, [filter.limit,filter.skip,openPopUp,filter.sort]);
  const [page,setPage]=useState(1);
  const dataPerPage=5;
  const startIndex=page===1?0:dataPerPage*(page-1)  
  const currentUserData=userData?.slice(startIndex,(startIndex+5))
  const headings = [
    "name",
    "username",
    "email",
    "age",
    "gender",
    "actions",
  ];
  console.log(userData);
  const deleteHandler =useCallback((user) => {
    try {
    AxiosConfig
        .delete(`${apiUrls?.deleteUser}/${user?._id}`)
        .then(() =>
          toast.success(`User ${user?.username} deleted successfully`)
        );
    } catch (e) {
      toast.error(`Unable to delete this user ${user?.username}`);
    }
  },[]);
  return (
    <>

<div className={styles?.card}>
<table>
  <thead>
    <tr>
    {headings?.map((head) => (
                <td key={head} style={{ color: "white" }}>
                  {head}
                </td>
              ))}
    </tr>
  </thead>
  <tbody>
  {currentUserData?.map((row) => (
              <tr key={row?._id} style={{ textAlignLast: "left" }}>
                <td >{row.name}</td>
                <td >{row.username}</td>
                <td >{row.email}</td>
                <td >{row.age}</td>
                <td >{row.gender}</td>
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
      <td rowSpan={2}> {userData && <Paginate dataPerPage={dataPerPage} page={page} setPage={setPage} totalRecords={userData?.length}  />
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
      {openPopUp && <EditPopup open={openPopUp} setOpen={setOpenPopUp} />}
    </>
  );
};

export default DisplayUser;
