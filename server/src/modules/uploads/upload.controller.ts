import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { UploadService } from "./upload.service";

// Use memory storage so file.buffer is always present (multer is a dependency of @nestjs/platform-express)
const memoryStorage = require("multer").memoryStorage();

/** File shape from Multer memory storage. */
interface MulterFile {
  fieldname: string;
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

const ALLOWED_MIMES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

@ApiTags("uploads")
@Controller("uploads")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        if (!file) {
          cb(new Error("No file in request"), false);
          return;
        }
        if (!ALLOWED_MIMES.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              `Invalid file type: ${file.mimetype}. Use JPEG, PNG, GIF, or WebP.`,
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Image file (logo)",
        },
      },
    },
  })
  async uploadImage(
    @UploadedFile() file: MulterFile | undefined,
  ): Promise<{ url: string; publicId?: string }> {
    if (!file) {
      throw new BadRequestException(
        "No file uploaded. Send as multipart/form-data with field name: file",
      );
    }
    if (!file.buffer || !(file.buffer instanceof Buffer)) {
      throw new BadRequestException(
        "File data not received. Try a smaller image or different format.",
      );
    }
    this.uploadService.validateImageFile(file.mimetype, file.size);
    const result = await this.uploadService.uploadImage(file.buffer);
    return { url: result.url, publicId: result.publicId };
  }
}
