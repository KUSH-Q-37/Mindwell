import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #2563eb;
    --primary-glow: rgba(37, 99, 235, 0.4);
    --primary-dark: #1d4ed8;
    
    --background-color: #050505;
    --card-background: #121214;
    --card-border: #27272a;
    
    --text-color: #ffffff;
    --text-secondary: #a1a1aa;
    --text-muted: #52525b;
    
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
    --shadow-glow: 0 0 20px rgba(37, 99, 235, 0.15);

    /* Luxury Gradients */
    --luxury-gradient: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    --surface-gradient: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%);
    
    /* Institutional Badges */
    --badge-bg: rgba(37, 99, 235, 0.1);
    --badge-border: rgba(37, 99, 235, 0.2);
    --badge-text: #60a5fa;

    /* Typography */
    --font-main: 'Inter', system-ui, sans-serif;
    --font-heading: 'Playfair Display', serif;
    
    --spacing-xs: 0.5rem;
    --spacing-sm: 0.75rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 3rem;
    --spacing-xl: 5rem;

    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --border-radius-xl: 0; /* Sharp architectural corners for primary elements */
    
    --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body.dark-mode {
    /* Theme is already high-contrast dark by default now */
    --background-color: #050505;
    --card-background: #0f0f11;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-main);
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
    background-image: 
      radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.05) 0%, transparent 40%),
      radial-gradient(circle at 100% 100%, rgba(37, 99, 235, 0.03) 0%, transparent 40%);
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  h1 {
    font-size: var(--font-size-xxlarge);
  }

  h2 {
    font-size: var(--font-size-xlarge);
  }

  h3 {
    font-size: var(--font-size-large);
  }

  p {
    margin-bottom: var(--spacing-md);
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  a:hover {
    color: var(--secondary-color);
  }

  button {
    cursor: pointer;
    font-family: var(--font-family);
    font-size: var(--font-size-medium);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    border: none;
    background-color: var(--primary-color);
    color: white;
    transition: background-color var(--transition-fast);
  }

  button:hover {
    background-color: var(--secondary-color);
  }

  input, textarea, select {
    font-family: var(--font-family);
    font-size: var(--font-size-medium);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color);
    background-color: var(--card-background);
    width: 100%;
    transition: border-color var(--transition-fast);
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }

  /* Glassmorphism Utility */
  .glass {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-lg);
  }

  /* Utility classes */
  .container {
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  .text-gradient {
    background: var(--wellness-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .flex { display: flex; }
  .flex-column { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .gap-sm { gap: var(--spacing-sm); }
  .gap-md { gap: var(--spacing-md); }
  .gap-lg { gap: var(--spacing-lg); }

  .mt-sm { margin-top: var(--spacing-sm); }
  .mt-md { margin-top: var(--spacing-md); }
  .mt-lg { margin-top: var(--spacing-lg); }
  .mb-sm { margin-bottom: var(--spacing-sm); }
  .mb-md { margin-bottom: var(--spacing-md); }
  .mb-lg { margin-bottom: var(--spacing-lg); }
`;

export default GlobalStyles;
