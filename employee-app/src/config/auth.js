const authToken = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : "";
const token = authToken.token;
module.exports = {
  BEARER_TOKEN: { headers: { 'Authorization': `Bearer ${token}` } },
  DEPARTMENT_ID: authToken?.payload?.departmentId,
  AVATAR_URL: authToken?.payload?.avatarUrl,
  USER_ID: authToken?.payload?.uid,
  ROLE: authToken?.payload?.role,
  FULLNAME: authToken?.payload?.fullname
};