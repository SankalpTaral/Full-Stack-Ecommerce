
import api from "./api";

export const signUser = async (payload) => {
  const { name, email, password } = payload;

  const response = await api.post("/signup", {
    name,
    email,
    password,
  });

  return response.data;
};

export const loginUser = async(payload)=>{
  const {email , password} = payload;

  const response = await api.post('/login' ,{
    email,
    password
  })
  console.log(response.data);
  return response.data;
}

export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};