import { forwardRef, useRef, useState, type ReactNode, type DragEvent } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

/** Human-readable byte size. */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export interface FileUploadProps {
  /** Controlled file list. */
  value?: File[];
  /** Initial files when uncontrolled. @default [] */
  defaultValue?: File[];
  /** Called with the updated file list. */
  onChange?: (files: File[]) => void;
  /** `accept` attribute for the file input. */
  accept?: string;
  /** Allow selecting multiple files. @default false */
  multiple?: boolean;
  /** Disable the control. @default false */
  disabled?: boolean;
  /** Main dropzone label. @default 'ファイルをドラッグ、またはクリックして選択' */
  label?: ReactNode;
  /** Secondary hint under the label. */
  hint?: ReactNode;
  /** Builds the remove button label. @default `Remove ${name}` */
  removeLabel?: (name: string) => string;
  /** Accessible name for the underlying file input. @default 'ファイルを選択' */
  inputLabel?: string;
  id?: string;
  name?: string;
  className?: string;
}

/**
 * FileUpload — a drag-and-drop dropzone with a selected-file list. The dropzone
 * is a real button (keyboard operable) for a hidden file input.
 *
 * @example
 * ```tsx
 * <FileUpload multiple accept="image/*" onChange={setFiles} />
 * ```
 */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  { value: valueProp, defaultValue = [], onChange, accept, multiple = false, disabled = false, label = 'ファイルをドラッグ、またはクリックして選択', hint, removeLabel = (n) => `Remove ${n}`, inputLabel = 'ファイルを選択', id, name, className },
  ref,
) {
  const [files, setFiles] = useControllableState<File[]>({ value: valueProp, defaultValue, onChange });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = hint && id ? `${id}-hint` : undefined;

  const accept_ = (incoming: File[]) => {
    const next = multiple ? [...files, ...incoming] : incoming.slice(0, 1);
    setFiles(next);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    accept_(Array.from(e.dataTransfer.files));
  };

  return (
    <div ref={ref} className={cx('lily-file-upload', className)}>
      <button
        type="button"
        className={cx('lily-file-upload__dropzone', dragging && 'lily-file-upload__dropzone--dragging')}
        disabled={disabled}
        aria-describedby={hintId}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <span>{label}</span>
        {hint && (
          <span className="lily-file-upload__hint" id={hintId}>
            {hint}
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        className="lily-file-upload__input"
        type="file"
        id={id}
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        aria-label={inputLabel}
        onChange={(e) => accept_(Array.from(e.target.files ?? []))}
      />
      {files.length > 0 && (
        <ul className="lily-file-upload__list">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="lily-file-upload__item">
              <span>{file.name}</span>
              <span className="lily-file-upload__size">{formatBytes(file.size)}</span>
              <button
                type="button"
                className="lily-chip__remove"
                aria-label={removeLabel(file.name)}
                onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
              >
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
