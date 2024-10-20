import React from 'react';
import Main from './Main';
import styled from './styles.module.scss';
import Top from './Top';

const Header = ({ country, searchHandler }) => {
  return (
    <>
      <header className={styled.header}>
        <Top country={country} />
        <Main searchHandler2={searchHandler} />
      </header>
      <div className={styled.headerSpacer}></div>
    </>
  );
};

export default Header;