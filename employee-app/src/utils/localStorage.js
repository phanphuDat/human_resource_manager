export const addUserToLocalStorage = (user) => {
    localStorage.setItem('authToken', JSON.stringify(user));
  };
  
  export const removeUserFromLocalStorage = () => {
    localStorage.removeItem("authToken");
  };
  
  export const getUserFromLocalStorage = () => {
    const result = localStorage.getItem('authToken');
    const user = result ? JSON.parse(result) : null;
    return user;
  };
  

  export const getTodoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('notification')) || [];
}