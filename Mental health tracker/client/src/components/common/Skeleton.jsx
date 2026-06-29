import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const SkeletonBase = styled.div`
  background: var(--border-color);
  background-image: linear-gradient(
    to right, 
    var(--border-color) 0%, 
    rgba(255, 255, 255, 0.1) 20%, 
    var(--border-color) 40%, 
    var(--border-color) 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 104px;
  display: inline-block;
  position: relative;
  animation: ${shimmer} 1.2s linear infinite forwards;
  border-radius: ${props => props.$radius || '4px'};
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  margin-bottom: ${props => props.$margin || '0'};
`;

export const CardSkeleton = styled.div`
  padding: var(--spacing-lg);
  background: var(--card-background);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

export const Skeleton = ({ width, height, radius, margin }) => (
  <SkeletonBase $width={width} $height={height} $radius={radius} $margin={margin} />
);

export default Skeleton;
