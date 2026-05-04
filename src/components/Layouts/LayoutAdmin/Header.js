
const Header = () => {
  return (
    <>
      <header className="header">
        <div className="inner-logo">
          <div className="inner-button-wrapper">
            <button className="inner-menu-mobile-button">
              <div className="inner-menu-button-background">
                <i></i>
                <i></i>
                <i></i>
              </div>
            </button>
            <button className="inner-menu-mobile-only-button">
              <div className="inner-menu-button-background">
                <i></i>
                <i></i>
                <i></i>
              </div>
            </button>
          </div>
          <div className="inner-logo-content-wrapper">
            <a href={`#`}>
              <span>Admin</span>
            </a>
          </div>
        </div>
        <div className="inner-wrap">
          <div className="inner-notify">
            <img src="/icon-bell.svg" alt="Notifications" />
            <span>6</span>
          </div>
          <div className="inner-account">
            <div className="inner-avatar">
              <img src={`/avatar-2.jpg`} alt="Avatar" />
            </div>
            <div className="inner-text">
              <div className="inner-name">Le Van A</div>
              <div className="inner-role">Administrator</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;