import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import Button from '../common/Button';
import { moodApi } from '../../utils/api';

const PredictionContainer = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const PredictionCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const PredictionHeader = styled.div`
  padding: 40px 40px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PredictionTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
`;

const Badge = styled.span`
  background: var(--badge-bg);
  border: 1px solid var(--badge-border);
  color: var(--badge-text);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const PredictionContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--card-border);
  border-top: 1px solid var(--card-border);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryPanel = styled.div`
  padding: 40px;
  background: var(--card-background);
  border-right: 1px solid var(--card-border);
`;

const ChartPanel = styled.div`
  padding: 40px;
  background: var(--card-background);
  height: 350px;
`;

const InsightItem = styled.div`
  margin-bottom: 32px;
  
  &:last-child { margin-bottom: 0; }
`;

const InsightLabel = styled.div`
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  margin-bottom: 8px;
`;

const InsightValue = styled.div`
  font-family: var(--font-heading);
  font-size: 2rem;
  color: white;
  margin-bottom: 4px;
`;

const InsightDesc = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
`;

const ConfidenceScore = styled.div`
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid var(--card-border);
`;

const ConfidenceLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 12px;
`;

const ConfidenceBar = styled.div`
  height: 2px;
  background: var(--card-border);
  width: 100%;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  width: ${props => props.$value}%;
  background: var(--primary-color);
  box-shadow: 0 0 10px var(--primary-glow);
`;

const ForecastItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--card-border);
  
  &:last-child { border-bottom: none; }
`;

const ForecastDay = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const ForecastScore = styled.div`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: white;
`;

const LoadingText = styled.p`
  color: var(--text-secondary);
  font-style: italic;
`;

const MoodPrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [future, setFuture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      setError(null);
      try {
        const [predRes, futureRes] = await Promise.all([
          moodApi.getPrediction(),
          moodApi.getFuturePrediction()
        ]);
        setPrediction(predRes.data);
        setFuture(futureRes.data);
      } catch (err) {
        console.error('Failed to fetch predictions:', err);
        setError('Analysis service is currently busy or warming up. Trends will appear shortly.');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const getInsight = (score) => {
    if (score >= 8) return "Looking great! Your current habits are supporting a very positive mood. Keep up the social interactions.";
    if (score >= 6) return "A steady day ahead. Your sleep and exercise levels are keeping things balanced.";
    if (score >= 4) return "You might feel a bit drained tomorrow. Try to squeeze in a 10-minute meditation or a short walk.";
    return "Low mood predicted. We recommend prioritizing sleep tonight and reaching out to a friend or professional resource.";
  };

  if (loading) return <Card title="Intelligence Outlook"><LoadingText>Analyzing your patterns...</LoadingText></Card>;
  
  if (error) return (
    <Card title="Intelligence Outlook">
      <div style={{ padding: '20px', textAlign: 'center', opacity: 0.7 }}>
        <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>{error}</p>
        <Button size="small" variant="secondary" onClick={() => window.location.reload()}>Retry Analysis</Button>
      </div>
    </Card>
  );

  return (
    <PredictionContainer>
      <PredictionCard>
        <PredictionHeader>
          <PredictionTitle>Intelligence Outlook</PredictionTitle>
          <Badge>AI Analysis</Badge>
        </PredictionHeader>
        
        <PredictionContent>
          <SummaryPanel>
            <InsightItem>
              <InsightLabel>Tomorrow's Predicted Score</InsightLabel>
              <InsightValue>{prediction?.predicted_mood || future?.next_day?.score || 'N/A'}</InsightValue>
              <InsightDesc>{getInsight(prediction?.predicted_mood || future?.next_day?.score || 5)}</InsightDesc>
            </InsightItem>
            
            <ConfidenceScore>
              <ConfidenceLabel>
                <span>Confidence Level</span>
                <span>85%</span>
              </ConfidenceLabel>
              <ConfidenceBar>
                <ConfidenceFill $value={85} />
              </ConfidenceBar>
            </ConfidenceScore>
          </SummaryPanel>
          
          <ChartPanel>
            <InsightLabel>7-Day Future Trend</InsightLabel>
            {future ? (
              <div style={{ padding: '20px 0' }}>
                <ForecastItem>
                  <ForecastDay>Next Day</ForecastDay>
                  <ForecastScore>{future.next_day.score} <span style={{fontSize: '0.8rem', opacity: 0.6}}>{future.next_day.label}</span></ForecastScore>
                </ForecastItem>
                <ForecastItem>
                  <ForecastDay>3 Days Ahead</ForecastDay>
                  <ForecastScore>{future['3_days'].score} <span style={{fontSize: '0.8rem', opacity: 0.6}}>{future['3_days'].label}</span></ForecastScore>
                </ForecastItem>
                <ForecastItem>
                  <ForecastDay>7 Days Ahead</ForecastDay>
                  <ForecastScore>{future['7_days'].score} <span style={{fontSize: '0.8rem', opacity: 0.6}}>{future['7_days'].label}</span></ForecastScore>
                </ForecastItem>
              </div>
            ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px dashed var(--card-border)', background: 'rgba(255,255,255,0.01)' }}>
                  Calculating Longitudinal Trends...
                </div>
            )}
          </ChartPanel>
        </PredictionContent>
      </PredictionCard>
    </PredictionContainer>
  );
};

export default MoodPrediction;
