// server/models/project.js
import mongoose from 'mongoose';

const projectSchema = mongoose.Schema(
    {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    projectName: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    voiceSettings: {
        type: Object,
        default: {},
    },
    audioFileUrl: {
        type: String,
    },
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;