import React, { useState } from 'react';
import './App.css';
import EnhancedTable from './EnchancedTable';
import Form from './Form';
import Button from '@material-ui/core/Button';

function App() {
  const [showForm, setShowForm] = useState<Boolean>(false);


  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowForm(!showForm);
  }

  const buttonText = showForm ? 'Return to the Tasks' : 'Add a New Task';

  return (
    <div className="App">
      <hr />

      <Button color="primary" onClick={handleClick}>
        {buttonText}
      </Button>

      {showForm ? (
        <Form />
      ) : (
          <div>
            <hr />
            <EnhancedTable />
          </div>
        )}

      <p>With Love from Ioan Zicu</p>
    </div>
  );
}

export default App;
