export default (numbers: number[]) => {
  const sum = numbers.reduce((total, num) => total + num, 0);
  return sum / numbers.length;
};
