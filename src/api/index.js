export const BASE_URL = "https://fitnesstrac-kr.herokuapp.com/api";

export const clearToken = () => {
  localStorage.removeItem("auth-token");
};

export const setToken = (token) => {
  localStorage.setItem("auth-token", token);
};

export const getToken = () => {
  return localStorage.getItem("auth-token");
};

export const auth = async (username, password, isNew = false) => {
  let url = `${BASE_URL}/users` + (isNew ? "/register" : "/login");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.token) {
      setToken(data.token);
    }

    return data;
  } catch (err) {
    console.log("Error from API index file:", err);
  }
};

function buildHeaders() {
  let base = {
    "Content-Type": "application/json",
  };

  if (getToken()) {
    base["Authorization"] = `Bearer ${getToken()}`;
  }

  return base;
}

export const fetchAPI = async (url, method = "GET", sendData = null) => {
  const fetchOptions = {
    method: method,
    headers: buildHeaders(),
  };

  if (sendData) {
    fetchOptions.body = JSON.stringify(sendData);
  }

  const response = await fetch(url, fetchOptions);
  console.log("this is what we are sending in the fetch", fetchOptions);
  console.log("this is the initial response:", response);
  const data = await response.json();

  console.log("result from fetch in api index file:", data);

  return data;
};

