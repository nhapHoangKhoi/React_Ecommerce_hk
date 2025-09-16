import variables from "../../config/variables";

import { useEffect, useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { Link } from "react-router-dom";

import { loginAccount } from "../../services/accountAdminService";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuthen } from "../../actions/authen";

// --- JustValidate
import JustValidate from "just-validate";
// --- End JustValidate

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ----- Handle passowrd icon ----- //
  const handleClickPasswordIcon = () => {
    setHidePassword(!hidePassword);
  }
  // ----- End handle passowrd icon ----- //

  // ----- Handle submit form ----- //
  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    // console.log(email);
    // console.log(password);

    const dataSubmit = {
      email: email,
      password: password
    };

    const dataFromBE = await loginAccount(dataSubmit);

    if(dataFromBE.success == true)
    {
      // not care about true, false
      // only cares about changing state
      // because need to change UI of Header
      dispatch(checkAuthen(true));

      // login successfully
      // then navgiate back to Home page
      // this code only navigates
      // this code does not help to reload page or else
      navigate(`/${variables.pathAdmin}/dashboard`);
      // navigate(`/${variables.pathAdmin}/categories`);
    }
    else {
      alert("Email or password incorrect!");
    }
  }
  // ----- End handle submit form ----- //

  // ----- JustValidate ----- //
  useEffect(() => {
    const validation = new JustValidate("#login-form");

    validation
      .addField("#email", [
        {
          rule: "required",
          errorMessage: "Please enter your email!",
        },
        {
          rule: "email",
          errorMessage: "Invalid email format!",
        },
      ])
      .addField("#password", [
        {
          rule: "required",
          errorMessage: "Please enter your password!",
        },
      ])
      .onSuccess(async (event) => {
        await handleSubmit(event);
      })
  }, []);
  // ----- End JustValidate ----- //

  return (
    <>
      <div className="form-account">
        <h2 className="inner-title">Login</h2>
        <p className="inner-description">
          Enter your email and password to continue
        </p>

        <form 
          className="inner-form" 
          id="login-form"
          // onSubmit={handleSubmit}
        >
          <div className="inner-group">
            <label htmlFor="email" className="inner-label">
              Email <span className="field-required">*</span>
            </label>
            <input
              className="inner-control"
              type="email"
              name="email"
              id="email"
              placeholder="Example: levana@gmail.com"
            />
          </div>

          <div className="inner-group password-form">
            <label htmlFor="password" className="inner-label">
              Password <span className="field-required">*</span>
            </label>
            <input
              className="inner-control"
              type={hidePassword ? "password" : "text"} 
              name="password"
              id="password"
            />
            <div className="password-icon" onClick={handleClickPasswordIcon}>
              {hidePassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </div>
          </div>

          <button className="inner-button" type="submit">
            Login
          </button>
        </form>

        <div className="inner-more">
          <span>Don't have an account?</span>
          <Link to={`/${variables.pathAdmin}/account/register`}>
            Create an account
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;