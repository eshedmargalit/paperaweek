import React from 'react';
import { useProtected } from '../../hooks/useProtected';

import Drafts from '../Drafts';

function DraftPageRedux(): JSX.Element {
  useProtected();

  return (
    <div className="width80">
      <Drafts />
    </div>
  );
}

export default DraftPageRedux;
