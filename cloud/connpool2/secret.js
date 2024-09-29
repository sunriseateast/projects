const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager")
async function get_secret(id){

	try{
		const client = new SecretsManagerClient({region:'ap-south-1'});
		const input = {
  			SecretId:id,
		}
		const command = new GetSecretValueCommand(input);
		const response = await client.send(command);
		return JSON.parse(response.SecretString)
	}
	catch(error)
	{
		throw error
	}
}

module.exports={get_secret}
