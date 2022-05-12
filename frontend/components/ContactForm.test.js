import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';
import App from '../App.js'

test('renders without errors', () => {
    render(<App/>)
});

test('renders the contact form header', () => {
    render(<App/>)
    const title = screen.getByText(/contact form/i)
    expect(title).toBeInTheDocument()
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<App/>)
    const firstNameError = screen.getByPlaceholderText('Edd')
    userEvent.type(firstNameError, ' ')
    expect(screen.getByText(/firstName must have at least 5 characters./i)).toBeInTheDocument()
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    const page = render(<App/>)
    const submitButton = page.getByText('Submit')
    userEvent.click(submitButton)
    expect(screen.getByText(/firstName must have at least 5 characters./i)).toBeInTheDocument()
    expect(screen.getByText(/lastName is a required field./i)).toBeInTheDocument()
    expect(screen.getByText(/email must be a valid email address./i)).toBeInTheDocument()
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<App/>)
    const firstNameError = screen.getByPlaceholderText('Edd')
    const lastNameError = screen.getByPlaceholderText('Burke')
    const emailError = screen.getByPlaceholderText('bluebill1049@hotmail.com')
    userEvent.type(firstNameError, 'Eric')
    userEvent.type(lastNameError, 'Peng')
    userEvent.type(emailError, ' ')
    expect(screen.getByText(/email must be a valid email address./i)).toBeInTheDocument()
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<App/>)
    const emailError = screen.getByPlaceholderText('bluebill1049@hotmail.com')
    userEvent.type(emailError, '123456')
    expect(screen.getByText(/email must be a valid email address./i))
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<App/>)
    const lastNameError = screen.getByPlaceholderText('Burke')
    const submitButton = screen.getByText('Submit')
    userEvent.type(lastNameError, ' ')
    userEvent.type(lastNameError, '{backspace}')
    userEvent.click(submitButton)
    expect(screen.getByText(/lastName is a required field./i))
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    const page = render(<App/>)
    const firstNameError = page.getByPlaceholderText('Edd')
    const lastNameError = page.getByPlaceholderText('Burke')
    const emailError = page.getByPlaceholderText('bluebill1049@hotmail.com')
    const submitButton = page.getByText('Submit')

    userEvent.type(firstNameError, 'Erics')
    userEvent.type(lastNameError, 'Pengs')
    userEvent.type(emailError, '12345@gmail.com')
    userEvent.click(submitButton)

    const firstNameDisplay = page.getByTestId('firstnameDisplay')
    const lastNameDisplay = page.getByTestId('lastnameDisplay')
    const emailDisplay = page.getByTestId('emailDisplay')

    expect(firstNameDisplay.textContent).toBe('First Name: Erics')
    expect(lastNameDisplay.textContent).toBe('Last Name: Pengs')
    expect(emailDisplay.textContent).toBe('Email: 12345@gmail.com')
    expect(page.queryByText('Message: ')).toBeNull()

});

test('renders all fields text when all fields are submitted.', async () => {
    const page = render(<App/>)
    const firstNameError = page.getByLabelText('First Name*')
    const lastNameError = page.getByLabelText('Last Name*')
    const emailError = page.getByLabelText('Email*')
    const messageError = page.getByLabelText('Message')
    const submitButton = page.getByText('Submit')

    userEvent.type(firstNameError, 'Erics')
    userEvent.type(lastNameError, 'Pengs')
    userEvent.type(emailError, '12345@gmail.com')
    userEvent.type(messageError, 'Message')
    userEvent.click(submitButton)

    const firstNameDisplay = page.getByTestId('firstnameDisplay')
    const lastNameDisplay = page.getByTestId('lastnameDisplay')
    const emailDisplay = page.getByTestId('emailDisplay')
    const messageDisplay = page.getByTestId('messageDisplay')

    expect(firstNameDisplay.textContent).toBe('First Name: Erics')
    expect(lastNameDisplay.textContent).toBe('Last Name: Pengs')
    expect(emailDisplay.textContent).toBe('Email: 12345@gmail.com')
    expect(messageDisplay.textContent).toBe('Message: Message')
});
