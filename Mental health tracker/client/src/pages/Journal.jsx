import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { journalApi } from '../utils/api';

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

const JournalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-lg);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const EntriesSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const EntryEditor = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: var(--spacing-md);
  
  i {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
  }
  
  input {
    width: 100%;
    padding: 14px 14px 14px 48px;
    background: var(--card-background);
    border: 1px solid var(--card-border);
    border-radius: var(--border-radius-md);
    color: white;
    font-size: 0.95rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: var(--shadow-glow);
    }
  }
`;

const EntryPreviewCard = styled.div`
  padding: 24px;
  background: var(--card-background);
  border: 1px solid ${props => props.$active ? 'var(--primary-color)' : 'var(--card-border)'};
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
  display: block;
  
  &:hover {
    border-color: ${props => props.$active ? 'var(--primary-color)' : 'var(--text-muted)'};
    background: #0a0a0b;
  }
`;

const EntryPreviewTitle = styled.h4`
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 400;
  color: white;
  margin-bottom: 8px;
`;

const EntryPreviewDate = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary-color);
  margin-bottom: 12px;
`;

const EntryPreviewSnippet = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const FilterSection = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 6px 12px;
  border-radius: 20px;
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

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        const response = await journalApi.getJournals();
        setJournals(response.data);
        setFilteredJournals(response.data);

        const allTags = response.data.reduce((acc, journal) => {
          if (journal.tags && journal.tags.length > 0) {
            journal.tags.forEach(tag => {
              if (!acc.includes(tag)) {
                acc.push(tag);
              }
            });
          }
          return acc;
        }, []);
        
        setTags(allTags);
        setError(null);
      } catch (err) {
        console.error('Error fetching journals:', err);
        setError('Failed to load journal entries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJournals();
  }, []);
  
  useEffect(() => {
    let filtered = journals;

    if (activeTag !== 'All') {
      filtered = filtered.filter(journal => 
        journal.tags && journal.tags.includes(activeTag)
      );
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(journal => 
        journal.title.toLowerCase().includes(query) || 
        journal.content.toLowerCase().includes(query)
      );
    }
    
    setFilteredJournals(filtered);
  }, [activeTag, searchQuery, journals]);
  
  const handleTagChange = (tag) => {
    setActiveTag(tag);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <PageContainer>
        <Container>
          <Header>
            <Title>Journal</Title>
          </Header>
          <LoadingState>Loading your private reflections...</LoadingState>
        </Container>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <Container>
          <Header>
            <Title>Journal</Title>
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
            <Title>Journal</Title>
            <Subtitle>Historical record of your emotional journey.</Subtitle>
          </div>
          <Button as={Link} to="/journal/new">
            Write New Entry
          </Button>
        </Header>
        
        <JournalGrid>
          <EntriesSidebar>
            <SearchBox>
              <i className="fas fa-search"></i>
              <input 
                type="text"
                placeholder="Search reflections..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </SearchBox>
            
            <FilterSection style={{ marginBottom: '24px' }}>
              <FilterButton
                $active={activeTag === 'All'}
                onClick={() => handleTagChange('All')}
              >
                All
              </FilterButton>
              {tags.map(tag => (
                <FilterButton
                  key={tag}
                  $active={activeTag === tag}
                  onClick={() => handleTagChange(tag)}
                >
                  {tag}
                </FilterButton>
              ))}
            </FilterSection>

            {filteredJournals.length === 0 ? (
              <EmptyState>
                <p>No reflections found.</p>
              </EmptyState>
            ) : (
              filteredJournals.map(journal => (
                <EntryPreviewCard
                  key={journal._id}
                  as={Link}
                  to={`/journal/${journal._id}`}
                >
                  <EntryPreviewDate>{formatDate(journal.createdAt)}</EntryPreviewDate>
                  <EntryPreviewTitle>{journal.title}</EntryPreviewTitle>
                  <EntryPreviewSnippet>{journal.content}</EntryPreviewSnippet>
                </EntryPreviewCard>
              ))
            )}
          </EntriesSidebar>

          <EntryEditor>
            <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <i className="fas fa-pen-fancy" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                <p>Select an entry to view details or start writing a new reflection.</p>
                <Button as={Link} to="/journal/new" variant="secondary" style={{ marginTop: '1rem' }}>
                  Create New Reflection
                </Button>
              </div>
            </Card>
          </EntryEditor>
        </JournalGrid>
      </Container>
    </PageContainer>
  );
};

export default Journal;
