import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

export function PropertyImagesInterceptor() {
    return FilesInterceptor('images', 10, {
        storage: diskStorage({
            destination: (req: any, file: any, cb: any) => {

                const isVercel = !!process.env.VERCEL;

                const uploadPath = isVercel
                    ? '/tmp/propertyImages'
                    : 'propertyImages';

                if (!existsSync(uploadPath)) {
                    mkdirSync(uploadPath, { recursive: true });
                }

                cb(null, uploadPath);
            },

            filename: (req, file, cb) => {
                const randomName = Math.random().toString(36).substring(2, 14);
                cb(null, `property-${randomName}${extname(file.originalname)}`);
            },
        }),
    });
}
