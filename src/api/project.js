import request from "./request";

export function createProject(data) {
  return request({
    url: "/api/project",
    method: "post",
    data,
  });
}

export function getProjects() {
  return request({
    url: "/api/project",
    method: "get",
  });
}


export function getProject(projectId) {
  return request({
    url: `/api/project/${projectId}`,
    method: "get",
  });
}

export function updateProject(projectId, data) {
  return request({
    url: `/api/project/${projectId}`,
    method: "patch",
    data,
  });
}

export function deleteProject(projectId) {
  return request({
    url: `/api/project/${projectId}`,
    method: "delete",
  });
}

export function addMember(data) {
  return request({
    url: "/api/project/member",
    method: "post",
    data,
  });
}

export function updateMember(data) {
  return request({
    url: "/api/project/member",
    method: "put",
    data,
  });
}

export function deleteMember(data) {
  return request({
    url: "/api/project/member/del",
    method: "delete",
    data,
  });
}
