"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Note_1 = require("../models/Note");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Get all notes for the authenticated user
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, tags } = req.query;
        const userId = req.user._id;
        // Build query
        const query = { user: userId };
        // Add search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }
        // Add tags filter
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : [tags];
            query.tags = { $in: tagArray };
        }
        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);
        // Execute query with pagination
        const [notes, total] = await Promise.all([
            Note_1.Note.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Note_1.Note.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / Number(limit));
        res.json({
            success: true,
            data: {
                notes,
                pagination: {
                    currentPage: Number(page),
                    totalPages,
                    totalNotes: total,
                    hasNextPage: Number(page) < totalPages,
                    hasPrevPage: Number(page) > 1,
                },
            },
        });
    }
    catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Get a single note by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const note = await Note_1.Note.findOne({ _id: id, user: userId });
        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found',
            });
        }
        res.json({
            success: true,
            data: { note },
        });
    }
    catch (error) {
        console.error('Get note error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Create a new note
router.post('/', validation_1.validateNote, validation_1.handleValidationErrors, async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const userId = req.user._id;
        const note = new Note_1.Note({
            title,
            content,
            tags: tags || [],
            user: userId,
        });
        await note.save();
        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            data: { note },
        });
    }
    catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Update a note
router.put('/:id', validation_1.validateNote, validation_1.handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags } = req.body;
        const userId = req.user._id;
        const note = await Note_1.Note.findOneAndUpdate({ _id: id, user: userId }, { title, content, tags: tags || [] }, { new: true, runValidators: true });
        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found',
            });
        }
        res.json({
            success: true,
            message: 'Note updated successfully',
            data: { note },
        });
    }
    catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Delete a note
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const note = await Note_1.Note.findOneAndDelete({ _id: id, user: userId });
        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found',
            });
        }
        res.json({
            success: true,
            message: 'Note deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Get user's note statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const userId = req.user._id;
        const [totalNotes, recentNotes, tagStats] = await Promise.all([
            Note_1.Note.countDocuments({ user: userId }),
            Note_1.Note.countDocuments({
                user: userId,
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
            }),
            Note_1.Note.aggregate([
                { $match: { user: userId } },
                { $unwind: '$tags' },
                { $group: { _id: '$tags', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ]),
        ]);
        res.json({
            success: true,
            data: {
                totalNotes,
                recentNotes,
                popularTags: tagStats,
            },
        });
    }
    catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=notes.js.map