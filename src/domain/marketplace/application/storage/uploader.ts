export interface UploadParams {
  file: File;
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ path: string }>;
}
