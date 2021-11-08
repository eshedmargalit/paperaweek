import { CheckCircleOutlined, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import { blankPaper } from '../../templates';
import { useSetReadingList } from './hooks';

function ReadingListAdderForm({ onExit }: { onExit: VoidFunction }): JSX.Element {
  const [title, setTitle] = useState('');

  const readingList = useAppSelector((state) => state.readingList);
  const { setReadingList } = useSetReadingList();

  const submitItem = () => {
    const newReadingList = readingList.concat({ ...blankPaper, title });
    setReadingList(newReadingList);
    onExit();
  };

  return (
    <div className="reading-list-adder__form">
      <Input placeholder="Paper title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button aria-label="submit" onClick={submitItem} disabled={title === ''}>
        <CheckCircleOutlined />
      </Button>
      <Button aria-label="cancel" danger onClick={onExit}>
        <CloseCircleOutlined />
      </Button>
    </div>
  );
}

export default function ManualReadingListAdder(): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="reading-list-adder">
      {!isEditing ? (
        <Button onClick={() => setIsEditing(true)} className="reading-list-adder__startButton">
          Add to Reading List <PlusOutlined />
        </Button>
      ) : (
        <ReadingListAdderForm onExit={() => setIsEditing(false)} />
      )}
    </div>
  );
}
