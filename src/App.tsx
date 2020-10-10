import React, { useState } from 'react';
import './styles/App.css';
import { ThemeProvider } from '@material-ui/core/styles';
import EnhancedTable from './EnchancedTable';
import Form from './Form';
import Button from '@material-ui/core/Button';
import { Author } from './Author';
import { theme } from './CustomStyles';

function App() {
  const [showForm, setShowForm] = useState<Boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowForm(!showForm);
  }

  const buttonText = showForm ? 'Return to the Tasks' : 'Add a New Task';

  return (
    <div className="App">
      <br />
      <ThemeProvider theme={theme}>
        <Button variant="contained" color="primary" onClick={handleClick}>
          {buttonText}
        </Button>
      </ThemeProvider>

      {showForm ? (
        <Form showForm={showForm} setShowForm={setShowForm} />
      ) : (
          <div>
            <hr />
            <EnhancedTable />
          </div>
        )}

      <hr />
      <Author />
    </div>
  );
}

export default App;
