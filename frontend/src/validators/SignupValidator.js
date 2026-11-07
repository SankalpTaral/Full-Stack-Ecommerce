
import validator from "validator";

export  function validateName(name){

    console.log("Yoo runnning the function!");
    console.log("Name inside function  " , name );

    const username = name.trim();

    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

if(username.length === 0){
    return "Please Enter your name , name field is required "
}

if(  username.length < 3){
 return "Name length should be greater "
}

if(!nameRegex.test(username)){
 return "Name should contain only letters with single spaces between words";
}


return null; // if every check passes then return this 











}



export function validateEmail(email) {
  const userEmail = email.trim();

  if (userEmail.length === 0) {
    return "Email is required";
  }

  if (!validator.isEmail(userEmail)) {
    return "Please enter a valid email address";
  }

  return null;
}


export function validatePassword(password){


    if (password.length === 0) {
    return "Password is required";
  }

    
    if(password.length < 4){
        return "Password length should be greater than 4" ; 
    }

    
      if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return null;

}