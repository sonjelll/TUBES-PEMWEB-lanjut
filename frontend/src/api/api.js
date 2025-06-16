const API_BASE_URL = process.env.REACT_APP_API_URL;

export const addRecipeApi = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getAllRecipesApi = async () => {
    const response = await fetch(`${API_BASE_URL}/recipes`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getPopularRecipesApi = async () => {
    const response = await fetch(`${API_BASE_URL}/recipes/popular`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getRecipesByCategoryApi = async (category) => {
    const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/recipes/category/</span>{category}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getUserRecipesApi = async (userId) => {
    const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/recipes/mine/</span>{userId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};