/* eslint-disable jsx-a11y/no-autofocus */
import React, { ChangeEvent, useRef, useState } from 'react';
import { InputState } from 'react-hook-form';
import { wrapMarkdownWithMath } from '../utils';
import { Maybe } from '../../types';

interface MarkdownTextAreaProps {
  value: string;
  onChange: any;
  shouldRenderMarkdown?: boolean;
  onBlurHandler: Maybe<() => void>;
}

function MarkdownTextArea({
  value,
  onChange,
  shouldRenderMarkdown = true,
  onBlurHandler,
}: MarkdownTextAreaProps): JSX.Element {
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
      autoFocus={!!value}
      ref={textAreaRef}
      onFocus={focus}
      onBlur={() => {
        // Call our custom onBlurHandler
        if (onBlurHandler) {
          onBlurHandler();
        }

        // Call our unfocus after, to switch back to the markdown render
        unfocus();
      }}
      className="dynamic-text-area"
      value={value}
      onChange={onChange}
    />
  );
}

export default MarkdownTextArea;
