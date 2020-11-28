export const formFields = [
  { label: 'שם משתמש', name: 'username' },
  { label: 'סיסמה', name: 'password' },
  { label: 'שם פרטי', name: 'firstName' },
  { label: 'שם משפחה', name: 'lastName' },
  { label: 'תפקיד', name: 'role' },
  { label: 'ארגון', name: 'organization' },
];

export const formSelectionFields = [
  {
    label: 'הרשאות',
    name: 'permissions',
    placeholder: 'בחר הרשאה',
    options: [{ value: 'מנהל' }, { value: 'צופה' }, { value: 'עורך' }],
  },
];
