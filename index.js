const express = require ('express');

const db = require('./connection/db')

const app = express()
const port = 3000

const isLogin = true;

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];


let projects = [];

// TEST CONNECTION DB
//db.connect(function(err, _, done){
//  if (err) throw err;

//  console.log('Database Connection Success');
//});

app.set('view engine', 'hbs'); //setup template engine / view engine

app.use('/public', express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));

// Routing GET
app.get('/', (req, res) => {

  db.connect(function(err, client, done) {
    if (err) throw err;
  
  const query = 'SELECT * FROM tb_project';

  client.query(query, function (err, result){
    if (err) throw err;

  const projectsData = result.rows;

  const newProject = projectsData.map((project) => {
  project.isLogin = isLogin;
  project.duration = durationTime(project['start_date'],project['end_date']);
  project.time = getFullTime(project['start_date']);
    return project;
  });

  console.log(newProject);

  res.render('index', {isLogin: isLogin, projects: newProject});
  });

  done();
});
});


app.get('/add-project',(req, res) =>{
  res.render('add-project')

});

app.get('/contact-me', (req, res) => {
    res.render('contact-me');
  });

app.get('/delete-project/:id', (req, res) => {
  const id = req.params.id

    db.connect(function(err, client, done) {
        if (err) throw err;

        const query = `DELETE FROM tb_project WHERE id = ${id};`;

        client.query(query, function(err, result) {
            if (err) throw err;

            res.redirect('/');
        });

        done();
    });
});

app.get('/project-detail/:id', function (req, res){
  const id = req.params.id;
  
db.connect(function(err, client, done) {
    if (err) throw err;
  
  const query = `SELECT * FROM tb_project WHERE id = ${id}`;

  client.query(query, function (err, result){
    if (err) throw err;
    
    const detailProject = result.rows[0]
    const detail = detailProject;  

    detail.duration = durationTime(detail["start_date"], detail["end_date"]);
    detail.date = getFullTime(detail["start_date"]);

    res.render('project-detail', {isLogin: isLogin, detail: detail})
    });
    done();
  });
})


app.get('/edit-project/:id', function(req, res){
  let id = req.params.id;

  db.connect(function(err, client, done){
    if (err) throw err;
    
    const query = `SELECT * FROM tb_project WHERE id =${id}`

    client.query(query, function(err, result) {
        if (err) throw err;

        const projects = result.rows[0]
        projects.start_date = changeTime (projects.start_date);   //perubahan 1
        projects.end_date = changeTime (projects.end_date);

         res.render('edit-project', {
          edit: projects,
          id: id
      })
    })
    done()
  })
})

 // Routing POST 
  app.post('/contact-me', (req, res) => {
    const data = req.body;

      res.redirect('/contact-me');
  });
  
  
  app.post('/add-project', (req, res) => {
    const data = req.body;
    const name = req.body.name;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const description = req.body.description;
    const image = req.body.image;
    const technologies = [];
    if (req.body.nodejs) {
         technologies.push('nodejs');
     } else {
         technologies.push('')
     }
     if (req.body.reactjs) {
         technologies.push('reactjs');
     } else {
         technologies.push('')
     }
     if (req.body.js) {
         technologies.push('js');
     } else {
         technologies.push('')
     }
     if (req.body.typescript) {
         technologies.push('typescript');
     } else {
         technologies.push('')
     }
   
     db.connect(function (err, client, done) {
      if (err) throw err;
  
      const query = `INSERT INTO tb_project (name, start_date, end_date, description, technologies, image) 
                     VALUES ('${name}', '${start_date}', '${end_date}', '${description}', ARRAY ['${technologies[0]}', '${technologies[1]}','${technologies[2]}', '${technologies[3]}'], '${image}')`
  
      client.query(query, function (err, result) {
        if (err) throw err;

        projects.push(data);
        console.log(projects);
    

    res.redirect('/');
});

done();
});
});


app.post('/edit-project/:id', (req, res) => {

  const name = req.body.name;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const description = req.body.description;
  const image = req.body.image;
  const technologies = [];
  if (req.body.nodejs) {
       technologies.push('nodejs');
   } else {
       technologies.push('')
   }
   if (req.body.reactjs) {
       technologies.push('reactjs');
   } else {
       technologies.push('')
   }
   if (req.body.js) {
       technologies.push('js');
   } else {
       technologies.push('')
   }
   if (req.body.typescript) {
       technologies.push('typescript');
   } else {
       technologies.push('')
   }
 
   console.log();
   db.connect(function (err, client, done) {
    let id = req.params.id
    if (err) throw err;

    const query = `UPDATE tb_project 
    SET name = '${name}', start_date = '${start_date}', end_date = '${end_date}', description = '${description}', technologies = ARRAY ['${technologies[0]}', '${technologies[1]}','${technologies[2]}', '${technologies[3]}'], image='${image}' 
    WHERE id=${id};`


    client.query(query, function (err, result) {
      if (err) throw err;

      
  res.redirect('/');
});

done();
});
});




app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
  });


  

  //function

  function durationTime(start_date, end_date) {
    // Convert Start - End Date to Days
    let newStartDate = new Date(start_date)
    let newEndDate = new Date(end_date)
    let duration = Math.abs(newStartDate - newEndDate)
  
    let day = Math.floor(duration / (1000 * 60 * 60 * 24))
  
    if (day < 30) {
      return day + ` days `
    } 
    
    else {
      let diffMonths = Math.ceil(duration / (1000 * 60 * 60 * 24 * 30));
      if (diffMonths >= 1) {
        return diffMonths + ` months `
      }

      if (diffMonths < 12) {
        return diffMonths + ` months `
      } 
      
      else {
        let diffYears = Math.ceil(duration / (1000 * 60 * 60 * 24 * 30 * 12));
        if (diffYears >= 1) {
          return diffYears + ` years `
        }
      }
    }

    
  };

  function getFullTime(time) {
    time = new Date(time);
    const date = time.getDate();
    const monthIndex = time.getMonth();
    const year = time.getFullYear();
    let hour = time.getHours();
    let minute = time.getMinutes();
   
    const fullTime = `${date} ${month[monthIndex]} ${year}`;
  
    return fullTime;
  }

  function changeTime (time) {  //memunculkan start_date sama end_date pada app.get edit.
    let newTime = new Date (time);
    const date = newTime.getDate ();
    const monthIndex = newTime.getMonth () + 1;
    const year = newTime.getFullYear ();
  
    if(monthIndex<10){
      monthformat = '0' + monthIndex;
    } else {
      monthformat = monthIndex;
    }
  
    if(date<10){
      dateformat = '0' + date;
    } else {
      dateformat = date;
    }
  
    const fullTime = `${year}-${monthformat}-${dateformat}`;
    
    return fullTime;
  }
  