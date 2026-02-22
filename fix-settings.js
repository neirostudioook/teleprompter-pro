const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSettings.ts', 'utf8');
const fixed = `    return (
        <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    );`;

code = code.replace(/return \([\s\S]*?\);/m, fixed);
fs.writeFileSync('src/hooks/useSettings.ts', code, 'utf8');
console.log("File updated");
