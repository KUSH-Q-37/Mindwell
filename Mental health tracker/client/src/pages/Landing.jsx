import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import { useAuth } from '../context/AuthContext';

// ─── Animations ──────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 0.7; transform: scale(1.05); }
`;

// ─── Hero Section ─────────────────────────────────────────────────────────────

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  padding-top: 80px;
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    top: -10%;
    left: -5%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(37, 99, 235, 0.08), transparent 70%);
    border-radius: 50%;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: left;
  max-width: 900px;
  animation: ${fadeUp} 0.8s ease-out both;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--badge-bg);
  border: 1px solid var(--badge-border);
  color: var(--badge-text);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 24px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: clamp(3rem, 8vw, 6.5rem);
  font-weight: 400;
  line-height: 1.05;
  color: white;
  margin-bottom: 40px;
  letter-spacing: -0.02em;

  span {
    font-style: italic;
    font-weight: 400;
    color: var(--text-color);
    display: block;
    opacity: 0.6;
    font-family: var(--font-heading);
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 580px;
  margin-bottom: 48px;
  line-height: 1.6;
  font-weight: 400;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 80px;
`;

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 60px;
  padding-top: 60px;
  border-top: 1px solid var(--card-border);
`;

const StatItem = styled.div`
  text-align: left;

  .number {
    font-family: var(--font-heading);
    font-size: 3.5rem;
    font-weight: 400;
    color: white;
    display: block;
  }

  .label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.55);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
`;

// ─── Features Section ─────────────────────────────────────────────────────────

const FeaturesSection = styled.section`
  padding: 120px 0;
  background: #050505;
`;

const SectionHeader = styled.div`
  text-align: left;
  margin-bottom: 80px;
  max-width: 600px;
`;

const SectionLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--primary-color);
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 400;
  color: white;
  margin-bottom: 24px;
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.7;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--card-border);
  border: 1px solid var(--card-border);

  @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;

const FeatureCard = styled.div`
  background: var(--background-color);
  padding: 60px 40px;
  transition: all 0.4s ease;
  cursor: default;

  &:hover {
    background: #0a0a0b;
    .icon { color: white; transform: scale(1.1); }
  }
`;

const FeatureIconWrap = styled.div`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 32px;
  transition: all 0.3s ease;
`;

const FeatureTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 400;
  margin-bottom: 16px;
  color: white;
`;

const FeatureDesc = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
`;

const HowSection = styled.section`
  padding: 120px 0;
  background: #080809;
  border-top: 1px solid var(--card-border);
`;

const StepCard = styled.div`
  text-align: left;
`;

const StepNumber = styled.div`
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--text-muted);
  margin-bottom: 24px;
`;

const StepTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 400;
  color: white;
  margin-bottom: 12px;
`;

const StepDesc = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const SecondaryBtn = styled.button`
  background: transparent;
  color: white;
  border: 1px solid var(--card-border);
  padding: 0 32px;
  height: 54px;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--text-muted);
  }
`;

const CTASection = styled.section`
  padding: 150px 0;
  background-color: var(--background-color);
  text-align: center;
  position: relative;
  overflow: hidden;
  border-top: 1px solid var(--card-border);
`;

const CTAContent = styled.div`
  position: relative;
  z-index: 2;
`;

const CTATitle = styled.h2`
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: white;
  margin-bottom: 24px;
`;

const CTASubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.75);
  max-width: 500px;
  margin: 0 auto 40px;
  line-height: 1.7;
`;

// ─── Footer ───────────────────────────────────────────────────────────────────

const FooterSection = styled.footer`
  background: #0a0a0a;
  padding: 32px 0;
  text-align: center;
  color: rgba(255,255,255,0.45);
  font-size: 0.9rem;

  a {
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    margin: 0 12px;
    transition: color 0.2s;
    &:hover { color: white; }
  }

  .footer-links { margin-bottom: 12px; }
