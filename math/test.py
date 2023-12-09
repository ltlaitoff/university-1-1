from scipy import integrate
import numpy as np

# Визначте функцію для інтегрування
def f(x):
    return np.cos(((9*x)/4))**2

# Обчисліть інтеграл з заданою точністю
result, error = integrate.quad(f, 0, 1, epsabs=1e-3)

print("Значення інтегралу:", result)
print("Оцінка похибки:", error)
