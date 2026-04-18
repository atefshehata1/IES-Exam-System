// src/utils/navigation.js
export const getRoleBasedRoute = (user) => {
  if (!user || !user.role) {
    return "/";
  }

  switch (user.role.toLowerCase()) {
    case "teacher":
    case "instructor":
      return "/dashboard";
    case "student":
      return "/student-dashboard";
    default:
      return "/";
  }
};

export const navigateBasedOnRole = (user, navigate) => {
  const route = getRoleBasedRoute(user);
  navigate(route);
};
