/* eslint-disable jsx-a11y/no-autofocus */
import { useField } from 'formik';
import React, { useState } from 'react';
import { wrapMarkdownWithMath } from '../utils';

interface MarkdownTextAreaProps {
  formFieldName: string;
  shouldRenderMarkdown?: boolean;
}

function MarkdownTextArea({ formFieldName, shouldRenderMarkdown = true }: MarkdownTextAreaProps): JSX.Element {
  const [, { value }, { setValue }] = useField<string>(formFieldName);
  const [isFocused, setIsFocused] = useState(false);

  const focus = () => setIsFocused(true);
  const unfocus = () => setIsFocused(false);

  const willRenderMarkdown = !isFocused && !!value && shouldRenderMarkdown;

  return willRenderMarkdown ? (
    <div className="preview-text-area" role="textbox" tabIndex={0} onClick={focus} onKeyDown={focus}>
      {wrapMarkdownWithMath(value)}
    </div>
  ) : (
    <textarea
      onFocus={focus}
      onBlur={unfocus}
      className="dynamic-text-area"
      autoFocus
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}

export default MarkdownTextArea;
