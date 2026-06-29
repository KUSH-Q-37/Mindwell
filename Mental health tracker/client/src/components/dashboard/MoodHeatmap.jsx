import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeatmapWrapper = styled(motion.div)`
  background: var(--card-background);
  border: 1px solid var(--card-border);
  padding: 32px;
  border-radius: 4px;
  
  .react-calendar-heatmap .color-empty { fill: rgba(255, 255, 255, 0.03); }
  .react-calendar-heatmap .color-scale-1 { fill: #fca5a5; } /* Poor */
  .react-calendar-heatmap .color-scale-2 { fill: #fde047; } /* Neutral */
  .react-calendar-heatmap .color-scale-3 { fill: #93c5fd; } /* Good */
  .react-calendar-heatmap .color-scale-4 { fill: #3b82f6; } /* Excellent */

  .react-calendar-heatmap rect {
    rx: 2;
    ry: 2;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 400;
  color: white;
  margin: 0;
`;

const Legend = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 2px;
    }
  }
  
  .p::before { background: #fca5a5; }
  .n::before { background: #fde047; }
  .g::before { background: #93c5fd; }
  .e::before { background: #3b82f6; }
`;

const MoodHeatmap = ({ moods }) => {
  // Transform moods for heatmap [ { date: '2023-01-01', count: 1 } ]
  const values = moods.map(m => ({
    date: new Date(m.date).toISOString().split('T')[0],
    count: Math.ceil(m.mood / 2.5) // Scale 1-10 to 1-4
  }));

  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  return (
    <HeatmapWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Header>
        <Title>Mood Continuity</Title>
        <Legend>
            <span className="p">Poor</span>
            <span className="n">Neutral</span>
            <span className="g">Good</span>
            <span className="e">Elite</span>
        </Legend>
      </Header>
      
      <CalendarHeatmap
        startDate={sixMonthsAgo}
        endDate={today}
        values={values}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          return `color-scale-${value.count}`;
        }}
        tooltipDataAttrs={value => {
            if (!value || !value.date) return null;
            return { 'data-tip': `${value.date}: Mood Level ${value.count}` };
        }}
      />
    </HeatmapWrapper>
  );
};

export default MoodHeatmap;
