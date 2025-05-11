const User = require('../models/userModel');

exports.getUserProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            name: user.name,
            email: user.email,
            favoriteGenres: user.favoriteGenres,
            readingPreferences: user.readingPreferences,
            booksOwned: user.booksOwned,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.editUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { name, email, favoriteGenres, readingPreferences } = req.body;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (favoriteGenres) user.favoriteGenres = favoriteGenres;
        if (readingPreferences) user.readingPreferences = readingPreferences;

        await user.save();

        res.json({
            message: 'User profile updated successfully',
            user: { name: user.name, email: user.email, favoriteGenres: user.favoriteGenres, readingPreferences: user.readingPreferences },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
