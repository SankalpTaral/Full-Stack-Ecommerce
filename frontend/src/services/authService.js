
import axios from "axios";

export const signUser = async (payload) => {
  const { name, email, password } = payload;

  const response = await axios.post("http://localhost:7777/signup", {
    name,
    email,
    password,
  });

  return response.data;
};

export const loginUser = async(payload)=>{
  const {email , password} = payload;

  const response = await axios.post('http://localhost:7777/login' ,{
    email,
    password
  })
  console.log(response.data);
  return response.data;
}
