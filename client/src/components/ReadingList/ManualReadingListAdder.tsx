import { CheckCircleOutlined, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useState } from 'react';

export default function ManualReadingListAdder(): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const submitItem = () => {
    setTitle('');
  };

  return (
    <div className="reading-list-adder">
      {!isEditing ? (
        <Button onClick={() => setIsEditing(true)} className="reading-list-adder__startButton">
          Add to Reading List <PlusOutlined />
        </Button>
      ) : (
        <div className="reading-list-adder__form">
          <Input placeholder="Paper title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button onClick={submitItem} disabled={title === ''}>
            <CheckCircleOutlined />
          </Button>
          <Button danger onClick={() => setIsEditing(false)}>
            <CloseCircleOutlined />
          </Button>
        </div>
      )}
    </div>
  );
}
