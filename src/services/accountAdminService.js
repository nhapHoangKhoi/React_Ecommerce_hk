/* eslint-disable no-unused-vars */
import { get, myDelete, patch, post } from "../utils/requests";

import variables from "../config/variables";

export const loginAccount = async (dataSubmit) => {
  // const data = await post(`/${variables.pathAdmin}/account/login`, dataSubmit);
  const data = await post(`/api/v1/users/login`, dataSubmit);
  return data;
}

export const logoutAccount = async (dataSubmit) => {
  // const data = await post(`/${variables.pathAdmin}/account/logout`, dataSubmit);
  const data = await post(`/api/v1/users/logout`, dataSubmit);
  return data;
}

export const registerAccount = async (dataSubmit) => {
  const data = await post(`/${variables.pathAdmin}/account/register`, dataSubmit);
  return data;
}