import api from './axiosInstances';

export const signup = async (usrData) => await api.baseInstance.post('/user/signup', usrData);
export const login = async (usrData) => await api.baseInstance.post('/tokenAuth/login', usrData);
export const getAllUsers = async () => await api.tokenInstance.get('/user/all');
export const getAllUsersEmail = async () => await api.tokenInstance.get('/user/all-email');
export const editUser = async (id, update) => await api.tokenInstance.put(`/user/id/${id}`, { update });
export const deleteUser = async (id) => await api.tokenInstance.delete(`/user/${id}`);