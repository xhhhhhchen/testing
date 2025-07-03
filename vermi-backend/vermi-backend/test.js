const express = require('express');
const app = express();

const router = express.Router();
router.get('/ping', (req, res) => res.send('pong'));
app.use('/api/tanks', router);

app.listen(8081, () => console.log('Test server on 8081'));