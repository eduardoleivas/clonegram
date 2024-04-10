import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'

import { Button } from '../ui/button'

type FileUploaderProps={
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setfile] = useState<File[]>([]);
  const [fileUrl, setfileUrl] = useState("");
  
  const placeholder = mediaUrl;
  placeholder;

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setfile(acceptedFiles);
    fieldChange(acceptedFiles);
    setfileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])

  const {getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*" : [".png", ".gif", ".jpg", ".jpeg", ".svg", ".webp"]
    }
  })

  return (
    <div className="flex flex-center flex-col cursor-pointer group bg-dark-3 hover:bg-dark-4 rounded-xl border-dark-4 hover:border-dark-3 border-2 border-dashed"{...getRootProps()}>
      <input className="cursor-pointer"{...getInputProps()} />
      { fileUrl ? (
          <>
            <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
              <img
                src={fileUrl}
                alt="image"
                className="file_uploader-img"
              />
            </div>
            <p className="file_uploader-label">Click or drag photo to replace</p>
          </>
        ) : (
          <div className="file_uploader-box">
            <img
              src="/clonegram/assets/icons/file-upload.svg"
              width={96}
              height={77}
              alt="file-upload"
            />
            <h3 className="base-medium text-light-2 mb-2 mt-6">Drag your photo here</h3>
            <p className="small-regular text-light-4 mb-6">.SVG, .PNG, .JPG</p>

            <Button className="shad-button_dark_4 group-hover:shad-button_dark_3">
              Select from computer
            </Button>
          </div>
        )
      }
    </div>
  )
}

export default FileUploader