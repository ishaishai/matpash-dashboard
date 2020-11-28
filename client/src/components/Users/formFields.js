export const formFields = [
  { label: 'שם משתמש', name: 'username' },
  { label: 'סיסמה', name: 'password' },
  { label: 'שם פרטי', name: 'firstName' },
  { label: 'שם משפחה', name: 'lastName' },
  { label: 'ת.ז', name: 'id' },
  { label: 'תפקיד', name: 'role' },
  { label: 'ארגון', name: 'organization' },
];

export const formSelectionFields = [
  {
    label: 'הרשאות',
    name: 'permissions',
    placeholder: 'בחר הרשאה',
    options: [{ value: 'אדמין' }, { value: 'צופה' }, { value: 'עורך' }],
  },
];
