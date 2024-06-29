import ListItem from './ListItem';
import styled from './styles.module.scss';

export default function SubList({
  categories,
  subCategories,
  setSubCategories,
}) {
  return (
    <>
      <div className={styled.header}>Список подкатегорий</div>

      <table className={styled.list}>
        <thead>
          <th>подкатегория</th>
          <th>Родительская категория</th>
          <th>редактируется</th>
          <th>действия</th>
        </thead>
        <tbody>
          {subCategories.map((subCategory, index) => (
            <ListItem
              categories={categories}
              subCategory={subCategory}
              key={subCategory._id}
              setSubCategories={setSubCategories}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
