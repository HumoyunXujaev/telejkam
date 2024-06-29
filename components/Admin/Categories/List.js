import ListItem from './ListItem';
import styled from './styles.module.scss';

export default function List({ categories, setCategories }) {
  return (
    <>
      <div className={styled.header}>Список категорий</div>

      <table className={styled.list}>
        <thead>
          <th>Имя категории</th>
          <th>Редактируется</th>
          <th>Действия</th>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <ListItem
              category={category}
              key={category._id}
              setCategories={setCategories}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