`;

// ─── Features Data ────────────────────────────────────────────────────────────

const features = [
  {
    icon: 'fa-chart-line',
    title: 'Mood Tracking',
    desc: 'Log your daily mood and emotions to uncover patterns and triggers over time.',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    icon: 'fa-brain',
    title: 'AI Predictions',
    desc: 'Our LSTM model forecasts your mood for the next 1, 3, and 7 days based on your history.',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    icon: 'fa-spa',
    title: 'Mindfulness Exercises',
    desc: 'Access guided meditation and breathing exercises to manage stress and anxiety.',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
  {
    icon: 'fa-book',
    title: 'Mood Journal',
    desc: 'Record your thoughts and feelings in a private, encrypted digital journal.',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
  },
  {
    icon: 'fa-hands-helping',
    title: 'Professional Resources',
    desc: 'Connect with therapists, counselors, and support groups in your area.',
    gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
  },
  {
    icon: 'fa-lock',
    title: 'Privacy & Security',
    desc: 'Your data is encrypted end-to-end. We prioritize your privacy above all.',
    gradient: 'linear-gradient(135deg, #6366f1, #10b981)',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Landing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <>
      {/* ── HERO ── */}
      <HeroSection>
        <HeroBg />
        <Container>
          <HeroContent>
            <HeroBadge>
              <i className="fas fa-heart-pulse" /> Mental Wellness Platform
            </HeroBadge>
            <HeroTitle>
              Take Control of Your <span>Mental Wellbeing</span>
            </HeroTitle>
            <HeroSubtitle>
              Track your mood, get AI-powered insights, practice mindfulness, and connect with professional support — all in one beautiful place.
            </HeroSubtitle>
            <HeroButtons>
              {currentUser ? (
                <Button size="large" onClick={() => navigate('/dashboard')}>
                  <i className="fas fa-tachometer-alt" style={{ marginRight: 8 }} />
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button size="large" onClick={() => navigate('/register')}>
                    <i className="fas fa-rocket" style={{ marginRight: 8 }} />
                    Get Started — Free
                  </Button>
                  <SecondaryBtn onClick={() => navigate('/login')}>
                    Sign In
                  </SecondaryBtn>
                </>
              )}
            </HeroButtons>
            <HeroStats>
              <StatItem>
                <span className="number">10K+</span>
                <span className="label">Active Users</span>
              </StatItem>
              <StatItem>
                <span className="number">50K+</span>
                <span className="label">Mood Entries</span>
              </StatItem>
              <StatItem>
                <span className="number">94%</span>
                <span className="label">Feel Better</span>
              </StatItem>
            </HeroStats>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* ── FEATURES ── */}
      <FeaturesSection>
        <Container>
          <SectionHeader>
            <SectionLabel>Everything You Need</SectionLabel>
            <SectionTitle>Your Complete Wellness Toolkit</SectionTitle>
            <SectionSubtitle>
              Powerful features designed by mental health experts to help you build lasting emotional resilience.
            </SectionSubtitle>
          </SectionHeader>
          <FeaturesGrid>
            {features.map((f, i) => (
              <FeatureCard key={i}>
                <FeatureIconWrap $gradient={f.gradient}>
                  <i className={`fas ${f.icon}`} />
                </FeatureIconWrap>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureDesc>{f.desc}</FeatureDesc>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      {/* ── HOW IT WORKS ── */}
      <HowSection>
        <Container>
          <SectionHeader>
            <SectionLabel>Simple & Effective</SectionLabel>
            <SectionTitle>How MindTrack Works</SectionTitle>
            <SectionSubtitle>
              Start your journey in three easy steps and begin seeing meaningful progress within days.
            </SectionSubtitle>
          </SectionHeader>
          <StepsGrid>
            <StepCard>
              <StepNumber $delay="3s">1</StepNumber>
              <StepTitle>Create Your Account</StepTitle>
              <StepDesc>Sign up in under a minute. No credit card required — completely free to start.</StepDesc>
            </StepCard>
            <StepCard>
              <StepNumber $delay="3.5s">2</StepNumber>
              <StepTitle>Log Your Daily Mood</StepTitle>
              <StepDesc>Record how you feel each day along with activities, sleep, and notes.</StepDesc>
            </StepCard>
            <StepCard>
              <StepNumber $delay="4s">3</StepNumber>
              <StepTitle>Get AI Insights</StepTitle>
              <StepDesc>Our LSTM model learns your patterns and predicts your mood up to 7 days ahead.</StepDesc>
            </StepCard>
          </StepsGrid>
        </Container>
      </HowSection>

      {/* ── CTA ── */}
      <CTASection>
        <Container>
          <CTAContent>
            <CTATitle>Begin Your Journey Today</CTATitle>
            <CTASubtitle>
              Join thousands who are already taking meaningful steps towards better mental health.
            </CTASubtitle>
            {currentUser ? (
              <Button size="large" onClick={() => navigate('/dashboard')}>
                <i className="fas fa-tachometer-alt" style={{ marginRight: 8 }} />
                Open Dashboard
              </Button>
            ) : (
              <Button size="large" onClick={() => navigate('/register')}>
                <i className="fas fa-user-plus" style={{ marginRight: 8 }} />
                Create Free Account
              </Button>
            )}
          </CTAContent>
        </Container>
      </CTASection>

      {/* ── FOOTER ── */}
      <FooterSection>
        <Container>
          <div className="footer-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/login">Sign In</a>
            <a href="/register">Register</a>
          </div>
          <p>© 2026 MindTrack. All rights reserved.</p>
          <p style={{ marginTop: 6, fontSize: '0.8rem', opacity: 0.6 }}>
            Not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </Container>
      </FooterSection>
    </>
  );
};

export default Landing;
