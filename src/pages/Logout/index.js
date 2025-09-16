import variables from "../../config/variables";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkAuthen } from "../../actions/authen";

import { useEffect } from "react";
import { logoutAccount } from "../../services/accountAdminService";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      const dataFromBE = await logoutAccount();

      if(dataFromBE.success == true) {
        dispatch(checkAuthen(false)); // not care about true, false
                                      // only care about changing state
        navigate(`/${variables.pathAdmin}/account/login`);
      }
    }

    handleLogout();
  }, []);
  
  return(
    <>
    </>
  );
}

export default Logout;