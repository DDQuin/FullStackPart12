import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'


describe('rendering todo', () => {
    let mockHandler
    beforeEach(() => {
        mockHandler = jest.fn()
        const todo = {
            text: 'Component testing is done with react-testing-library',
            done: true,
        }
        render(<Todo todo={todo} onClickComplete={mockHandler} onClickDelete={mockHandler} />)
    })
    test('renders content', () => {
        const divTodo = screen.getByTestId('todo')
        expect(divTodo).toHaveTextContent(
            'Component testing is done with react-testing-library'
        )
    })
})

