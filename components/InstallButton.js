// Gangetabell Trener - Install Button komponent

const { useState, useEffect } = React;

// Installer-app prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

export const InstallButton = () => {
    const [canInstall, setCanInstall] = useState(false);

    useEffect(() => {
        const handler = (e) => { 
            e.preventDefault(); 
            deferredPrompt = e; 
            setCanInstall(true); 
        };
        
        window.addEventListener('beforeinstallprompt', handler);
        if (deferredPrompt) setCanInstall(true);
        
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    if (!canInstall) return null;

    return (
        <button
            onClick={async () => {
                if (!deferredPrompt) return;
                deferredPrompt.prompt();
                await deferredPrompt.userChoice;
                deferredPrompt = null;
                setCanInstall(false);
            }}
            className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105"
        >
            ➕ Installer appen
        </button>
    );
};
