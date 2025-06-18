const API_BASE_URL = process.env.REACT_APP_API_URL;

export const addRecipeApi = async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`
        },
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
    const encodedCategory = encodeURIComponent(category);
    const response = await fetch(`${API_BASE_URL}/recipes/category/${encodedCategory}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getUserRecipesApi = async () => {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage
    const response = await fetch(`${API_BASE_URL}/recipes/mine`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getRecipeByIdApi = async (id) => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const updateRecipeApi = async (id, formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const deleteRecipeApi = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};
