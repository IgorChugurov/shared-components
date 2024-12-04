import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUpload.css"; // Make sure to create a corresponding CSS file
import { Icon_attach_file, Icon_close } from "./Icons";

interface FileUploadProps {
  onFilesAdded: (newFiles: File[]) => void;
  onFileRemoved: (file: File) => void;
  onClearSelection: () => void;
  selectedFiles: File[];
  single: boolean;
  error: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesAdded,
  onFileRemoved,
  onClearSelection,
  selectedFiles,
  single,
  error,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className={"file_upload_container"}>
      <div
        {...getRootProps()}
        className={"dropzone"}
        style={error ? { borderColor: "var(--text-error-default)" } : {}}
      >
        <input {...getInputProps()} />
        <span className="body-m-medium text-secondary">
          Drop files to upload or
        </span>
        <button className="button secondaryButton">Select files</button>
        {/* <div className={"wrap_for_text"}>
          

          <div className={`file_select body-m-regular`}>Select Files</div>
        </div> */}
      </div>
      {error && (
        <span
          className="body-xs-regular colorSystemError"
          style={{ lineHeight: "12px" }}
        >
          Select file
        </span>
      )}
      {selectedFiles.map((file, index) => (
        <div key={index} className={"file_info"}>
          <div className="iconButton tertiaryIconButton">
            <Icon_attach_file />
          </div>

          <span className="body-s-medium text-default" style={{ flex: 1 }}>
            {file.name}
          </span>
          <span className="body-s-regular text-secondary">
            {" "}
            {transformFileSize(file.size)}
          </span>

          <Icon_close
            className={"closeIcon"}
            onClick={() => onFileRemoved(file)}
          />
        </div>
      ))}
      {/* <div className={styles.file_upload_controls}>
        <button onClick={onClearSelection}>Clear</button>
        <button>Upload</button>
      </div> */}
    </div>
  );
};

export default FileUpload;
function transformFileSize(bytes: number, decimals = 2): string {
  try {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  } catch (err) {
    return "0 Bytes";
  }
}

// <FileUpload
//             error={Boolean(submitted && selectedFiles.length === 0)}
//             single={false}
//             selectedFiles={selectedFiles}
//             onFilesAdded={handleFilesAdded}
//             onFileRemoved={handleFileRemoved}
//             onClearSelection={handleClearSelection}
//           />
