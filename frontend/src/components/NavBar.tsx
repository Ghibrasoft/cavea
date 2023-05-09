import { useNavigate } from 'react-router-dom'
import { Navbar as NavbarBs, Nav, Container, } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';


export function NavBar() {
  const navigate = useNavigate();
  return (
    <NavbarBs sticky='top' className='bg-white shadow-sm mb-3'>
      <Container>
        <img
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi5WYsoyV3Gmx_xaxQEvPTrT-LHVzIoHdS9lxSJIkp&s'
          alt='cavea'
          style={{ width: 200, height: 50, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        <Nav className='ms-auto'>
          <Nav.Link to='/' as={NavLink}>Home</Nav.Link>
        </Nav>
      </Container>
    </NavbarBs>
  )
}
