function getFavorites() {
    return JSON.parse(localStorage.getItem('favoritePrompts') || '[]');
}

function isFavorite(row) {
    const favorites = getFavorites();
    return favorites.includes(row.act);
}

function toggleFavorite(row) {
    let favorites = getFavorites();
    if (favorites.includes(row.act)) {
        favorites = favorites.filter(act => act !== row.act);
    } else {
        favorites.push(row.act);
    }
    localStorage.setItem('favoritePrompts', JSON.stringify(favorites));
}