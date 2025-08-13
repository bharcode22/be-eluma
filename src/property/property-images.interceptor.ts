import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function PropertyImagesInterceptor() {
    return FilesInterceptor('images', 10, {
        storage: diskStorage({
            destination: './propertyImages',
            filename: (req: any, file: any, cb: any) => {
                const randomName = Math.random().toString(36).substring(2, 14);
                const filename = `property-${randomName}${extname(file.originalname)}`;
                cb(null, filename);
            },
        }),
    });
}
