// authService.js
export const authenticateUser = (enteredUsername, enteredPassword, hardcodedUsername, hardcodedPassword, navigate) => {
  // Check if credentials match
  if (enteredUsername === hardcodedUsername && enteredPassword === hardcodedPassword) {
    // Redirect based on the username
    if (enteredUsername === 'admin') {
      navigate('/admin-dashboard');
    } else if (enteredUsername === 'user') {
      navigate('/user-dashboard');
    } else {
      navigate('/default-dashboard');
    }
    return true;
  } else {
    return false;
  }
};
