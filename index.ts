#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';

// Bank Account class
class BankAccount {
    accountNumber: number;
    balance: number;

    constructor(accountNumber: number, balance: number) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    // debit money
    withdraw(amount: number): void {
        if (this.balance >= amount) {
            this.balance -= amount;
            console.log(chalk.green(`Withdrawal of $${amount} successful. Remaining balance: $${this.balance}`));
        } else {
            console.log(chalk.red('Insufficient Balance.'));
        }
    }

    // credit money
    deposit(amount: number): void {
        if (amount > 100) {
            amount -= 1;  // $1 fee charged if more than $100 is deposited
        }
        this.balance += amount;
        console.log(chalk.green(`Deposit of $${amount} successful. Remaining balance: $${this.balance}`));
    }

    // check balance
    checkBalance(): void {
        console.log(chalk.blue(`Current Balance: $${this.balance}`));
    }
}

// Customer class
class Customer {
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    mobileNumber: number;
    account: BankAccount;

    constructor(
        firstName: string,
        lastName: string,
        gender: string,
        age: number,
        mobileNumber: number,
        account: BankAccount
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
        this.account = account;
    }
}

// Create bank accounts
const accounts: BankAccount[] = [
    new BankAccount(1001, 500),
    new BankAccount(1002, 1000),
    new BankAccount(1003, 2000)
];

// Create customers
const customers: Customer[] = [
    new Customer('Hamza', 'Khan', 'Male', 35, 1234567891, accounts[0]),
    new Customer('Aiman', 'Khan', 'Female', 25, 1334567891, accounts[1]),
    new Customer('Minal', 'Khan', 'Female', 24, 1434567891, accounts[2])
];

// Function to interact with bank account
async function service() {
    do {
        const accountNumberInput = await inquirer.prompt([
            {
                name: 'accountNumber',
                type: 'input',
                message: 'Enter your account number:',
                validate: (input) => !isNaN(Number(input)) || 'Please enter a valid number'
            }
        ]);

        const accountNumber = Number(accountNumberInput.accountNumber);
        const customer = customers.find(customer => customer.account.accountNumber === accountNumber);

        if (customer) {
            console.log(chalk.cyan(`Welcome, ${customer.firstName} ${customer.lastName}`));
            const answer = await inquirer.prompt([
                {
                    name: 'select',
                    type: 'list',
                    message: 'Select an operation',
                    choices: ['Deposit', 'Withdraw', 'Check Balance', 'Exit']
                }
            ]);

            switch (answer.select) {
                case 'Deposit':
                    const depositAmount = await inquirer.prompt([
                        {
                            name: 'amount',
                            type: 'number',
                            message: 'Enter the amount to deposit:'
                        }
                    ]);
                    customer.account.deposit(depositAmount.amount);
                    break;
                case 'Withdraw':
                    const withdrawAmount = await inquirer.prompt([
                        {
                            name: 'amount',
                            type: 'number',
                            message: 'Enter the amount to withdraw:'
                        }
                    ]);
                    customer.account.withdraw(withdrawAmount.amount);
                    break;
                case 'Check Balance':
                    customer.account.checkBalance();
                    break;
                case 'Exit':
                    console.log(chalk.yellow('Exiting Bank program'));
                    console.log(chalk.magenta("Thank you for using our bank service! Goodbye!"));
                    return;
            }
        } else {
            console.log(chalk.red('Invalid account number. Please try again.'));
        }
    } while (true);
}

service();
