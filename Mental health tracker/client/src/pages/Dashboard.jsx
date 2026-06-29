import { useAuth } from '../context/AuthContext';
import { useMoods } from '../hooks/useMoods';
import { useResources, useExercises, useGoals, useJournals } from '../hooks/useDashboardData';
import PageTransition from '../components/common/PageTransition';
import Skeleton from '../components/common/Skeleton';
import { motion } from 'framer-motion';
import { Activity, PlusCircle, Sprout, Users, Book } from 'lucide-react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import MoodInsights from '../components/dashboard/MoodInsights';
import WellnessScore from '../components/dashboard/WellnessScore';
import MoodPrediction from '../components/dashboard/MoodPrediction';
import MoodHeatmap from '../components/dashboard/MoodHeatmap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

const DashboardContainer = styled.div`
  padding: var(--spacing-lg) 0;
  background-color: var(--background-color);
`;

const WelcomeSection = styled.div`
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--card-border);
`;

const WelcomeTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 3.5rem;
  font-weight: 400;
  color: white;
  margin-bottom: 12px;
  
  span {
    font-style: italic;
    opacity: 0.6;
  }
`;

const WelcomeSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0;
`;

const GamificationBanner = styled.div`
  background: var(--calm-gradient);
  padding: 16px 24px;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const StreakInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 1.1rem;
`;

const BadgesContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Badge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  backdrop-filter: blur(5px);
  font-weight: 600;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const MoodSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--card-border);
  margin-bottom: var(--spacing-md);
  border: 1px solid var(--card-border);

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const MoodStat = styled.div`
  text-align: left;
  padding: 30px;
  background: var(--card-background);

  h3 {
    font-size: 0.75rem;
    margin-bottom: 16px;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  p {
    font-family: var(--font-heading);
    font-size: 2.5rem;
    font-weight: 400;
    margin: 0;
    color: white;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--card-border);
  border: 1px solid var(--card-border);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ActionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-light);
    
    i { transform: scale(1.1); }
  }

  i {
    font-size: 2.5rem;
    background: var(--wellness-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--spacing-md);
    transition: transform var(--transition-normal);
  }

  h3 {
    color: var(--text-color);
    font-size: 1.25rem;
    margin-bottom: var(--spacing-xs);
    text-align: center;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    text-align: center;
    margin: 0;
  }
`;

const ResourcesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const ResourceItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
  border: 1px solid transparent;

  &:hover {
    background-color: var(--background-color);
    border-color: var(--border-color);
    transform: translateX(4px);
  }

  i {
    color: var(--primary-color);
    margin-right: var(--spacing-md);
    font-size: 1.25rem;
    width: 24px;
    text-align: center;
  }

  div {
    flex: 1;
  }

  h4 {
    color: var(--text-color);
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 0.85rem;
  }
`;

const ExercisesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const ExerciseItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
  border: 1px solid transparent;

  &:hover {
    background-color: var(--background-color);
    border-color: var(--border-color);
    transform: translateX(4px);
  }

  i {
    color: var(--primary-color);
    margin-right: var(--spacing-md);
    font-size: 1.25rem;
    width: 24px;
    text-align: center;
  }

  div {
    flex: 1;
  }

  h4 {
    color: var(--text-color);
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 0.85rem;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`;

