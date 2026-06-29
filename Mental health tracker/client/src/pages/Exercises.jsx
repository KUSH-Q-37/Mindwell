import { useState } from 'react';
import { useExercises } from '../hooks/useDashboardData';
import PageTransition from '../components/common/PageTransition';
import Skeleton from '../components/common/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { Wind, Sprout, Dumbbell, Brain, Leaf, Star, ChevronRight } from 'lucide-react';
import BreathingGuide from '../components/exercises/BreathingGuide';
import Modal from '../components/common/Modal'; 

const PageContainer = styled.div`
  padding: var(--spacing-lg) 0;
  background-color: var(--background-color);
`;

const Header = styled.div`
  margin-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--card-border);
  padding-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`;

const Title = styled.h1`
  font-family: var(--font-heading);
  font-size: 3.5rem;
  font-weight: 400;
  color: white;
  margin: 0;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-top: 8px;
`;

const FilterSection = styled.div`
  display: flex;
  margin-bottom: var(--spacing-lg);
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 40px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.$active ? 'var(--primary-color)' : 'var(--card-border)'};
  transition: all var(--transition-fast);
  white-space: nowrap;

  &:hover {
    border-color: ${props => props.$active ? 'var(--primary-color)' : 'var(--text-muted)'};
    color: white;
  }
`;

const ExercisesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--card-border);
  border: 1px solid var(--card-border);

  @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;

const ExerciseCard = styled.div`
  background: var(--card-background);
  padding: 40px;
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: flex;
  flex-direction: column;

  &:hover {
    background: #0a0a0b;
    .icon { color: white; transform: scale(1.1); }
  }
`;

const ExerciseIcon = styled.div`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 24px;
  transition: all 0.3s ease;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(37, 99, 235, 0.05);
  border-radius: 4px;
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const ExerciseLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
`;

const ExerciseTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 400;
  color: white;
  margin-bottom: 12px;
`;

const ExerciseDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 24px;
  flex-grow: 1;
`;

const ExerciseMeta = styled.div`
  color: var(--text-muted);
  font-size: 0.75rem;
  display: flex;
  gap: 16px;
  margin-top: auto;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FeaturedExercise = styled(motion.div)`
  background: #0a0a0b;
  border: 1px solid var(--card-border);
  padding: 60px;
  color: white;
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-lg);
    padding: 40px;
  }

  .content {
    flex: 1;
    z-index: 2;
  }

  .icon-bg {
    position: absolute;
    right: -20px;
    bottom: -20px;
    opacity: 0.03;
    transform: rotate(-15deg);
    z-index: 1;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  border: 1px dashed var(--card-border);
  border-radius: var(--border-radius-md);
`;

const ErrorState = styled.div`
  padding: var(--spacing-lg);
  color: var(--error-color);
  text-align: center;
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Exercises = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  
  const { data: exercises = [], isLoading, error } = useExercises();

  const categories = ['All', 'Meditation', 'Breathing', 'Physical', 'Cognitive', 'Mindfulness'];
  
  const filteredExercises = activeCategory === 'All' 
    ? exercises 
    : exercises.filter(ex => ex.category === activeCategory);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Meditation': return <Sprout size={20} />;
      case 'Breathing': return <Wind size={20} />;
      case 'Physical': return <Dumbbell size={20} />;
      case 'Cognitive': return <Brain size={20} />;
      case 'Mindfulness': return <Leaf size={20} />;
      default: return <Star size={20} />;
    }
  };
  
  return (
    <PageTransition>
      <PageContainer>
        <Container>
          <Header as={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <Title>Mindfulness Library</Title>
              <Subtitle>Curated professional resources for psychological well-being.</Subtitle>
            </div>
          </Header>
          
          <FeaturedExercise
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="content">
              <ExerciseLabel style={{ color: 'var(--primary-color)', marginBottom: '16px', display: 'block' }}>Featured Session</ExerciseLabel>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 400, marginBottom: '16px' }}>4-7-8 Breathing Protocol</h2>
              <p style={{ maxWidth: '600px', color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: 1.6 }}>
                An architectural approach to stress relief. Regulate your autonomic nervous system with this high-precision guided breathing protocol.
              </p>
              <Button onClick={() => setShowBreathingModal(true)}>
                Commence Session
              </Button>
            </div>
            <Wind size={300} className="icon-bg" />
          </FeaturedExercise>

          <FilterSection>
            {categories.map(category => (
              <FilterButton
                key={category}
                $active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </FilterButton>
            ))}
          </FilterSection>
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <ExercisesGrid>
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} style={{ height: '300px', background: 'var(--card-background)' }}></div>)}
              </ExercisesGrid>
            ) : error ? (
              <ErrorState>Error loading suite modules.</ErrorState>
            ) : filteredExercises.length === 0 ? (
              <EmptyState>
                <p>No modules found for this category.</p>
                <Button onClick={() => setActiveCategory('All')} variant="secondary" style={{ marginTop: '16px' }}>View All Modules</Button>
              </EmptyState>
            ) : (
              <ExercisesGrid as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                {filteredExercises.map(exercise => (
                  <ExerciseCard
                    key={exercise._id}
                    as={motion.create(Link)}
                    to={`/exercises/${exercise._id}`}
                    variants={itemVariants}
                  >
                    <ExerciseHeader>
                      <ExerciseIcon className="icon">
                        {getCategoryIcon(exercise.category)}
                      </ExerciseIcon>
                      <ExerciseLabel>{exercise.category}</ExerciseLabel>
                    </ExerciseHeader>
                    
                    <ExerciseTitle>{exercise.title}</ExerciseTitle>
                    <ExerciseDescription>
                      {exercise.description.substring(0, 120)}...
                    </ExerciseDescription>
                    
                    <ExerciseMeta>
                      <span>{exercise.duration} Minutes</span>
                      <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
                    </ExerciseMeta>
                  </ExerciseCard>
                ))}
              </ExercisesGrid>
            )}
          </AnimatePresence>
        </Container>
      </PageContainer>

      {showBreathingModal && (
        <Modal onClose={() => setShowBreathingModal(false)}>
          <BreathingGuide onClose={() => setShowBreathingModal(false)} />
        </Modal>
      )}
    </PageTransition>
  );
};

export default Exercises;
