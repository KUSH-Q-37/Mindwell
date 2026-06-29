import { useMoods, useMoodForecast } from '../hooks/useMoods';
import PageTransition from '../components/common/PageTransition';
import Skeleton from '../components/common/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, PlusCircle, Brain, History, Download } from 'lucide-react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
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

const TrackerContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
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



const ChartSection = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0;

  i {
    background: var(--wellness-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ChartContainer = styled.div`
  height: 400px;
  width: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterButton = styled.button`
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid ${props => props.$active ? 'var(--primary-color)' : 'var(--border-color)'};
  background-color: ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-secondary)'};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--primary-color);
    color: ${props => props.$active ? 'white' : 'var(--primary-color)'};
  }
`;

const MoodEntriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--spacing-lg);
`;

const MoodEntryCard = styled(Card)`
  padding: 0;
  overflow: hidden;

  &:hover {
    border-color: var(--primary-light);
  }
`;

const EntryHeader = styled.div`
  padding: var(--spacing-md);
  background: rgba(99, 102, 241, 0.03);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .date {
    font-weight: 700;
    color: var(--text-color);
  }
`;

const MoodBadge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.$color || 'var(--primary-color)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  box-shadow: 0 4px 10px -2px ${props => props.$color}55;
`;

const EntryContent = styled.div`
  padding: var(--spacing-md);
`;

const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--spacing-sm);
`;

const Tag = styled.span`
  font-size: 0.75rem;
  padding: 4px 10px;
  background: var(--background-color);
  color: var(--text-secondary);
  border-radius: 14px;
  border: 1px solid var(--border-color);
  font-weight: 500;
`;

