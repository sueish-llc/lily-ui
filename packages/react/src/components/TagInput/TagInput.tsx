import { forwardRef, useState, type AriaAttributes, type KeyboardEvent } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';
import { useFieldControl } from '../FormField';
import { Chip } from '../Chip';

export interface TagInputProps {
  /** Controlled list of tags. */
  value?: string[];
  /** Initial tags when uncontrolled. @default [] */
  defaultValue?: string[];
  /** Called with the updated tag list. */
  onChange?: (tags: string[]) => void;
  /** Placeholder for the text field. */
  placeholder?: string;
  /** Keys (besides Enter) that commit the current text. @default [','] */
  delimiters?: string[];
  /** Reject duplicate tags. @default true */
  unique?: boolean;
  /** Disable adding/removing. @default false */
  disabled?: boolean;
  /** Accessible label for the group/field. */
  'aria-label'?: string;
  /** Builds the remove button label for a tag. @default `Remove ${tag}` */
  removeLabel?: (tag: string) => string;
  id?: string;
  className?: string;
}

/**
 * TagInput — collect multiple tokens (emails, keywords). Type and press Enter
 * (or a delimiter) to add; Backspace on an empty field removes the last tag.
 * Tags render as removable {@link Chip}s.
 *
 * @example
 * ```tsx
 * <FormField label="宛先"><TagInput defaultValue={['ada@example.com']} /></FormField>
 * ```
 */
export const TagInput = forwardRef<HTMLDivElement, TagInputProps>(function TagInput(
  { value: valueProp, defaultValue = [], onChange, placeholder, delimiters = [','], unique = true, disabled = false, removeLabel = (t) => `Remove ${t}`, id, className, ...rest },
  ref,
) {
  const [tags, setTags] = useControllableState<string[]>({ value: valueProp, defaultValue, onChange });
  const [draft, setDraft] = useState('');
  const fieldProps = useFieldControl<{
    id?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: AriaAttributes['aria-invalid'];
    required?: boolean;
  }>({ id, 'aria-label': rest['aria-label'] });

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    if (unique && tags.includes(t)) {
      setDraft('');
      return;
    }
    setTags([...tags, t]);
    setDraft('');
  };
  const removeAt = (i: number) => setTags(tags.filter((_, idx) => idx !== i));

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || delimiters.includes(e.key)) {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      removeAt(tags.length - 1);
    }
  };

  return (
    <div
      ref={ref}
      className={cx('lily-tag-input', disabled && 'lily-tag-input--disabled', className)}
      role="group"
      aria-label={fieldProps['aria-label']}
    >
      {tags.map((tag, i) => (
        <Chip key={`${tag}-${i}`} onRemove={disabled ? undefined : () => removeAt(i)} removeLabel={removeLabel(tag)}>
          {tag}
        </Chip>
      ))}
      <input
        className="lily-tag-input__field"
        value={draft}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => addTag(draft)}
        id={fieldProps.id}
        aria-describedby={fieldProps['aria-describedby']}
        aria-invalid={fieldProps['aria-invalid']}
      />
    </div>
  );
});
