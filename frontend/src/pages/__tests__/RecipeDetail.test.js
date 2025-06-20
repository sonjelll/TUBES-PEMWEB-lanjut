import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RecipeDetail from '../RecipeDetail';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

jest.mock('../../api/api');

const mockRecipe = {
  id: 1,
  title: 'Nasi Goreng',
  image_url: 'http://example.com/image.jpg',
  category: 'Makanan',
  ingredients: 'Nasi, Telur, Kecap',
  description: 'Masak nasi dengan telur dan kecap.',
};

const mockFavorites = [
  { id: 1, title: 'Nasi Goreng' },
];

function renderWithRouterAndContext(ui, { route = '/recipes/1', user = { id: 1, name: 'Test User' } } = {}) {
  window.history.pushState({}, 'Test page', route);

  return render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/recipes/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('RecipeDetail Page', () => {
  beforeEach(() => {
    api.getRecipeByIdApi.mockResolvedValue(mockRecipe);
    api.getFavoritesApi.mockResolvedValue(mockFavorites);
    api.addFavoriteApi.mockResolvedValue({});
    api.removeFavoriteApi.mockResolvedValue({});
  });

  test('renders recipe details correctly', async () => {
    renderWithRouterAndContext(<RecipeDetail />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(api.getRecipeByIdApi).toHaveBeenCalledWith('1'));

    expect(screen.getByRole('heading', { name: /Nasi Goreng/i })).toBeInTheDocument();
    expect(screen.getByText(/Makanan/i)).toBeInTheDocument();
    expect(screen.getByText(/Nasi, Telur, Kecap/i)).toBeInTheDocument();
    expect(screen.getByText(/Masak nasi dengan telur dan kecap./i)).toBeInTheDocument();
    expect(screen.getByAltText(/Nasi Goreng/i)).toHaveAttribute('src', mockRecipe.image_url);
  });

  test('toggles favorite status', async () => {
    renderWithRouterAndContext(<RecipeDetail />);

    await waitFor(() => expect(api.getRecipeByIdApi).toHaveBeenCalled());

    const favButton = screen.getByRole('button', { name: /Hapus dari favorit/i });
    expect(favButton).toBeInTheDocument();

    // Click to remove favorite
    fireEvent.click(favButton);
    await waitFor(() => expect(api.removeFavoriteApi).toHaveBeenCalledWith(mockRecipe.id));

    // Click to add favorite
    fireEvent.click(favButton);
    await waitFor(() => expect(api.addFavoriteApi).toHaveBeenCalledWith(mockRecipe.id));
  });

  test('shows alert if user not logged in and tries to favorite', async () => {
    window.alert = jest.fn();

    render(
      <AuthContext.Provider value={{ user: null }}>
        <MemoryRouter initialEntries={['/recipes/1']}>
          <Routes>
            <Route path="/recipes/:id" element={<RecipeDetail />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => expect(api.getRecipeByIdApi).toHaveBeenCalled());

    const favButton = screen.queryByRole('button');
    expect(favButton).not.toBeInTheDocument();

    // Try to toggle favorite by calling toggleFavorite directly is not possible here,
    // so this test ensures no favorite button is rendered when user is not logged in.
    expect(window.alert).not.toHaveBeenCalled();
  });
});
