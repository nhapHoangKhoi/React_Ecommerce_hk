/* eslint-disable no-unused-vars */
import { get, del, patch, post, put } from "../utils/requests";

import variables from "../config/variables";

export const getAllCategories = async (keyword = "", page = 1) => {
  const url = new URL(window.location.href);
  
  url.searchParams.set("page", page);
  url.searchParams.set("limit", 10);
  
  if(keyword.trim()) {
    url.searchParams.set("keyword", keyword);
  }

  // consol.log(url.herf);       // http://localhost:3000/admin333/categories?page=1&limit=50
  //
  const pathName = url.pathname; // /admin333/categories
  const queryPart = url.search;  // ?page=1&limit=50


  // const data = await get(`/${variables.pathAdmin}/categories`);
  // const data = await get(`${pathName}${queryPart}`);
  const data = await get(`/api/v1/categories${queryPart}`);
  return data;
}

export const getCategoryById = async (categoryId) => {
  // const data = await get(`/${variables.pathAdmin}/categories/${categoryId}`);
  const data = await get(`/api/v1/categories/${categoryId}`);
  return data;
}

export const getCategoriesTree = async () => {
  const data = await get(`/${variables.pathAdmin}/categories/create`);
  return data;
}

export const createCategory = async (dataSubmit) => {
  const data = await post(`/${variables.pathAdmin}/categories`, dataSubmit);
  return data;
}

export const editCategory = async (itemId, dataSubmit) => {
  // const data = await patch(`/${variables.pathAdmin}/categories/${itemId}`, dataSubmit);
  const data = await put(`/api/v1/categories/${itemId}`, dataSubmit);
  return data;
}

export const deleteCategorySoft = async (itemId) => {
  const data = await del(`/${variables.pathAdmin}/categories/${itemId}`);
  return data;
}