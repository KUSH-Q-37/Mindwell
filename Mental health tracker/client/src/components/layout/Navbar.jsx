import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';

const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  height: 72px;
  background-color: rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--card-border);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all var(--transition-normal);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.25rem;
  cursor: pointer;
  margin-right: var(--spacing-md);
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: var(--border-radius-sm);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Logo = styled(Link)`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  letter-spacing: -0.01em;

  span {
    color: var(--primary-color);
    font-style: italic;
    font-weight: 400;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  @media (max-width: 992px) {
    display: none; /* Hide complex nav on mobile for now */
  }
`;

const NavLink = styled(Link)`
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 40px;
  transition: all var(--transition-fast);
  
  ${props => props.$active && `
    background: rgba(37, 99, 235, 0.1);
    color: var(--primary-color);
    box-shadow: 0 0 10px rgba(37, 99, 235, 0.1);
  `}

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.03);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const UserName = styled.span`
  font-weight: 500;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Navbar = ({ toggleSidebar }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <NavbarContainer $isLanding={isLanding}>
      <LogoContainer>
        {currentUser && (
          <MenuButton onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </MenuButton>
        )}
        <Logo to="/" $isLanding={isLanding}>Mind<span>Track</span></Logo>
      </LogoContainer>

      <MobileMenuButton onClick={toggleMobileMenu}>
        <i className={`fas fa-${mobileMenuOpen ? 'times' : 'bars'}`}></i>
      </MobileMenuButton>

      <NavLinks $isOpen={mobileMenuOpen}>
        {currentUser ? (
          <>
            <NavActions>
              <NavLink to="/ai-chat" $active={location.pathname === '/ai-chat'}>
                <i className="fas fa-robot"></i> AI Assistant
              </NavLink>
              <ThemeToggle />
              <UserInfo>
                <UserName>Hello, {currentUser.firstName || currentUser.username}</UserName>
                <Button size="small" variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </UserInfo>
            </NavActions>
          </>
        ) : (
          <>
            <NavActions>
              <ThemeToggle />
              <NavLink to="/login">Sign In</NavLink>
              <Button size="small" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </NavActions>
          </>
        )}
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;
