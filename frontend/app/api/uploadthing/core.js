import { createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  }).middleware(async () => {
    return { uploadedBy: 'user' };
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),

  projectCoverUploader: f({
    image: { maxFileSize: '8MB', maxFileCount: 1 },
  }).middleware(async () => {
    return { uploadedBy: 'project' };
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),

  taskAttachmentUploader: f({
    image: { maxFileSize: '8MB', maxFileCount: 1 },
    pdf: { maxFileSize: '16MB', maxFileCount: 1 },
  }).middleware(async () => {
    return { uploadedBy: 'task' };
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),
};
