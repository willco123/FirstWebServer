const express = require('express');
const app = express();

app.get('/', (req,res) =>{
    res.send('hey')
});

const port = process.env.PORT || 3001;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
