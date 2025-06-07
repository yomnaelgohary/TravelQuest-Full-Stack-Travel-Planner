
var express = require('express');
var path = require('path');
var session=require('express-session');
var fs=require('fs');
const { MongoClient } = require('mongodb');
var app = express();



const client = new MongoClient('mongodb://127.0.0.1:27017',{monitorCommands:true});
const db =client.db("myDB");

db.collection('myCollection').find().toArray(function(err,results){
  console.log(results);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'booky',
  resave:false,
  saveUninitialized:true,
  cookie:{secure:false}
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

function isAuthenticated(req,res,next){
  if(req.session.username){
    return next();
  }
  res.redirect('/login?message=Please log in first');
}


app.get('/',function(req,res){
  res.render('login');
});


app.get('/login',function(req,res){
  res.render('login');
});

app.post('/login',async function(req,res){
  var u=req.body.username;
  var p=req.body.password;

  if(!u||!p){
    return res.status(400).send('<h3 style="color: red;" >All fields are required!</h3>');
  }
  const user=await db.collection('myCollection').findOne({username:u});
  if(!user){
    return res.status(400).send('<h3 style="color:red;" >Username does not exist!</h3>');
  }
  if(user.password!==p){
    return res.status(400).send('<h3 style="color:red;">Incorrect password!</h3>');
  }

  req.session.username=u;

  res.redirect('/home?message=Login Successful;');
});

app.get('/registration',function(req,res){
  res.render('registration');
});

app.post('/register',async function(req,res) {
  var x=req.body.username;
  var y=req.body.password;
  var c={username:x,password:y, wantToGoList:[]};

  if(!x||!y){
    return res.status(400).send('<h3 style ="color: red;">All fields are required,</h3>');
  }
  const result= await db.collection('myCollection').findOne({username:x});
  if(result){
    return res.status(400).send('<h3 style="color: red;">User already exists! Try a different username');
  }
  else{
    try{
    db.collection('myCollection').insertOne(c);
    res.redirect('/login?message=Registration successful;');
    }
    catch(error){
      console.error(error);
      res.status(500).send('<h3 style="color:red;">An error occured.Please try again later</h3>')
    }
  }

});

app.get('/home',function(req,res){
  res.render('home',{message:req.query.message});
});

app.post('/wanttogo', async function (req, res) {
  const { place } = req.body;
  const username = req.session.username;

  if (!username) {
    return res.status(401).send('Unauthorized: Please log in to add to your list.');
  }

  try {
    const user = await db.collection('myCollection').findOne({ username });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    const updatedList = user.wantToGoList || [];

    if (updatedList.includes(place)) {
      return res.render('wanttogo', {
        want: updatedList,
        error: 'The destination is already in your Want-to-Go list.',
      });
    }

    updatedList.push(place);

    await db.collection('myCollection').updateOne(
      { username },
      { $set: { wantToGoList: updatedList } }
    );

    res.redirect('/wanttogo');
  } catch (err) {
    console.error('Error adding to Want-to-Go list:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/wanttogo', async function (req, res) {
  const username = req.session.username;

  if (!username) {
      return res.status(401).send('Unauthorized: Please log in to view your Want-to-Go list.');
  }

  try {
      // Fetch the logged-in user's document
      const user = await db.collection('myCollection').findOne({ username });

      if (!user || !user.wantToGoList || user.wantToGoList.length === 0) {
          return res.render('wanttogo', {
              want: [], // Empty list
              error: 'Your Want-to-Go list is empty.'
          });
      }

      // Map the list to include destination names and URLs
      const destinations = user.wantToGoList.map(dest => {
          switch (dest.toLowerCase()) {
              case 'rome': return { name: 'Rome', url: '/rome' };
              case 'bali': return { name: 'Bali', url: '/bali' };
              case 'paris': return { name: 'Paris', url: '/paris' };
              case 'santorini': return { name: 'Santorini', url: '/santorini' };
              case 'annapurna': return { name: 'Annapurna', url: '/annapurna' };
              case 'inca trail': return { name: 'Inca Trail', url: '/inca' };
              default: return { name: dest, url: '#' }; // Default case for unknown destinations
          }
      });

      res.render('wanttogo', { want: destinations, error: null });
  } catch (err) {
      console.error('Error fetching Want-to-Go list:', err);
      res.render('wanttogo', {
          want: [],
          error: 'An error occurred while fetching your Want-to-Go list.'
      });
  }
});

//search
async function initializeDestinations() {
  const collection = db.collection('myCollection');


  const destinationCount = await collection.countDocuments({ type: 'destination' });
  if (destinationCount === 0) {
      const sampleDestinations = [
          { name: "Inca Trail", url: "/inca", type: 'destination' },
          { name: "Annapurna", url: "/annapurna", type: 'destination' },
          { name: "Paris", url: "/paris", type: 'destination' },
          { name: "Rome", url: "/rome", type: 'destination' },
          { name: "Bali", url: "/bali", type: 'destination' },
          { name: "Santorini", url: "/santorini", type: 'destination' }
      ];

      await collection.insertMany(sampleDestinations);
      console.log("Sample destinations inserted.");
  }
}

initializeDestinations();


// Search functionality
app.post('/search', async function (req, res) {
    const searchKeyword = req.body.Search;
    if (!searchKeyword) {
        return res.status(400).send('Search keyword is required.');
    }

    try {
        const results = await db.collection('myCollection')
            .find({ name: { $regex: searchKeyword, $options: 'i' }, type: 'destination' })
            .toArray();

        if (results.length === 0) {
            return res.render('searchresults', { destinations: [], message: "Destination not found." });
        }

        res.render('searchresults', { destinations: results, message: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your search.');
    }
});


app.get('/hiking',isAuthenticated,function(req,res){
  res.render('hiking');
});

app.post('/hiking',function(req,res){
  res.render('hiking');
});

app.get('/inca',isAuthenticated,function(req,res){
  res.render('inca');
});

app.get('/annapurna',isAuthenticated,function(req,res){
  res.render('annapurna');
});

app.get('/cities',isAuthenticated,function(req,res){
  res.render('cities');
});

app.get('/paris',isAuthenticated,function(req,res){
  res.render('paris');
});

app.get('/rome',isAuthenticated,function(req,res){
  res.render('rome');
});

app.get('/islands',isAuthenticated,function(req,res){
  res.render('islands');
});

app.get('/bali',isAuthenticated,function(req,res){
  res.render('bali');
});

app.post('/bali',function(req,res){
  res.render('bali');
});

app.get('/santorini',isAuthenticated,function(req,res){
  res.render('santorini');
});




app.listen(3000);


