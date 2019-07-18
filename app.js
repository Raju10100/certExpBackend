const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')

const Recipes = require('./models/Recipes')

mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser:true})
mongoose.connection.on('connected', ()=>{
    console.log('connected to mongod at mongodb://localhost:27017/')
})
mongoose.connection.on('error', ()=>{
    console.log('UnExpected error while connecting to mongodb')
})

app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/', (req, res)=>{
    const helper =
        `<pre> 
        Welcome onboard, these are some endpoints that you can hit
        1. GET  /api/recipes  — returns all recipes in database
        2. GET  /api/recipes/:id  — returns the recipe with the provided ID from the database
        3. POST  /api/recipes  — adds a new recipe to the database
        4. PUT  /api/recipes/:id  — modifies the recipe with the provided ID
        5. DELETE  /api/recipes/:id  — deletes the recipe with the provided ID
        </pre>`
    res.send(helper)
})

app.post('/api/recipes', (req, res)=>{        //create
    const recipes = new Recipes({
        title:req.body.title,
        instructions:req.body.instructions,
        ingredients:req.body.ingredients,
        time: req.body.time,
        difficulty: req.body.difficulty
    })
    recipes.save().then(()=>{
        res.status(200).json({
            message: 'recipe created successfully'
        })
    }).catch((error)=>{
        res.status(404).json({
            error:error
        })
    })
})

app.get('/api/recipes', (req,res)=>{          //read all
    Recipes.find({}).then((allRecipes)=>{
        res.status(200).json(allRecipes)
    }).catch((error)=>{
        res.status(400).json({
            error:error
        })
    })
})

app.get('/api/recipes/:id', (req, res)=>{  //read one
    Recipes.findOne({
        _id:req.params.id
    }).then((wantedRecipe)=>{
        res.status(200).json(wantedRecipe)
    }).catch((error)=>{
        res.status(400).json({
            error:error
        })
    })
})

app.put('/api/recipes/:id', (req, res)=>{   // update one if diff level is between 1 and 5
    if((req.body.difficulty !==0) && (req.body.difficulty <= 5)){
        Recipes.updateOne({
                _id:req.params.id
            },
            {
                title:req.body.title,
                difficulty:req.body.difficulty,
                time:req.body.time,
                ingredients:req.body.ingredients,
                instructions:req.body.instructions
            }).then((updatedItem)=>{
            res.status(200).json({...updatedItem, message:'successfully updated recipe'})
        }).catch((error)=>{
            res.status(400).json({
                error:error
            })
        })
    }else{
        res.status(400).json({
            message: 'difficulty level must be 1 to 5'
        })
    }
})

app.delete('/api/recipes/:id', (req, res)=>{  //delete one
    Recipes.deleteOne({
        _id:req.params.id
    }).then((recipe)=>{
        res.status(200).json({...recipe, message:'successfully deleted the recipe'})
    }).catch((error)=>{
        res.status(400).json({
            error:error
        })
    })
})

module.exports = app