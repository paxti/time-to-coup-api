function generateRandomNumber(limit) {
  return Math.floor(Math.random() * (limit - 1));
}

function twoRundomNumbers() {
  let firstNumber = generateRandomNumber(10);
  let secondNumber = generateRandomNumber(10);
  while (firstNumber === secondNumber) {
    firstNumber = generateRandomNumber(10);
    secondNumber = generateRandomNumber(10);
  }

  return [firstNumber, secondNumber];
}

export default function generateRandom() {
  return [
    generateRandomNumber(5) + 0,
    generateRandomNumber(5) + 5,
    generateRandomNumber(5) + 10,
    ...twoRundomNumbers().map((number) => number + 15)
  ];
}
