import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class UploadService {
  constructor(private config: ConfigService) {
    const cloudName = this.config.get<string>("CLOUDINARY_CLOUD_NAME");
    const apiKey = this.config.get<string>("CLOUDINARY_API_KEY");
    const apiSecret = this.config.get<string>("CLOUDINARY_API_SECRET");
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    }
  }

  private readonly allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  private readonly maxSizeBytes = 5 * 1024 * 1024; // 5MB

  async uploadImage(
    buffer: Buffer,
    folder = "logos",
  ): Promise<{ url: string; publicId: string }> {
    const cloudName = this.config.get<string>("CLOUDINARY_CLOUD_NAME");
    if (!cloudName) {
      throw new BadRequestException(
        "Image upload is not configured (missing Cloudinary credentials)",
      );
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        },
        (err, result) => {
          if (err) {
            const msg = err.message || "Upload failed";
            if (
              msg.toLowerCase().includes("invalid cloud_name") ||
              msg.toLowerCase().includes("cloud_name")
            ) {
              reject(
                new BadRequestException(
                  `${msg}. Fix: set CLOUDINARY_CLOUD_NAME in server .env.local to your Cloudinary cloud name (Dashboard → Product environment credentials).`,
                ),
              );
            } else {
              reject(new BadRequestException(msg));
            }
            return;
          }
          if (!result?.secure_url) {
            reject(new BadRequestException("Upload failed: no URL returned"));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id ?? "",
          });
        },
      );
      const readable = Readable.from(buffer);
      readable.pipe(stream);
    });
  }

  validateImageFile(mimetype: string | undefined, size: number): void {
    if (!mimetype || !this.allowedMimes.includes(mimetype)) {
      throw new BadRequestException(
        "Invalid file type. Allowed: JPEG, PNG, GIF, WebP",
      );
    }
    if (size > this.maxSizeBytes) {
      throw new BadRequestException(
        `File too large. Maximum size: ${this.maxSizeBytes / 1024 / 1024}MB`,
      );
    }
  }
}
