import { useLocation, useNavigate } from "react-router-dom";
import { memo, useEffect } from "react";
import { apiUrls, AxiosConfig } from "utils";
import { useState } from "react";
import Header from "./header";
import { Login } from "pages";
import Footer from "./footer";
import { ProfileContext } from "pages/UserProfile";

const ProtectedLayout = ({ Component }) => {
  const [userDetails, setUserDetails] = useState();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      try {
        const response = await AxiosConfig.get(apiUrls?.getUserProfile);
        setUserDetails(response?.user);
      } catch (error) {
        localStorage.clear();
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();

    if (location.pathname === "/login" || location.pathname === "/signup") {
      navigate("/");
    }
  }, [navigate, location.pathname]);

  if (loading) return;

  if (!userDetails) {
    return <Login />;
  }

  if (userDetails) {
    return (
      <>
        <ProfileContext.Provider value={{ userDetails }}>
          <Header />
          <div className="content">
            <Component />
          </div>
          <Footer />
        </ProfileContext.Provider>
      </>
    );
  }
};

export default memo(ProtectedLayout);
