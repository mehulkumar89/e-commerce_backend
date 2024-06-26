const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/item');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const session=require('express-session');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(session({
  key: 'id',
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
 cookie:{
  httpOnly:true,
  secure:true,
  sameSite:'none',
   maxAge:1000*60*60*24*7,
 },
}))
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({
  origin:'*',
  credentials:true,
  exposedHeaders:['Set-Cookie']
}));
app.use('/api', authRoutes);
app.use('/api', itemRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

/*production environment
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}
*/

//MongoDB connection
const PORT = process.env.PORT || 4000;
const dbURI = process.env.DB_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(result =>
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    })
  )
  .catch(err => console.log(err));
