import request from "./request";


export function userLogin(data) {
  return request({
    url: "/api/auth",
    method: "post",
    data,
  });
}

export function userRegister(data) {
  return request({
    url: "/api/user",
    method: "post",
    data,
  });
}

export function getUserInfo(id) {
  return request({
    url: "/api/user/" + id,
    method: "get",
  });
}

export function updateUserInfo(id, data) {
  return request({
    url: `/api/user/${id}`,
    method: "put",
    data,
  });
}

export function deleteUser(id) {
  return request({
    url: `/api/user/${id}`,
    method: "delete",
  });
}
