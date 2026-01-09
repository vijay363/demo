export function chartTheme() {
  const styles = getComputedStyle(document.documentElement);

  return {
    text: styles.getPropertyValue('--text-secondary').trim(),
    grid: styles.getPropertyValue('--border-color').trim(),
    primary: styles.getPropertyValue('--primary').trim(),
  };
}
