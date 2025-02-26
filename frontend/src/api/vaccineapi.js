import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const getStaffByEmail = (email) => axios.get(`${API_BASE_URL}/${email}`);

export const updateVaccinationStatus = (email, response) =>
  axios.put(`${API_BASE_URL}/update`, { email, vaccinated: response });
