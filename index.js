const express = require('express')
var expressHandlebars  = require('express-handlebars');
const bodyParser = require('body-parser')


const app = express();
app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: 'hbs'
}))
app.use(bodyParser.urlencoded({
    extended: false
}))

const port = 8000;

var N = 9
var GlobalGrid = [ ['', '', '', '', '', '', '', '', ''], 
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''] ]


app.get('/', async (req, res) => {

    GlobalGrid = [ ['', '', '', '', '', '', '', '', ''], 
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''] ]

    res.render('start.hbs',{grid: GlobalGrid})

});

app.get('/reset', async (req, res) => {

    GlobalGrid = [ ['', '', '', '', '', '', '', '', ''], 
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''],  
                    ['', '', '', '', '', '', '', '', ''] ]

    res.render('start.hbs',{grid: GlobalGrid})

});

app.post('/solve', async (req, res) => {
    const x = req.body

    GlobalGrid = [ [x.c00, x.c01, x.c02, x.c03, x.c04, x.c05, x.c06, x.c07, x.c08], 
                    [x.c10, x.c11, x.c12, x.c13, x.c14, x.c15, x.c16, x.c17, x.c18],
                    [x.c20, x.c21, x.c22, x.c23, x.c24, x.c25, x.c26, x.c27, x.c28],
                    [x.c30, x.c31, x.c32, x.c33, x.c34, x.c35, x.c36, x.c37, x.c38],
                    [x.c40, x.c41, x.c42, x.c43, x.c44, x.c45, x.c46, x.c47, x.c48],
                    [x.c50, x.c51, x.c52, x.c53, x.c54, x.c55, x.c56, x.c57, x.c58],
                    [x.c60, x.c61, x.c62, x.c63, x.c64, x.c65, x.c66, x.c67, x.c68],
                    [x.c70, x.c71, x.c72, x.c73, x.c74, x.c75, x.c76, x.c77, x.c78],
                    [x.c80, x.c81, x.c82, x.c83, x.c84, x.c85, x.c86, x.c87, x.c88], ]

    
    if(!await check(GlobalGrid)){
        res.render('start.hbs',{grid: GlobalGrid, error: true})
    }else{
        if(await solve(GlobalGrid, 0, 0)){
            res.render('start.hbs',{grid: GlobalGrid, correct: true})
        }else{
            //res.render('start.hbs',{grid: GlobalGrid})
            res.render('start.hbs',{grid: GlobalGrid, error: true})
        }
    }


});

//FUNCTIONS
async function possible(y,x,num,grid){
    var i, j;
    for(i = 0; i < grid[0].length; i++){
        if(grid[y][i] == num && i != x){
            return false
        }
    }
    for(i = 0; i < grid[0].length; i++){
        if(grid[i][x] == num && i != y){
            return false
        }
    }

    var x0 = Math.floor(x/3) * 3
    var y0 = Math.floor(y/3) * 3

    for(i = 0; i < 3; i++){
        for(j = 0; j < 3; j++){
            if(grid[y0 + i][x0 + j] == num && !((y0 + i) == y && (x0 + j) == x)){
                return false
            }
        }
    }

    return true
}

async function solve(grid, row, col){
    var n;

    if(row == N-1 && col == N){
        return true
    }

    if(col == N){
        row++
        col = 0
    }

    if(grid[row][col] > 0){
        return await solve(grid, row, col+1)
    }

    for(n = 1; n <= N; n++){
        if(await possible(row,col,n,grid)){
            grid[row][col] = n

            if(await solve(grid, row, col+1)){
                return true
            }

        }
        grid[row][col] = 0
    }

    return false

}

async function check(grid){

    for(var row = 0; row < N; row++){
        for(var col = 0; col < N; col++){
            if(grid[row][col] > 0 && !await possible(row,col,grid[row][col],grid)){
                return false
            }
        }
    }

    return true

}

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
});