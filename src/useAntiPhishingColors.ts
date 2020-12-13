export function useLocalStorage<T>(k: string, getDefault: () => T): T {
  const oldValue = localStorage.getItem(k);
  if (oldValue !== null) {
    return JSON.parse(oldValue);
  }
  const newValue = getDefault();
  localStorage.setItem(k, JSON.stringify(newValue));
  return newValue;
}

export const useAntiPhishingColors = () => {
  const colors = useLocalStorage("anti-phishing-hsl", () => {
    const hue = ~~(360 * Math.random());
    const oppositeHue = (hue + 180) % 360;
    const lightness = hue < 180 ? 70 : 30;
    return [
      `hsl(${hue}, 100%, ${lightness}%)`,
      `hsl(${oppositeHue}, 100%, ${100 - lightness}%)`,
    ];
  });

  return colors;
};
