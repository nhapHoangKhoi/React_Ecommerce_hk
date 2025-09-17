import variables from "../config/variables";

import LayoutAccount from "../components/Layouts/LayoutAccount";
import LayoutAdmin from "../components/Layouts/LayoutAdmin";
import LayoutDefault from "../components/Layouts/LayoutDefault"
import PrivateRoutes from "../components/PrivateRoutes";
import Dashboard from "../pages/Dashboard";
import CategoryManage from "../pages/CategoryManage";
import CategoryCreate from "../pages/CategoryManage/CategoryCreate";
import CategoryEdit from "../pages/CategoryManage/CategoryEdit";
import ProductManage from "../pages/ProductManage";
import ProductCreate from "../pages/ProductManage/ProductCreate";
import ProductEdit from "../pages/ProductManage/ProductEdit";
import ProductsByCategory from "../pages/ProductsByCategory";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Register from "../pages/Register";


export const routes = [
  // --- Public
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: `categories/:categoryId`,
        element: <ProductsByCategory />
      }
    ]
  },
  {
    path: `/${variables.pathAdmin}/account/`,
    element: <LayoutAccount />,
    children: [
      {
        path: "register",
        element: <Register />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "logout",
        element: <Logout />
      }
    ]
  },
  // --- End public
  // --- Private
  {
    path: `/${variables.pathAdmin}/`,
    element: <PrivateRoutes />,
    children: [
      {
        element: <LayoutAdmin />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "categories",
            element: <CategoryManage />
          },
          {
            path: "categories/create",
            element: <CategoryCreate />
          },
          {
            path: "categories/:id/edit",
            element: <CategoryEdit />
          },
          // {
          //   path: "categories/trash",
          //   element: <CategoryTrash />
          // },
          {
            path: "products",
            element: <ProductManage />
          },
          {
            path: "products/create",
            element: <ProductCreate />
          },
          {
            path: "products/:id/edit",
            element: <ProductEdit />
          },
        ]
      }
    ]
  }
  // {
  //   path: "/admin333/",
  //   element: <LayoutAdmin />,
  //   children: [
  //     {
  //       path: "dashboard",
  //       element: <Dashboard />
  //     },
  //     {
  //       path: "categories",
  //       element: <Category />
  //     }
  //   ]
  // }
  // --- End private
]