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
    <ThemeProvider theme={theme}>
      <div className="App">

        <div style={{ paddingTop: '1rem' }}></div>
        {showForm ? (
          <Form showForm={showForm} setShowForm={setShowForm} />
        ) : (
            <div>
              <EnhancedTable />
            </div>
          )}
        <br />
        <Button variant="contained" color="primary" onClick={handleClick}>
          {buttonText}
        </Button>

        <Author />

      </div>
    </ThemeProvider>
  );
}

export default App;
