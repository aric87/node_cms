module.exports = (models) => {
	return{
		getInsert : (client, page) => {
			return new Promise(function(resolve, reject){
				models.Insert.findOne({client:client.id, page: page},(err,content) => {
            	return err ? reject(err) : resolve(content);
            	})
			})
			
        }
	}
}