const validateUser = (user) => {
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}$/;

    if (!user.username || user.username.length < 3) {
        const error = new Error('Username must be at least 3 characters long');
        error.statusCode = 400;
        throw error;
    } else if (!user.email || !emailRegex.test(user.email)) {
        const error = new Error('Invalid email');
        error.statusCode = 400;
        throw error;
    } else if (!user.password || !passwordRegex.test(user.password)) {
        const error = new Error('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one sepcial character and one number.');
        error.statusCode = 400;
        throw error;
    }
    return true;
}

const validateNote = (note) => {
    if (!note.title || note.title.length < 2) {
        const error = new Error('Note title must be at least 2 characters long');
        error.statusCode = 400;
        throw error;
    } else if (!note.content || note.content.length < 5) {
        const error = new Error('Note content must be at least 5 characters long');
        error.statusCode = 400;
        throw error;
    }
    return true;
}

const validateLabel = (label) => {
    if (!label.name || label.name.trim().length < 1) {
        const error = new Error('Label name must be at least 1 character long');
        error.statusCode = 400;
        throw error;
    }
    return true;
}

module.exports = { validateUser, validateNote, validateLabel };