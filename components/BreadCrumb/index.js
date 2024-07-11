import Link from 'next/link';
import * as Icon from 'react-feather';
import styled from './styles.module.scss';

const BreadCrumb = ({ category, categoryLink, subCategories }) => {
  return (
    <div className={styled.wrapper}>
      <Link href='/'>
        <Icon.Home />
      </Link>
      <Icon.ChevronRight /> <Link href={categoryLink}>{category}</Link>{' '}
      <Icon.ChevronRight />{' '}
      {subCategories?.map((sub, index) => (
        <span key={index}>
          {sub.name} <Icon.ChevronRight />{' '}
        </span>
      ))}
    </div>
  );
};

export default BreadCrumb;
