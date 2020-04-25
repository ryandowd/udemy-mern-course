import React, { useState } from "react";
import { Link } from "react-router-dom";

// Components
import MainHeader from "./MainHeader";
import Navlinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIELements/Backdrop";

// Styles
import "./MainNavigation.css";

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <Navlinks />
      </SideDrawer>
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Your Places</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <Navlinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
