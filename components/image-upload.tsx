"use client";

import React, { useState } from "react";

const ImageDropZone = () => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`flex items-center justify-center w-full h-64 border-2 border-dashed rounded-lg ${
        dragging ? "bg-gray-200" : "bg-gray-100"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image as string}
          alt="Uploaded"
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="text-center text-gray-600">
          <p className="text-lg font-medium">Drag & Drop your image here</p>
          <p className="text-sm">or click to select a file</p>
        </div>
      )}
    </div>
  );
};

export default ImageDropZone;
