const SERVER = "http://localhost:8080";

export const get = async (path) => {
  const response = await fetch((SERVER + path), {
    method: "GET",
    credentials: "include" // allow cookies to be set and sent with requests
  });

  const data = await response.json();
  return data;
}

export const post = async (path, dataSubmit) => {
  const response = await fetch((SERVER + path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include", // allow cookies to be set and sent with requests
    body: JSON.stringify(dataSubmit)
  });

  const data = await response.json();
  return data;
}

export const del = async (path) => {
  const response = await fetch((SERVER + path), {
    method: "DELETE",
    credentials: "include" // allow cookies to be set and sent with requests
  });

  const data = await response.json();
  return data;
}

export const patch = async (path, dataSubmit) => {
  const response = await fetch((SERVER + path), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include", // allow cookies to be set and sent with requests
    body: JSON.stringify(dataSubmit)
  });

  const data = await response.json();
  return data;
}

export const put = async (path, dataSubmit) => {
  const response = await fetch((SERVER + path), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include", // allow cookies to be set and sent with requests
    body: JSON.stringify(dataSubmit)
  });

  const data = await response.json();
  return data;
}