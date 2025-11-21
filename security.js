(function () {
    // Disable Right Click
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Disable Keyboard Shortcuts
    document.addEventListener('keydown', function (e) {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
            e.preventDefault();
            return false;
        }

        // Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
    });

    // Debugger Trap
    // This will freeze the browser if DevTools is open
    setInterval(function () {
        const start = new Date().getTime();
        debugger;
        const end = new Date().getTime();
        if (end - start > 100) {
            document.body.innerHTML = '<h1 style="color:red; text-align:center; margin-top:20%;">Access Denied</h1>';
        }
    }, 1000);

    console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cThis is a browser feature intended for developers.', 'font-size: 20px;');
})();
