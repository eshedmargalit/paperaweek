/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import { wrapMarkdownWithMath } from '../utils';
import { Maybe } from '../../types';
import { useAutoResizingTextArea } from './useAutoResizingTextArea';

export interface MarkdownTextAreaProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  shouldRenderMarkdown?: boolean;
  onBlurHandler: Maybe<() => void>;
}

function MarkdownTextArea({
  value,
  onChange,
  shouldRenderMarkdown = true,
  onBlurHandler,
}: MarkdownTextAreaProps): JSX.Element {
  const { handleFocus, handleBlur, textAreaRef, willRenderMarkdown } = useAutoResizingTextArea(
    value,
    shouldRenderMarkdown,
    onBlurHandler
  );

  return willRenderMarkdown ? (
    <div className="preview-text-area" role="textbox" tabIndex={0} onClick={handleFocus} onKeyDown={handleFocus}>
      {wrapMarkdownWithMath(value)}
    </div>
  ) : (
    <textarea
      autoFocus={!!value}
      ref={textAreaRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="dynamic-text-area"
      value={value}
      onChange={onChange}
    />
  );
}

export default MarkdownTextArea;
