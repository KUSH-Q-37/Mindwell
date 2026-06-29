import styled, { css } from 'styled-components';

const ButtonVariants = {
  primary: css`
    background: var(--primary-color);
    color: white;
    
    &:hover {
      background: var(--primary-dark);
      box-shadow: 0 0 15px var(--primary-glow);
    }
  `,
  secondary: css`
    background: transparent;
    color: var(--text-color);
    border: 1px solid var(--card-border);
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--text-muted);
    }
  `,
  danger: css`
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
    
    &:hover {
      background: #ef4444;
      color: white;
    }
  `,
  success: css`
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.2);
    
    &:hover {
      background: #10b981;
      color: white;
    }
  `
};

const ButtonSizes = {
  small: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  `,
  medium: css`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  `,
  large: css`
    padding: 1rem 2rem;
    font-size: 1.125rem;
  `
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-family: var(--font-main);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  outline: none;
  letter-spacing: -0.01em;
  
  ${props => ButtonVariants[props.$variant || 'primary']}
  ${props => ButtonSizes[props.$size || 'medium']}
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  type = 'button',
  fullWidth = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
