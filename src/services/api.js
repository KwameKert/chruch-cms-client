import axios from "axios";
export default axios.create({
 baseURL: `https://hope-cms-api.herokuapp.com/api`,
 headers: {
 'Accept': 'application/json',
 'Content-Type': 'application/json'
 }
 })