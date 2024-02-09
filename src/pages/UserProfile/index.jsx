import { useContext, createContext, useState, useEffect } from "react";
import styles from "./profile.module.css";
import Avatar from "@mui/material/Avatar";

export const ProfileContext = createContext([]);
const logoutChannel = new BroadcastChannel("logout");

const handleLogOut = () => {
  localStorage.clear();
  logoutChannel.postMessage("logout");
  window.location.assign("/login");
};

export const logOutAll = () => {
  logoutChannel.onmessage = (e) => {
    if(e.data=="logout"){
      handleLogOut();
      logoutChannel.close(); }
  };
};
const Profile = () => {
  const { userDetails } = useContext(ProfileContext);
  const [changeButton, setChangeButton] = useState(false);
  useEffect(() => {
    logOutAll();
  }, []);
  const submitHandler = (e, id) => {
    e.preventDefault();
    const { name, username, age } = e.target.elements;
    console.log(name.value, username.value, age.value);
  };
  const ImageChangeHandler = (id) => {};
  return (
    <div className={styles?.profileParent}>
      <form onSubmit={(e) => submitHandler(e, userDetails?._id)}>
        {" "}
        <div className={styles?.profile}>
          <div className={styles?.cardHead}>
            <Avatar
              alt={userDetails.name}
              src={userDetails.image}
              sx={{ height: "10vh", width: "10vh" }}
            />
            <input
              type="file"
              id="chgImg"
              multiple="false"
              accept="image/*"
              style={{ display: "none" }}
              onChange={() => ImageChangeHandler(userDetails?._id)}
            />
            {changeButton && <label htmlFor="chgImg">Change Image</label>}
          </div>

          <div className={styles?.cardBody}>
            <div className={styles?.bodyNodes}>
              <span>Name</span>
              <span>
                {changeButton ? (
                  <input type="text" id="name" />
                ) : (
                  userDetails?.name
                )}
              </span>
            </div>
            <div className={styles?.bodyNodes}>
              <span>Username </span>
              <span>
                {changeButton ? (
                  <input type="text" id="username" />
                ) : (
                  userDetails.username
                )}
              </span>
            </div>
            <div className={styles?.bodyNodes}>
              <span>Age </span>
              <span>
                {changeButton ? (
                  <input type="text" id="age" />
                ) : (
                  userDetails.age
                )}
              </span>
            </div>
            <div className={styles?.bodyNodes}>
              <span>Email</span>
              <span>{userDetails.email}</span>
            </div>
          </div>
          <div className={styles?.cardFoot}>
            {changeButton ? (
              <>
                <button type="submit">Update</button>
                <button type="button" onClick={() => setChangeButton(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setChangeButton(true);
                  }}
                >
                  Edit
                </button>
                <button type="button" onClick={handleLogOut}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
