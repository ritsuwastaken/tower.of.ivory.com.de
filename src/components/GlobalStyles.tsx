import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    --control-height: ${({ theme }) => theme.controls.height};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    :root {
      --control-height: ${({ theme }) => theme.controls.mobileHeight};
    }
  }

  html,
  body {
    min-height: 100vh;
    max-width: 100vw;
    overflow-x: hidden;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    display: flex;
    flex-direction: column;
    font-size: ${({ theme }) => theme.typography.body};
    line-height: ${({ theme }) => theme.typography.lineHeight};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.title};
    line-height: ${({ theme }) => theme.typography.headingLineHeight};
    overflow-wrap: anywhere;
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.heading};
    line-height: ${({ theme }) => theme.typography.headingLineHeight};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.body};
    line-height: ${({ theme }) => theme.typography.headingLineHeight};
  }
  
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  @media (prefers-reduced-motion: reduce) {
    ::view-transition-group(*),
    ::view-transition-old(*),
    ::view-transition-new(*) {
      animation: none !important;
    }
  }

  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
  }
`
