import React from 'react';

const themes = [
  'vs-dark',
  'light',
  'hc-black',
  'monokai',
  'github',
  'solarized-dark'
];

const EditorThemeSelector = ({ currentTheme, onThemeChange }: { currentTheme: string, onThemeChange: (theme: string) => void }) => {
  return (
    <select value={currentTheme} onChange={(e) => onThemeChange(e.target.value)} className="theme-selector">
      {themes.map(theme => (
        <option key={theme} value={theme}>{theme}</option>
      ))}
    </select>
  );
};

export default EditorThemeSelector;