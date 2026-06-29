import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import { moodApi, journalApi, goalsApi } from '../../utils/api';

const ScoreContainer = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const ScoreCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const ScoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 40px 20px;
`;

const ScoreTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
`;

const ScoreDate = styled.div`
  color: var(--text-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
`;

const ScoreContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1px;
  background: var(--card-border);
  border-top: 1px solid var(--card-border);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ScoreGauge = styled.div`
  padding: 60px 40px;
  background: var(--card-background);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--card-border);
`;

const ScoreValue = styled.div`
  font-family: var(--font-heading);
  font-size: 6rem;
  font-weight: 400;
  color: white;
  line-height: 1;
  margin-bottom: 8px;
`;

const ScoreLabel = styled.div`
  font-size: 0.75rem;
  color: var(--primary-color);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.15em;
`;

const ScoreFactors = styled.div`
  padding: 40px;
  background: var(--card-background);
`;

const FactorsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FactorItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const FactorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const FactorIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: ${props => props.$color || 'var(--primary-color)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const FactorName = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FactorValue = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: white;
`;

const FactorScore = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FactorBar = styled.div`
  height: 2px;
  background-color: var(--text-muted);
  width: 100%;
`;

const FactorBarFill = styled.div`
  height: 100%;
  width: ${props => props.$value}%;
  background: var(--primary-color);
  box-shadow: 0 0 10px var(--primary-glow);
`;

const DailyTip = styled.div`
  padding: 40px;
  background: rgba(37, 99, 235, 0.03);
  border-top: 1px solid var(--card-border);
`;

const TipTitle = styled.div`
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  
  i {
    margin-right: 12px;
  }
`;

const TipContent = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  font-style: italic;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`;

const WellnessScore = () => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const calculateWellnessScore = async () => {
      try {
        setLoading(true);

        const [moodResponse, journalResponse, goalsResponse] = await Promise.all([
          moodApi.getMoods(),
          journalApi.getJournals(),
          goalsApi.getGoals()
        ]);
        
        const moods = moodResponse.data;
        const journals = journalResponse.data;
        const goals = goalsResponse.data;

        let moodScore = 0;
        if (moods.length > 0) {

          const recentMoods = moods.slice(0, 7);
          const avgMood = recentMoods.reduce((sum, mood) => sum + mood.mood, 0) / recentMoods.length;
          moodScore = (avgMood / 10) * 100; // Convert to percentage
        }

        let journalScore = 0;
        if (journals.length > 0) {

          const last7Days = new Date();
          last7Days.setDate(last7Days.getDate() - 7);
          
          const recentJournals = journals.filter(journal => 
            new Date(journal.createdAt) >= last7Days
          );
          
          journalScore = (recentJournals.length / 7) * 100; // Percentage of days with entries
          journalScore = Math.min(journalScore, 100); // Cap at 100%
        }

        let goalsScore = 0;
        if (goals.length > 0) {

          const totalGoals = goals.length;
          const completedGoals = goals.filter(goal => goal.isCompleted).length;

          let stepsCompletion = 0;
          const inProgressGoals = goals.filter(goal => !goal.isCompleted);
          
          if (inProgressGoals.length > 0) {
            inProgressGoals.forEach(goal => {
              if (goal.steps && goal.steps.length > 0) {
                const totalSteps = goal.steps.length;
                const completedSteps = goal.steps.filter(step => step.isCompleted).length;
                stepsCompletion += completedSteps / totalSteps;
              }
            });
            
            stepsCompletion = stepsCompletion / inProgressGoals.length;
          }

          goalsScore = ((completedGoals / totalGoals) * 0.7 + stepsCompletion * 0.3) * 100;
        }

        let sleepScore = 0;
        if (moods.length > 0) {

          const entriesWithSleep = moods.filter(mood => mood.sleepHours);
          
          if (entriesWithSleep.length > 0) {
            const avgSleep = entriesWithSleep.reduce((sum, mood) => sum + mood.sleepHours, 0) / entriesWithSleep.length;

            if (avgSleep >= 7 && avgSleep <= 9) {
              sleepScore = 100;
            } else if (avgSleep >= 6 && avgSleep < 7) {
              sleepScore = 80;
            } else if (avgSleep > 9 && avgSleep <= 10) {
              sleepScore = 80;
            } else if (avgSleep >= 5 && avgSleep < 6) {
              sleepScore = 60;
            } else if (avgSleep > 10) {
              sleepScore = 60;
            } else {
              sleepScore = 40;
            }
          }
        }

        const overallScore = Math.round(
          (moodScore * 0.3) + (journalScore * 0.2) + (goalsScore * 0.3) + (sleepScore * 0.2)
        );

        let tip = '';
        let lowestScore = Math.min(moodScore, journalScore, goalsScore, sleepScore);
        
        if (lowestScore === moodScore) {
          tip = 'Try practicing gratitude or mindfulness exercises to improve your mood. Even a few minutes each day can make a difference.';
        } else if (lowestScore === journalScore) {
          tip = 'Regular journaling can help process emotions and track patterns. Try setting aside 5 minutes each day to write.';
        } else if (lowestScore === goalsScore) {
          tip = 'Break down your goals into smaller, manageable steps. Celebrating small wins can boost motivation.';
        } else if (lowestScore === sleepScore) {
          tip = 'Improve sleep quality by maintaining a consistent sleep schedule and creating a relaxing bedtime routine.';
        }

        setScore({
          overall: overallScore,
          factors: [
            { name: 'Mood', value: Math.round(moodScore), color: '#5ac8fa', icon: 'smile' },
            { name: 'Journaling', value: Math.round(journalScore), color: '#ff9500', icon: 'book' },
            { name: 'Goals', value: Math.round(goalsScore), color: '#4cd964', icon: 'bullseye' },
            { name: 'Sleep', value: Math.round(sleepScore), color: '#5856d6', icon: 'moon' }
          ],
          tip
        });
      } catch (err) {
        console.error('Error calculating wellness score:', err);
        setError('Failed to calculate wellness score. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    calculateWellnessScore();
  }, []);
  
  if (loading) {
    return (
      <ScoreContainer>
        <LoadingState>Calculating your wellness score...</LoadingState>
      </ScoreContainer>
    );
  }
  
  if (error) {
    return (
      <ScoreContainer>
        <div style={{ color: 'var(--error-color)' }}>{error}</div>
      </ScoreContainer>
    );
  }
  
  if (!score) {
    return null;
  }
  
  return (
    <ScoreContainer>
      <ScoreCard>
        <ScoreHeader>
          <ScoreTitle>Your Wellness Score</ScoreTitle>
          <ScoreDate>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </ScoreDate>
        </ScoreHeader>
        
        <ScoreContent>
          <ScoreGauge>
            <ScoreValue>{score.overall}</ScoreValue>
            <ScoreLabel>Wellness Index</ScoreLabel>
          </ScoreGauge>
          
          <ScoreFactors>
            <FactorsList>
              {score.factors.map((factor, index) => (
                <FactorItem key={index}>
                  <FactorHeader>
                    <FactorIcon $color={factor.color}>
                      <i className={`fas fa-${factor.icon}`}></i>
                    </FactorIcon>
                    <FactorName>{factor.name}</FactorName>
                  </FactorHeader>
                  <FactorScore>
                    <FactorBar>
                      <FactorBarFill $value={factor.value} $color={factor.color} />
                    </FactorBar>
                    <FactorValue>{factor.value}%</FactorValue>
                  </FactorScore>
                </FactorItem>
              ))}
            </FactorsList>
          </ScoreFactors>
        </ScoreContent>
        
        <DailyTip>
          <TipTitle>
            <i className="fas fa-lightbulb"></i>
            Daily Wellness Tip
          </TipTitle>
          <TipContent>{score.tip}</TipContent>
        </DailyTip>
      </ScoreCard>
    </ScoreContainer>
  );
};

export default WellnessScore;
