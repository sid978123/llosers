import React, { useRef, useState } from "react";
import { UploadCloud, File as FileIcon, X, Plus } from "lucide-react";
import { formatBytes } from "../utils/downloadHelper";

interface FileUploaderProps {
  acceptedFormats: string[];
  multiple: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
  title?: string;
  subtitle?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  acceptedFormats,
  multiple,
  files,
  onFilesChange,
  title,
  subtitle,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptString = acceptedFormats.join(",");

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    if (multiple) {
      onFilesChange([...files, ...droppedFiles]);
    } else {
      onFilesChange([droppedFiles[0]]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      if (multiple) {
        onFilesChange([...files, ...selectedFiles]);
      } else {
        onFilesChange([selectedFiles[0]]);
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? "border-[#00AB80] bg-[#00AB80]/[0.08] scale-[1.005]"
            : "border-white/[0.12] hover:border-[#00AB80]/60 bg-[#0E131F] hover:bg-[#111622]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptString}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#161D2B] border border-white/[0.08] flex items-center justify-center text-[#00AB80] transition-transform group-hover:scale-105">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div>
            <p className="text-base font-semibold text-[#F8FAFC]">
              {title ||
                (multiple
                  ? "Drop documents here or click to browse"
                  : "Drop your document here or click to browse")}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1.5 font-mono">
              {subtitle || `Accepted formats: ${acceptedFormats.join(", ")}`}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#94A3B8] bg-[#0A0D14] px-3.5 py-1.5 rounded-full border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00AB80]" />
            <span>Ephemeral buffer processing • Never written to database</span>
          </div>
        </div>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] px-1">
            <span className="font-mono text-[11px]">
              Selected ({files.length} {files.length === 1 ? "file" : "files"})
            </span>
            {multiple && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center space-x-1 text-xs text-[#00AB80] hover:text-[#009670] font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add another file</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0E131F] border border-white/[0.08]"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-[#161D2B] border border-white/[0.08] text-[#00AB80] shrink-0">
                    <FileIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#F8FAFC] truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-[#64748B] font-mono">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(idx);
                  }}
                  className="p-1.5 text-[#64748B] hover:text-[#EF4444] rounded-lg hover:bg-white/[0.05] transition-colors shrink-0 ml-2 cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