const ErrorState = styled.div`
  padding: var(--spacing-md);
  color: var(--error-color);
  text-align: center;
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  
  // React Query Hooks
  const { data: moodData = [], isLoading: loadingMoods, error: moodError } = useMoods();
  const { data: resources = [], isLoading: loadingResources } = useResources();
  const { data: exercises = [], isLoading: loadingExercises } = useExercises();

  const chartData = {
    labels: moodData.slice(-7).map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse(),
    datasets: [
      {
        label: 'Mood Level',
        data: moodData.slice(-7).map(entry => entry.mood).reverse(),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#121214',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 14 },
        padding: 12,
        borderColor: '#27272a',
        borderWidth: 1,
        displayColors: false,
      }
    },
    scales: {
      y: {
        min: 1,
        max: 10,
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: 'var(--text-muted)', font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'var(--text-muted)', font: { size: 10 } }
      }
    }
  };

  const calculateAverageMood = () => {
    if (moodData.length === 0) return 'N/A';
    const sum = moodData.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodData.length).toFixed(1);
  };

  const getLatestMood = () => {
    if (moodData.length === 0) return 'N/A';
    return moodData[0].mood;
  };

  const getMoodTrend = () => {
    if (moodData.length < 2) return 'N/A';
    const latest = moodData[0].mood;
    const previous = moodData[1].mood;
    if (latest > previous) return 'Improving ↑';
    if (latest < previous) return 'Declining ↓';
    return 'Stable →';
  };

  return (
    <PageTransition>
      <DashboardContainer>
        <Container>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WelcomeSection>
              <WelcomeTitle>Welcome, {currentUser?.firstName || currentUser?.username}!</WelcomeTitle>
              <WelcomeSubtitle>
                Your mental wellness journey continues. Let's see how you're doing today.
              </WelcomeSubtitle>
            </WelcomeSection>

            <GamificationBanner>
              <StreakInfo>
                🔥 Current Streak: {currentUser?.currentStreak || 0} Days (Best: {currentUser?.longestStreak || 0})
              </StreakInfo>
              <BadgesContainer>
                {currentUser?.badges?.length > 0 ? (
                  currentUser.badges.map((b, i) => <Badge key={i}>{b}</Badge>)
                ) : (
                  <Badge style={{ opacity: 0.7 }}>Log moods to earn badges!</Badge>
                )}
              </BadgesContainer>
            </GamificationBanner>
          </motion.div>

          <WellnessScore />
          <MoodPrediction />

          <DashboardGrid as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
            <MainColumn>
              <Card title="Mood Overview" as={motion.div} variants={itemVariants}>
                {loadingMoods ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Skeleton height="150px" radius="12px" />
                    <Skeleton height="200px" radius="12px" />
                  </div>
                ) : moodError ? (
                  <ErrorState>Failed to load mood insights. Please try again.</ErrorState>
                ) : moodData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Activity size={48} color="var(--primary-light)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>No mood data yet. Start your journey today.</p>
                    <Button as={Link} to="/mood-tracker/new" style={{ marginTop: '1rem' }}>
                      Add Entry
                    </Button>
                  </div>
                ) : (
                  <>
                    <MoodSummary>
                      <MoodStat>
                        <h3>Latest</h3>
                        <p>{getLatestMood()}/10</p>
                      </MoodStat>
                      <MoodStat>
                        <h3>Average</h3>
                        <p>{calculateAverageMood()}/10</p>
                      </MoodStat>
                      <MoodStat>
                        <h3>Trend</h3>
                        <p>{getMoodTrend()}</p>
                      </MoodStat>
                    </MoodSummary>

                    <div style={{ height: '300px', padding: '10px 0' }}>
                      <Line data={chartData} options={chartOptions} />
                    </div>

                    <MoodInsights />

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                      <Button as={Link} to="/mood-tracker" variant="secondary">
                        Comprehensive History
                      </Button>
                    </div>
                  </>
                )}
              </Card>

              {moodData.length > 0 && (
                <MoodHeatmap moods={moodData} />
              )}

              <Card title="Quick Actions" as={motion.div} variants={itemVariants}>
                <QuickActions>
                  <ActionCard to="/mood-tracker/new">
                    <PlusCircle size={32} />
                    <h3>Track Mood</h3>
                    <p>How are you now?</p>
                  </ActionCard>

                  <ActionCard to="/exercises">
                    <Sprout size={32} />
                    <h3>Mindfulness</h3>
                    <p>Calm your mind</p>
                  </ActionCard>

                  <ActionCard to="/resources">
                    <Users size={32} />
                    <h3>Support</h3>
                    <p>Professional help</p>
                  </ActionCard>

                  <ActionCard to="/journal">
                    <Book size={32} />
                    <h3>Journal</h3>
                    <p>Speak your heart</p>
                  </ActionCard>
                </QuickActions>
              </Card>
            </MainColumn>

            <SideColumn>
              <Card title="Guided Exercises" as={motion.div} variants={itemVariants}>
                {loadingExercises ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[1, 2, 3].map(i => <Skeleton key={i} height="60px" radius="8px" />)}
                  </div>
                ) : (
                  <ExercisesList>
                    {exercises.slice(0, 4).map(exercise => (
                      <ExerciseItem key={exercise._id} to={`/exercises/${exercise._id}`}>
                        <div className="icon">
                          <Sprout size={20} />
                        </div>
                        <div>
                          <h4>{exercise.title}</h4>
                          <p>{exercise.duration} min • {exercise.category}</p>
                        </div>
                      </ExerciseItem>
                    ))}
                  </ExercisesList>
                )}
              </Card>

              <Card title="Expert Resources" as={motion.div} variants={itemVariants}>
                {loadingResources ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[1, 2, 3].map(i => <Skeleton key={i} height="60px" radius="8px" />)}
                  </div>
                ) : (
                  <ResourcesList>
                    {resources.slice(0, 4).map(resource => (
                      <ResourceItem key={resource._id} to={`/resources/${resource._id}`}>
                        <div className="icon">
                          <Users size={20} />
                        </div>
                        <div>
                          <h4>{resource.title}</h4>
                          <p>{resource.category}</p>
                        </div>
                      </ResourceItem>
                    ))}
                  </ResourcesList>
                )}
              </Card>
            </SideColumn>
          </DashboardGrid>
        </Container>
      </DashboardContainer>
    </PageTransition>
  );
};

export default Dashboard;
