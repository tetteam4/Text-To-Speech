import styled from "styled-components";

export const HeaderContainer = styled.header`
  background-color: #fff;
  color: #000;
  padding: 1em 2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 70px;

  h1 {
    font-size: 1.5rem;
    margin: 0;
  }

  nav {
    display: flex;
    gap: 2em;
  }

  nav a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
    &:hover {
      color: #007bff;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1em;
  }
`;
