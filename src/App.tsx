import React from 'react';
import './App.css';
import EnhancedTable from './EnchancedTable';

// let todos = [
//   { "title": "todos 1", "priority": "high", "done": false },
//   { "title": "todos 2", "priority": "low", "done": true },
//   { "title": "todos 3", "priority": "high", "done": true },
//   { "title": "todos 4", "priority": "mediom", "done": false },
// ]

function App() {
  return (
    <div className="App">

      <EnhancedTable />

      <p>With Love from Ioan Zicu</p>
    </div>
  );
}

export default App;
