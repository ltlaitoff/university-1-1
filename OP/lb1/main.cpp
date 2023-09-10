#include <math.h>
#include <iostream>

/*
  1) знайти площу рівнобічної трапеції з більшою основою a,
  боковою стороною b та кутом φ між основою а і боковою стороною b,
  які задані користувачем з клавіатури;
*/
double getTrapezeArea(int a, int b, int fi) {
  double finRadian = fi * M_PI / 180;

  return b * sin(finRadian) * (a - b * cos(finRadian));
}

/*
  2) обчислити значення функції f (x) для заданого користувачем
  дійсного числа а, якщо
  0, якщо x <= 0
  x^2 - x, якщо 0 < x <= 1
  x^2 - sin(pi) * x^2, інакше
*/
double getSecondFunctionValue(double x) {
  if (x <= 0) {
    return 0;
  }

  if (x <= 1) {
    return pow(x, 2) - x;
  }

  return pow(x, 2) - sin(M_PI) * pow(x, 2);
}

/*
  в) перевірити, чи є трикутник прямокутним за введеними
  довжинами його сторін;
*/
bool checkTriangle(double a, double b, double c) {
  if (std::max(c, std::max(a, b)) == c) {
    return pow(a, 2) + pow(b, 2) == pow(c, 2);
  }

  return checkTriangle(c, a, b);
}

/*
  г) обчислити для заданого користувачем значення цілого числа x
  значення виразу
  M = a / b;
  a = sqrt((7 + 0,5x)^5 + ln(x))
  b = e^0 + arcsin(6 * x^2)
*/
double getFourFunctionValue(int x) {
  double top = sqrt(pow((7 + 0.5 * x), 5) + log(x));
  double bottom = exp(0) + asin(6 * pow(x, 2));

  std::cout << top << " | " << bottom << std::endl;

  return top / bottom;
}

void printFistTask(int a, int b, int fi) {
  std::cout << "a = " << a << "; b = " << b << "; fi(degree) = " << fi
            << "; result = " << getTrapezeArea(a, b, fi) << std::endl;
}

void printSecond(double x) {
  std::cout << "x = " << x << "; result = " << getSecondFunctionValue(x)
            << std::endl;
}

void printThird(double a, double b, double c) {
  std::string result = checkTriangle(a, b, c) ? "True" : "False";

  std::cout << "a = " << a << "; b = " << b << "; c = " << c
            << "; result = " << result << std::endl;
}

void printFour(int x) {
  std::cout << "x = " << x << "; result = " << getFourFunctionValue(x)
            << std::endl;
}

int main() {
  std::cout << "Task 1:" << std::endl;
  printFistTask(10, 5, 60);
  printFistTask(7, 8, 75);
  printFistTask(25, 7, 25);

  std::cout << std::endl;
  std::cout << "Task 2:" << std::endl;
  printSecond(-1);
  printSecond(0.5);
  printSecond(0.75);
  printSecond(1);
  printSecond(4);

  std::cout << std::endl;
  std::cout << "Task 3:" << std::endl;
  printThird(2, 5, 7);
  printThird(3, 4, 5);
  printThird(5, 4, 3);

  std::cout << std::endl;
  std::cout << "Task 4:" << std::endl;
  printFour(1);
  printFour(6);
  printFour(12);

  return 0;
}
