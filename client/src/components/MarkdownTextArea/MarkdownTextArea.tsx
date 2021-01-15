/* eslint-disable jsx-a11y/no-autofocus */
import { useField } from 'formik';
import React, { useRef, useState } from 'react';
import { wrapMarkdownWithMath } from '../utils';

interface MarkdownTextAreaProps {
  formFieldName: string;
  shouldRenderMarkdown?: boolean;
}

function MarkdownTextArea({ formFieldName, shouldRenderMarkdown = true }: MarkdownTextAreaProps): JSX.Element {
  const [field, { value }, { setValue }] = useField<string>(formFieldName);
  const [isFocused, setIsFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const focus = () => setIsFocused(true);
  const unfocus = () => setIsFocused(false);

  const willRenderMarkdown = !isFocused && !!value && shouldRenderMarkdown;

  return willRenderMarkdown ? (
    <div className="preview-text-area" role="textbox" tabIndex={0} onClick={focus} onKeyDown={focus}>
      {wrapMarkdownWithMath(value)}
    </div>
  ) : (
    <textarea
      {...field}
      ref={textAreaRef}
      onFocus={focus}
      onBlur={e => {
        // Call Formik's onBlur first, this might be to trigger autosave
        field.onBlur(e);

        // Call our unfocus after, to switch back to the markdown render
        unfocus();
      }}
      className="dynamic-text-area"
      autoFocus
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}

export default MarkdownTextArea;
