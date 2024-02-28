import api from './axiosInstances';

export const createExpenseNumber = async (expenseNumber, aTkn ) => await api.tokenInstance.post('/expensenumbers/newexpensenumber', { accessToken: aTkn, ...expenseNumber });
export const getMyExpenseNumbers = async (aTkn) => await api.tokenInstance.get('/expensenumbers/myexpensenumbers', { accessToken: aTkn });
export const getAllExpenseNumbers = async (aTkn) => await api.tokenInstance.get('/expensenumbers/allexpensenumbers', { accessToken: aTkn });
export const getExpenseNumber = async (id, aTkn) => await api.tokenInstance.get(`/expensenumbers/${id}`, { accessToken: aTkn });
export const editExpenseNumber = async (id, expenseNumber ) => await api.tokenInstance.put(`/expensenumbers/user/${id}`, expenseNumber);
export const editDetailExpenseNumber = async (id, expenseNumber ) => await api.tokenInstance.put(`/expensenumbers/id/${id}`, expenseNumber);
export const deleteExpenseNumber = async (id) => await api.tokenInstance.delete(`/expensenumbers/${id}`);