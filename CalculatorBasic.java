// File: CalculatorBasic.java

import java.util.Scanner;

public class CalculatorBasic {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Input
        System.out.print("Enter first number: ");
        double num1 = scanner.nextDouble();

        System.out.print("Enter second number: ");
        double num2 = scanner.nextDouble();

        // Operations
        double sum = num1 + num2;
        double difference = num1 - num2;

        // Output
        System.out.println("Addition result: " + sum);
        System.out.println("Subtraction result: " + difference);

        scanner.close();
    }
}
