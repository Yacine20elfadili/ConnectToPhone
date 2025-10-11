const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;

const STORAGE_ROOT = path.resolve(__dirname, '..', '..');

app.use(cors());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_ROOT)) {
    fs.mkdirSync(STORAGE_ROOT);
}

// Helper function to get MIME type based on file extension
const getMimeType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        // Images
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.ico': 'image/x-icon',
        '.tiff': 'image/tiff',
        '.tif': 'image/tiff',

        // Videos
        '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo',
        '.mov': 'video/quicktime',
        '.wmv': 'video/x-ms-wmv',
        '.flv': 'video/x-flv',
        '.webm': 'video/webm',
        '.mkv': 'video/x-matroska',
        '.m4v': 'video/mp4',
        '.3gp': 'video/3gpp',
        '.ogv': 'video/ogg',

        // Default
        default: 'application/octet-stream'
    };

    return mimeTypes[ext] || mimeTypes.default;
};

// API to browse files and directories
app.get('/api/browse', (req, res) => {
    const relativePath = req.query.path || '';

    // Security: Prevent directory traversal
    const absolutePath = path.resolve(path.join(STORAGE_ROOT, relativePath));
    if (!absolutePath.startsWith(STORAGE_ROOT)) {
        return res.status(400).json({ error: 'Access denied.' });
    }

    fs.readdir(absolutePath, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read directory.' });
        }

        const fileData = files.map(file => ({
            name: file.name,
            isDirectory: file.isDirectory(),
        }));

        res.json(fileData);
    });
});

// API to download a specific file or serve media files with Range support
app.get('/api/download', (req, res) => {
    const relativePath = req.query.path || '';

    if (!relativePath) {
        return res.status(400).json({ error: 'File path is required.' });
    }

    // Security: Prevent directory traversal
    const absolutePath = path.resolve(path.join(STORAGE_ROOT, relativePath));
    if (!absolutePath.startsWith(STORAGE_ROOT)) {
        return res.status(400).json({ error: 'Access denied.' });
    }

    fs.stat(absolutePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).json({ error: 'File not found or is a directory.' });
        }

        const fileSize = stats.size;
        const range = req.headers.range;

        if (range) {
            // Parse range
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = (end - start) + 1;

            const file = fs.createReadStream(absolutePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': getMimeType(path.basename(absolutePath)),
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': getMimeType(path.basename(absolutePath)),
            };
            res.writeHead(200, head);
            fs.createReadStream(absolutePath).pipe(res);
        }
    });
});

// API to view content of a text file
app.get('/api/view-text-file', (req, res) => {
    const relativePath = req.query.path || '';

    if (!relativePath) {
        return res.status(400).json({ error: 'File path is required.' });
    }

    // Security: Prevent directory traversal
    const absolutePath = path.resolve(path.join(STORAGE_ROOT, relativePath));
    if (!absolutePath.startsWith(STORAGE_ROOT)) {
        return res.status(400).json({ error: 'Access denied.' });
    }

    fs.stat(absolutePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).json({ error: 'File not found or is a directory.' });
        }

        // Read file as UTF-8 text
        fs.readFile(absolutePath, 'utf8', (readErr, data) => {
            if (readErr) {
                console.error(readErr);
                return res.status(500).json({ error: 'Failed to read file.' });
            }
            res.type('text/plain').send(data);
        });
    });
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
