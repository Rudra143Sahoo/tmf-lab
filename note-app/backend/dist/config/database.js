"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-app';
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ Connected to MongoDB successfully');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
// Handle connection events
mongoose_1.default.connection.on('disconnected', () => {
    console.log('❌ MongoDB disconnected');
});
mongoose_1.default.connection.on('error', (error) => {
    console.error('❌ MongoDB error:', error);
});
exports.default = connectDatabase;
//# sourceMappingURL=database.js.map