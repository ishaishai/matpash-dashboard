export const formFields = [
  { label: 'שם משתמש', name: 'username' },
  { label: 'סיסמה', name: 'password' },
  { label: 'שם פרטי', name: 'firstName' },
  { label: 'שם משפחה', name: 'lastName' },
  { label: 'ת.ז', name: 'id' },
  { label: 'תפקיד', name: 'role'},
];

export const formSelectionFields = [
  {
    label: 'ארגון',
    name: 'organization',
    placeholder: 'בחר ארגון',
    options: [
      { value: 'מת"ק עזה' },
      { value: 'מנהא"ז' },
      { value: 'מטה' },
      { value: 'אחר' },
    ],
  },
  {
    label: 'הרשאות',
    name: 'permissions',
    placeholder: 'בחר הרשאה',
    options: [{ value: 'אדמין' }, { value: 'צופה' }, { value: 'עורך' }],
  },
];
