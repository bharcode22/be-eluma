import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export function PropertyImagesInterceptor() {
    return FilesInterceptor('images', 10, {
        storage: diskStorage({
            destination: (req, file, cb) => {
                // Gunakan /tmp di Vercel, atau folder lokal di development
                const uploadPath = process.env.NODE_ENV === 'production'
                    ? '/tmp'
                    : './propertyImages';

                if (!existsSync(uploadPath)) {
                    mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req: any, file: any, cb: any) => {
                const randomName = Math.random().toString(36).substring(2, 14);
                const filename = `property-${randomName}${extname(file.originalname)}`;
                cb(null, filename);
            },
        }),
    });
}
