import { useMoods } from '../../hooks/useMoods';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, Moon, Activity as ActivityIcon, Info, HelpCircle } from 'lucide-react';
import styled from 'styled-components';
import Card from '../common/Card';
import Skeleton from '../common/Skeleton';

const InsightsContainer = styled.div`
  margin-bottom: var(--spacing-lg);
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--card-border);
  border: 1px solid var(--card-border);
`;

const InsightCard = styled.div`
  background: var(--card-background);
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;



const InsightContent = styled.div`
  flex: 1;
`;

const InsightTitle = styled.h4`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 400;
  color: white;
  margin-bottom: 12px;
`;

const InsightText = styled.p`
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
`;

const CategoryHeader = styled.div`
  padding: 24px 40px;
  background: #0a0a0b;
  border-bottom: 1px solid var(--card-border);
  
  h5 {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin: 0;
  }
`;

const LoadingContainer = styled.div`
  padding: 60px;
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
`;

const CorrelationContainer = styled.div`
  margin-top: var(--spacing-lg);
`;

const CorrelationItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
`;



const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--card-border);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const InsightValue = styled.div`
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 400;
  color: ${props => props.color || 'white'};
  margin-bottom: 8px;
`;

const InsightLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 12px;
`;

const InsightDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
`;

const CorrelationBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: ${props => props.$bg || 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$color || 'white'};
  border-radius: 2px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
`;

const MoodInsights = () => {
  const { data: moodEntries = [], isLoading } = useMoods();
  
  const calculateAverage = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const calculateCorrelation = (x, y) => {
    if (x.length < 3 || x.length !== y.length) return null;
    const n = x.length;
    const xMean = calculateAverage(x);
    const yMean = calculateAverage(y);
    let cov = 0, xVar = 0, yVar = 0;
    for (let i = 0; i < n; i++) {
      const xDiff = x[i] - xMean;
      const yDiff = y[i] - yMean;
      cov += xDiff * yDiff;
      xVar += xDiff * xDiff;
      yVar += yDiff * yDiff;
    }
    const r = cov / (Math.sqrt(xVar) * Math.sqrt(yVar));
    return isNaN(r) ? null : r;
  };

  const processData = () => {
    if (!moodEntries.length) return null;
    
    const moods = moodEntries.map(e => e.mood);
    const entriesWithSleep = moodEntries.filter(e => e.sleepHours);
    const entriesWithActivity = moodEntries.filter(e => e.physicalActivity);

    // Recent trend (last 7 entries vs prior 7)
    const recentAvg = calculateAverage(moods.slice(0, 7));
    const priorAvg = calculateAverage(moods.slice(7, 14));
    const trend = priorAvg ? ((recentAvg - priorAvg) / priorAvg) * 100 : 0;

    const sleepCorr = calculateCorrelation(
      entriesWithSleep.map(e => e.sleepHours),
      entriesWithSleep.map(e => e.mood)
    );

    const activityCorr = calculateCorrelation(
      entriesWithActivity.map(e => e.physicalActivity),
      entriesWithActivity.map(e => e.mood)
    );

    return {
      avgMood: recentAvg.toFixed(1),
      trend: trend.toFixed(0),
      sleepAvg: calculateAverage(entriesWithSleep.map(e => e.sleepHours)).toFixed(1),
      activityAvg: Math.round(calculateAverage(entriesWithActivity.map(e => e.physicalActivity))),
      correlations: [
        { label: 'Sleep Quality', value: sleepCorr, icon: <Moon size={18} /> },
        { label: 'Physical Movement', value: activityCorr, icon: <ActivityIcon size={18} /> }
      ].filter(c => c.value !== null)
    };
  };

  const insights = processData();

  if (isLoading) return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><Skeleton height="150px" /><Skeleton height="150px" /></div>;
  if (!insights) return null;

  return (
    <InsightsContainer>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Sparkles size={20} color="var(--primary-color)" />
        <h3 style={{ margin: 0 }}>Proactive AI Insights</h3>
      </div>
      
      <InsightGrid>
        <InsightCard as={motion.div} whileHover={{ y: -5 }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            {parseFloat(insights.trend) >= 0 ? <TrendingUp color="#6366f1" /> : <TrendingDown color="#ef4444" />}
          </div>
          <InsightValue color={parseFloat(insights.trend) >= 0 ? 'var(--primary-color)' : 'var(--error-color)'}>
            {insights.trend}%
          </InsightValue>
          <InsightLabel>Weekly Momentum</InsightLabel>
          <InsightDescription>
            {parseFloat(insights.trend) >= 0 
              ? 'Your emotional resilience is increasing. Keep up the great work!' 
              : 'You might be under extra pressure lately. Take some time for yourself.'}
          </InsightDescription>
        </InsightCard>

        {insights.correlations.map((corr, idx) => (
          <InsightCard key={idx} as={motion.div} whileHover={{ y: -5 }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
              {corr.icon}
            </div>
            <CorrelationBadge 
              $bg={Math.abs(corr.value) > 0.5 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}
              $color={Math.abs(corr.value) > 0.5 ? '#10b981' : '#f59e0b'}
            >
              {Math.abs(corr.value) > 0.5 ? 'Strong Impact' : 'Subtle Impact'}
            </CorrelationBadge>
            <div style={{ marginTop: '0.5rem' }}>
              <InsightLabel>{corr.label}</InsightLabel>
              <InsightDescription>
                {corr.value > 0 
                  ? `Better ${corr.label.toLowerCase()} is clearly lifting your spirits.` 
                  : `${corr.label} doesn't seem to be your primary mood driver right now.`}
              </InsightDescription>
            </div>
          </InsightCard>
        ))}
      </InsightGrid>
    </InsightsContainer>
  );
};

export default MoodInsights;
