'use client'
import { useState, useRef } from 'react'

export interface UploadedFile {
  name: string
  size: number
  file: File
}

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  label?: string
  sublabel?: string
  onUpload: (files: UploadedFile[]) => void
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function FileUploadZone({ accept, multiple, maxSizeMb, label = 'Drop files here', sublabel, onUpload }: FileUploadProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const files: UploadedFile[] = []
    Array.from(fileList).forEach(file => {
      if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) return
      files.push({ name: file.name, size: file.size, file })
    })
    if (files.length) onUpload(files)
  }

  return (
    <div
      className={`file-upload${dragging ? ' drag-over' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
      role="button"
      tabIndex={0}
      aria-label="Upload file"
    >
      <div className="file-upload-icon">↑</div>
      <div className="file-upload-title">{label}</div>
      {sublabel && <div className="file-upload-sub">{sublabel}</div>}
      <button className="file-upload-btn" type="button">choose file{multiple ? 's' : ''}</button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  )
}

interface UploadedRowProps {
  file: UploadedFile
  onRemove: () => void
}

export function UploadedFileRow({ file, onRemove }: UploadedRowProps) {
  return (
    <div className="file-uploaded">
      <div className="file-uploaded-stripe" />
      <div className="file-uploaded-body">
        <div className="file-uploaded-name">{file.name}</div>
        <div className="file-uploaded-meta">{formatSize(file.size)}</div>
      </div>
      <button className="file-uploaded-remove" onClick={onRemove} aria-label="Remove file">✕</button>
    </div>
  )
}

// Convenience wrapper: upload zone + file list
interface FileUploadProps2 extends FileUploadProps {
  files: UploadedFile[]
  onRemove: (index: number) => void
}

export default function FileUpload({ files, onRemove, onUpload, ...zoneProps }: FileUploadProps2) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <FileUploadZone onUpload={onUpload} {...zoneProps} />
      {files.map((f, i) => (
        <UploadedFileRow key={i} file={f} onRemove={() => onRemove(i)} />
      ))}
    </div>
  )
}
