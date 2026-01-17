import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

export function PropertyImagesInterceptor() {
    return FilesInterceptor('images', 10, {
        storage: diskStorage({
            destination: (req: any, file: any, cb: any) => {

                const preferredUploadPath = 'propertyImages';
                const fallbackUploadPath = '/tmp/propertyImages';

                const ensureDir = (dir: string) => {
                    if (!existsSync(dir)) {
                        mkdirSync(dir, { recursive: true });
                    }
                };

                try {
                    ensureDir(preferredUploadPath);
                    cb(null, preferredUploadPath);
                } catch (err: any) {
                    if (err?.code === 'EROFS' || err?.code === 'EACCES') {
                        ensureDir(fallbackUploadPath);
                        cb(null, fallbackUploadPath);
                        return;
                    }
                    throw err;
                }
            },

            filename: (req, file, cb) => {
                const randomName = Math.random().toString(36).substring(2, 14);
                cb(null, `property-${randomName}${extname(file.originalname)}`);
            },
        }),
    });
}
