import api from './axiosInstances';

export const getMyExpenses = async () => await api.tokenInstance.get('/expenses/myexpenses');
export const getAllExpenses = async () => await api.tokenInstance.get('/expenses/allexpenses');
export const getAllExpensesData = async () => await api.tokenInstance.get('/expenses/allexpensesdata');
export const getExpense = async (id) => await api.tokenInstance.get(`/expenses/expense-${id}`);
export const getImageUrl = async (id) => await api.tokenInstance.get(`/expenses/image-${id}`);
export const editExpense = async (expenseData, id) => await api.tokenInstance.put(`/expenses/${id}`, expenseData);
export const editExpensePhoto = async (formData, id) => await api.fileInstance.put(`/expenses/image/${id}`, formData);