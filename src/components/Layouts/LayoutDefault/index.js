import Header from "./Header";
import Main from "./Main";
import "./LayoutDefault.css";
// import Footer from "./Footer";

const LayoutDefault = () => {
  return (
    <>
      <div className="layout-default">
        <Header />
        <Main />
        {/* <Footer /> */}
      </div>
    </>
  );
}

export default LayoutDefault;