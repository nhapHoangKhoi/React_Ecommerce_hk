/* eslint-disable no-unused-vars */
import { get, myDelete, patch, post } from "../utils/requests";

import variables from "../config/variables";

export const getAllProducts = async (keyword = "", page = 1) => {
  const url = new URL(window.location.href);
  
  url.searchParams.set("page", page);
  url.searchParams.set("limit", 10);
  
  if(keyword.trim()) {
    url.searchParams.set("keyword", keyword);
  }

  // consol.log(url.herf);       // http://localhost:3000/admin333/products?page=1&limit=50
  //
  const pathName = url.pathname; // /admin333/products
  const queryPart = url.search;  // ?page=1&limit=50


  // const data = await get(`/${variables.pathAdmin}/products`);
  // const data = await get(`${pathName}${queryPart}`);
  const data = await get(`/api/v1/products${queryPart}`);
  return data;
}

export const getAllProductsClient = async (keyword = "", page = 1) => {
  const url = new URL(window.location.href);
  
  url.searchParams.set("page", page);
  url.searchParams.set("limit", 4);
  
  if(keyword.trim()) {
    url.searchParams.set("keyword", keyword);
  }

  // consol.log(url.herf);       // http://localhost:3000/admin333/products?page=1&limit=50
  //
  const pathName = url.pathname; // /admin333/products
  const queryPart = url.search;  // ?page=1&limit=50


  // const data = await get(`/${variables.pathAdmin}/products`);
  const data = await get(`/api/v1/products${queryPart}`);
  return data;
}

// -- cannot use because this is application/json, while we use multipart/formdata to send
// export const createProduct = async (dataSubmit) => {
//   const data = await post(`/${variables.pathAdmin}/products`, dataSubmit);
//   return data;
// }

// export const getProductsHomePage = async () => {
//   const data = await get(`/api/client/home`);
//   return data;
// }