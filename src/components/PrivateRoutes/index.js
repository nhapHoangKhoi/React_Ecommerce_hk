import variables from "../../config/variables";

import { Navigate, Outlet } from "react-router-dom";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkAuthen } from "../../actions/authen";

const PrivateRoutes = () => {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // const res = await fetch(`http://localhost:8080/${variables.pathAdmin}/account/profile`, {
        //   method: "GET",
        //   credentials: "include"
        // });
        const respsonse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/me`, {
          method: "GET",
          credentials: "include"
        });
        const data = await respsonse.json();

        if(data.success === true) {
          const isAdmin = data.data.roles?.some(
            role => role.roleName === "ROLE_ADMIN"
          );

          if(isAdmin) {
            dispatch(checkAuthen(true));
            setVerified(true);
          } 
          else {
            dispatch(checkAuthen(false));
            setVerified(false);
          }
        }
      } 
      catch (err) {
        // console.error("Failed to verify auth:", err);
        setVerified(false);
      } 
      finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [dispatch]);

  if(loading) {
    return (
      <>
        {/* spinner better */}
        <div>Loading...</div>;
      </>
    );
  }

  return (
    <>
      {verified ? <Outlet /> : <Navigate to={`/${variables.pathAdmin}/account/login`} />}
    </>
  );
}

export default PrivateRoutes;