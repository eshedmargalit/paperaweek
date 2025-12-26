import { Application } from 'express';
import archiver from 'archiver';
import requireLogin from '../middlewares/requireLogin';

/**
 * Sanitize a string for use as a filename.
 * Removes/replaces characters that are problematic in filenames.
 */
function sanitizeFilename(title: string): string {
  return title
    .replace(/[/\\?%*:|"<>]/g, '-') // Replace problematic characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Collapse multiple dashes
    .replace(/^-|-$/g, '') // Trim leading/trailing dashes
    .substring(0, 100); // Limit length
}

module.exports = (app: Application) => {
  app.get('/api/export', requireLogin, async (req, res) => {
    const user = req.user!;

    // Set headers for zip download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="paperaweek-export-${Date.now()}.zip"`);

    // Create zip stream and pipe to response
    const archive = archiver('zip', { zlib: { level: 5 } });

    archive.on('error', (err) => {
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);

    // Add reviews folder
    user.reviews.forEach((review, i) => {
      const filename = sanitizeFilename(review.paper.title) || `review-${i}`;
      archive.append(JSON.stringify(review, null, 2), {
        name: `reviews/${filename}.json`,
      });
    });

    // Add drafts folder
    user.drafts.forEach((draft, i) => {
      const filename = sanitizeFilename(draft.paper.title) || `draft-${i}`;
      archive.append(JSON.stringify(draft, null, 2), {
        name: `drafts/${filename}.json`,
      });
    });

    // Add reading-list folder
    user.readingList.forEach((paper, i) => {
      const filename = sanitizeFilename(paper.title) || `paper-${i}`;
      archive.append(JSON.stringify(paper, null, 2), {
        name: `reading-list/${filename}.json`,
      });
    });

    await archive.finalize();
  });
};
