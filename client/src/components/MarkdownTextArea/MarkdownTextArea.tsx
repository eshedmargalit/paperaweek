/* eslint-disable jsx-a11y/no-autofocus */
import React, { useMemo, useRef, useState } from 'react';
import { wrapMarkdownWithMath } from '../utils';
import { Maybe } from '../../types';

export interface MarkdownTextAreaProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  shouldRenderMarkdown?: boolean;
  onBlurHandler: Maybe<() => void>;
}

const CHARS_PER_LINE = 150;

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

  // Easiest adapation of https://stackoverflow.com/a/7523, determine how tall the textarea should be
  const desiredRowCount = useMemo(
    () =>
      !willRenderMarkdown && !!value
        ? // Add a row for each newline, plus one for every row of text, approx. by chars per line
          value.split('\n').reduce((prev, curr) => prev + (1 + Math.ceil(curr.length / CHARS_PER_LINE)), 0)
        : undefined,
    [willRenderMarkdown, value]
  );

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
      rows={desiredRowCount}
      onChange={onChange}
    />
  );
}

export default MarkdownTextArea;
