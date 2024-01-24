import WhiteTalk from '../assets/whiteTalk.png'
import Logo from '../assets/logo.png';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { Dispatch, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { TUser } from '../interfaces/user';
import { shallowEqual, useSelector } from 'react-redux';
import { UserState } from '../type';
import { useDispatch } from 'react-redux';
import { updateUser } from '../store/actionCreators';
import { Avatar, IconButton, Tooltip } from '@mui/material';

export const Home = () => {
  const location = useLocation();
  const apiUri = 'http://localhost:3000';
  const token = Cookies.get('JwtToken');
  const [admin, setAdmin] = useState<TUser>();
  // const [ location, setLocation] = useState("/homePage/forumList");

  const currentUser: TUser = useSelector(
    (state: UserState) => state.currentUser,
    shallowEqual
  )

  const dispatch: Dispatch<any> = useDispatch()

  const saveUser = useCallback(
    (user: TUser) => dispatch(updateUser(user)),
    [dispatch]
  )


  useEffect(() => {
    axios.get(`${apiUri}/user/getCurrentUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    ).then(res => {saveUser(res.data); isAdmin()})
      .catch(err => console.log(err))
  }, [])

  const isAdmin=()=>{
    axios.get(`${apiUri}/user/getSystemAdmin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    ).then(res => setAdmin(res.data))
    .catch(err => console.log(err))
        // return (admin?._id==currentUser._id)
  }

  return (
    <div className="home-page">
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark" sticky="top" >
        <Container>
          <img style={{ height: "40px" }} src={Logo} />
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">

            <Nav variant="underline" activeKey={location.pathname}>
              <Nav.Link href="/homePage/profile" >פרופיל החברה</Nav.Link>
              <Nav.Link href="/homePage/customers" >לקוחות החברה</Nav.Link>
              <Nav.Link href="/homePage/forumList" >פורומים</Nav.Link>
              <Nav.Link href="/homePage/account" >החשבון שלי</Nav.Link>
              {admin?._id==currentUser._id?(<Nav.Link href="/homePage/management/forumManagement" >ניהול המערכת</Nav.Link>):(<></>)}
              
            </Nav>

            <Nav className="me-auto">
              <Nav.Link >{currentUser.name}</Nav.Link>
              <Nav.Link href="/" onClick={() => Cookies.set('JwtToken', "")}><RiLogoutCircleLine /></Nav.Link>
              <Tooltip title="Open settings">
                <IconButton sx={{ p: 0 }}>
                  <Avatar alt={currentUser.name} src={`${apiUri}/files/${currentUser.profilePicture}`} />
                </IconButton>
              </Tooltip>
................................
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="left">
        <div className="card">
          <Link to='/homePage/newForum'><img className="card-img-top" src={WhiteTalk} /></Link>
          <div className="card-body">
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
};
