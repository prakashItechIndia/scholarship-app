export const maskEmail = (email: string): string => {
  return email.replace(/(.{2})(.*)(@.*)/, (_: string, start: string, middle: string, end: string) => {
    const middleLength = typeof middle === 'string' ? middle.length : 0;
    return `${start}${'*'.repeat(Math.min(middleLength, 5))}${end}`;
  });
};

export const getBaseUrl = (): string => {
  return typeof window !== 'undefined' ? window.location.origin : 'https://scholarship.icaptur.ai';
};

export const createResendTimer = (
  setCooldown: (value: number | ((prev: number) => number)) => void
): ReturnType<typeof setInterval> => {
  return setInterval(() => {
    setCooldown((prev) => {
      if (prev <= 1) {
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};

