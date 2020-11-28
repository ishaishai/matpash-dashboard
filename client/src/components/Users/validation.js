export default ({
  username,
  firstName,
  lastName,
  password,
  organization,
  role,
  permissions,
}) => {
  const errors = {};
  if (!username) {
    errors.username = 'שדה חובה';
  } else if (username.length < 5) {
    errors.username = 'חייב להכיל לפחות 5 תווים';
  }
  if (!password) {
    errors.password = 'שדה חובה';
  } else if (password.length < 6) {
    errors.password = 'חייב להכיל לפחות 6 תווים';
  }
  if (!firstName) {
    errors.firstName = 'שדה חובה';
  } else if (firstName.length < 2) {
    errors.firstName = 'חייב להכיל לפחות 2 תווים';
  }
  if (!lastName) {
    errors.lastName = 'שדה חובה';
  } else if (lastName.length < 2) {
    errors.lastName = 'חייב להכיל לפחות 2 תווים';
  }
  if (!role) {
    errors.role = 'שדה חובה';
  } else if (role.length < 2) {
    errors.role = 'חייב להכיל לפחות 2 תווים';
  }

  if (!organization) {
    errors.organization = 'שדה חובה';
  } else if (organization.length < 2) {
    errors.organization = 'חייב להכיל לפחות 2 תווים';
  }

  if (!permissions || permissions === 'בחר הרשאה') {
    errors.permissions = 'בחר הרשאה';
  }

  return errors;
};
