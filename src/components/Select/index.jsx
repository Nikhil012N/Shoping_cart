/* eslint-disable react/prop-types */
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function CustomSelect(props) {
  const { arr,setSelect,getSelect,keys } = props;
  console.log(keys)
  return (
    <div>
      <FormControl sx={{ minWidth: 80 }} size='small' >
        <Select
          id="demo-simple-select-autowidth"
          value={getSelect}
          size='small' 
          onChange={(e) => {
            setSelect((prevState) => ({ ...prevState, [keys]: e.target.value }));
          }}
          autoWidth
        >
          {arr?.map((data) => (
            <MenuItem value={data} key={data} sx={{minWidth: 80}} >
              {data}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
