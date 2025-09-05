import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    --background-color: #111111;
    --text-color: #fff;
  }
  
  @media (prefers-color-scheme: dark) {
    :root {
      --background: #0a0a0a;
      --foreground: #ededed;
    }
  }
  
  html,
  body {
    min-height: 100vh;
    max-width: 100vw;
    overflow-x: hidden;
    background-color: var(--background-color);
    color: var(--text-color);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    display: flex;
    flex-direction: column;
  
    & > div {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
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
  
  button {
    font-family: inherit;
  }
  
  input,
  select {
    font-family: inherit;
  }
  
  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
  }
`
