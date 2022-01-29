require('dotenv').config
const app = require('./server/app')

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));
        
console.log(process.env.NODE_ENV)
