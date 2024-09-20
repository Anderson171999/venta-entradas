// src/components/EventoList.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import EventoList from './EventoList';
import '@testing-library/jest-dom/extend-expect';

test('renders EventoList component', () => {
  render(
    <Provider store={store}>
      <EventoList />
    </Provider>
  );

  expect(screen.getByText(/Eventos/i)).toBeInTheDocument();
});
