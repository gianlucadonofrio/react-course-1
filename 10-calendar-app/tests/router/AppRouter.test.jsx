import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CalendarPage } from '../../src/calendar';
import { useAuthStore } from '../../src/hooks';
import { AppRouter } from '../../src/router/AppRouter';

jest.mock('../../src/hooks/useAuthStore');

jest.mock('../../src/calendar', () => {
  return {
    CalendarPage: () => <h1>CalendarPage</h1>,
  };
});
describe('Pruebas en AppRouter', () => {
  const mockCheckAuthToken = jest.fn();
  beforeEach(() => jest.clearAllMocks());

  test('debe de mostrar la pantalla de carga y llamar checkAuthToken', () => {
    useAuthStore.mockReturnValue({
      status: 'checking',
      checkAuthToken: mockCheckAuthToken,
    });

    render(<AppRouter />);
    expect(screen.getByText('Cargando...')).toBeTruthy();
    expect(mockCheckAuthToken).toHaveBeenCalled();
  });

  test('debe de mostrar la pantalla de login si no está autenticado', () => {
    useAuthStore.mockReturnValue({
      status: 'not-authenticated',
      checkAuthToken: mockCheckAuthToken,
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('Ingreso')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  test('debe de mostrar el calendario si estamos autenticados', () => {
    useAuthStore.mockReturnValue({
      status: 'authenticated',
      checkAuthToken: mockCheckAuthToken,
    });

    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText('CalendarPage')).toBeTruthy();
  });
});
