import React from 'react'
import { Link } from 'gatsby'
import github from '../assets/img/github-icon.svg'
import logo from '../assets/img/logo.svg'

const Navbar = class extends React.Component {

  componentDidMount() {
    // Get all "navbar-burger" elements
   const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    // Check if there are any navbar burgers
   if ($navbarBurgers.length > 0) {
 
     // Add a click event on each of them
     $navbarBurgers.forEach( el => {
       el.addEventListener('click', () => {
 
         // Get the target from the "data-target" attribute
         const target = el.dataset.target;
         const $target = document.getElementById(target);
 
         // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
         el.classList.toggle('is-active');
         $target.classList.toggle('is-active');
 
       });
     });
   }
 }
 
 render() {
   return (
  
<nav className="landing-navbar navbar navbar-expand-lg navbar-dark fixed-top pt-lg-4"role="navigation" aria-label="main-navigation">
    <div className="container-fluid px-3">
      <Link to="/" className="navbar-brandpy-3"> title="Logo">
          <img src={logo} alt="Everpay" style={{ width: '128px' }} />
        </Link>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#landing-navbar-collapse">
        <span className="navbar-toggler-icon"></span>
      </button>
 {/* Hamburger menu */}
burger" data-target="navMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
<div className="collapse navbar-collapse burger" data-target="navMenu" id="landing-navbar-collapse">
        <div className="navbar-nav align-items-lg-center ml-lg-4">
<Link className="anchor-link nav-item nav-link" to="#features">Features</Link>
<Link className="nav-item nav-link" to="/pricing">Pricing</Link>
<Link className="nav-item nav-link" to="/about">About</Link>
<Link className="nav-item nav-link" to="/contact">Contact</Link>
        </div>

        <div className="navbar-nav align-items-lg-center ml-auto">

          <div className="nav-item py-2 py-lg-0 ml-lg-4">
        <a
          className="nav-item nav-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">
            <img src={github} alt="Support" />
          </span>
        </a>
      </div>
          <div className="nav-item py-2 py-lg-0 ml-lg-4">
<a className="btn btn-outline-white btn-round borderless" 
          href="https://id.everpayinc.com/login"
          target="_blank"
          rel="noopener noreferrer"
        >Sign In</a>
          </div>
          <div className="nav-item py-2 py-lg-0 ml-lg-1">
<Link className="btn btn-primary btn-round" to="https://id.everpayinc.com/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  </nav>

  )}
}

export default Navbar