const MoodNotes = styled.p`
  color: var(--text-color);
  margin-top: var(--spacing-md);
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ForecastCard = styled.div`
  background: var(--card-background);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
  text-align: center;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary-light);
  }

  h4 {
    color: var(--text-secondary);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: var(--spacing-sm);
  }

  .score {
    font-size: 2.5rem;
    font-weight: 800;
    font-family: var(--font-heading);
    color: var(--primary-color);
    line-height: 1;
    margin-bottom: 4px;
    display: block;
  }

  .label {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text-color);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--card-background);
  border-radius: var(--border-radius-lg);
  border: 1px dashed var(--border-color);
  
  i {
    font-size: 3rem;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  gap: var(--spacing-md);
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
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const MoodTracker = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('week');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    const input = document.getElementById('pdf-export-area');
    if (!input) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(input, {
        backgroundColor: '#050505',
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('MindTrack-Wellness-Report.pdf');
    } catch (err) {
      console.error('Error exporting PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };
  
  // React Query Hooks
  const { data: moodEntries = [], isLoading: loadingMoods, error: moodError } = useMoods();
  const { data: futurePrediction, isLoading: loadingPredict, error: predictError } = useMoodForecast();
  
  const getFilteredEntries = () => {
    const now = new Date();
    switch (timeFilter) {
      case 'week':
        return moodEntries.filter(e => new Date(e.date) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
      case 'month':
        return moodEntries.filter(e => new Date(e.date) >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
      case 'quarter':
        return moodEntries.filter(e => new Date(e.date) >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000));
      default:
        return moodEntries;
    }
  };

  const filteredEntries = getFilteredEntries();

  const chartData = {
    labels: filteredEntries.map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse(),
    datasets: [{
      label: 'Mood Level',
      data: filteredEntries.map(entry => entry.mood).reverse(),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        borderRadius: 8,
        bodyFont: { size: 14, weight: '600' }
      }
    },
    scales: {
      y: { min: 1, max: 10, grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { stepSize: 1 } },
      x: { grid: { display: false } }
    }
  };
  
  const getMoodColor = (level) => {
    if (level >= 9) return '#10b981';
    if (level >= 7) return '#6366f1';
    if (level >= 5) return '#f59e0b';
    if (level >= 3) return '#f97316';
    return '#ef4444';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };
  
  return (
    <PageTransition>
      <TrackerContainer>
        <Container>
          <PageHeader as={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <Title>Mood Journey</Title>
              <Subtitle>Visualization of your emotional landscape over time.</Subtitle>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={handleExportPDF} variant="secondary" disabled={isExporting}>
                <Download size={20} style={{ marginRight: '8px' }} /> 
                {isExporting ? 'Exporting...' : 'Export Report'}
              </Button>
              <Button onClick={() => navigate('/mood-tracker/new')} className="premium-btn">
                <PlusCircle size={20} style={{ marginRight: '8px' }} /> Log Mood
              </Button>
            </div>
          </PageHeader>
          
          <div id="pdf-export-area" style={{ padding: isExporting ? '20px' : '0' }}>
          
          <ChartSection as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <ChartHeader>
                <SectionTitle><Activity size={24} /> Emotional Trends</SectionTitle>
                <FilterContainer>
                  {['week', 'month', 'quarter', 'all'].map(f => (
                    <FilterButton key={f} $active={timeFilter === f} onClick={() => setTimeFilter(f)}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </FilterButton>
                  ))}
                </FilterContainer>
              </ChartHeader>
              <ChartContainer>
                {loadingMoods ? <Skeleton height="400px" radius="12px" /> : <Line data={chartData} options={chartOptions} />}
              </ChartContainer>
            </Card>
          </ChartSection>

          <SectionTitle style={{ marginBottom: '1.5rem' }}><Sparkles size={24} /> AI Forecast</SectionTitle>
          <AnimatePresence mode="wait">
            {loadingPredict ? (
              <ForecastGrid key="loading">
                {[1, 2, 3].map(i => <Skeleton key={i} height="120px" radius="16px" />)}
              </ForecastGrid>
            ) : predictError ? (
              <Card key="error">
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p>Forecasting service is currently busy. Please try again later.</p>
                </div>
              </Card>
            ) : (futurePrediction && Object.keys(futurePrediction).length > 0) ? (
              <ForecastGrid as={motion.div} variants={containerVariants} initial="hidden" animate="visible" key="content">
                {['next_day', '3_days', '7_days'].map((key) => {
                  const labelMap = { 'next_day': 'Tomorrow', '3_days': '3 Days', '7_days': 'Week' };
                  const data = futurePrediction[key];
                  return (
                    <ForecastCard key={key} as={motion.div} variants={itemVariants}>
                      <h4>{labelMap[key]}</h4>
                      <div className="score">{data?.score || 'N/A'}</div>
                      <div className="label">{data?.label || 'Calculating...'}</div>
                    </ForecastCard>
                  );
                })}
              </ForecastGrid>
            ) : (
              <Card key="empty"><EmptyState><Brain size={48} /><p>Add more entries to unlock AI forecasting.</p></EmptyState></Card>
            )}
          </AnimatePresence>
          
          <SectionTitle style={{ margin: '3rem 0 1.5rem' }}><History size={24} /> Recent reflections</SectionTitle>
          {loadingMoods ? (
            <MoodEntriesContainer>
              {[1, 2, 3, 4].map(i => <Skeleton key={i} height="160px" radius="18px" />)}
            </MoodEntriesContainer>
          ) : filteredEntries.length === 0 ? (
            <EmptyState><Activity size={48} /><p>No entries found for this period.</p></EmptyState>
          ) : (
            <MoodEntriesContainer as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
              {filteredEntries.map(entry => (
                <MoodEntryCard key={entry._id} as={motion.create(Link)} to={`/mood-tracker/${entry._id}`} variants={itemVariants} whileHover={{ y: -5 }}>
                  <EntryHeader>
                    <span className="date">{formatDate(entry.date)}</span>
                    <MoodBadge $color={getMoodColor(entry.mood)}>{entry.mood}</MoodBadge>
                  </EntryHeader>
                  <EntryContent>
                    <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{entry.mood >= 7 ? 'Feeling Uplifted' : entry.mood >= 5 ? 'Stable' : 'Reflective'}</p>
                    <TagGroup>
                      {entry.factors?.map((f, i) => <Tag key={i}>{f.factor}</Tag>)}
                      {entry.activities?.slice(0, 3).map((a, i) => <Tag key={i} style={{ backgroundColor: 'rgba(99, 102, 241, 0.05)', color: '#6366f1' }}>{a}</Tag>)}
                    </TagGroup>
                    {entry.notes && <MoodNotes>{entry.notes}</MoodNotes>}
                  </EntryContent>
                </MoodEntryCard>
              ))}
            </MoodEntriesContainer>
          )}
          </div>
        </Container>
      </TrackerContainer>
    </PageTransition>
  );
};

export default MoodTracker;
