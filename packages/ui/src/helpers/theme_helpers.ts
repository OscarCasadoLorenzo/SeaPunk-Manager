export const toggleTheme = () => {
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark');
  return currentTheme === 'dark' ? 'light' : 'dark';
};
