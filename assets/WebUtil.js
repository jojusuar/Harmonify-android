if (!sessionStorage.getItem('reloaded')) {
    sessionStorage.setItem('reloaded', 'true');
    window.location.reload(true);
} else {
    sessionStorage.removeItem('reloaded');
}