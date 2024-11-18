const { exec } = require('child_process');

// Start both servers
exec('node server-email.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error starting email server: ${err}`);
        return;
    }
    console.log(`Email server output:\n${stdout}`);
    console.error(`Email server errors:\n${stderr}`);
});

exec('node server-stripe.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error starting Stripe server: ${err}`);
        return;
    }
    console.log(`Stripe server output:\n${stdout}`);
    console.error(`Stripe server errors:\n${stderr}`);
});
