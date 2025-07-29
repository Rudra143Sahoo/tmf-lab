import express, { Response } from 'express';
import { Note } from '../models/Note';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { validateNote, handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all notes for the authenticated user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, tags } = req.query;
    const userId = req.user._id;

    // Build query
    const query: any = { user: userId };

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
      Note.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Note.countDocuments(query),
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
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get a single note by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findOne({ _id: id, user: userId });

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
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Create a new note
router.post('/', validateNote, handleValidationErrors, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.user._id;

    const note = new Note({
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
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Update a note
router.put('/:id', validateNote, handleValidationErrors, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const userId = req.user._id;

    const note = await Note.findOneAndUpdate(
      { _id: id, user: userId },
      { title, content, tags: tags || [] },
      { new: true, runValidators: true }
    );

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
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Delete a note
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findOneAndDelete({ _id: id, user: userId });

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
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get user's note statistics
router.get('/stats/overview', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const [totalNotes, recentNotes, tagStats] = await Promise.all([
      Note.countDocuments({ user: userId }),
      Note.countDocuments({
        user: userId,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
      }),
      Note.aggregate([
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
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;