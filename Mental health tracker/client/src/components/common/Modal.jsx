import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
`;

const ModalContainer = styled(motion.div)`
  background: var(--background-color);
  width: 100%;
  max-width: ${props => props.$maxWidth || '600px'};
  border-radius: var(--border-radius-xl);
  position: relative;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--glass-border);
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  z-index: 10;
  transition: color 0.2s;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--error-color);
  }
`;

const Modal = ({ children, onClose, maxWidth }) => {
  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContainer
          $maxWidth={maxWidth}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
          {children}
        </ModalContainer>
      </Overlay>
    </AnimatePresence>
  );
};

export default Modal;
