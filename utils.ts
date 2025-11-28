export const isBirthdayToday = (dateString: string): boolean => {
  const today = new Date();
  const dob = new Date(dateString);
  // Note: Date parsing can be tricky with timezones, assuming local input YYYY-MM-DD matches local day
  // Better approach involves splitting string to avoid timezone shifts
  const [year, month, day] = dateString.split('-').map(Number);
  
  return today.getDate() === day && (today.getMonth() + 1) === month;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const generateId = () => Math.random().toString(36).substr(2, 9);