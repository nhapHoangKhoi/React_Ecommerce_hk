import { Link } from "react-router-dom";

const CategoryMenu = ({ categories }) => {
  if (!categories || categories.length === 0) return null;
  return (
    <>
      <li>
        <div style={{ cursor: "default" }}>
          Categories
        </div>
        <ul>
          {categories.map((category) => (
            <li key={category.id} className="">
              <Link to={`/categories/${category.id}`}>{category.name}</Link>

              {/* {category.children && category.children.length > 0 && (
                <ul className="absolute left-full top-0 hidden group-hover:block bg-white shadow-md rounded mt-0 ml-2 z-10">
                  <CategoryMenu categories={category.children} />
                </ul>
              )} */}
            </li>
          ))}
        </ul>
      </li>
    </>
  );
};

export default CategoryMenu;