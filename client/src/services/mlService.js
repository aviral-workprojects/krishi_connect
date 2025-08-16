import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + "/ml";

export const getCropRecommendation = async (inputData) => {
  const res = await axios.post(`${API_URL}/recommend`, inputData);
  return res.data;
};

export const getMarketTrends = async () => {
  const res = await axios.get(`${API_URL}/trends`);
  return res.data;
};
