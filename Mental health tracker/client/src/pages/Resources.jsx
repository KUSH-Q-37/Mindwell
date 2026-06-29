import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import ResourceRecommendations from '../components/resources/ResourceRecommendations';
import { resourcesApi } from '../utils/api';

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
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-muted)'};
  border: 1px solid ${props => props.$active ? 'var(--primary-color)' : 'var(--card-border)'};
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--primary-color);
    color: white;
  }
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--card-border);
  border: 1px solid var(--card-border);

  @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;

const ResourceCard = styled.div`
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

const ResourceIcon = styled.div`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 32px;
  transition: all 0.3s ease;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(37, 99, 235, 0.05);
  border-radius: 4px;
`;

const ResourceCategory = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 16px;
`;

const ResourceTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 400;
  color: white;
  margin-bottom: 16px;
`;

const ResourceDesc = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 32px;
  flex-grow: 1;
`;

const ResourceLink = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  
  i { transition: transform 0.2s; }
  
  &:hover i { transform: translateX(4px); }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  border: 1px dashed var(--card-border);
  border-radius: var(--border-radius-md);
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

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    'All',
    'Therapist',
    'Counselor',
    'Psychiatrist',
    'Support Group',
    'Hotline',
    'Online Platform'
  ];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await resourcesApi.getResources();
        setResources(response.data);
        setFilteredResources(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load professional resources.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(resource => resource.category === activeCategory));
    }
  }, [activeCategory, resources]);

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <Header>
            <Title>Professional Network</Title>
          </Header>
          <LoadingState>Loading professional directory...</LoadingState>
        </Container>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Container>
          <Header>
            <Title>Professional Network</Title>
          </Header>
          <ErrorState>{error}</ErrorState>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <Header>
          <div>
            <Title>Professional Network</Title>
            <Subtitle>Consult with verified specialists and clinical support systems.</Subtitle>
          </div>
        </Header>

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

        {filteredResources.length === 0 ? (
          <EmptyState>
            <p>No specialists found in this category.</p>
            <Button onClick={() => setActiveCategory('All')} variant="secondary" style={{ marginTop: '16px' }}>View All Specialists</Button>
          </EmptyState>
        ) : (
          <ResourcesGrid>
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource._id}
                as={Link}
                to={`/resources/${resource._id}`}
              >
                <ResourceCategory>{resource.category}</ResourceCategory>
                <ResourceTitle>{resource.title}</ResourceTitle>
                <ResourceDesc>
                  {resource.description.length > 180
                    ? `${resource.description.substring(0, 180)}...`
                    : resource.description}
                </ResourceDesc>
                <ResourceLink>
                  View Profile <i className="fas fa-arrow-right"></i>
                </ResourceLink>
              </ResourceCard>
            ))}
          </ResourcesGrid>
        )}

        <div style={{ marginTop: '80px' }}>
          <ResourceRecommendations />
        </div>
      </Container>
    </PageContainer>
  );
};

export default Resources;
