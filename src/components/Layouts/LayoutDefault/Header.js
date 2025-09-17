import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import CategoryMenu from "../../CategoryMenu/CategoryMenu";
import { Link, useNavigate } from "react-router-dom";
import { getAllCategories } from "../../../services/categoryService";
import { logoutAccount } from "../../../services/accountAdminService";

const Header = () => {
  const [categoryTree, setCategoryTree] = useState([]);
  const [theUser, setTheUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAPI = async () => {
      const dataFromBE = await getAllCategories();
      if(dataFromBE.success === true) {
        setCategoryTree(dataFromBE.data.content);
      }
    }

    fetchAPI();
  }, []);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/users/me", {
          method: "GET",
          credentials: "include"
        });
        const data = await response.json();

        if(data.success === true) {
          setTheUser(data.data);
        }
      } 
      catch (error) {
        setTheUser(null);
      }
    };

    fetchLoggedInUser();
  }, []);

  const handleLogout = async () => {
    const dataFromBE = await logoutAccount();

    if(dataFromBE.success == true) {
      setTheUser(null);
      navigate("/");
    }
  };

  return (
    <>
      {/* Top header */}
      <div className="top-header">
        <div className="container">
          <div className="inner-wrap">
            <div className="inner-item">
              <i className="fa-solid fa-phone"></i> 0903.727.691
            </div>
            <div className="inner-item">
              <i className="fa-solid fa-envelope"></i> hoangkhoi@contact.com
            </div>
            <div className="inner-item">
              <i className="fa-solid fa-building"></i> Số 123, đường ABC, thành phố XYZ
            </div>
          </div>
        </div>
      </div>
      {/* End top header */}

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="inner-wrap">
            <button className="inner-menu-mobile-button">
              <FaBars />
            </button>
            <div className="inner-logo">
              <Link to="/">
                <img src="/logo.png" alt="Logo" />
              </Link>
            </div>
            <nav className="inner-menu menu-sider">
              <ul>
                <li>
                  <Link to="/" className="active">
                    Home
                  </Link>
                </li>
                <CategoryMenu categories={categoryTree} />
                {theUser ? (
                  <>
                    <li>
                      <Link onClick={handleLogout}>
                        Logout
                      </Link>
                    </li>
                    <li>
                      <Link style={{ cursor: "default" }}>
                        Hello, {theUser.email}
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                    <li>
                      <Link to="/user/register">Sign up</Link>
                    </li>
                  </>
                )}
              </ul>
              <div className="inner-overlay"></div>
            </nav>
            <div className="inner-cart">
              <a href="#">
                <img src="/icon-cart.svg" alt="Cart" />
                <span>1</span>
              </a>
            </div>
          </div>
          <button className="inner-menu-mobile-button-cancel">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </header>
      {/* Header */}

    </>
  );
}

export default Header;