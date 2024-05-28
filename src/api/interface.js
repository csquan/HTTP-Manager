import request from "./request";

export function createInterface(data) {
  return request({
    url: "/api/interface",
    method: "post",
    data,
  });
}

export function batchCreateInterface(data) {
  return request({
    url: "/api/interface/batch",
    method: "post",
    data,
  });
}

export function getInterfaces(projectId) {
  return request({
    url: `/api/interface/project/${projectId}`,
    method: "get",
  });
}

export function getInterface(interfaceId) {
  return request({
    url: `/api/interface/${interfaceId}`,
    method: "get",
  });
}

export function updateInterface(interfaceId, data) {
  return request({
    url: `/api/interface/${interfaceId}`,
    method: "patch",
    data,
  });
}

export function deleteInterface(interfaceId) {
  return request({
    url: `/api/interface/${interfaceId}`,
    method: "delete",
  });
}

export function getHistory(interfaceId) {
  return request({
    url: `/api/interface/${interfaceId}/history/`,
    method: "get",
  });
}

export function rollbackHistory(interfaceId, historyId) {
  return request({
    url: `/api/interface/${interfaceId}/history/${historyId}`,
    method: "put",
  });
}


export function uploadFile(formData) {
  return request({
    url: "/api/upload",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: [
      function () {
        return formData;
      },
    ],
    data: formData,
  });
}

export function addMock(data) {
  return request({
    url: "/mock/add",
    method: "post",
    data,
  });
}
