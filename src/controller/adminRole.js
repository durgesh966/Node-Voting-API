const User = require('../../database/models/user');

const checkIsAdmin = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (user && user.role === 'admin') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking admin role:', error);
        return false;
    }
};

module.exports = checkIsAdmin;


