module.exports = (models) => {
	return{
		getClient : (host) => {
			return new Promise(function(resolve, reject){
				models.Client.findOne({'host':host},(err,client) => {
					return err ? reject(err) : resolve(client);
				})
			})
		}
	}
}