import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw, X } from 'lucide-react';
import Button from '../common/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  text-align: center;
`;

const CircleContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacing-xl) 0;
`;

const MainCircle = styled(motion.div)`
  width: 100px;
  height: 100px;
  background: var(--calm-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 0 50px rgba(16, 185, 129, 0.3);
  z-index: 2;
`;

const PulseCircle = styled(motion.div)`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--calm-gradient);
  opacity: 0.3;
  z-index: 1;
`;

const Instruction = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--primary-color);
  height: 3rem;
`;

const Timer = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
`;

const Controls = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

const BreathingGuide = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Ready'); // Ready, Inhale, Hold, Exhale
  const [seconds, setSeconds] = useState(0);

  // 4-7-8 Breathing Technique
  const phases = {
    Inhale: { duration: 4, text: 'Breathe In', scale: 2.5 },
    Hold: { duration: 7, text: 'Hold', scale: 2.5 },
    Exhale: { duration: 8, text: 'Breathe Out', scale: 1 },
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (phase === 'Ready') {
            setPhase('Inhale');
            return 0;
          }

          const currentPhaseDuration = phases[phase].duration;
          if (prev + 1 >= currentPhaseDuration) {
            // Move to next phase
            if (phase === 'Inhale') setPhase('Hold');
            else if (phase === 'Hold') setPhase('Exhale');
            else if (phase === 'Exhale') setPhase('Inhale');
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleStart = () => {
    setIsActive(!isActive);
    if (!isActive && phase === 'Ready') setPhase('Inhale');
  };

  const reset = () => {
    setIsActive(false);
    setPhase('Ready');
    setSeconds(0);
  };

  return (
    <Container>
      <div style={{ alignSelf: 'flex-end', cursor: 'pointer' }} onClick={onClose}>
        <X size={24} color="var(--text-secondary)" />
      </div>
      
      <Wind size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
      <Instruction
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        {phase === 'Ready' ? 'Mindful Breathing' : phases[phase].text}
      </Instruction>

      <Timer>
        {phase !== 'Ready' && `${seconds + 1} / ${phases[phase].duration}s`}
      </Timer>

      <CircleContainer>
        <MainCircle
          animate={{
            scale: phase === 'Ready' ? 1 : phases[phase].scale,
          }}
          transition={{
            duration: phase === 'Ready' ? 0.5 : phases[phase].duration,
            ease: "easeInOut"
          }}
        >
          {isActive && phase === 'Inhale' && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }}>...</motion.div>}
        </MainCircle>
        
        {isActive && (
          <PulseCircle
            animate={{ scale: [1, 3], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeOut" }}
          />
        )}
      </CircleContainer>

      <Controls>
        <Button onClick={toggleStart} variant={isActive ? "secondary" : "primary"}>
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          <span style={{ marginLeft: '8px' }}>{isActive ? 'Pause' : 'Start'}</span>
        </Button>
        <Button onClick={reset} variant="secondary">
          <RotateCcw size={20} />
          <span style={{ marginLeft: '8px' }}>Reset</span>
        </Button>
      </Controls>
      
      <p style={{ marginTop: '2rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
        The 4-7-8 technique is a proven way to reduce anxiety and help you fall asleep. 
        Focus entirely on the circle.
      </p>
    </Container>
  );
};

export default BreathingGuide;
