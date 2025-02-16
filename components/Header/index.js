import React from 'react';
import Main from './Main';
import styled from './styles.module.scss';
import Top from './Top';

const Header = ({ country, searchHandler, settings }) => {
  console.log(settings, 'header settings');
  return (
    <>
      <header className={styled.header}>
        <Top country={country} settings={settings} />
        <Main searchHandler2={searchHandler} settings={settings} />
      </header>
      <div className={styled.headerSpacer}></div>
    </>
  );
};

export default Header;
