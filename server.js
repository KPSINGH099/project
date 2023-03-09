const PORT = 3000;
const app=require('./index');
app.listen(PORT, function(err){
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});