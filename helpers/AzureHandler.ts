import azure from "azure-storage"
import { PassThrough } from "stream";

//? to upload files on azure
export function ScraawlBlob(blobName: string, stream: any, streamLength: number) {
    const blobService = azure.createBlobService(
        process.env.STORAGE_ACCOUNT!,
        process.env.ACCESS_KEY!
    );

    return new Promise((resolve, reject) => {
        // Create a PassThrough stream to handle file data
        const passthroughStream = new PassThrough();
        stream.pipe(passthroughStream);

        blobService.createBlockBlobFromStream(
            process.env.CONTAINER_NAME!,
            blobName,
            passthroughStream,
            streamLength,
            (err) => {
                if (err) {
                    console.error(`Error uploading blob ${blobName}:`, err);
                    reject(err);
                } else {
                    console.log(`Blob uploaded successfully: ${blobName}`);
                    resolve(blobName);
                }
            }
        );
    });
}

//?to delete files from blob