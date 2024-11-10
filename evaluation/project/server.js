const express= require('express');
const fs= require('fs');
const path=require('path');
//create an express app
const app=express();
const port=3000;
//middleware to parse JSON bodies
app.use(bodyParser.json());
const postsFilePath=path.join(__dirname, 'posts.json');

function loadPosts(req, res, next){
    if(fs.existsSync(postsFilePath)){
        const data=fs.readFileSync(postsFilePath);
        req.posts=JSON.parse(data);
    }
    else{
        req.posts=[];
    }
    next();
}
app.use(loadPosts);

function savePosts(posts){
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));

}

//crud ops

//create
app.post('/posts', (req, res) => {
    const { title, content}= req.body;
    if(!title || !content){
        return res.status(400).json({ message: 'title and content are required'});
    }
    const newPost ={
        id: Date.now().toString(),
        title,
        content,
    };

    req.post.push(newPost);
    savePosts(req.posts);

    res.status(201).json(newPost);
});

//get all post

app.get('/posts', (req, res) => {
    res,json(req.posts);
});

//get single post
app.get('/posts/id:', (req, res) => {
    const post= req.posts.find(p => p.id === req.params.id);
    if(!post){
        return res.status(404).json({message: 'Post not found'});
    }
    res.json(post);
});

//update a post by ID
app.put('/posts/:id', (req, res) => {
    const { title, content } = req.body;
    const postIndex = req.posts.findIndex( p => p.id === req.paramsid);
    
    if(postIndex ===-1){
        return res.status(404).json({message: 'Post not found'});

    }

    const deletePost = req.posts.splice(postIndex, 1);
    savePosts(req.posts);

    res.json(deletedPost);
});

app.listen(port, () => { console.log('Server running at http://localhost:${port}');});



