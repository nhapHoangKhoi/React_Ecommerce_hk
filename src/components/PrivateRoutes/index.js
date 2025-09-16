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
        const res = await fetch(`http://localhost:8080/api/v1/users/me`, {
          method: "GET",
          credentials: "include"
        });

        if(res.ok) {
          const data = await res.json();
          // console.log("Verified account:", data);

          dispatch(checkAuthen(true));
          setVerified(true);
        } 
        else {
          dispatch(checkAuthen(false));
          setVerified(false);
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